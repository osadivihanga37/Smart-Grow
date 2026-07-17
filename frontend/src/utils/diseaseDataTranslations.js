const DISEASE_VALUE_TRANSLATIONS = {
  'Black Mold': {
    en: 'Black Mold',
    si: 'කළු දිලීර රෝගය',
    ta: 'கருப்பு பூஞ்சை நோய்',
  },
  'Aspergillus niger': {
    en: 'Aspergillus niger',
    si: 'Aspergillus niger',
    ta: 'Aspergillus niger',
  },
  'Anthracnose-Twister': {
    en: 'Anthracnose-Twister',
    si: 'ඇන්ත්‍රැක්නෝස්-ට්විස්ටර්',
    ta: 'ஆந்த்ராக்நோஸ்-ட்விஸ்டர்',
  },
  'Colletotrichum siamense': {
    en: 'Colletotrichum siamense',
    si: 'Colletotrichum siamense',
    ta: 'Colletotrichum siamense',
  },
};

export const translateDiseaseValue = (value, lang = 'en') => {
  return DISEASE_VALUE_TRANSLATIONS[value]?.[lang] || value;
};