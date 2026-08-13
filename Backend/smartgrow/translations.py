"""
Smart Grow — All farmer-facing messages in English, Sinhala and Tamil.
Add new messages here and reference them by key throughout the app.
"""

MESSAGES = {

    # ─── GENERAL ───────────────────────────────────────────────────────────
    'invalid_language': {
        'en': 'Invalid language. Choose: en, si, ta',
        'si': 'භාෂාව වැරදිය. තෝරන්න: en, si, ta',
        'ta': 'தவறான மொழி. தேர்வு செய்யவும்: en, si, ta',
    },
    'missing_fields': {
        'en': 'Required fields are missing.',
        'si': 'අවශ්‍ය තොරතුරු නොමැත.',
        'ta': 'தேவையான தகவல்கள் இல்லை.',
    },
    'weather_error': {
        'en': 'Could not fetch weather data. Please try again shortly.',
        'si': 'කාලගුණ දත්ත ලබා ගත නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.',
        'ta': 'வானிலை தரவை பெற முடியவில்லை. சிறிது நேரத்தில் மீண்டும் முயற்சிக்கவும்.',
    },
    'crop_not_found': {
        'en': 'Crop not found.',
        'si': 'බෝගය හමු නොවීය.',
        'ta': 'பயிர் கண்டுபிடிக்கப்படவில்லை.',
    },
    'crop_not_available': {
        'en': 'This crop is not yet supported. Support is coming soon.',
        'si': 'මෙම බෝගය තවම සහාය නොදක්වයි. සහාය ඉක්මනින් ලැබෙනු ඇත.',
        'ta': 'இந்த பயிருக்கு இன்னும் ஆதரவு இல்லை. ஆதரவு விரைவில் கிடைக்கும்.',
    },
    'crop_advisory_fetched': {
        'en': 'Crop advisory data retrieved successfully.',
        'si': 'බෝග උපදේශන දත්ත සාර්ථකව ලබා ගන්නා ලදී.',
        'ta': 'பயிர் ஆலோசனை தரவு வெற்றிகரமாக பெறப்பட்டது.',
    },
    'server_error': {
        'en': 'A server error occurred. Please try again.',
        'si': 'සේවාදායක දෝෂයක් ඇති විය. නැවත උත්සාහ කරන්න.',
        'ta': 'சேவையக பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.',
    },

    # ─── AUTH ──────────────────────────────────────────────────────────────
    'register_success': {
        'en': 'Account created successfully. Welcome to Smart Grow!',
        'si': 'ගිණුම සාර්ථකව සාදන ලදී. Smart Grow වෙත සාදරයෙන් පිළිගනිමු!',
        'ta': 'கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது. Smart Grow-க்கு வரவேற்கிறோம்!',
    },
    'login_success': {
        'en': 'Login successful.',
        'si': 'පිවිසීම සාර්ථකයි.',
        'ta': 'உள்நுழைவு வெற்றிகரமாக உள்ளது.',
    },
    'login_failed': {
        'en': 'Invalid username or password.',
        'si': 'වැරදි පරිශීලක නාමය හෝ මුරපදය.',
        'ta': 'தவறான பயனர்பெயர் அல்லது கடவுச்சொல்.',
    },
    'logout_success': {
        'en': 'Logged out successfully.',
        'si': 'සාර්ථකව පිටවිය.',
        'ta': 'வெற்றிகரமாக வெளியேறினீர்கள்.',
    },

    # ─── IRRIGATION ────────────────────────────────────────────────────────
    'irrigate_now': {
        'en': 'Irrigate today — your crop needs water.',
        'si': 'අද වතුර දෙන්න — ඔබේ බෝගයට ජලය අවශ්‍යයි.',
        'ta': 'இன்று நீர்ப்பாசனம் செய்யுங்கள் — உங்கள் பயிருக்கு தண்ணீர் தேவை.',
    },
    'no_irrigation': {
        'en': 'No irrigation needed today. Soil moisture is adequate.',
        'si': 'අද වතුර දීම අවශ්‍ය නැත. පස් තෙතමනය ප්‍රමාණවත්.',
        'ta': 'இன்று நீர்ப்பாசனம் தேவையில்லை. மண் ஈரப்பதம் போதுமானது.',
    },
    'irrigate_urgent': {
        'en': 'URGENT: Irrigate immediately to prevent yield loss.',
        'si': 'හදිසි: අස්වැන්න අඩු නොවීමට දැන් ම වතුර දෙන්න.',
        'ta': 'அவசரம்: விளைச்சல் இழப்பை தடுக்க உடனடியாக நீர்ப்பாசனம் செய்யுங்கள்.',
    },
    'irrigate_normal': {
        'en': 'Irrigate today as per recommended schedule.',
        'si': 'නිර්දේශිත කාලසටහනට අනුව අද වතුර දෙන්න.',
        'ta': 'பரிந்துரைக்கப்பட்ட அட்டவணையின்படி இன்று நீர்ப்பாசனம் செய்யுங்கள்.',
    },
    'volume_info': {
        'en': 'Recommended water volume: {volume} liters for your {acres} acre farm.',
        'si': 'නිර්දේශිත ජල ප්‍රමාණය: ඔබේ {acres} අක්කර ගොවිපළට ලීටර් {volume} ක්.',
        'ta': 'பரிந்துரைக்கப்பட்ட நீர் அளவு: உங்கள் {acres} ஏக்கர் பண்ணைக்கு {volume} லிட்டர்.',
    },

    # ─── DISEASE ───────────────────────────────────────────────────────────
    'disease_low': {
        'en': 'LOW RISK: Conditions not favorable for {disease} today.',
        'si': 'අඩු අවදානම: අද {disease} රෝගයට හිතකර තත්ත්ව නැත.',
        'ta': 'குறைந்த ஆபத்து: இன்று {disease} க்கு சாதகமான நிலைமைகள் இல்லை.',
    },
    'disease_medium': {
        'en': 'MEDIUM RISK: Monitor crops daily for {disease} symptoms.',
        'si': 'මධ්‍යම අවදානම: {disease} රෝග ලක්ෂණ සඳහා දිනපතා බෝගය නිරීක්ෂණය කරන්න.',
        'ta': 'நடுத்தர ஆபத்து: {disease} அறிகுறிகளுக்கு தினமும் பயிர்களை கண்காணிக்கவும்.',
    },
    'disease_high': {
        'en': 'HIGH RISK: Inspect crops and apply preventive treatment for {disease}.',
        'si': 'ඉහළ අවදානම: {disease} සඳහා බෝගය පරීක්ෂා කර වළක්වාගැනීමේ ප්‍රතිකාර යොදන්න.',
        'ta': 'அதிக ஆபத்து: {disease} க்காக பயிர்களை ஆய்வு செய்து தடுப்பு சிகிச்சை செய்யுங்கள்.',
    },
    'disease_critical': {
        'en': 'CRITICAL: Apply fungicide immediately for {disease}. Yield loss up to {loss}%.',
        'si': 'අවධානය: {disease} සඳහා දැන් ම දිලීර නාශක යොදන්න. {loss}% දක්වා අස්වැන්න අහිමි විය හැක.',
        'ta': 'அவசரம்: {disease} க்காக உடனடியாக பூஞ்சைக்கொல்லி தெளிக்கவும். {loss}% வரை விளைச்சல் இழப்பு.',
    },
}


def get_message(key: str, lang: str = 'en', **kwargs) -> str:
    """
    Returns a translated message by key and language code.
    Falls back to English if language or key not found.
    Supports string formatting via kwargs (e.g. volume=1000, acres=2).

    Usage:
        get_message('irrigate_now', lang='si')
        get_message('volume_info', lang='ta', volume=5000, acres=1.5)
    """
    lang = lang if lang in ('en', 'si', 'ta') else 'en'
    message_group = MESSAGES.get(key, {})
    message = message_group.get(lang) or message_group.get('en', 'Message not found.')

    # Apply any formatting placeholders
    if kwargs:
        try:
            message = message.format(**kwargs)
        except KeyError:
            pass

    return message


def get_supported_languages():
    return {
        'en': 'English',
        'si': 'සිංහල',
        'ta': 'தமிழ்'
    }