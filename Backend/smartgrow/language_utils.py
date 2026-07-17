SUPPORTED_LANGUAGES = ('en', 'si', 'ta')
DEFAULT_LANGUAGE = 'en'


def get_lang(request) -> str:
    """
    Extracts language preference from request.
    Checks: POST/GET 'lang' param → Header 'Accept-Language' → default 'en'
    """
    lang = (
        request.data.get('lang') or
        request.query_params.get('lang') or
        request.headers.get('Accept-Language', DEFAULT_LANGUAGE)
    )
    return lang if lang in SUPPORTED_LANGUAGES else DEFAULT_LANGUAGE