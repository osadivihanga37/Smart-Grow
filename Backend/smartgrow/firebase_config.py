import os
import firebase_admin
from firebase_admin import credentials, firestore

_FIREBASE_APP = None


def get_firebase_app():
    """Initializes the Firebase Admin app once (idempotent) and returns it."""
    global _FIREBASE_APP
    if _FIREBASE_APP is None:
        cred_path = os.getenv('FIREBASE_CREDENTIALS_PATH')
        if not cred_path:
            raise RuntimeError(
                "FIREBASE_CREDENTIALS_PATH is not set. Add it to your .env file, "
                "pointing at the service account JSON you downloaded from "
                "Firebase Console -> Project settings -> Service accounts."
            )
        cred = credentials.Certificate(cred_path)
        _FIREBASE_APP = firebase_admin.initialize_app(cred)
    return _FIREBASE_APP


def get_firestore_client():
    """Returns a Firestore client, ensuring the Firebase app is initialized first."""
    get_firebase_app()
    return firestore.client()