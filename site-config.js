(function (window) {
  "use strict";

  const siteConfig = {
    version: "20260526",
    siteName: "Product Gallery",
    siteTagline: "Simple products, clearly presented.",
    featuredProductId: "product-001",
    pages: {
      home: "index.html",
      gallery: "gallery.html",
      detail: "product.html",
    },
    categories: [
      { value: "all", label: "All categories" },
      { value: "featured", label: "Featured" },
      { value: "gift-ready", label: "Gift-ready" },
      { value: "everyday", label: "Everyday" },
      { value: "limited-run", label: "Limited run" },
      { value: "seasonal", label: "Seasonal" },
      { value: "collections", label: "Collections" },
    ],
    specificationFilters: [{ key: "availability", label: "Availability" }],
    defaultDistributorContact: {
      name: "Product Gallery Team",
      email: "hello@example.com",
      phone: "",
      note: "Contact us for availability, ordering, and product questions.",
    },
    defaultCta: {
      label: "Contact about this product",
      url: "mailto:hello@example.com",
    },
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

  window.StorefrontConfig = siteConfig;
})(window);
