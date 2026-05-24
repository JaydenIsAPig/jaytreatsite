#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const rootDir = path.resolve(__dirname, "..");
const scriptFiles = ["site-config.js", "treats.js", "gallery.js"];
const htmlFiles = ["index.html", "gallery.html", "treat.html"];
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
  };
  const context = {
    URLSearchParams,
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
    assert(html.includes("treats.js"), `${fileName} should load treats.js.`);
    assert(html.includes("gallery.js"), `${fileName} should load gallery.js.`);
  });
}

function validateConfig(config, treatData) {
  assert(config, "JayTreatsConfig is not defined.");
  assert(config.siteName, "Config must define siteName.");
  assert(config.featuredTreatId, "Config must define featuredTreatId.");
  assert(treatData[config.featuredTreatId], `Featured treat "${config.featuredTreatId}" is missing from treats.js.`);
  assert(Number.isFinite(Number(config.featuredPrice)), "featuredPrice must be numeric.");
  assert(config.pages && config.pages.detail, "Config must define a detail page path.");
  assert(config.social && config.social.instagram, "Config must define an Instagram URL.");
  assert(config.payment && config.payment.baseUrl && config.payment.username, "Config must define payment baseUrl and username.");
}

function validateTreatData(treatData) {
  assert(treatData && typeof treatData === "object", "JayTreatsData is not defined.");

  Object.entries(treatData).forEach(([id, treat]) => {
    assert(treat.name, `${id} is missing a name.`);
    assert(treat.ingredients, `${id} is missing ingredients.`);
    assert(treat.allergens, `${id} is missing allergens.`);
    assert(Array.isArray(treat.images), `${id} images must be an array.`);
    assert(treat.images.length > 0, `${id} should include at least one image.`);

    treat.images.forEach((imagePath) => {
      assert(fs.existsSync(path.join(rootDir, imagePath)), `${id} references missing image: ${imagePath}`);
    });
  });
}

function validateUtilities(app) {
  assert(app && app.utils, "JayTreats utility API is not exposed.");

  if (!app || !app.utils) {
    return;
  }

  const { extractYouTubeId, formatPrice, isYouTubeShort } = app.utils;

  assert(extractYouTubeId("https://www.youtube.com/shorts/h2pDgsDiEv8") === "h2pDgsDiEv8", "Shorts URLs should parse to an 11-character ID.");
  assert(extractYouTubeId("https://youtu.be/SEFPr8NGXiY?si=abc") === "SEFPr8NGXiY", "youtu.be URLs should parse to an 11-character ID.");
  assert(extractYouTubeId("https://www.youtube.com/watch?v=wIAtMzUSFHI&feature=share") === "wIAtMzUSFHI", "watch URLs should parse to an 11-character ID.");
  assert(isYouTubeShort("https://www.youtube.com/shorts/h2pDgsDiEv8"), "Shorts URLs should be detected.");
  assert(formatPrice(4) === "4.00", "Prices should format with two decimals.");
}

function run() {
  validateHtml();

  const window = loadBrowserScripts();
  validateConfig(window.JayTreatsConfig, window.JayTreatsData);
  validateTreatData(window.JayTreatsData);
  validateUtilities(window.JayTreats);

  if (errors.length > 0) {
    console.error("Site validation failed:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("Site validation passed.");
}

run();
