from rest_framework import authentication, exceptions
from firebase_admin import auth as firebase_auth
from smartgrow.firebase_config import get_firebase_app


class FirebaseUser:
    """Lightweight stand-in for Django's User, built from a verified Firebase ID token."""

    def __init__(self, uid, email=None, username=None):
        self.uid = uid
        self.email = email
        self.username = username or email
        self.is_authenticated = True
        self.is_anonymous = False

    def __str__(self):
        return self.username or self.uid


class FirebaseAuthentication(authentication.BaseAuthentication):
    """
    Expects: Authorization: Bearer <Firebase ID token>
    Verifies the token with the Admin SDK and attaches a FirebaseUser
    to request.user (replacing Django's ORM-backed User for our API views).
    """
    keyword = 'Bearer'

    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header.startswith(f'{self.keyword} '):
            return None  # no Firebase token presented; let permission checks handle it

        id_token = auth_header.split(' ', 1)[1].strip()
        get_firebase_app()  # ensure the app is initialized

        try:
            decoded = firebase_auth.verify_id_token(id_token)
        except Exception as exc:
            raise exceptions.AuthenticationFailed(f'Invalid Firebase token: {exc}')

        user = FirebaseUser(
            uid=decoded.get('uid'),
            email=decoded.get('email'),
            username=decoded.get('name') or decoded.get('email'),
        )
        return (user, None)