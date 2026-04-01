// 1. The "Pointer" - Change this string to match the ID of the treat you want featured
const currentTreatID = "choclate-smores'2";
const currentPrice = 5.00;


// 2. The "Backlog" - Your complete database of items

const treatData = {
  "choclate-smores'2": {
    name: "Chocolate Chips Smores Cookie.",
    vibe: "#9e4700",
    ingredients: "Classic, Jaytreat cookie base, cinnamon, {Milk,White, Dark} choclate chips &, toasted marshmallow, graham cracker,",
    allergens: "Flour (gluetn), Dairy, Gelatin",
    images: [
      "images/smores-chip'2-main.webp",
      "images/smores-chip'2-1.webp",
      "images/smores-chip'2-2.webp",
      "images/smores-chip'2-3.webp",
      "images/smores-chip'2-4.webp",
    ],
  },
  "caramel-snickerdoodle": {
    name: "Carmel Snickerdoodle Cookie Sandwich",
    vibe: "#ffa21fc9",
    ingredients: "Butter, Sugar, Brown Sugar, Eggs, Flour, Baking Powder, Salt, Cornstarch, Cinnamon, Cream of Tar Tar",
    allergens: "Flour (Gluetn), Cinnamon",
    images: [
      "images/caramel-snickerdoodle-main.webp",
      "images/caramel-snickerdoodle-1.webp",
      "images/caramel-snickerdoodle-2.webp",
      "images/caramel-snickerdoodle-3.webp",
    ],
  },
  "biscoff-brownie": {
    name: "British Smores Brownie",
    vibe: "#381300b5",
    ingredients: "Marshmallows, Semi Sweet & Dark chocolate chips, Butter, Sugar, Brown Sugar, Eggs, Flour, Baking Powder, Salt, Cornstarch, Cocoa powder, Biscoff Spread, Biscoff Cookie",
    allergens: "Flour (Gluetn), Gelatin",
    images: [
      "images/biscoff-brownie-main.webp",
      "images/biscoff-brownie-1.webp",
      "images/biscoff-brownie-2.webp",
      "images/biscoff-brownie-poster.webp",
    ],
  },
  "cookies-cream": {
    name: "Cookies & Cream",
    vibe: "#000000b5",
    ingredients: "Oreos (Golden & Original), Semi Sweet & White chocolate chips Butter, Sugar, Brown Sugar, Eggs, Flour, Baking Soda, Salt, Cornstarch,",
    allergens: "Flour (Gluetn)",
    images: [
      "images/cookies-cream-main.webp",
      "images/cookies-cream-1.webp",
      "images/cookies-cream-2.webp",
      "images/cookies-cream-3.webp",
    ],
  },
  "fudge-brookie": {
    name: "Heath Oreo Brookie Fudge Bomb",
    vibe: "#822300b5",
    ingredients: "Heath, Cookie Dough Oreo, Semisweet chocolate chips, Butter, Sugar, Salt, Cocoa Powder",
    allergens: "Flour (Gluetn)",
    images: [
      "images/fudge-brookie-main.webp",
      "images/fudge-brookie-1.webp",
      "images/fudge-brookie-2.webp",
      "images/fudge-brookie-poster.webp",
    ],
  },
  "biscoff-crispy": {
    name: "Biscoff Rice Crisp treat",
    vibe: "#0095f2",
    ingredients: "Chewy Rice Crispy infused with biscoff butter, finished with a biscoff white choclate and encrusted with more biscoff powder",
    allergens: "Cinnamon, Gelatin",
    images: [
      "images/biscoff-crispy-main.webp",
      "images/biscoff-crispy-1.webp",
      "images/biscoff-crispy-2.webp",
      "images/biscoff-crispy-poster.webp",
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
      "images/velvet-cheesecake-main.webp",
      "images/velvet-cheesecake-1.webp",
      "images/velvet-cheesecake-2.webp",
      "images/velvet-cheesecake-poster.webp",
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
      "images/british-main.webp",
      "images/british-1.webp",
      "images/british-2.webp",
      "images/british-poster.webp",
    ],
  },
  "santas-cookies": {
    name: "Santas Cookies.",
    vibe: "#ff2710",
    ingredients: "Classic Jaytreat cookie base, chocolate & white peppermint chocolate covered pretzels, chocolate covered caramels & almonds",
    allergens: "Flour (gluetn), Almonds",
    youtubeID: "https://www.youtube.com/shorts/V8w1FR6SCSM",
    images: [
      "images/santa-main.webp",
      "images/santa-1.webp",
      "images/santa-2.webp",
      "images/santa-poster.webp",
    ],
  },
  "basque-cheesecake": {
    name: "Caramel Biscoff Basque Cheesecake.",
    vibe: "#6f5948",
    ingredients: "Biscoff cookie base, salted caramel, cream cheese.",
    allergens: "Nutmeg",
    youtubeID: "https://www.youtube.com/shorts/g6cSvJr3fzw",
    images: [
      "images/basquecake-main.webp",
      "images/basquecake-1.webp",
      "images/basquecake-2.webp",
      "images/basquecake-poster.webp",
    ],
  },
  "choclate-smores": {
    name: "Chocolate Chips Smores Cookie.",
    vibe: "#ffe6d2",
    ingredients: "Classic, Jaytreat cookie base, cinnamon, semi-sweet choclate chips, toasted marshmallow",
    allergens: "Flour (gluetn), Dairy, Gelatin",
    youtubeID: "https://www.youtube.com/shorts/SEFPr8NGXiY",
    images: [
      "images/smores-chip-main.webp",
      "images/smores-chip-1.webp",
      "images/smores-chip-2.webp",
      "images/smores-chip-poster.webp",
    ],
  },
  "bannana-bread": {
    name: "Bannana Bread Cookies.",
    vibe: "#ffea00",
    ingredients: "Bannana bread-cookie hybrid that is soft and chewy but not too sweet.",
    allergens: "Flour (gluetn), Dairy, Bannana",
    youtubeID: "https://www.youtube.com/shorts/Q-Cp2_iJrfc",
    images: [
      "images/bannana-cookie-main.webp",
      "images/bannana-cookie-1.webp",
      "images/bannana-cookie-2.webp",
      "images/bannana-cookie-poster.webp",
    ],
  },
  "pumpkin-kup": {
    name: "Iced Spiced Pumpkin Kupz.",
    vibe: "#a44f00",
    ingredients: "Fluffy yellow cake with cinnamon sugar topping, and finished with maple spiced icing",
    allergens: "Flour (gluetn), Dairy, Cinnamon, Nutmeg",
    images: [
      "images/pump-kup-main.webp",
      "images/pump-kup-1.webp",
      "images/pump-kup-2.webp",
      "images/pump-kup-poster.webp",
    ],
  },
  "golden-smore": {
    name: "Golden Smoreo Cookie.",
    vibe: "#a44f00",
    ingredients: "Classic Jaytreat cookie base with a golden oreo surprise on the bottom, and a marshmallow one on top.",
    allergens: "Flour (gluetn), Dairy, Cinnamon",
    images: [
      "images/golden-smoreo-main.webp",
      "images/golden-smoreo-1.webp",
      "images/golden-smoreo-2.webp",
      "images/golden-smoreo-poster.webp",
    ],
  },
    "cookies-scream": {
    name: "Cookies & Scream Brownie",
    vibe: "#ff5100b5",
    ingredients: "Halloween Oreos, Chocolate goodness.",
    allergens: "Flour (Gluetn)",
    images: [
      "images/cookies-scream-main.webp",
      "images/cookies-scream-1.webp",
      "images/cookies-scream-2.webp",
      "images/cookies-scream-poster.webp",
    ],
  },
  "smores-pc": {
    name: "Pretzel Caramel Smores Cookie.",
    vibe: "#5b3614",
    ingredients: "Classic Jaytreat cookie stuffed with pretzels, caramel, chocolate chips, and topped with a toasted marsh",
    allergens: "Flour (gluetn), Dairy, Cinnamon",
    images: [
      "images/smores-pc-main.webp",
      "images/smores-pc-1.webp",
      "images/smores-pc-2.webp",
      "images/smores-pc-poster.webp",
    ],
  },
  "mountain-cookie": { 
    name: "Mountain Cookie.",
    vibe: "#000000",
    ingredients: "Heath, Biscoff, Oreo, COOKIE",
    allergens: "Flour (gluetn)",
    images: [
      "images/mountain-cookie-main.webp",
      "images/mountain-cookie-1.webp",
      "images/mountain-cookie-2.webp",
      "images/mountain-cookie-3.webp",
      "images/mountain-cookie-poster.webp",
    ],
  },
  "matcha-cookie": { 
    name: "Matcha Cookie.",
    vibe: "#44ff00",
    ingredients: "Matcha, Cream cheese, Honey Caramel, Oatmeal",
    allergens: "Flour (gluetn), Cream Cheese, Performative nature",
    images: [
      "images/matcha-cookie-main.webp",
      "images/matcha-cookie-1.webp",
      "images/matcha-cookie-poster.webp",
    ],  
  },
   "dubai-cookie": { 
    name: "Dubai Cookie.",
    vibe: "#114a00",
    ingredients: "Classic Jaytreat, with dubai pistachio filling and chocolate topping.",
    allergens: "Flour (gluetn) Gelatin, Peach",
    images: [
      "images/dubai-cookie-main.webp",
      "images/dubai-cookie-1.webp",
      "images/dubai-cookie-2.webp",
      "images/dubai-cookie-poster.webp",
    ],
  },
   "apple-studel": { 
    name: "Apple Strudel Kup.",
    vibe: "#ff3006",
    ingredients: "Delicious cookie cup with apple filling topped with crunchy cinnamon sugar strudel",
    allergens: "Flour (gluetn) Gelatin, Peach",
    images: [
      "images/apple-strudel-main.webp",
      "images/apple-strudel-1.webp",
      "images/apple-strudel-2.webp",
      "images/apple-strudel-poster.webp",
    ],
  },
  
    "peach-cream": { 
    name: "Peaches & Cream Cookie.",
    vibe: "#ffaa64",
    ingredients: "Classic Jaytreat cookie base mixed with peach puree and white choclate chips",
    allergens: "Flour (gluetn) Gelatin, Peach",
    images: [
      "images/peach-cream-main.webp",
      "images/peach-cream-1.webp",
      "images/peach-cream-2.webp",
      "images/peach-cream-poster.webp",
    ],
  },
  "kid-kup": { 
    name: "Kid Kups.",
    vibe: "#ffd900",
    ingredients: "Everything you love in a cup (marshmallow, cookie, chocolate, pretzel, m&m)",
    allergens: "Flour (gluetn) Gelatin",
    images: [
      "images/kid-kup-main.webp",
      "images/kid-kup-1.webp",
      "images/kid-kup-2.webp",
      "images/kid-kup-poster.webp",
    ],
  },
    "throwbacks": {
    name: "Throwbacks",
    vibe: "#ffffff",
    ingredients: "Idk, a bunch of em, these are oldies",
    allergens: "I think one had peanuts",
    images: [
      "images/other-main.webp",
      "images/other-1.webp",
      "images/other-2.webp",
      "images/other-3.webp",
      "images/other-4.webp",
      "images/other-5.webp",
      "images/other-6.webp",
      "images/other-7.webp",
    ],
  },
};
