// FAQ knowledge base — rule-based, keyword-matched.
// Each entry: id, category, keywords per language, answer per language.
// SI/TA answers below are placeholders — same translation-review gap
// already flagged in the thesis (Section 8.4) applies here; get these
// checked by a native speaker before shipping, same as the rest of the app.

export const FAQ_ENTRIES = [
  {
    id: "app_overview",
    category: "general",
    keywords: {
      en: ["how is the app working", "how does the app work", "how does this work", "what does this app do", "what is smart grow", "how does smart grow work", "how it works"],
      si: ["how does this work", "මෙය ක්‍රියා කරන්නේ කෙසේද"],
      ta: ["how does this work", "இது எப்படி வேலை செய்கிறது"],
    },
    answer: {
      en: "Smart Grow helps Big Onion farmers in Dambulla make better irrigation and disease-prevention decisions. It checks current weather conditions and gives you two things: an irrigation recommendation (when and how much to water) and a disease risk forecast (for 4 common diseases). Both are based on published agricultural research, not guesswork. Tap Irrigation or Disease from the Home screen to see today's recommendations.",
      si: "[SI TRANSLATION NEEDED]",
      ta: "[TA TRANSLATION NEEDED]",
    },
  },
  {
    id: "irrigation_how",
    category: "irrigation",
    keywords: {
      en: ["water", "watering", "irrigation", "when should i water", "how much water"],
      si: ["water", "වතුර", "වාරිමාර්ග"], // TODO: verify/expand Sinhala keywords
      ta: ["water", "நீர்", "பாசனம்"],     // TODO: verify/expand Tamil keywords
    },
    answer: {
      en: "Smart Grow's irrigation recommendation is based on current weather conditions and Big Onion's growth stage. Check the Irrigation screen for today's recommendation — it updates automatically as conditions change.",
      si: "[SI TRANSLATION NEEDED]",
      ta: "[TA TRANSLATION NEEDED]",
    },
  },
  {
    id: "disease_how",
    category: "disease",
    keywords: {
      en: ["disease", "sick", "fungus", "blight", "risk", "infection"],
      si: ["disease", "රෝගය"],
      ta: ["disease", "நோய்"],
    },
    answer: {
      en: "The Disease Advisory screen shows current risk levels for four diseases (Black Mould, Anthracnose/Twister, Purple Blotch, Basal Rot) based on temperature and humidity. A higher risk level means conditions currently favour that disease — check your crop closely.",
      si: "[SI TRANSLATION NEEDED]",
      ta: "[TA TRANSLATION NEEDED]",
    },
  },
  {
    id: "service_area",
    category: "access",
    keywords: {
      en: ["service area", "location", "outside", "why blocked", "region", "dambulla"],
      si: ["location", "ස්ථානය"],
      ta: ["location", "இடம்"],
    },
    answer: {
      en: "Smart Grow's recommendations are based on research specific to the Dambulla area, so the app is currently only available within about 30km of Dambulla. Using it outside that area could give you advice that doesn't match your local conditions.",
      si: "[SI TRANSLATION NEEDED]",
      ta: "[TA TRANSLATION NEEDED]",
    },
  },
  {
    id: "locked_crops",
    category: "crops",
    keywords: {
      en: ["locked", "coming soon", "tomato", "potato", "chilli", "maize", "red onion", "other crops"],
      si: ["locked", "වසා ඇත"],
      ta: ["locked", "பூட்டப்பட்டது"],
    },
    answer: {
      en: "Right now, Smart Grow fully supports Big Onion only. Other crops like Tomato, Potato, Chilli, Maize and Red Onion are shown as 'Coming Soon' — they're on our roadmap but not available yet.",
      si: "[SI TRANSLATION NEEDED]",
      ta: "[TA TRANSLATION NEEDED]",
    },
  },
  {
    id: "language_switch",
    category: "settings",
    keywords: {
      en: ["language", "sinhala", "tamil", "english", "switch language", "change language"],
      si: ["language", "භාෂාව"],
      ta: ["language", "மொழி"],
    },
    answer: {
      en: "You can switch languages anytime using the language tabs on the Home screen. Your choice is saved automatically for next time.",
      si: "[SI TRANSLATION NEEDED]",
      ta: "[TA TRANSLATION NEEDED]",
    },
  },
  {
    id: "account_delete",
    category: "account",
    keywords: {
      en: ["delete account", "remove account", "close account", "delete my data"],
      si: ["delete", "මකන්න"],
      ta: ["delete", "நீக்கு"],
    },
    answer: {
      en: "You can delete your account from Settings (tap the gear icon on your Profile screen). This permanently removes your profile and login — it can't be undone.",
      si: "[SI TRANSLATION NEEDED]",
      ta: "[TA TRANSLATION NEEDED]",
    },
  },
];

export const FALLBACK_ANSWER = {
  en: "Sorry, I don't have an answer for that yet. Try asking about irrigation, disease risk, locked crops, the service area, languages, or your account.",
  si: "[SI TRANSLATION NEEDED]",
  ta: "[TA TRANSLATION NEEDED]",
};