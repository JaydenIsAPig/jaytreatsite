#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const rootDir = path.resolve(__dirname, "..");
const scriptFiles = ["site-config.js", "products.js", "storefront.js"];
const htmlFiles = ["index.html", "gallery.html", "product.html"];
const maintenanceGuide = "docs/MAINTENANCE.md";
const errors = [];

function assert(condition, message) {
  if (!condition) {
    errors.push(message);
  }
}

function readProjectFile(filePath) {
  return fs.readFileSync(path.join(rootDir, filePath), "utf8");
}

function loadBrowserScripts() {
  const window = {
    location: { search: "" },
    document: null,
    fetch: () => Promise.resolve({ ok: true }),
  };
  const context = {
    URLSearchParams,
    FormData,
    Intl,
    Promise,
    console,
    window,
  };

  window.window = window;
  vm.createContext(context);

  scriptFiles.forEach((fileName) => {
    vm.runInContext(readProjectFile(fileName), context, { filename: fileName });
  });

  return window;
}

function validateHtml() {
  htmlFiles.forEach((fileName) => {
    const html = readProjectFile(fileName);
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

    assert(!html.includes("document.write"), `${fileName} should not use document.write.`);
    assert(duplicateIds.length === 0, `${fileName} has duplicate id(s): ${duplicateIds.join(", ")}`);
    assert(html.includes("site-config.js"), `${fileName} should load site-config.js.`);
    assert(html.includes("products.js"), `${fileName} should load products.js.`);
    assert(html.includes("storefront.js"), `${fileName} should load storefront.js.`);
    assert(html.includes("data-social-links"), `${fileName} should include the shared social media link container.`);
  });
}

function validateDocumentation() {
  const readme = readProjectFile("README.md");
  const guidePath = path.join(rootDir, maintenanceGuide);

  assert(fs.existsSync(guidePath), `${maintenanceGuide} should document the storefront architecture.`);

  if (!fs.existsSync(guidePath)) {
    return;
  }

  const guide = readProjectFile(maintenanceGuide);
  const requiredSections = [
    "## Architecture At A Glance",
    "## Current Feature Inventory",
    "## Change Matrix",
    "## File Responsibilities",
    "## Shared HTML Hooks",
    "## Featured Carousel",
    "## Verification Checklist",
  ];

  assert(readme.includes(maintenanceGuide), `README.md should link to ${maintenanceGuide}.`);
  requiredSections.forEach((section) => {
    assert(guide.includes(section), `${maintenanceGuide} is missing "${section}".`);
  });
}

function validateConfig(config, productData) {
  assert(config, "StorefrontConfig is not defined.");
  assert(config.siteName, "Config must define siteName.");
  assert(config.featuredProductId, "Config must define featuredProductId.");
  assert(productData[config.featuredProductId], `Featured product "${config.featuredProductId}" is missing from products.js.`);
  assert(config.pages && config.pages.detail === "product.html", "Config must define the product detail page path.");
  assert(Array.isArray(config.categories) && config.categories.length > 0, "Config must define category filter values.");
  assert(config.categories.some((category) => category.value === "all"), "Config categories must include an all option.");
  assert(config.categories.some((category) => category.value === "featured"), "Config categories must include a featured products filter option.");
  assert(config.defaultDistributorContact && config.defaultDistributorContact.email, "Config must define default distributor contact info.");
  assert(config.defaultCta && config.defaultCta.label && config.defaultCta.url, "Config must define a universal contact CTA label and URL.");
  const socialLinks = config.socialLinks === undefined ? [] : config.socialLinks;
  assert(Array.isArray(socialLinks), "Config socialLinks must be an array when defined.");
  assert(socialLinks.length <= 3, "Config socialLinks can contain up to 3 links.");
  socialLinks.forEach((link, index) => {
    const label = link.platform || `Social link ${index + 1}`;
    assert(link.platform && link.url && link.image, `${label} must define platform, url, and image.`);
    assert(fs.existsSync(path.join(rootDir, link.image)), `${label} references missing image: ${link.image}`);
  });
  assert(config.emailSignup && Object.prototype.hasOwnProperty.call(config.emailSignup, "endpoint"), "Config must define email signup settings.");
}

