// 1. The "Pointer" - Change this string to match the ID of the treat you want featured
const currentTreatID = "british-smores";

// 2. The "Backlog" - Your complete database of items
const treatData = {
  "british-smores": {
    name: "British Smores.",
    vibe: "#8e3d00",
    ingredients: "British people and smores.",
    allergens: "Flour, Dairy",
    youtubeID: "4rsmACYUxQ", // Replace with real YouTube ID
    // The first link is the Main Image. Add as many others as you want.
    images: [
      "images/british-main.jpeg",
      "images/british-1.jpeg",
      "images/british-2.jpeg",
      "images/british-poster.jpeg",
    ],
  },
  "santas-cookies": {
    name: "Santas Cookies.",
    vibe: "#ff2710",
    ingredients: "Chocolate chips, sea salt, brown butter.",
    allergens: "Flour (gluetn), Almonds",
    youtubeID: "dQw4w9WgXcQ",
    images: [
      "images/santa-main.jpeg",
      "images/santa-1.jpeg",
      "images/santa-2.jpeg",
      "images/santa-poster.jpeg",
    ],
  },
  "basque-cheesecake": {
    name: "Caramel Biscoff Basque Cheesecake.",
    vibe: "#6f5948",
    ingredients: "Cocoa powder, dark chocolate chunks, espresso.",
    allergens: "Nutmeg",
    youtubeID: "dQw4w9WgXcQ",
    images: [
      "images/basquecake-main.jpeg",
      "images/basquecake-1.jpeg",
      "images/basquecake-2.jpeg",
      "images/basquecake-poster.jpeg",
    ],
  },
};
