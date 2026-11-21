/**
 * OOKHAL MUSAL (उखल मूसल) — Master Spice Catalog & Inventory Database
 * 
 * HOW TO ADD OR EDIT SPICES:
 * 1. You can edit this file directly by adding or updating spice objects.
 * 2. Or use the built-in "Spice Manager" on the website (click "Manage Spices" in navigation/footer)
 *    to add new launches and toggle stock availability visually, then export with one click!
 */

const DEFAULT_SPICES = [
  {
    id: "sp-01",
    name: "Lakadong High-Curcumin Turmeric",
    hindiName: "लाकाडोंग हल्दी",
    category: "single-origin",
    isNewLaunch: false,
    isAvailable: true,
    badge: "7.5%+ Curcumin",
    origin: "Jaintia Hills, Meghalaya",
    aromaProfile: "Deep golden amber, intensely earthy, warm therapeutic citrus notes.",
    grindOptions: ["Silky Fine Powder", "Coarse Ayurvedic Pounding"],
    pricePer100g: "₹180 / 100g",
    description: "World's most potent turmeric with over 7.5% natural curcumin content. Cold-ground live to preserve fragile curcuminoids.",
    icon: "🌱"
  },
  {
    id: "sp-02",
    name: "Wayanad Bold Tellicherry Black Pepper",
    hindiName: "वायनाड काली मिर्च",
    category: "single-origin",
    isNewLaunch: false,
    isAvailable: true,
    badge: "Single Estate",
    origin: "Wayanad, Kerala",
    aromaProfile: "Pungent woody spice with bright fruity citrus undertones.",
    grindOptions: ["Cracked Mote Dane (Coarse)", "Fine Table Grind", "Whole Sun-Dried"],
    pricePer100g: "₹220 / 100g",
    description: "Plump, sun-ripened berries hand-harvested from ancient vines. Pounded on-demand so piperine oils explode with every bite.",
    icon: "⚫"
  },
  {
    id: "sp-03",
    name: "Grandmother's 16-Spice Shahi Garam Masala",
    hindiName: "दादी की 16-मसाला शाही गरम मसाला",
    category: "heirloom-blends",
    isNewLaunch: true,
    isAvailable: true,
    badge: "✨ Master Signature",
    origin: "Heritage Awadhi & Punjabi Recipe",
    aromaProfile: "Intoxicating royal warmth, sweet mace, green cardamom, and royal cumin aroma.",
    grindOptions: ["Traditional Sil-Batta Style Coarse", "Velvet Fine"],
    pricePer100g: "₹340 / 100g",
    description: "Hand-toasted whole spices: Green Cardamom, Black Cardamom, Mace, Nutmeg, Star Anise, Cloves & Cinnamon ground live at your door.",
    icon: "👑"
  },
  {
    id: "sp-04",
    name: "Guntur Sannam Sun-Dried Red Chilli",
    hindiName: "गुंटूर सन्नम लाल मिर्च",
    category: "single-origin",
    isNewLaunch: false,
    isAvailable: true,
    badge: "Zero Color Added",
    origin: "Guntur, Andhra Pradesh",
    aromaProfile: "Fiery, smoky, deep red crimson natural oils without artificial dyes.",
    grindOptions: ["Dardari (Crushed Flakes)", "Fine Degi Style Powder"],
    pricePer100g: "₹160 / 100g",
    description: "Selected whole stemless chillies with seeds intact. Pounded cold to keep the natural red capsanthin oil vibrant and aromatic.",
    icon: "🌶️"
  },
  {
    id: "sp-05",
    name: "Royal Kashmiri Kahwa & Saffron Chai Spice",
    hindiName: "शाही कश्मीरी कहवा व चाय मसाला",
    category: "new-launches",
    isNewLaunch: true,
    isAvailable: true,
    badge: "🌟 New Seasonal Launch",
    origin: "Pampore, Kashmir & Wayanad",
    aromaProfile: "Heirloom saffron threads, Ceylon cinnamon, dried rose petals, and crushed green cardamom.",
    grindOptions: ["Aromatic Coarse Chai Infusion", "Fine Silk Blend"],
    pricePer100g: "₹420 / 100g",
    description: "Our newest winter drop. Made with GI-tagged Kashmiri Mongra saffron and freshly crushed Alleppey cardamoms for soothing, golden cups.",
    icon: "☕"
  },
  {
    id: "sp-06",
    name: "Authentic Tanjore Temple Sambar Podi",
    hindiName: "तंजावुर सांभर पोड़ी",
    category: "heirloom-blends",
    isNewLaunch: false,
    isAvailable: true,
    badge: "Slow Roasted",
    origin: "Thanjavur, Tamil Nadu",
    aromaProfile: "Roasted chana dal, coriander seeds, fenugreek, curry leaves, and Byadgi chilli.",
    grindOptions: ["Heirloom Medium Coarse Podi"],
    pricePer100g: "₹240 / 100g",
    description: "An heirloom South Indian household blend roasted slowly over clay stoves before arrival, then freshly pulverized at your doorstep.",
    icon: "🍲"
  },
  {
    id: "sp-07",
    name: "Alleppey Extra Bold Green Cardamom (8mm+)",
    hindiName: "एलेप्पी हरी इलायची",
    category: "single-origin",
    isNewLaunch: false,
    isAvailable: true,
    badge: "Grade 1 Extra Bold",
    origin: "Cardamom Hills, Kerala",
    aromaProfile: "Sweet, cooling camphor, floral eucalyptus notes, high terpinyl acetate.",
    grindOptions: ["Freshly Pod-Crushed", "Whole Green Pods"],
    pricePer100g: "₹480 / 100g",
    description: "Lush green pods with oily black seeds inside. Grinding at your doorstep releases that ethereal, room-filling festive sweetness.",
    icon: "✨"
  },
  {
    id: "sp-08",
    name: "Ancient Panch Phoron & Bengali Mustard Blend",
    hindiName: "प्राचीन पंच फोरन व राई मसाला",
    category: "heirloom-blends",
    isNewLaunch: false,
    isAvailable: true,
    badge: "Traditional Ratio",
    origin: "Bengal & Bihar Heritage",
    aromaProfile: "Pungent mustard, aniseed sweet fennel, fenugreek bitters, and nigella.",
    grindOptions: ["Whole Tadka Seed Mix", "Lightly Bruised Seeds"],
    pricePer100g: "₹190 / 100g",
    description: "Radhuni, Fenugreek, Cumin, Nigella (Kalonji) and Fennel in golden heirloom proportions. Perfect for dal tadkas and vegetable roasts.",
    icon: "🌿"
  },
  {
    id: "sp-09",
    name: "Rajasthani Smoked Kasoori Methi & Mathania Podi",
    hindiName: "मथानिया मिर्च व कसूरी मेथी पॉडी",
    category: "new-launches",
    isNewLaunch: true,
    isAvailable: true,
    badge: "🌟 New Seasonal Launch",
    origin: "Nagaur & Mathania, Rajasthan",
    aromaProfile: "Deep smoky chili heat laced with fragrant bittersweet wild fenugreek leaves.",
    grindOptions: ["Finely Crushed Rub", "Table Sprinkle Grind"],
    pricePer100g: "₹260 / 100g",
    description: "Rare sun-dried Mathania chillies blended with organic Nagauri Kasoori methi leaves. Freshly pounded for royal gravies and parathas.",
    icon: "🔥"
  },
  {
    id: "sp-10",
    name: "Unpolished Fragrant Royal Cumin (Jeera)",
    hindiName: "बिना पॉलिश का देसी जीरा",
    category: "single-origin",
    isNewLaunch: false,
    isAvailable: true,
    badge: "100% Unwashed / Unbleached",
    origin: "Unjha, Gujarat",
    aromaProfile: "Rich nutty aroma, intensely herbaceous, high cuminaldehyde oil.",
    grindOptions: ["Roasted Bhuna Jeera Powder", "Raw Pounded Jeera", "Whole Clean Seeds"],
    pricePer100g: "₹170 / 100g",
    description: "Clean, naturally sun-dried whole cumin without sulfur fumes or cosmetic mineral oil polish. You'll smell the difference immediately.",
    icon: "🌾"
  }
];

// Helper to load spices from localStorage or default
function getStoredSpices() {
  try {
    const stored = localStorage.getItem("ookhal_spices_catalog");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read local spice catalog, using defaults", e);
  }
  return DEFAULT_SPICES;
}

// Helper to save spices to localStorage
function saveStoredSpices(spicesList) {
  try {
    localStorage.setItem("ookhal_spices_catalog", JSON.stringify(spicesList));
    return true;
  } catch (e) {
    console.error("Failed to save spice catalog to local storage", e);
    return false;
  }
}
