import requests
from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from firebase_admin import auth as firebase_auth
from smartgrow.firebase_config import get_firestore_client, get_firebase_app
from smartgrow.translations import get_message
from smartgrow.language_utils import get_lang
from .serializers import RegisterInputSerializer

FIREBASE_WEB_API_KEY = settings.FIREBASE_WEB_API_KEY
IDENTITY_TOOLKIT_SIGNIN_URL = (
    f'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_WEB_API_KEY}'
)


def _sign_in_with_password(email, password):
    """Calls Firebase's Identity Toolkit REST API to verify a password and get an ID token back."""
    return requests.post(IDENTITY_TOOLKIT_SIGNIN_URL, json={
        'email': email,
        'password': password,
        'returnSecureToken': True,
    })


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        lang = get_lang(request)
        serializer = RegisterInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        get_firebase_app()

        try:
            firebase_user = firebase_auth.create_user(
                email=data['email'],
                password=data['password'],
                display_name=data['username'],
            )
        except firebase_auth.EmailAlreadyExistsError:
            return Response(
                {'error': 'An account with this email already exists.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as exc:
            return Response({'error': str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        # Save the extra profile fields (district, phone, age, location) in Firestore
        db = get_firestore_client()
        profile_data = {
            'username': data['username'],
            'email': data['email'],
            'phone_number': data.get('phone_number', ''),
            'district': data.get('district', 'Dambulla'),
            'age': data.get('age'),
            'latitude': data.get('latitude'),
            'longitude': data.get('longitude'),
        }
        db.collection('farmer_profiles').document(firebase_user.uid).set(profile_data)

        # Sign them in immediately so the app gets a usable token, same as before
        signin_resp = _sign_in_with_password(data['email'], data['password'])
        if signin_resp.status_code != 200:
            return Response(
                {'error': 'Account created, but automatic sign-in failed. Please log in.'},
                status=status.HTTP_201_CREATED
            )
        signin_data = signin_resp.json()

        return Response({
            'token': signin_data['idToken'],
            'refresh_token': signin_data['refreshToken'],
            'user': {'uid': firebase_user.uid, **profile_data},
            'message': get_message('register_success', lang),
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        lang = get_lang(request)
        # "identifier" may be a username or an email — Firebase Auth only signs in
        # by email, so if it doesn't look like one, look the matching email up
        # in Firestore by username first.
        identifier = request.data.get('username') or request.data.get('identifier')
        password = request.data.get('password')

        if not identifier or not password:
            return Response(
                {'error': get_message('missing_fields', lang)},
                status=status.HTTP_400_BAD_REQUEST
            )

        email = identifier
        if '@' not in identifier:
            db = get_firestore_client()
            query = db.collection('farmer_profiles').where('username', '==', identifier).limit(1).stream()
            match = next(query, None)
            if not match:
                return Response(
                    {'error': get_message('login_failed', lang)},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            email = match.to_dict().get('email')

        signin_resp = _sign_in_with_password(email, password)
        if signin_resp.status_code != 200:
            return Response(
                {'error': get_message('login_failed', lang)},
                status=status.HTTP_401_UNAUTHORIZED
            )
        signin_data = signin_resp.json()
        uid = signin_data['localId']

        db = get_firestore_client()
        profile_doc = db.collection('farmer_profiles').document(uid).get()
        profile_data = profile_doc.to_dict() if profile_doc.exists else {}

        return Response({
            'token': signin_data['idToken'],
            'refresh_token': signin_data['refreshToken'],
            'user': {'uid': uid, **profile_data},
            'message': get_message('login_success', lang),
        })

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        db = get_firestore_client()
        doc = db.collection('farmer_profiles').document(request.user.uid).get()
        data = doc.to_dict() if doc.exists else {}
        return Response({'uid': request.user.uid, **data})


class UpdateLocationView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')

        db = get_firestore_client()
        doc_ref = db.collection('farmer_profiles').document(request.user.uid)
        updates = {}
        if latitude is not None:
            updates['latitude'] = latitude
        if longitude is not None:
            updates['longitude'] = longitude
        doc_ref.set(updates, merge=True)

        return Response({
            'message': 'Location updated successfully',
            'latitude': latitude,
            'longitude': longitude,
        })
    
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        db = get_firestore_client()
        doc = db.collection('farmer_profiles').document(request.user.uid).get()
        data = doc.to_dict() if doc.exists else {}
        return Response({'uid': request.user.uid, **data})

    def patch(self, request):
        db = get_firestore_client()
        doc_ref = db.collection('farmer_profiles').document(request.user.uid)

        allowed_fields = ['username', 'phone_number', 'district', 'age', 'farm_size_acres']
        updates = {k: v for k, v in request.data.items() if k in allowed_fields}

        if not updates:
            return Response({'error': 'No valid fields provided.'}, status=status.HTTP_400_BAD_REQUEST)

        doc_ref.set(updates, merge=True)

        updated_doc = doc_ref.get()
        return Response({'uid': request.user.uid, **updated_doc.to_dict()})


class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        uid = request.user.uid
        db = get_firestore_client()

        try:
            db.collection('farmer_profiles').document(uid).delete()
        except Exception:
            pass  # profile doc might already be gone — not fatal

        try:
            firebase_auth.delete_user(uid)
        except Exception as exc:
            return Response({'error': str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'Account deleted successfully.'}, status=status.HTTP_200_OK)    