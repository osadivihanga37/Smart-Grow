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
  'Purple Blotch': {
    en: 'Purple Blotch',
    si: 'දම් පැල්ලම් රෝගය',
    ta: 'ஊதா புள்ளி நோய்',
  },
  'Alternaria porri': {
    en: 'Alternaria porri',
    si: 'Alternaria porri',
    ta: 'Alternaria porri',
  },
  'Basal Rot': {
    en: 'Basal Rot',
    si: 'පාද කුණුවීම',
    ta: 'அடிமட்ட அழுகல்',
  },
  'Fusarium oxysporum f. sp. cepae': {
    en: 'Fusarium oxysporum f. sp. cepae',
    si: 'Fusarium oxysporum f. sp. cepae',
    ta: 'Fusarium oxysporum f. sp. cepae',
  },
};

export const translateDiseaseValue = (value, lang = 'en') => {
  return DISEASE_VALUE_TRANSLATIONS[value]?.[lang] || value;
};