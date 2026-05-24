(function (window) {
  "use strict";

  const siteConfig = {
    version: "20260429",
    siteName: "JayTreats",
    featuredTreatId: "bday-cake",
    featuredPrice: 4.0,
    defaultOrderNote: "jaytreat",
    pages: {
      home: "index.html",
      gallery: "gallery.html",
      detail: "treat.html",
    },
    social: {
      instagram: "https://www.instagram.com/jaydessertss",
      instagramIcon: "images/insta.png",
    },
    payment: {
      provider: "venmo",
      baseUrl: "https://venmo.com",
      username: "Jaden-Daden",
    },
    text: {
      homeSubtitle: "Click my picture for more info",
      galleryTitle: "The Archives",
      gallerySubtitle: "Taste them all (visually)",
      gallerySearchPlaceholder: "Search for your favorites...",
      browseArchiveLabel: "Or browse all my old stuff",
      backHomeLabel: "Back to Home",
      noMatchesPrefix: "No treats found matching",
      treatNotFound: "Treat Not Found",
    },
  };

  window.JayTreatsConfig = siteConfig;

  // Legacy aliases keep older snippets or bookmarked console usage working.
  window.SITE_VERSION = siteConfig.version;
  window.currentTreatID = siteConfig.featuredTreatId;
  window.currentPrice = siteConfig.featuredPrice;
})(window);
