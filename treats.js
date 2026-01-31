// 1. The "Pointer" - Change this string to match the ID of the treat you want featured
const currentTreatID = "biscoff-crispy";
const currentPrice = 3.50;


// 2. The "Backlog" - Your complete database of items
const treatData = {
  "biscoff-crispy": {
    name: "Biscoff Rice Crisp treat",
    vibe: "#3e0f04",
    ingredients: "Chewy Rice Crispy infused with biscoff butter, finished with a biscoff white choclate and encrusted with more biscoff powder",
    allergens: "Cinnamon, Gelatin",
    images: [
      "images/biscoff-crispy-main.jpg",
      "images/biscoff-crispy-1.jpg",
      "images/biscoff-crispy-2.jpg",
      "images/biscoff-crispy-poster.jpg",
    ],
  },
  "velvet-cheesecake": {
    name: "Dark Velvet Cheesecake Cookie",
    vibe: "#3e0f04",
    ingredients: "Chocolate cookie base, Unprocessed Cocoa powder, White chocolate chips, Cream cheese filling",
    allergens: "Flour (gluetn), Dairy, Cocoa",
    youtubeID: "https://www.youtube.com/shorts/h2pDgsDiEv8", // Replace with real YouTube ID
    // The first link is the Main Image. Add as many others as you want.
    images: [
      "images/velvet-cheesecake-main.jpeg",
      "images/velvet-cheesecake-1.jpeg",
      "images/velvet-cheesecake-2.jpeg",
      "images/velvet-cheesecake-poster.png",
    ],
  },
  "british-smores": {
    name: "British Smores Cookie.",
    vibe: "#8e3d00",
    ingredients: "Classic, Jaytreat cookie base, cinnamon, white choclate chips, biscoff, biscoff cookie butter, toasted marshmallow",
    allergens: "Flour (gluetn), Dairy",
    youtubeID: "https://www.youtube.com/shorts/wIAtMzUSFHI", // Replace with real YouTube ID
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
    ingredients: "Classic Jaytreat cookie base, chocolate & white peppermint chocolate covered pretzels, chocolate covered caramels & almonds",
    allergens: "Flour (gluetn), Almonds",
    youtubeID: "https://www.youtube.com/shorts/V8w1FR6SCSM",
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
    ingredients: "Biscoff cookie base, salted caramel, cream cheese.",
    allergens: "Nutmeg",
    youtubeID: "https://www.youtube.com/shorts/g6cSvJr3fzw",
    images: [
      "images/basquecake-main.jpeg",
      "images/basquecake-1.jpeg",
      "images/basquecake-2.jpeg",
      "images/basquecake-poster.jpeg",
    ],
  },
  "choclate-smores": {
    name: "Chocolate Chips Smores Cookie.",
    vibe: "#ffe6d2",
    ingredients: "Classic, Jaytreat cookie base, cinnamon, semi-sweet choclate chips, toasted marshmallow",
    allergens: "Flour (gluetn), Dairy, Gelatin",
    youtubeID: "https://www.youtube.com/shorts/SEFPr8NGXiY",
    images: [
      "images/smores-chip-main.jpeg",
      "images/smores-chip-1.jpeg",
      "images/smores-chip-2.jpeg",
      "images/smores-chip-poster.jpg",
    ],
  },
  "bannana-bread": {
    name: "Bannana Bread Cookies.",
    vibe: "#ffea00",
    ingredients: "Bannana bread-cookie hybrid that is soft and chewy but not too sweet.",
    allergens: "Flour (gluetn), Dairy, Bannana",
    youtubeID: "https://www.youtube.com/shorts/Q-Cp2_iJrfc",
    images: [
      "images/bannana-cookie-main.jpeg",
      "images/bannana-cookie-1.jpeg",
      "images/bannana-cookie-2.jpeg",
      "images/bannana-cookie-poster.png",
    ],
  },
  "pumpkin-kup": {
    name: "Iced Spiced Pumpkin Kupz.",
    vibe: "#a44f00",
    ingredients: "Fluffy yellow cake with cinnamon sugar topping, and finished with maple spiced icing",
    allergens: "Flour (gluetn), Dairy, Cinnamon, Nutmeg",
    images: [
      "images/pump-kup-main.jpeg",
      "images/pump-kup-1.jpeg",
      "images/pump-kup-2.jpeg",
      "images/pump-kup-poster.JPG",
    ],
  },
  "golden-smore": {
    name: "Golden Smoreo Cookie.",
    vibe: "#a44f00",
    ingredients: "Classic Jaytreat cookie base with a golden oreo surprise on the bottom, and a marshmallow one on top.",
    allergens: "Flour (gluetn), Dairy, Cinnamon, Gelatin",
    images: [
      "images/golden-smoreo-main.jpeg",
      "images/golden-smoreo-1.jpeg",
      "images/golden-smoreo-2.jpeg",
      "images/golden-smoreo-poster.JPG",
    ],
  },
};
