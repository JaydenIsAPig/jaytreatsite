(function (window) {
  "use strict";

  /*
   * Shared storefront runtime.
   * Architecture and extension contracts: docs/MAINTENANCE.md
   */
  const TRANSPARENT_PIXEL =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  const FEATURED_FILTER_VALUE = "featured";
  // Keep these durations synchronized with the carousel animations in style.css.
  const FEATURED_ROTATION_MS = 4000;
  const FEATURED_FADE_OUT_MS = 240;
  const FEATURED_FADE_IN_MS = 420;

  // Defensive defaults keep shared rendering usable when optional config is absent.
  const fallbackConfig = {
    siteName: "Caren Jewelry",
    siteTagline: "Quality jewelry, thoughtfully chosen.",
    featuredProductId: "",
    pages: {
      home: "index.html",
      gallery: "gallery.html",
      detail: "product.html",
    },
    categories: [{ value: "all", label: "All categories" }],
    specificationFilters: [],
    defaultDistributorContact: {
      name: "Caren Romack",
      email: "hello@example.com",
      phone: "",
      note: "Contact us for availability, ordering, and product questions.",
    },
    defaultCta: {
      label: "Ask to purchase",
      url: "mailto:hello@example.com",
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
      galleryNavLabel: "Shop jewelry",
      galleryTitle: "Find a piece to love",
      gallerySubtitle: "Browse the full collection.",
      searchLabel: "Search the collection",
      categoryFilterLabel: "Jewelry type",
      gallerySearchPlaceholder: "Search by name, color, or material",
      browseGalleryLabel: "View the full collection",
      backHomeLabel: "Back to home",
      backGalleryLabel: "Back to the collection",
      viewProductLabel: "View details & price",
      featuredEyebrow: "Featured jewelry",
      featuredFallbackTitle: "Featured piece not found",
      productNotFound: "This piece could not be found",
      noMatchesPrefix: "No pieces found matching",
      allProductsCountLabel: "pieces shown",
      singleProductCountLabel: "piece shown",
      priceLabel: "Price",
      categoryLabel: "Jewelry type",
      featuresLabel: "What makes it special",
      specificationsLabel: "Piece details",
      contactLabel: "Questions & ordering",
      purchaseTitle: "Ready to make it yours?",
      purchaseHelp: "Select the button below to ask about availability and purchase this piece directly.",
      galleryImagesLabel: "More views",
      emailSignupTitle: "Join our email list",
      emailButtonLabel: "Get updates",
      emailPlaceholder: "you@example.com",
      siteTagline: "Simple jewelry, thoughtfully chosen.",
    },
  };

  // Configuration and catalog access
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

  // Shared DOM, image, formatting, URL, and media helpers
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
    if (value === null || value === undefined || value === "") {
      return "Contact for price";
    }

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

  function getContactCta(config, product) {
    let url = config.defaultCta.url;

    if (product && url && url.startsWith("mailto:")) {
      const separator = url.includes("?") ? "&" : "?";
      url = `${url}${separator}subject=${encodeURIComponent(`Purchase inquiry: ${product.name}`)}`;
    }

    return {
      label: config.defaultCta.label,
      url,
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

  // Shared page shell hydration
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

  // Home page featured carousel
  function renderHomePage(documentRef, config, data) {
    const featuredContainer = documentRef.getElementById("featured-product-container");

    if (!featuredContainer) {
      return;
    }

    const products = getProductList(data);
    const featuredProducts = products.filter((product) => product.featured === true);
    const preferredProduct = getProductById(data, config.featuredProductId);

    if (preferredProduct && preferredProduct.featured) {
      const preferredIndex = featuredProducts.findIndex((product) => product.id === preferredProduct.id);
      if (preferredIndex > 0) {
        featuredProducts.unshift(featuredProducts.splice(preferredIndex, 1)[0]);
      }
    }

    featuredContainer.replaceChildren();

    if (featuredProducts.length === 0) {
      featuredContainer.append(
        createElement(documentRef, "h2", {
          className: "featured-title",
          attrs: { id: "featured-product-title" },
          text: config.text.featuredFallbackTitle,
        }),
      );
      return;
    }

    let currentIndex = 0;
    let rotationTimer = null;
    let pointerStartX = null;
    let mouseStartX = null;
    let gestureHandled = false;
    let suppressClick = false;
    let isTransitioning = false;
    const featuredImageCache = new Map();
    const prefersReducedMotion =
      typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const slide = createElement(documentRef, "div", {
      className: "featured-slide",
      attrs: { "aria-live": "polite", "aria-atomic": "true" },
    });
    const previousButton = createElement(documentRef, "button", {
      className: "carousel-arrow carousel-arrow--previous",
      text: "←",
      attrs: { type: "button", "aria-label": "Show previous featured item" },
    });
    const nextButton = createElement(documentRef, "button", {
      className: "carousel-arrow carousel-arrow--next",
      text: "→",
      attrs: { type: "button", "aria-label": "Show next featured item" },
    });
    const status = createElement(documentRef, "p", {
      className: "carousel-status",
      attrs: { "aria-live": "polite" },
    });

    function loadFeaturedImage(product) {
      const imagePath = getPrimaryImage(product);

      if (!imagePath || featuredImageCache.has(imagePath)) {
        return featuredImageCache.get(imagePath) || Promise.resolve();
      }

      const imageReady = new Promise((resolve) => {
        const image = new window.Image();
        image.decoding = "async";
        image.onload = () => {
          if (typeof image.decode === "function") {
            image.decode().catch(() => {});
          }
          resolve();
        };
        image.onerror = resolve;
        image.src = imagePath;
      });

      featuredImageCache.set(imagePath, imageReady);
      return imageReady;
    }

    function preloadAdjacentImages() {
      if (featuredProducts.length < 2) {
        return;
      }

      const preload = () => {
        loadFeaturedImage(featuredProducts[(currentIndex + 1) % featuredProducts.length]);
        loadFeaturedImage(featuredProducts[(currentIndex - 1 + featuredProducts.length) % featuredProducts.length]);
      };

      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(preload, { timeout: 1200 });
      } else {
        window.setTimeout(preload, 200);
      }
    }

    function renderFeaturedSlide() {
      const featuredProduct = featuredProducts[currentIndex];
      const detailUrl = getDetailUrl(config, featuredProduct.id);
      const imagePath = getPrimaryImage(featuredProduct);
      const imageWrap = createElement(documentRef, "a", {
        className: "featured-image-link",
        attrs: {
          href: detailUrl,
          "aria-label": `Open ${featuredProduct.name} details and price`,
        },
      });

      applyAccent(featuredContainer, featuredProduct);

      if (imagePath) {
        const featuredImage = createElement(documentRef, "img", {
          className: "featured-image",
          attrs: {
            src: imagePath,
            alt: featuredProduct.name,
            decoding: "async",
            fetchpriority: currentIndex === 0 ? "high" : "auto",
          },
        });
        let imageReady = featuredImageCache.get(imagePath);

        if (!imageReady) {
          if (typeof featuredImage.decode === "function") {
            imageReady = featuredImage.decode().catch(() => {});
          } else {
            imageReady = new Promise((resolve) => {
              featuredImage.addEventListener("load", resolve, { once: true });
              featuredImage.addEventListener("error", resolve, { once: true });
            });
          }
          featuredImageCache.set(imagePath, imageReady);
        }

        imageReady.then(preloadAdjacentImages);
        imageWrap.append(featuredImage);
      } else {
        imageWrap.append(createElement(documentRef, "div", { className: "image-placeholder", text: featuredProduct.name }));
        preloadAdjacentImages();
      }

      const title = createElement(documentRef, "h3", {
        className: "featured-title",
        attrs: { id: "featured-product-title" },
      });
      title.append(
        createElement(documentRef, "a", {
          className: "featured-title-link",
          text: featuredProduct.name,
          attrs: { href: detailUrl },
        }),
      );

      slide.replaceChildren(imageWrap, title);
      status.textContent = `${currentIndex + 1} of ${featuredProducts.length}: ${featuredProduct.name}`;
    }

    function showFeaturedProduct(nextIndex, userInitiated = false) {
      if (isTransitioning || nextIndex === currentIndex) {
        return;
      }

      const resolvedIndex = (nextIndex + featuredProducts.length) % featuredProducts.length;

      if (prefersReducedMotion) {
        currentIndex = resolvedIndex;
        renderFeaturedSlide();
      } else {
        isTransitioning = true;
        loadFeaturedImage(featuredProducts[resolvedIndex]).then(() => {
          slide.classList.remove("is-fading-in");
          slide.classList.add("is-fading-out");
          window.setTimeout(() => {
            currentIndex = resolvedIndex;
            renderFeaturedSlide();
            slide.classList.remove("is-fading-out");
            slide.classList.add("is-fading-in");
            window.setTimeout(() => {
              slide.classList.remove("is-fading-in");
              isTransitioning = false;
            }, FEATURED_FADE_IN_MS);
          }, FEATURED_FADE_OUT_MS);
        });
      }

      if (userInitiated) {
        restartRotation();
      }
    }

    function stopRotation() {
      if (rotationTimer) {
        window.clearTimeout(rotationTimer);
        rotationTimer = null;
      }
    }

    function startRotation() {
      stopRotation();
      if (featuredProducts.length < 2) {
        return;
      }
      rotationTimer = window.setTimeout(() => {
        showFeaturedProduct(currentIndex + 1);
        startRotation();
      }, FEATURED_ROTATION_MS);
    }

    function restartRotation() {
      stopRotation();
      startRotation();
    }

    function completeSwipe(distance) {
      if (gestureHandled) {
        return;
      }
      gestureHandled = true;
      if (Math.abs(distance) >= 45) {
        suppressClick = true;
        showFeaturedProduct(currentIndex + (distance < 0 ? 1 : -1), true);
        window.setTimeout(() => {
          suppressClick = false;
        }, 0);
      } else {
        startRotation();
      }
    }

    previousButton.addEventListener("click", () => showFeaturedProduct(currentIndex - 1, true));
    nextButton.addEventListener("click", () => showFeaturedProduct(currentIndex + 1, true));
    featuredContainer.addEventListener("mouseenter", stopRotation);
    featuredContainer.addEventListener("mouseleave", startRotation);
    featuredContainer.addEventListener("focusin", stopRotation);
    featuredContainer.addEventListener("focusout", startRotation);
    featuredContainer.addEventListener("dragstart", (event) => event.preventDefault());
    featuredContainer.addEventListener("pointerdown", (event) => {
      pointerStartX = event.clientX;
      gestureHandled = false;
      stopRotation();
      if (typeof featuredContainer.setPointerCapture === "function") {
        featuredContainer.setPointerCapture(event.pointerId);
      }
    });
    featuredContainer.addEventListener("pointerup", (event) => {
      if (pointerStartX === null) {
        return;
      }
      const distance = event.clientX - pointerStartX;
      pointerStartX = null;
      completeSwipe(distance);
    });
    featuredContainer.addEventListener("mousedown", (event) => {
      mouseStartX = event.clientX;
      if (pointerStartX === null) {
        gestureHandled = false;
      }
      stopRotation();
    });
    featuredContainer.addEventListener("mouseup", (event) => {
      if (mouseStartX === null) {
        return;
      }
      const distance = event.clientX - mouseStartX;
      mouseStartX = null;
      completeSwipe(distance);
    });
    featuredContainer.addEventListener("pointercancel", () => {
      pointerStartX = null;
      mouseStartX = null;
      gestureHandled = false;
      startRotation();
    });
    featuredContainer.addEventListener(
      "click",
      (event) => {
        if (suppressClick) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      true,
    );
    documentRef.addEventListener("visibilitychange", () => {
      if (documentRef.hidden) {
        stopRotation();
      } else {
        startRotation();
      }
    });

    if (featuredProducts.length < 2) {
      previousButton.hidden = true;
      nextButton.hidden = true;
    }

    featuredContainer.append(slide, previousButton, nextButton, status);
    renderFeaturedSlide();
    startRotation();
  }

  // Gallery filtering, lazy image loading, and product cards
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

  function createProductCard(documentRef, config, product, imageObserver, headingTag = "h2") {
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
    const title = createElement(documentRef, headingTag, { className: "product-card-title" });
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

  // Product detail sections, purchase contact, images, and optional video
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

    const contactCta = getContactCta(config, product);
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

  function createPurchasePanel(documentRef, config, product) {
    const contactCta = getContactCta(config, product);
    const panel = createElement(documentRef, "section", { className: "purchase-panel" });

    panel.append(
      createElement(documentRef, "p", { className: "purchase-panel-label", text: config.text.purchaseTitle }),
      createElement(documentRef, "p", { className: "purchase-panel-help", text: config.text.purchaseHelp }),
      createElement(documentRef, "a", {
        className: "primary-button purchase-button",
        text: contactCta.label,
        attrs: { href: contactCta.url },
      }),
    );

    return panel;
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

    images.forEach((imagePath, index) => {
      const button = createElement(documentRef, "button", {
        className: `gallery-image-button${index === 0 ? " is-active" : ""}`,
        attrs: {
          type: "button",
          "aria-label": `Show ${product.name} view ${index + 1}`,
          "aria-pressed": index === 0 ? "true" : "false",
        },
      });
      button.append(
        createElement(documentRef, "img", {
          className: "gallery-detail-img",
          attrs: {
            src: imagePath,
            alt: "",
            loading: index === 0 ? "eager" : "lazy",
          },
        }),
      );
      button.addEventListener("click", () => {
        mainImage.src = imagePath;
        mainImage.alt = `${product.name} view ${index + 1}`;
        extraContainer.querySelectorAll(".gallery-image-button").forEach((thumbnail) => {
          const isCurrent = thumbnail === button;
          thumbnail.classList.toggle("is-active", isCurrent);
          thumbnail.setAttribute("aria-pressed", String(isCurrent));
        });
      });
      extraContainer.append(button);
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
      const detailGallery = documentRef.querySelector(".detail-gallery");
      if (mainImage) {
        mainImage.hidden = true;
      }
      if (detailGallery) {
        detailGallery.hidden = true;
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
      createElement(documentRef, "p", { className: "detail-price", text: formatPrice(product.price) }),
    );

    infoRoot.append(heading, createPurchasePanel(documentRef, config, product));
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

  // Shared email signup and scroll-reveal enhancements
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

  function initScrollReveal(documentRef, windowRef) {
    const revealItems = [...documentRef.querySelectorAll("[data-reveal]")];

    if (revealItems.length === 0) {
      return;
    }

    if (!("IntersectionObserver" in windowRef)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new windowRef.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 },
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  /*
   * Application entry point. Each renderer detects its own page mount and exits
   * when absent, allowing this one file to support every static page.
   */
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
    initScrollReveal(documentRef, window);
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
