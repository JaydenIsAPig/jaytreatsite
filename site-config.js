(function (window) {
  "use strict";

  /*
   * Site-wide content and integration settings.
   * Product records belong in products.js. See docs/MAINTENANCE.md for the
   * configuration contract and the HTML data attributes these values hydrate.
   */
  const siteConfig = {
    version: "20260606",
    siteName: "Linden & Light Jewelry",
    siteTagline: "Simple jewelry, thoughtfully chosen.",
    featuredProductId: "product-001",
    // Canonical paths used by every data-page-link element and generated URL.
    pages: {
      home: "index.html",
      gallery: "gallery.html",
      detail: "product.html",
    },
    // Product category fields must match one of these values.
    categories: [
      { value: "all", label: "All categories" },
      { value: "featured", label: "Featured pieces" },
      { value: "necklaces", label: "Necklaces" },
      { value: "earrings", label: "Earrings" },
      { value: "bracelets", label: "Bracelets" },
      { value: "rings", label: "Rings" },
      { value: "brooches", label: "Brooches & pins" },
      { value: "gift-sets", label: "Gift sets" },
    ],
    // Each key becomes a generated gallery dropdown when product values exist.
    specificationFilters: [{ key: "availability", label: "Availability" }],
    defaultDistributorContact: {
      name: "Linden & Light",
      email: "hello@lindenandlight.com",
      phone: "",
      note: "Ordering is personal and simple. Send a note for availability, sizing, gift help, or any questions about this piece.",
    },
    defaultCta: {
      label: "Ask to purchase",
      url: "mailto:hello@lindenandlight.com",
    },
    // The shared footer renderer displays at most three social links.
    socialLinks: [
      {
        platform: "Instagram",
        url: "https://www.instagram.com/",
        image: "images/social-instagram.png",
      },
      {
        platform: "Facebook",
        url: "https://www.facebook.com/",
        image: "images/social-facebook.svg",
      },
      {
        platform: "TikTok",
        url: "https://www.tiktok.com/",
        image: "images/social-tiktok.svg",
      },
    ],
    // Leave endpoint empty for local-only success messaging.
    emailSignup: {
      enabled: true,
      provider: "placeholder",
      endpoint: "",
      successMessage: "Thank you. You are on the Linden & Light list.",
      errorMessage: "Please enter a valid email address.",
    },
    // Reusable UI copy is connected to HTML through data-config-text.
    text: {
      homeNavLabel: "Home",
      galleryNavLabel: "Shop jewelry",
      aboutNavLabel: "Our story",
      brandTagline: "Jewelry chosen with care",
      announcementText: "Complimentary gift wrapping on every piece",
      homeIntroEyebrow: "Timeless pieces. Thoughtful details.",
      homeIntroTitle: "Simple jewelry, beautifully chosen.",
      homeIntroBody: "Discover approachable pieces selected to feel comfortable, meaningful, and easy to wear every day.",
      shopCollectionLabel: "Shop the collection",
      meetSellerLabel: "Meet the seller",
      shoppingNoteTitle: "A simple way to shop",
      shoppingStepOne: "Browse the collection",
      shoppingStepTwo: "Open a piece for details and price",
      shoppingStepThree: "Use the purchase button to order",
      featuredSectionTitle: "A lovely place to begin",
      featuredSectionIntro: "A few customer favorites selected for their easy, timeless style.",
      galleryEyebrow: "The collection",
      galleryTitle: "Find a piece to love",
      gallerySubtitle: "Browse by jewelry type, or search for a color, material, or style.",
      filterTitle: "Narrow your choices",
      filterHelp: "Use one or more filters. Results update automatically.",
      searchLabel: "Search the collection",
      categoryFilterLabel: "Jewelry type",
      gallerySearchPlaceholder: "Try pearl, gold, silver, or gift",
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
      galleryImagesHelp: "Select an image to see it larger.",
      aboutEyebrow: "A note from the seller",
      aboutTitle: "Jewelry should be a joy to choose and a pleasure to wear.",
      aboutBody: "Linden & Light is a small independent shop built around uncomplicated beauty. Each piece is selected for its wearable shape, thoughtful detail, and ability to feel special without feeling fussy.",
      aboutNote: "Questions are always welcome. I am happy to help you choose a piece or find a thoughtful gift.",
      aboutContactLabel: "Say hello",
      emailSignupTitle: "A little beauty in your inbox",
      emailButtonLabel: "Join the list",
      emailPlaceholder: "you@example.com",
      siteTagline: "Simple jewelry, thoughtfully chosen.",
    },
  };

  window.StorefrontConfig = siteConfig;
})(window);
