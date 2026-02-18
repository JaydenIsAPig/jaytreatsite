// 1. The "Pointer" - Change this string to match the ID of the treat you want featured
const currentTreatID = "cookies-cream";
const currentPrice = 4.00;


// 2. The "Backlog" - Your complete database of items
const treatData = {
  "cookies-cream": {
    name: "Cookies & Cream",
    vibe: "#000000b5",
    ingredients: "Oreos (Golden & Original), Semi Sweet & White chocolate chips Butter, Sugar, Brown Sugar, Eggs, Flour, Baking Soda, Salt, Cornstarch,",
    allergens: "Flour (Gluetn)",
    images: [
      "images/cookies-cream-main.jpeg",
      "images/cookies-cream-1.jpeg",
      "images/cookies-cream-2.jpeg",
      "images/cookies-cream-3.jpeg",
    ],
  },
  "fudge-brookie": {
    name: "Heath Oreo Brookie Fudge Bomb",
    vibe: "#822300b5",
    ingredients: "Heath, Cookie Dough Oreo, Semisweet chocolate chips, Butter, Sugar, Salt, Cocoa Powder",
    allergens: "Flour (Gluetn)",
    images: [
      "images/fudge-brookie-main.jpeg",
      "images/fudge-brookie-1.jpeg",
      "images/fudge-brookie-2.jpeg",
      "images/fudge-brookie-poster.jpeg",
    ],
  },
  "biscoff-crispy": {
    name: "Biscoff Rice Crisp treat",
    vibe: "#0095f2",
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
    allergens: "Flour (gluetn), Dairy, Cinnamon",
    images: [
      "images/golden-smoreo-main.jpeg",
      "images/golden-smoreo-1.jpeg",
      "images/golden-smoreo-2.jpeg",
      "images/golden-smoreo-poster.JPG",
    ],
  },
    "cookies-scream": {
    name: "Cookies & Scream Brownie",
    vibe: "#ff5100b5",
    ingredients: "Halloween Oreos, Chocolate goodness.",
    allergens: "Flour (Gluetn)",
    images: [
      "images/cookies-scream-main.jpeg",
      "images/cookies-scream-1.jpeg",
      "images/cookies-scream-2.jpeg",
      "images/cookies-scream-poster.JPG",
    ],
  },
  "smores-pc": {
    name: "Pretzel Caramel Smores Cookie.",
    vibe: "#5b3614",
    ingredients: "Classic Jaytreat cookie stuffed with pretzels, caramel, chocolate chips, and topped with a toasted marsh",
    allergens: "Flour (gluetn), Dairy, Cinnamon",
    images: [
      "images/smores-pc-main.jpeg",
      "images/smores-pc-1.jpeg",
      "images/smores-pc-2.jpeg",
      "images/smores-pc-poster.jpg",
    ],
  },
  "mountain-cookie": { 
    name: "Mountain Cookie.",
    vibe: "#000000",
    ingredients: "Heath, Biscoff, Oreo, COOKIE",
    allergens: "Flour (gluetn)",
    images: [
      "images/mountain-cookie-main.jpeg",
      "images/mountain-cookie-1.jpeg",
      "images/mountain-cookie-2.jpeg",
      "images/mountain-cookie-3.jpeg",
      "images/mountain-cookie-poster.jpeg",
    ],
  },
  "matcha-cookie": { 
    name: "Matcha Cookie.",
    vibe: "#44ff00",
    ingredients: "Matcha, Cream cheese, Honey Caramel, Oatmeal",
    allergens: "Flour (gluetn), Cream Cheese, Performative nature",
    images: [
      "images/matcha-cookie-main.jpeg",
      "images/matcha-cookie-1.jpeg",
      "images/matcha-cookie-poster.jpg",
    ],  
  },
   "dubai-cookie": { 
    name: "Dubai Cookie.",
    vibe: "#114a00",
    ingredients: "Classic Jaytreat, with dubai pistachio filling and chocolate topping.",
    allergens: "Flour (gluetn) Gelatin, Peach",
    images: [
      "images/dubai-cookie-main.jpeg",
      "images/dubai-cookie-1.jpeg",
      "images/dubai-cookie-2.JPG",
      "images/dubai-cookie-poster.JPG",
    ],
  },
   "apple-studel": { 
    name: "Apple Strudel Kup.",
    vibe: "#ff3006",
    ingredients: "Delicious cookie cup with apple filling topped with crunchy cinnamon sugar strudel",
    allergens: "Flour (gluetn) Gelatin, Peach",
    images: [
      "images/apple-strudel-main.jpeg",
      "images/apple-strudel-1.jpeg",
      "images/apple-strudel-2.jpeg",
      "images/apple-strudel-poster.JPG",
    ],
  },
  
    "peach-cream": { 
    name: "Peaches & Cream Cookie.",
    vibe: "#ffaa64",
    ingredients: "Classic Jaytreat cookie base mixed with peach puree and white choclate chips",
    allergens: "Flour (gluetn) Gelatin, Peach",
    images: [
      "images/peach-cream-main.jpg",
      "images/peach-cream-1.jpeg",
      "images/peach-cream-2.jpeg",
      "images/peach-cream-poster.JPG",
    ],
  },
  "kid-kup": { 
    name: "Kid Kups.",
    vibe: "#ffd900",
    ingredients: "Everything you love in a cup (marshmallow, cookie, chocolate, pretzel, m&m)",
    allergens: "Flour (gluetn) Gelatin",
    images: [
      "images/kid-kup-main.jpeg",
      "images/kid-kup-1.jpeg",
      "images/kid-kup-2.jpeg",
      "images/kid-kup-poster.JPG",
    ],
  },
    "throwbacks": {
    name: "Throwbacks",
    vibe: "#ffffff",
    ingredients: "Idk, a bunch of em, these are oldies",
    allergens: "I think one had peanuts",
    images: [
      "images/other-main.jpeg",
      "images/other-1.jpeg",
      "images/other-2.JPG",
      "images/other-3.jpeg",
      "images/other-4.JPG",
      "images/other-5.JPG",
      "images/other-6.JPG",
      "images/other-7.JPG",
    ],
  },
};