function validateProductData(productData, config) {
  assert(productData && typeof productData === "object", "StorefrontProducts is not defined.");

  const categoryValues = new Set(config.categories.map((category) => category.value));

  Object.entries(productData).forEach(([id, product]) => {
    assert(product.id === id, `${id} must include a matching id field.`);
    assert(product.name, `${id} is missing a name.`);
    assert(product.description, `${id} is missing a description.`);
    assert(Array.isArray(product.features), `${id} features must be an array.`);
    assert(product.specifications && typeof product.specifications === "object", `${id} specifications must be an object.`);
    assert(product.category && categoryValues.has(product.category), `${id} has an unknown category: ${product.category}`);
    assert(product.category !== "featured", `${id} should use the featured boolean instead of a featured category.`);
    assert(typeof product.featured === "boolean", `${id} featured must be a boolean.`);
    assert(Array.isArray(product.galleryImages), `${id} galleryImages must be an array.`);
    assert(product.galleryImages.length > 0, `${id} should include at least one gallery image.`);
    assert(product.image === product.galleryImages[0], `${id} image should match the first gallery image.`);
    assert(Array.isArray(product.tags), `${id} tags must be an array.`);
    assert(!product.tags.some((tag) => String(tag).toLowerCase() === "featured"), `${id} should use the featured boolean instead of a featured tag.`);
    assert(!product.ctaLabel && !product.ctaUrl, `${id} should use the universal contact CTA from site-config.js.`);

    product.galleryImages.forEach((imagePath) => {
      assert(fs.existsSync(path.join(rootDir, imagePath)), `${id} references missing image: ${imagePath}`);
    });
  });
}

function validateUtilities(app) {
  assert(app && app.utils, "Storefront utility API is not exposed.");

  if (!app || !app.utils) {
    return;
  }

  const { extractYouTubeId, formatPrice, getDetailUrl, isYouTubeShort } = app.utils;

  assert(extractYouTubeId("https://www.youtube.com/shorts/h2pDgsDiEv8") === "h2pDgsDiEv8", "Shorts URLs should parse to an 11-character ID.");
  assert(extractYouTubeId("https://youtu.be/SEFPr8NGXiY?si=abc") === "SEFPr8NGXiY", "youtu.be URLs should parse to an 11-character ID.");
  assert(extractYouTubeId("https://www.youtube.com/watch?v=wIAtMzUSFHI&feature=share") === "wIAtMzUSFHI", "watch URLs should parse to an 11-character ID.");
  assert(isYouTubeShort("https://www.youtube.com/shorts/h2pDgsDiEv8"), "Shorts URLs should be detected.");
  assert(formatPrice(24) === "$24", "Whole-number prices should format as currency.");
  assert(getDetailUrl({ pages: { detail: "product.html" } }, "product-001") === "product.html?id=product-001", "Detail URLs should use product.html.");
}

function validateNaming() {
  const filesToInspect = [
    "index.html",
    "gallery.html",
    "product.html",
    "site-config.js",
    "products.js",
    "storefront.js",
    "style.css",
  ];
  const blockedWords = [
    ["t", "r", "e", "a", "t"].join(""),
    ["c", "o", "o", "k", "i", "e"].join(""),
    ["i", "n", "g", "r", "e", "d", "i", "e", "n", "t"].join(""),
    ["a", "l", "l", "e", "r", "g", "e", "n"].join(""),
  ];
  const blockedTerms = blockedWords.map((word) => new RegExp(`\\b${word}`, "i"));

  filesToInspect.forEach((fileName) => {
    const source = readProjectFile(fileName);
    blockedTerms.forEach((term) => {
      assert(!term.test(source), `${fileName} still contains product-type-specific wording: ${term}`);
    });
  });
}

function run() {
  validateHtml();
  validateDocumentation();

  const window = loadBrowserScripts();
  validateConfig(window.StorefrontConfig, window.StorefrontProducts);
  validateProductData(window.StorefrontProducts, window.StorefrontConfig);
  validateUtilities(window.Storefront);
  validateNaming();

  if (errors.length > 0) {
    console.error("Site validation failed:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("Site validation passed.");
}

run();
