(function (window) {
  "use strict";

  const TRANSPARENT_PIXEL =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  const FEATURED_FILTER_VALUE = "featured";

  const fallbackConfig = {
    siteName: "Product Gallery",
    siteTagline: "Simple products, clearly presented.",
    featuredProductId: "",
    pages: {
      home: "index.html",
      gallery: "gallery.html",
      detail: "product.html",
    },
    categories: [{ value: "all", label: "All categories" }],
    specificationFilters: [],
    defaultDistributorContact: {
      name: "Product Gallery Team",
      email: "hello@example.com",
      phone: "",
      note: "Contact us for availability, ordering, and product questions.",
    },
    defaultCta: {
      label: "Contact us",
      url: "https://example.com/contact",
    },
    socialLinks: [],
    emailSignup: {
      enabled: true,
      provider: "placeholder",
      endpoint: "",
      successMessage: "Thanks. You are on the update list.",
      errorMessage: "Please enter a valid email address.",
    },
    text: {
      homeNavLabel: "Home",
      galleryNavLabel: "Products",
      galleryTitle: "Product Gallery",
      gallerySubtitle: "Browse the full collection.",
      searchLabel: "Search products",
      categoryFilterLabel: "Category",
      gallerySearchPlaceholder: "Search by name, feature, or tag",
      browseGalleryLabel: "Browse all products",
      backHomeLabel: "Back to home",
      backGalleryLabel: "Back to products",
      viewProductLabel: "View product",
      featuredEyebrow: "Featured product",
      featuredFallbackTitle: "Featured product not found",
      productNotFound: "Product not found",
      noMatchesPrefix: "No products found matching",
      allProductsCountLabel: "products shown",
      singleProductCountLabel: "product shown",
      priceLabel: "Price",
      categoryLabel: "Category",
      featuresLabel: "Features",
      specificationsLabel: "Specifications",
      contactLabel: "Distributor contact",
      galleryImagesLabel: "More product images",
      emailSignupTitle: "Join our email list",
      emailButtonLabel: "Get updates",
      emailPlaceholder: "you@example.com",
      siteTagline: "Simple products, clearly presented.",
    },
  };

  function mergeConfig(config) {
    const source = config || {};

    return {
      ...fallbackConfig,
      ...source,
      pages: { ...fallbackConfig.pages, ...(source.pages || {}) },
      defaultDistributorContact: {
        ...fallbackConfig.defaultDistributorContact,
        ...(source.defaultDistributorContact || {}),
      },
      defaultCta: { ...fallbackConfig.defaultCta, ...(source.defaultCta || {}) },
      emailSignup: { ...fallbackConfig.emailSignup, ...(source.emailSignup || {}) },
      socialLinks: Array.isArray(source.socialLinks) ? source.socialLinks.slice(0, 3) : fallbackConfig.socialLinks,
      text: { ...fallbackConfig.text, ...(source.text || {}) },
      categories: source.categories || fallbackConfig.categories,
      specificationFilters: source.specificationFilters || fallbackConfig.specificationFilters,
    };
  }

  function getConfig() {
    return mergeConfig(window.StorefrontConfig);
  }

  function getProductData() {
    return window.StorefrontProducts || {};
  }

  function getProductList(data) {
    if (Array.isArray(data)) {
      return data;
    }

    return Object.values(data || {});
  }

  function getProductById(data, id) {
    if (!id) {
      return null;
    }

    if (Array.isArray(data)) {
      return data.find((product) => product.id === id) || null;
    }

    return data[id] || null;
  }

  function createElement(documentRef, tagName, options = {}) {
    const element = documentRef.createElement(tagName);

    if (options.className) {
      element.className = options.className;
    }

    if (options.text !== undefined) {
      element.textContent = options.text;
    }

    if (options.attrs) {
      Object.entries(options.attrs).forEach(([name, value]) => {
        if (value !== undefined && value !== null && value !== false) {
          element.setAttribute(name, value === true ? "" : String(value));
        }
      });
    }

    return element;
  }

  function getPrimaryImage(product) {
    if (!product) {
      return "";
    }

    if (product.image) {
      return product.image;
    }

    return Array.isArray(product.galleryImages) && product.galleryImages.length > 0
      ? product.galleryImages[0]
      : "";
  }

  function getGalleryImages(product) {
    if (!product) {
      return [];
    }

    if (Array.isArray(product.galleryImages) && product.galleryImages.length > 0) {
      return product.galleryImages;
    }

    return product.image ? [product.image] : [];
  }

  function formatPrice(value) {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return "Contact for price";
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: Number.isInteger(numericValue) ? 0 : 2,
    }).format(numericValue);
  }

  function getCategory(config, categoryValue) {
    return (config.categories || []).find((category) => category.value === categoryValue) || null;
  }

  function getCategoryLabel(config, categoryValue) {
    const category = getCategory(config, categoryValue);
    return category ? category.label : categoryValue || "Uncategorized";
  }

  function getDetailUrl(config, productId) {
    return `${config.pages.detail}?id=${encodeURIComponent(productId)}`;
  }

  function getContactCta(config) {
    return {
      label: config.defaultCta.label,
      url: config.defaultCta.url,
    };
  }

  function extractYouTubeId(value) {
    if (!value) {
      return "";
    }

    const rawValue = String(value).trim();
    const match = rawValue.match(/(?:shorts\/|embed\/|v=|youtu\.be\/)([\w-]{11})/);
    return match ? match[1] : rawValue;
  }

  function isYouTubeShort(value) {
    return /shorts\//.test(String(value || ""));
  }

  function applyAccent(element, product) {
    if (element && product && product.accentColor) {
      element.style.setProperty("--product-accent", product.accentColor);
    }
  }

  function renderSocialLinks(documentRef, config) {
    documentRef.querySelectorAll("[data-social-links]").forEach((container) => {
      container.replaceChildren();

      (config.socialLinks || []).slice(0, 3).forEach((link) => {
        if (!link.url || !link.image || !link.platform) {
          return;
        }

        const socialLink = createElement(documentRef, "a", {
          className: "social-link",
          attrs: {
            href: link.url,
            target: "_blank",
            rel: "noopener noreferrer",
            "aria-label": link.platform,
          },
        });
        socialLink.append(
          createElement(documentRef, "img", {
            className: "social-link-icon",
            attrs: {
              src: link.image,
              alt: "",
              loading: "lazy",
            },
          }),
          createElement(documentRef, "span", { text: link.platform }),
        );
        container.append(socialLink);
      });
    });
  }

  function hydrateSharedElements(documentRef, config) {
    documentRef.querySelectorAll("[data-site-name]").forEach((element) => {
      element.textContent = config.siteName;
    });

    documentRef.querySelectorAll("[data-current-year]").forEach((element) => {
      element.textContent = new Date().getFullYear();
    });

    documentRef.querySelectorAll("[data-config-text]").forEach((element) => {
      const key = element.getAttribute("data-config-text");
      if (key && config.text[key]) {
        element.textContent = config.text[key];
      }
    });

    documentRef.querySelectorAll("[data-config-placeholder]").forEach((element) => {
      const key = element.getAttribute("data-config-placeholder");
      if (key && config.text[key]) {
        element.setAttribute("placeholder", config.text[key]);
      }
    });

    documentRef.querySelectorAll("[data-page-link]").forEach((element) => {
      const pageKey = element.getAttribute("data-page-link");
      if (pageKey && config.pages[pageKey]) {
        element.setAttribute("href", config.pages[pageKey]);
      }
    });

    renderSocialLinks(documentRef, config);
  }

  function createMetric(documentRef, label, value) {
    const item = createElement(documentRef, "div", { className: "product-metric" });
    item.append(
      createElement(documentRef, "span", { className: "metric-label", text: label }),
      createElement(documentRef, "span", { className: "metric-value", text: value }),
    );
    return item;
  }

  function renderHomePage(documentRef, config, data) {
    const featuredContainer = documentRef.getElementById("featured-product-container");

    if (!featuredContainer) {
      return;
    }

    const products = getProductList(data);
    const featuredProduct =
      getProductById(data, config.featuredProductId) || products.find((product) => product.featured);

    featuredContainer.replaceChildren();

    if (!featuredProduct) {
      featuredContainer.append(
        createElement(documentRef, "h1", {
          className: "featured-title",
          attrs: { id: "featured-product-title" },
          text: config.text.featuredFallbackTitle,
        }),
      );
      return;
    }

    applyAccent(featuredContainer, featuredProduct);

    const imagePath = getPrimaryImage(featuredProduct);
    const imageWrap = createElement(documentRef, "a", {
      className: "featured-image-link",
      attrs: { href: getDetailUrl(config, featuredProduct.id), "aria-label": `${config.text.viewProductLabel}: ${featuredProduct.name}` },
    });

    if (imagePath) {
      imageWrap.append(
        createElement(documentRef, "img", {
          className: "featured-image",
          attrs: { src: imagePath, alt: featuredProduct.name },
        }),
      );
    } else {
      imageWrap.append(createElement(documentRef, "div", { className: "image-placeholder", text: featuredProduct.name }));
    }

    const content = createElement(documentRef, "div", { className: "featured-copy" });
    content.append(
      createElement(documentRef, "p", { className: "eyebrow", text: config.text.featuredEyebrow }),
      createElement(documentRef, "h1", {
        className: "featured-title",
        attrs: { id: "featured-product-title" },
        text: featuredProduct.name,
      }),
      createElement(documentRef, "p", { className: "featured-description", text: featuredProduct.description }),
    );

    const metrics = createElement(documentRef, "div", { className: "product-metrics" });
    metrics.append(
      createMetric(documentRef, config.text.categoryLabel, getCategoryLabel(config, featuredProduct.category)),
      createMetric(documentRef, config.text.priceLabel, formatPrice(featuredProduct.price)),
    );

    const contactCta = getContactCta(config);
    const actions = createElement(documentRef, "div", { className: "button-row" });
    actions.append(
      createElement(documentRef, "a", {
        className: "primary-button",
        text: config.text.viewProductLabel,
        attrs: { href: getDetailUrl(config, featuredProduct.id) },
      }),
      createElement(documentRef, "a", {
        className: "secondary-button contact-button",
        text: contactCta.label,
        attrs: { href: contactCta.url },
      }),
    );

    content.append(metrics, actions);
    featuredContainer.append(imageWrap, content);
  }

  function createImageObserver(windowRef) {
    if (!("IntersectionObserver" in windowRef)) {
      return null;
    }

    return new windowRef.IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const image = entry.target;
          image.src = image.dataset.src;
          image.classList.add("loaded");
          observer.unobserve(image);
        });
      },
      { rootMargin: "0px 0px 300px 0px" },
    );
  }

  function getSearchText(config, product) {
    const specificationText = Object.values(product.specifications || {}).join(" ");
    return [
      product.name,
      product.description,
      getCategoryLabel(config, product.category),
      product.featured ? FEATURED_FILTER_VALUE : "",
      ...(product.features || []),
      ...(product.tags || []),
      specificationText,
    ]
      .join(" ")
      .toLowerCase();
  }

  function populateCategoryFilter(documentRef, config, categorySelect) {
    if (!categorySelect) {
      return;
    }

    categorySelect.replaceChildren();

    (config.categories || []).forEach((category) => {
      categorySelect.append(
        createElement(documentRef, "option", {
          text: category.label,
          attrs: { value: category.value },
        }),
      );
    });
  }

  function getSpecificationValue(product, key) {
    return product && product.specifications ? product.specifications[key] || "" : "";
  }

  function matchesCategoryFilter(product, selectedCategory) {
    if (selectedCategory === "all") {
      return true;
    }

    if (selectedCategory === FEATURED_FILTER_VALUE) {
      return product.featured === true;
    }

    return product.category === selectedCategory;
  }

  function populateSpecificationFilters(documentRef, config, products, filtersContainer) {
    if (!filtersContainer) {
      return;
    }

    filtersContainer.replaceChildren();

    (config.specificationFilters || []).forEach((filter) => {
      const values = [...new Set(products.map((product) => getSpecificationValue(product, filter.key)).filter(Boolean))].sort();

      if (values.length === 0) {
        return;
      }

      const field = createElement(documentRef, "div", { className: "filter-field" });
      const selectId = `spec-filter-${filter.key}`;
      const select = createElement(documentRef, "select", {
        attrs: {
          id: selectId,
          "data-specification-filter": filter.key,
        },
      });

      select.append(createElement(documentRef, "option", { text: `All ${filter.label.toLowerCase()}`, attrs: { value: "all" } }));
      values.forEach((value) => {
        select.append(createElement(documentRef, "option", { text: value, attrs: { value } }));
      });

      field.append(createElement(documentRef, "label", { text: filter.label, attrs: { for: selectId } }), select);
      filtersContainer.append(field);
    });
  }

  function createProductCard(documentRef, config, product, imageObserver) {
    const card = createElement(documentRef, "article", { className: "product-card animate-in" });
    applyAccent(card, product);

    const detailUrl = getDetailUrl(config, product.id);
    const imageLink = createElement(documentRef, "a", {
      className: "product-card-image-link",
      attrs: { href: detailUrl, "aria-label": `${config.text.viewProductLabel}: ${product.name}` },
    });
    const imagePath = getPrimaryImage(product);

    if (imagePath) {
      const image = createElement(documentRef, "img", {
        className: "lazy-load product-card-image",
        attrs: {
          src: TRANSPARENT_PIXEL,
          "data-src": imagePath,
          alt: product.name,
        },
      });
      imageLink.append(image);

      if (imageObserver) {
        imageObserver.observe(image);
      } else {
        image.src = image.dataset.src;
        image.classList.add("loaded");
      }
    } else {
      imageLink.append(createElement(documentRef, "div", { className: "image-placeholder", text: product.name }));
    }

    const cardContent = createElement(documentRef, "div", { className: "product-card-content" });
    const title = createElement(documentRef, "h2", { className: "product-card-title" });
    title.append(
      createElement(documentRef, "a", {
        text: product.name,
        attrs: { href: detailUrl },
      }),
    );

    cardContent.append(
      createElement(documentRef, "p", {
        className: "category-pill",
        text: getCategoryLabel(config, product.category),
      }),
      title,
      createElement(documentRef, "p", { className: "product-card-description", text: product.description }),
      createElement(documentRef, "p", { className: "product-card-price", text: formatPrice(product.price) }),
      createElement(documentRef, "a", {
        className: "text-button",
        text: config.text.viewProductLabel,
        attrs: { href: detailUrl },
      }),
    );

    card.append(imageLink, cardContent);
    return card;
  }

  function renderGalleryPage(documentRef, config, data, windowRef) {
    const galleryContainer = documentRef.getElementById("product-gallery");
    const summary = documentRef.getElementById("gallery-results-summary");
    const searchInput = documentRef.getElementById("product-search");
    const categorySelect = documentRef.getElementById("category-filter");
    const filtersContainer = documentRef.getElementById("specification-filters");

    if (!galleryContainer) {
      return;
    }

    const imageObserver = createImageObserver(windowRef);
    const products = getProductList(data);
    populateCategoryFilter(documentRef, config, categorySelect);
    populateSpecificationFilters(documentRef, config, products, filtersContainer);

    function renderGallery() {
      const cleanSearch = (searchInput ? searchInput.value : "").toLowerCase().trim();
      const selectedCategory = categorySelect ? categorySelect.value : "all";
      const selectedSpecificationFilters = [...documentRef.querySelectorAll("[data-specification-filter]")].map((select) => ({
        key: select.getAttribute("data-specification-filter"),
        value: select.value,
      }));

      const filteredProducts = products.filter((product) => {
        const matchesSearch = !cleanSearch || getSearchText(config, product).includes(cleanSearch);
        const matchesCategory = matchesCategoryFilter(product, selectedCategory);
        const matchesSpecifications = selectedSpecificationFilters.every((filter) => {
          return filter.value === "all" || getSpecificationValue(product, filter.key) === filter.value;
        });
        return matchesSearch && matchesCategory && matchesSpecifications;
      });

      galleryContainer.replaceChildren();

      if (summary) {
        const countLabel =
          filteredProducts.length === 1 ? config.text.singleProductCountLabel : config.text.allProductsCountLabel;
        summary.textContent = `${filteredProducts.length} ${countLabel}`;
      }

      if (filteredProducts.length === 0) {
        const filterLabel = cleanSearch || getCategoryLabel(config, selectedCategory);
        galleryContainer.append(
          createElement(documentRef, "p", {
            className: "no-results",
            text: `${config.text.noMatchesPrefix} "${filterLabel}".`,
          }),
        );
        return;
      }

      filteredProducts.forEach((product) => {
        galleryContainer.append(createProductCard(documentRef, config, product, imageObserver));
      });
    }

    renderGallery();

    if (searchInput) {
      searchInput.addEventListener("input", renderGallery);
    }

    if (categorySelect) {
      categorySelect.addEventListener("change", renderGallery);
    }

    documentRef.querySelectorAll("[data-specification-filter]").forEach((select) => {
      select.addEventListener("change", renderGallery);
    });
  }

  function appendListSection(documentRef, root, title, items) {
    if (!Array.isArray(items) || items.length === 0) {
      return;
    }

    const section = createElement(documentRef, "section", { className: "detail-section" });
    const list = createElement(documentRef, "ul", { className: "feature-list" });
    items.forEach((item) => {
      list.append(createElement(documentRef, "li", { text: item }));
    });

    section.append(createElement(documentRef, "h2", { text: title }), list);
    root.append(section);
  }

  function appendSpecificationSection(documentRef, root, title, specifications) {
    const entries = Object.entries(specifications || {});

    if (entries.length === 0) {
      return;
    }

    const section = createElement(documentRef, "section", { className: "detail-section" });
    const list = createElement(documentRef, "dl", { className: "spec-list" });

    entries.forEach(([key, value]) => {
      const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
      list.append(
        createElement(documentRef, "dt", { text: label }),
        createElement(documentRef, "dd", { text: value }),
      );
    });

    section.append(createElement(documentRef, "h2", { text: title }), list);
    root.append(section);
  }

  function appendContactSection(documentRef, root, config, product) {
    const contact = product.distributorContact || config.defaultDistributorContact;

    if (!contact) {
      return;
    }

    const section = createElement(documentRef, "section", { className: "detail-section contact-section" });
    section.append(createElement(documentRef, "h2", { text: config.text.contactLabel }));

    if (contact.name) {
      section.append(createElement(documentRef, "p", { className: "contact-name", text: contact.name }));
    }

    if (contact.note) {
      section.append(createElement(documentRef, "p", { text: contact.note }));
    }

    const contactCta = getContactCta(config);
    const contactActions = createElement(documentRef, "div", { className: "contact-actions" });

    if (contactCta.url && contactCta.label) {
      contactActions.append(
        createElement(documentRef, "a", {
          className: "secondary-button contact-button",
          text: contactCta.label,
          attrs: { href: contactCta.url },
        }),
      );
    }

    if (contact.email) {
      if (contactActions.childElementCount > 0) {
        contactActions.append(createElement(documentRef, "span", { className: "contact-or", text: "or" }));
      }

      contactActions.append(
        createElement(documentRef, "a", {
          className: "secondary-button contact-email-button",
          text: contact.email,
          attrs: { href: `mailto:${contact.email}` },
        }),
      );
    }

    if (contactActions.childElementCount > 0) {
      section.append(contactActions);
    }

    const links = createElement(documentRef, "div", { className: "contact-links" });

    if (contact.phone) {
      links.append(
        createElement(documentRef, "a", {
          text: contact.phone,
          attrs: { href: `tel:${contact.phone.replace(/\D/g, "")}` },
        }),
      );
    }

    if (links.childElementCount > 0) {
      section.append(links);
    }

    root.append(section);
  }

  function createVideoEmbed(documentRef, product) {
    const rawVideo = product.videoUrl ? String(product.videoUrl).trim() : "";
    const videoId = extractYouTubeId(rawVideo);

    if (!videoId) {
      return null;
    }

    const wrapper = createElement(documentRef, "div", {
      className: `video-container${isYouTubeShort(rawVideo) ? " shorts-mode" : ""}`,
    });
    wrapper.append(
      createElement(documentRef, "iframe", {
        attrs: {
          src: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`,
          title: `${product.name} video`,
          loading: "lazy",
          allowfullscreen: true,
        },
      }),
    );

    return wrapper;
  }

  function renderProductImages(documentRef, product) {
    const mainImage = documentRef.getElementById("main-product-image");
    const extraContainer = documentRef.getElementById("extra-images-container");
    const images = getGalleryImages(product);

    if (!mainImage || !extraContainer) {
      return;
    }

    extraContainer.replaceChildren();

    if (images.length === 0) {
      mainImage.hidden = true;
      return;
    }

    mainImage.hidden = false;
    mainImage.src = images[0];
    mainImage.alt = `${product.name} main view`;

    images.slice(1).forEach((imagePath, index) => {
      extraContainer.append(
        createElement(documentRef, "img", {
          className: "gallery-detail-img",
          attrs: {
            src: imagePath,
            alt: `${product.name} detail ${index + 1}`,
            loading: "lazy",
          },
        }),
      );
    });
  }

  function renderProductDetailPage(documentRef, config, data, windowRef) {
    const detailRoot = documentRef.getElementById("product-detail");
    const infoRoot = documentRef.getElementById("product-info");
    const mediaSlot = documentRef.getElementById("media-slot");

    if (!detailRoot || !infoRoot) {
      return;
    }

    const params = new URLSearchParams(windowRef.location.search);
    const productId = params.get("id");
    const product = getProductById(data, productId);

    infoRoot.replaceChildren();

    if (!product) {
      const mainImage = documentRef.getElementById("main-product-image");
      if (mainImage) {
        mainImage.hidden = true;
      }

      detailRoot.classList.add("detail-layout--not-found");
      infoRoot.append(
        createElement(documentRef, "h1", { text: config.text.productNotFound }),
        createElement(documentRef, "a", {
          className: "primary-button",
          text: config.text.backGalleryLabel,
          attrs: { href: config.pages.gallery },
        }),
      );
      return;
    }

    applyAccent(detailRoot, product);
    documentRef.title = `${product.name} | ${config.siteName}`;

    const heading = createElement(documentRef, "div", { className: "detail-heading" });
    heading.append(
      createElement(documentRef, "p", {
        className: "category-pill",
        text: getCategoryLabel(config, product.category),
      }),
      createElement(documentRef, "h1", { text: product.name }),
      createElement(documentRef, "p", { className: "detail-description", text: product.description }),
    );

    const metrics = createElement(documentRef, "div", { className: "product-metrics" });
    metrics.append(
      createMetric(documentRef, config.text.priceLabel, formatPrice(product.price)),
      createMetric(documentRef, config.text.categoryLabel, getCategoryLabel(config, product.category)),
    );

    infoRoot.append(heading, metrics);
    appendListSection(documentRef, infoRoot, config.text.featuresLabel, product.features);
    appendSpecificationSection(documentRef, infoRoot, config.text.specificationsLabel, product.specifications);
    appendContactSection(documentRef, infoRoot, config, product);

    renderProductImages(documentRef, product);

    if (mediaSlot) {
      mediaSlot.replaceChildren();
      const videoEmbed = createVideoEmbed(documentRef, product);
      if (videoEmbed) {
        mediaSlot.append(videoEmbed);
      }
    }
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
  }

  function submitEmailSignup(formData, config) {
    const endpoint = config.emailSignup.endpoint;
    const payload = Object.fromEntries(formData.entries());

    if (!endpoint) {
      return Promise.resolve({ ok: true, provider: config.emailSignup.provider, payload });
    }

    return window.fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  function initEmailSignup(documentRef, config) {
    if (!config.emailSignup.enabled) {
      documentRef.querySelectorAll("[data-email-signup]").forEach((form) => {
        form.hidden = true;
      });
      return;
    }

    documentRef.querySelectorAll("[data-email-signup]").forEach((form) => {
      const emailInput = form.querySelector("input[type='email']");
      const status = form.querySelector("[data-email-status]");
      const submitButton = form.querySelector("button[type='submit']");

      form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!emailInput || !isValidEmail(emailInput.value)) {
          if (status) {
            status.textContent = config.emailSignup.errorMessage;
          }
          if (emailInput) {
            emailInput.focus();
          }
          return;
        }

        if (submitButton) {
          submitButton.disabled = true;
        }
        if (status) {
          status.textContent = "";
        }

        submitEmailSignup(new FormData(form), config)
          .then((response) => {
            if (!response || response.ok) {
              form.reset();
              if (status) {
                status.textContent = config.emailSignup.successMessage;
              }
              return;
            }

            throw new Error("Signup request failed.");
          })
          .catch(() => {
            if (status) {
              status.textContent = config.emailSignup.errorMessage;
            }
          })
          .finally(() => {
            if (submitButton) {
              submitButton.disabled = false;
            }
          });
      });
    });
  }

  function init() {
    const documentRef = window.document;

    if (!documentRef) {
      return;
    }

    const config = getConfig();
    const data = getProductData();

    hydrateSharedElements(documentRef, config);
    renderHomePage(documentRef, config, data);
    renderGalleryPage(documentRef, config, data, window);
    renderProductDetailPage(documentRef, config, data, window);
    initEmailSignup(documentRef, config);
  }

  window.Storefront = {
    getConfig,
    getProductData,
    renderHomePage,
    renderGalleryPage,
    renderProductDetailPage,
    emailSignup: {
      submit: submitEmailSignup,
    },
    utils: {
      extractYouTubeId,
      formatPrice,
      getCategoryLabel,
      getDetailUrl,
      isYouTubeShort,
    },
  };

  if (window.document) {
    if (window.document.readyState === "loading") {
      window.document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  }
})(window);
