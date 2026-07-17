// Translates known Crop Advisory data values (crop name, region, methods, etc.)
// since these come from the database as English strings, not through
// the standard t() translation system.
// Add new entries here if new crops/regions/values are added to the backend.

const CROP_DATA_TRANSLATIONS = {
  'Big Onion': { en: 'Big Onion', si: 'රතු ලූනු', ta: 'சிவப்பு வெங்காயம்' },
  'Dambulla': { en: 'Dambulla', si: 'දඹුල්ල', ta: 'தம்புள்ளை' },

  'Agri Well + Irrigation System': {
    en: 'Agri Well + Irrigation System',
    si: 'ගොවි ළිං + වාරි පද්ධතිය',
    ta: 'விவசாய கிணறு + நீர்ப்பாசன அமைப்பு',
  },
  'Paddy land': { en: 'Paddy land', si: 'කුඹුරු බිම', ta: 'நெல் நிலம்' },
  'Local & Import mix': {
    en: 'Local & Import mix',
    si: 'දේශීය හා ආනයනික මිශ්‍රණය',
    ta: 'உள்நாட்டு & இறக்குமதி கலவை',
  },

  'September': { en: 'September', si: 'සැප්තැම්බර්', ta: 'செப்டம்பர்' },
  'October': { en: 'October', si: 'ඔක්තෝබර්', ta: 'அக்டோபர்' },

  'DCS Big Onion Survey 2021 (Yala Season)': {
    en: 'DCS Big Onion Survey 2021 (Yala Season)',
    si: 'DCS රතු ලූනු සමීක්ෂණය 2021 (යල කන්නය)',
    ta: 'DCS சிவப்பு வெங்காய ஆய்வு 2021 (யால பருவம்)',
  },
}

export const translateCropValue = (value, lang) => {
  const entry = CROP_DATA_TRANSLATIONS[value]
  return entry ? (entry[lang] || entry.en) : value
}