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
      si: "ස්මාර්ට් ග්‍රෝ දඹුල්ලේ ලොකු ලූනු ගොවීන්ට වඩා හොඳ වාරිමාර්ග හා රෝග වැළැක්වීමේ තීරණ ගැනීමට උපකාරී වේ. එය වත්මන් කාලගුණ තත්ත්වයන් පරීක්ෂා කර ඔබට දේවල් දෙකක් ලබා දෙයි: වාරිමාර්ග නිර්දේශයක් (කවදා සහ කොපමණ ජලය දිය යුතුද) සහ රෝග අවදානම් අනාවැකියක් (රෝග 4ක් සඳහා). මෙම දෙකම මිථ්‍යාවන් මත නොව ප්‍රකාශිත කෘෂිකාර්මික පර්යේෂණ මත පදනම් වේ. අද දින නිර්දේශ බැලීමට මුල් පිටුවෙන් වාරිමාර්ග හෝ රෝග තෝරන්න.",
      ta: "ஸ்மார்ட் க்ரோ தம்புள்ளையில் உள்ள பெரிய வெங்காய விவசாயிகள் சிறந்த நீர்ப்பாசன மற்றும் நோய் தடுப்பு முடிவுகளை எடுக்க உதவுகிறது. இது தற்போதைய வானிலை நிலைமைகளை சரிபார்த்து உங்களுக்கு இரண்டு விஷயங்களை வழங்குகிறது: ஒரு நீர்ப்பாசன பரிந்துரை (எப்போது, எவ்வளவு நீர் பாய்ச்ச வேண்டும்) மற்றும் ஒரு நோய் ஆபத்து முன்னறிவிப்பு (4 பொதுவான நோய்களுக்கு). இரண்டும் யூகங்கள் அல்ல, வெளியிடப்பட்ட விவசாய ஆராய்ச்சியை அடிப்படையாகக் கொண்டவை. இன்றைய பரிந்துரைகளைப் பார்க்க முகப்புத் திரையிலிருந்து நீர்ப்பாசனம் அல்லது நோயைத் தட்டவும்.",
    },
  },
  {
      id: "irrigation_how",
      category: "irrigation",
      keywords: {
        en: ["water", "watering", "irrigation", "when should i water", "how much water"],
        si: ["water", "වතුර", "වාරිමාර්ග"], 
      },
      answer: {
        en: "Smart Grow's irrigation recommendation is based on current weather conditions and Big Onion's growth stage. Check the Irrigation screen for today's recommendation — it updates automatically as conditions change.",
        si: "ස්මාර්ට් ග්‍රෝහි වාරිමාර්ග නිර්දේශය වත්මන් කාලගුණ තත්ත්වයන් සහ ලොකු ලූනු බෝගයේ වර්ධන අවධිය මත පදනම් වේ. අද දින නිර්දේශය සඳහා වාරිමාර්ග තිරය පරීක්ෂා කරන්න — තත්ත්වයන් වෙනස් වන විට එය ස්වයංක්‍රීයව යාවත්කාලීන වේ.",
        ta: "ஸ்மார்ட் க்ரோவின் நீர்ப்பாசன பரிந்துரை தற்போதைய வானிலை நிலைமைகள் மற்றும் பெரிய வெங்காயத்தின் வளர்ச்சி நிலையை அடிப்படையாகக் கொண்டது. இன்றைய பரிந்துரைக்கு நீர்ப்பாசன திரையைச் சரிபார்க்கவும் — நிலைமைகள் மாறும்போது இது தானாகவே புதுப்பிக்கப்படும்.",
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
        si: "රෝග උපදේශන තිරයේ උෂ්ණත්වය සහ තෙතමනය මත පදනම්ව රෝග හතරක් (කළු පුස, ඇන්ත්‍රැක්නෝස්/ට්විස්ටර්, දම් පැල්ලම, මූල කුණුවීම) සඳහා වත්මන් අවදානම් මට්ටම් පෙන්වයි. ඉහළ අවදානම් මට්ටමක් යනු එම රෝගයට වත්මන් තත්ත්වයන් හිතකර බවයි — ඔබේ බෝගය සමීපව පරීක්ෂා කරන්න.",
        ta: "நோய் ஆலோசனை திரை வெப்பநிலை மற்றும் ஈரப்பதத்தின் அடிப்படையில் நான்கு நோய்களுக்கான (கருப்பு பூஞ்சை, ஆந்த்ராக்நோஸ்/ட்விஸ்டர், ஊதா புள்ளி, அடிக்கால் அழுகல்) தற்போதைய ஆபத்து நிலைகளைக் காட்டுகிறது. அதிக ஆபத்து நிலை என்பது தற்போதைய நிலைமைகள் அந்த நோய்க்கு சாதகமாக உள்ளன என்பதைக் குறிக்கிறது — உங்கள் பயிரை உன்னிப்பாகச் சரிபார்க்கவும்.",
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
        si: "ස්මාර්ට් ග්‍රෝහි නිර්දේශ දඹුල්ල ප්‍රදේශයට විශේෂිත පර්යේෂණ මත පදනම් වේ, එබැවින් යෙදුම දැනට දඹුල්ලේ සිට කිලෝමීටර් 30ක් පමණ ප්‍රදේශය තුළ පමණක් ලබා ගත හැක. එම ප්‍රදේශයෙන් පිටත එය භාවිතා කිරීමෙන් ඔබේ ප්‍රාදේශීය තත්ත්වයන්ට නොගැලපෙන උපදෙස් ලැබිය හැක.",
        ta: "ஸ்மார்ட் க்ரோவின் பரிந்துரைகள் தம்புள்ளை பகுதிக்கு உரிய ஆராய்ச்சியை அடிப்படையாகக் கொண்டவை, எனவே இந்த ஆப் தற்போது தம்புள்ளையிலிருந்து சுமார் 30 கிமீ சுற்றளவில் மட்டுமே கிடைக்கும். அந்த பகுதிக்கு வெளியே இதைப் பயன்படுத்துவது உங்கள் உள்ளூர் நிலைமைகளுக்குப் பொருந்தாத ஆலோசனையைத் தரக்கூடும்.",
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
        si: "දැනට, ස්මාර්ට් ග්‍රෝ සම්පූර්ණයෙන් සහාය දක්වන්නේ ලොකු ලූනු පමණි. තක්කාලි, අර්තාපල්, මිරිස්, ඉරිඟු සහ රතු ලූනු වැනි වෙනත් බෝග 'ඉක්මනින්' ලෙස පෙන්වා ඇත — ඒවා අපගේ සැලසුමේ ඇතත් තවම ලබා ගත නොහැක.",
        ta: "தற்போது, ஸ்மார்ட் க்ரோ பெரிய வெங்காயத்திற்கு மட்டுமே முழுமையாக ஆதரவளிக்கிறது. தக்காளி, உருளைக்கிழங்கு, மிளகாய், சோளம் மற்றும் சிவப்பு வெங்காயம் போன்ற பிற பயிர்கள் 'விரைவில்' என காட்டப்படுகின்றன — அவை எங்கள் திட்டத்தில் உள்ளன, ஆனால் இன்னும் கிடைக்கவில்லை.",
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
        si: "ඕනෑම වේලාවක මුල් පිටුවේ භාෂා ටැබ් භාවිතයෙන් ඔබට භාෂාව මාරු කළ හැක. ඔබේ තේරීම ඊළඟ වතාවේ සඳහා ස්වයංක්‍රීයව සුරැකේ.",
        ta: "முகப்புத் திரையில் உள்ள மொழி தாவல்களைப் பயன்படுத்தி நீங்கள் எப்போது வேண்டுமானாலும் மொழியை மாற்றலாம். உங்கள் தேர்வு அடுத்த முறைக்காக தானாகவே சேமிக்கப்படும்.",
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
        si: "ඔබට සැකසුම් වලින් ඔබේ ගිණුම මකා දැමිය හැක (ඔබේ පැතිකඩ තිරයේ ගියර් අයිකනය තට්ටු කරන්න). මෙය ඔබේ පැතිකඩ සහ පිවිසුම ස්ථිරවම ඉවත් කරයි — එය ආපසු හැරවිය නොහැක.",
        ta: "நீங்கள் அமைப்புகளில் இருந்து உங்கள் கணக்கை நீக்கலாம் (உங்கள் சுயவிவரத் திரையில் உள்ள கியர் ஐகானைத் தட்டவும்). இது உங்கள் சுயவிவரம் மற்றும் உள்நுழைவை நிரந்தரமாக அகற்றும் — இதை மாற்ற முடியாது.",
      },
    },
  ];

  export const FALLBACK_ANSWER = {
    en: "Sorry, I don't have an answer for that yet. Try asking about irrigation, disease risk, locked crops, the service area, languages, or your account.",
    si: "සමාවන්න, මට තවම ඒ සඳහා පිළිතුරක් නැත. වාරිමාර්ග, රෝග අවදානම, අගුලු දැමූ බෝග, සේවා ප්‍රදේශය, භාෂා, හෝ ඔබේ ගිණුම ගැන අසන්න.",
    ta: "மன்னிக்கவும், இதற்கு எனக்கு இன்னும் பதில் இல்லை. நீர்ப்பாசனம், நோய் ஆபத்து, பூட்டப்பட்ட பயிர்கள், சேவை பகுதி, மொழிகள் அல்லது உங்கள் கணக்கு பற்றி கேளுங்கள்.",
  };