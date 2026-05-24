(function (window) {
  "use strict";

  const TRANSPARENT_PIXEL =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  const fallbackConfig = {
    siteName: "JayTreats",
    featuredTreatId: "",
    featuredPrice: 0,
    defaultOrderNote: "jaytreat",
    pages: {
      home: "index.html",
      gallery: "gallery.html",
      detail: "treat.html",
    },
    social: {
      instagram: "#",
      instagramIcon: "images/insta.png",
    },
    payment: {
      baseUrl: "",
      username: "",
    },
    text: {
      noMatchesPrefix: "No treats found matching",
      treatNotFound: "Treat Not Found",
    },
  };

  function mergeConfig(config) {
    const source = config || {};

    return {
      ...fallbackConfig,
      ...source,
      pages: { ...fallbackConfig.pages, ...(source.pages || {}) },
      social: { ...fallbackConfig.social, ...(source.social || {}) },
      payment: { ...fallbackConfig.payment, ...(source.payment || {}) },
      text: { ...fallbackConfig.text, ...(source.text || {}) },
    };
  }

  function getConfig() {
    return mergeConfig(window.JayTreatsConfig);
  }

  function getTreatData() {
    return window.JayTreatsData || window.treatData || {};
  }

  function getTextShadow(color) {
    if (!color) {
      return "";
    }

    return `1px 1px 0 ${color}, -1px 1px 0 ${color}, 1px -1px 0 ${color}, -1px -1px 0 ${color}`;
  }

  function applyVibe(element, color) {
    if (element && color) {
      element.style.textShadow = getTextShadow(color);
    }
  }

  function extractYouTubeId(value) {
    if (!value) {
      return "";
    }

    const rawValue = String(value).trim();
    const match = rawValue.match(/(?:shorts\/|embed\/|v=|youtu\.be\/)([\w-]{11})/);

    if (match) {
      return match[1];
    }

    return rawValue;
  }

  function isYouTubeShort(value) {
    return /shorts\//.test(String(value || ""));
  }

  function formatPrice(value) {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue.toFixed(2) : "0.00";
  }

  function getDetailUrl(config, treatId) {
    return `${config.pages.detail}?id=${encodeURIComponent(treatId)}`;
  }

  function buildPaymentUrl(config, treat) {
    const { payment } = config;

    if (!payment.baseUrl || !payment.username) {
      return "#";
    }

    const params = new URLSearchParams({
      txn: "pay",
      amount: formatPrice(config.featuredPrice),
      note: config.defaultOrderNote || treat.name,
    });

    return `${payment.baseUrl.replace(/\/$/, "")}/${encodeURIComponent(payment.username)}?${params.toString()}`;
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
        if (value !== undefined && value !== null) {
          element.setAttribute(name, String(value));
        }
      });
    }

    return element;
  }

  function getPrimaryImage(treat) {
    return Array.isArray(treat.images) && treat.images.length > 0 ? treat.images[0] : "";
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

    documentRef.querySelectorAll("[data-social-link='instagram']").forEach((element) => {
      element.setAttribute("href", config.social.instagram);
      element.setAttribute("rel", "noopener noreferrer");
    });

    documentRef.querySelectorAll("[data-social-icon='instagram']").forEach((element) => {
      element.setAttribute("src", config.social.instagramIcon);
    });
  }

  function createFeaturedVisual(documentRef, config, treat, treatId) {
    const block = createElement(documentRef, "div", { className: "content-block featured-block" });
    const visual = createElement(documentRef, "div", { className: "featured-visual" });
    const detailLink = createElement(documentRef, "a", {
      className: "image-link featured-image-link",
      attrs: { href: getDetailUrl(config, treatId) },
    });

    const heroImage = getPrimaryImage(treat);

    if (heroImage) {
      const image = createElement(documentRef, "img", {
        className: "featured-image",
        attrs: {
          src: heroImage,
          alt: treat.name,
        },
      });
      const imageTitle = createElement(documentRef, "h2", {
        className: "treat-image-title",
        text: treat.name,
      });

      applyVibe(imageTitle, treat.vibe || "#000");
      detailLink.append(image, imageTitle);
    } else {
      detailLink.append(createElement(documentRef, "div", {
        className: "placeholder-img",
        text: treat.name,
      }));
    }

    const preorderLink = createElement(documentRef, "a", {
      className: "preorder-btn featured-preorder",
      text: `Click to preorder (${formatPrice(config.featuredPrice)}$)`,
      attrs: {
        href: buildPaymentUrl(config, treat),
        target: "_blank",
        rel: "noopener noreferrer",
      },
    });

    visual.append(detailLink, preorderLink);
    block.append(visual);
    return block;
  }

  function createVideoBlock(documentRef, treat) {
    const rawVideo = treat.youtubeID ? String(treat.youtubeID).trim() : "";
    const videoId = extractYouTubeId(rawVideo);
    const block = createElement(documentRef, "div", { className: "content-block" });
    const videoWrapper = createElement(documentRef, "div", {
      className: `video-container${isYouTubeShort(rawVideo) ? " shorts-mode" : ""}`,
    });
    const iframe = createElement(documentRef, "iframe", {
      attrs: {
        src: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`,
        title: `${treat.name} video`,
        loading: "lazy",
        allowfullscreen: "",
      },
    });

    videoWrapper.append(iframe);
    block.append(videoWrapper);
    return block;
  }

  function renderHomePage(documentRef, config, data) {
    const nameHeader = documentRef.getElementById("treat-name");
    const featuredContainer = documentRef.getElementById("featured-treat-container");

    if (!nameHeader && !featuredContainer) {
      return;
    }

    const treatId = config.featuredTreatId;
    const featuredTreat = data[treatId];

    if (!featuredTreat) {
      if (nameHeader) {
        nameHeader.textContent = config.text.treatNotFound;
      }

      if (featuredContainer) {
        featuredContainer.textContent = `Treat data not found for ID: ${treatId}`;
      }

      return;
    }

    if (nameHeader) {
      nameHeader.textContent = featuredTreat.name;
      applyVibe(nameHeader, featuredTreat.vibe);
    }

    if (!featuredContainer) {
      return;
    }

    featuredContainer.replaceChildren();
    featuredContainer.classList.remove("content-container--centered");

    const visualBlock = createFeaturedVisual(documentRef, config, featuredTreat, treatId);
    const videoId = extractYouTubeId(featuredTreat.youtubeID);

    if (videoId) {
      featuredContainer.append(visualBlock, createVideoBlock(documentRef, featuredTreat));
      return;
    }

    featuredContainer.classList.add("content-container--centered");
    visualBlock.classList.add("content-block--centered");
    featuredContainer.append(visualBlock);
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

  function renderGalleryPage(documentRef, config, data, windowRef) {
    const galleryContainer = documentRef.getElementById("full-gallery");
    const searchInput = documentRef.getElementById("treat-search");

    if (!galleryContainer) {
      return;
    }

    const imageObserver = createImageObserver(windowRef);

    function observeImage(image) {
      if (imageObserver) {
        imageObserver.observe(image);
        return;
      }

      image.src = image.dataset.src;
      image.classList.add("loaded");
    }

    function renderGallery(filterText = "") {
      const cleanFilter = filterText.toLowerCase().trim();
      let matchCount = 0;

      galleryContainer.replaceChildren();

      Object.entries(data).forEach(([id, treat]) => {
        const searchableText = `${treat.name || ""} ${treat.ingredients || ""}`.toLowerCase();

        if (!searchableText.includes(cleanFilter)) {
          return;
        }

        matchCount += 1;

        const card = createElement(documentRef, "article", {
          className: "content-block gallery-card animate-in",
        });
        const detailLink = createElement(documentRef, "a", {
          className: "image-link",
          attrs: { href: getDetailUrl(config, id) },
        });
        const cardImage = getPrimaryImage(treat);

        if (cardImage) {
          const image = createElement(documentRef, "img", {
            className: "lazy-load gallery-card-image",
            attrs: {
              src: TRANSPARENT_PIXEL,
              "data-src": cardImage,
              alt: treat.name,
            },
          });
          detailLink.append(image);
          observeImage(image);
        } else {
          detailLink.append(createElement(documentRef, "div", {
            className: "placeholder-img gallery-placeholder",
            text: treat.name,
          }));
        }

        const cardText = createElement(documentRef, "div", { className: "card-text" });
        const heading = createElement(documentRef, "h3");
        const headingLink = createElement(documentRef, "a", {
          className: "gallery-title-link",
          text: treat.name,
          attrs: { href: getDetailUrl(config, id) },
        });

        applyVibe(headingLink, treat.vibe || "#000");
        heading.append(headingLink);
        cardText.append(heading);
        card.append(detailLink, cardText);
        galleryContainer.append(card);
      });

      if (matchCount === 0) {
        galleryContainer.append(createElement(documentRef, "p", {
          className: "no-results",
          text: `${config.text.noMatchesPrefix} "${filterText}"`,
        }));
      }
    }

    renderGallery();

    if (searchInput) {
      searchInput.addEventListener("input", (event) => renderGallery(event.target.value));
    }
  }

  function createInfoCard(documentRef, treat) {
    const card = createElement(documentRef, "section", {
      className: "info-card",
      attrs: { id: "universal-info-card", "aria-label": `${treat.name} details` },
    });
    const allergenHeading = createElement(documentRef, "h3", {
      className: "allergen-heading",
      text: "Contains:",
    });
    const allergenList = createElement(documentRef, "p", {
      className: "allergen-list",
      text: treat.allergens || "Not listed",
    });
    const ingredientContainer = createElement(documentRef, "div", {
      className: "ingredient-container",
    });
    const ingredientHeading = createElement(documentRef, "h2", { text: "Ingredients" });
    const ingredientList = createElement(documentRef, "p", {
      className: "ingredient-list",
      text: treat.ingredients || "Not listed",
    });

    ingredientContainer.append(ingredientHeading, ingredientList);
    card.append(allergenHeading, allergenList, ingredientContainer);
    return card;
  }

  function renderTreatDetailPage(documentRef, config, data, windowRef) {
    const detailRoot = documentRef.getElementById("treat-detail");
    const nameHeader = documentRef.getElementById("treat-name");

    if (!detailRoot || !nameHeader) {
      return;
    }

    const params = new URLSearchParams(windowRef.location.search);
    const treatId = params.get("id");
    const treat = treatId ? data[treatId] : null;

    if (!treat) {
      nameHeader.textContent = config.text.treatNotFound;
      detailRoot.classList.add("is-hidden");
      return;
    }

    nameHeader.textContent = treat.name;
    applyVibe(nameHeader, treat.vibe);
    documentRef.title = `${treat.name} | ${config.siteName.toLowerCase()}`;

    const infoCard = createInfoCard(documentRef, treat);
    const headerSlot = documentRef.getElementById("header-slot");
    const mediaSlot = documentRef.getElementById("media-slot");
    const videoWrapper = documentRef.getElementById("video-wrapper");
    const videoFrame = documentRef.getElementById("video-player");
    const rawVideo = treat.youtubeID ? String(treat.youtubeID).trim() : "";
    const videoId = extractYouTubeId(rawVideo);

    if (videoId && headerSlot && videoWrapper && videoFrame) {
      headerSlot.append(infoCard);
      infoCard.classList.add("in-header");
      videoWrapper.classList.remove("is-hidden", "shorts-mode");
      videoWrapper.classList.toggle("shorts-mode", isYouTubeShort(rawVideo));
      videoFrame.src = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
      videoFrame.title = `${treat.name} video`;
    } else if (mediaSlot && videoWrapper && videoFrame) {
      videoWrapper.classList.add("is-hidden");
      videoFrame.removeAttribute("src");
      mediaSlot.append(infoCard);
      infoCard.classList.add("in-grid");
    }

    renderTreatImages(documentRef, treat);
  }

  function renderTreatImages(documentRef, treat) {
    const mainImage = documentRef.getElementById("main-treat-image");
    const extraContainer = documentRef.getElementById("extra-images-container");
    const images = Array.isArray(treat.images) ? treat.images : [];

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
    mainImage.alt = `${treat.name} main view`;

    images.slice(1).forEach((imagePath, index) => {
      const image = createElement(documentRef, "img", {
        className: "gallery-detail-img",
        attrs: {
          src: imagePath,
          alt: `${treat.name} detail ${index + 1}`,
          loading: "lazy",
        },
      });

      extraContainer.append(image);
    });
  }

  function init() {
    const documentRef = window.document;

    if (!documentRef) {
      return;
    }

    const config = getConfig();
    const data = getTreatData();

    hydrateSharedElements(documentRef, config);
    renderHomePage(documentRef, config, data);
    renderGalleryPage(documentRef, config, data, window);
    renderTreatDetailPage(documentRef, config, data, window);
  }

  window.JayTreats = {
    getConfig,
    getTreatData,
    renderHomePage,
    renderGalleryPage,
    renderTreatDetailPage,
    utils: {
      buildPaymentUrl,
      extractYouTubeId,
      formatPrice,
      getTextShadow,
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
