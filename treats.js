// 1. The "Pointer" - Change this string to match the ID of the treat you want featured
const currentTreatID = "strawberry-dream";

// 2. The "Backlog" - Your complete database of items
const treatData = {
  "strawberry-dream": {
    name: "Strawberry Dream",
    ingredients: "Fresh strawberries, white chocolate, vanilla bean, cream.",
    allergens: "Dairy, Soy",
    youtubeID: "xyz123", // Replace with real YouTube ID
    // The first link is the Main Image. Add as many others as you want.
    images: [
      "images/strawberry-main.jpg",
    ],
  },
  "classic-jay": {
    name: "The Classic Jay",
    ingredients: "Chocolate chips, sea salt, brown butter.",
    allergens: "Wheat, Dairy",
    youtubeID: "dQw4w9WgXcQ",
    images: ["images/classic-jay-main.jpg", "images/classic-stack.jpg"],
  },
  "double-choc": {
    name: "Double Trouble",
    ingredients: "Cocoa powder, dark chocolate chunks, espresso.",
    allergens: "Wheat, Dairy, Eggs",
    youtubeID: "dQw4w9WgXcQ",
    images: ["images/classic-jay-main.jpg", "images/classic-stack.jpg"],
  },
};
