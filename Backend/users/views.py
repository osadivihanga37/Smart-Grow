from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer, UserSerializer
from smartgrow.translations import get_message
from smartgrow.language_utils import get_lang
from .models import FarmerProfile


class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        lang = get_lang(request)
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {'error': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
            'message': get_message('register_success', lang)
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        lang = get_lang(request)
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'error': get_message('missing_fields', lang)},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)
        if user is None:
            return Response(
                {'error': get_message('login_failed', lang)},
                status=status.HTTP_401_UNAUTHORIZED
            )

        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
            'message': get_message('login_success', lang)
        })


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

class UpdateLocationView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        lang = get_lang(request)
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')

        try:
            profile = request.user.farmer_profile
        except FarmerProfile.DoesNotExist:
            return Response(
                {'error': 'Farmer profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        if latitude is not None:
            profile.latitude = latitude
        if longitude is not None:
            profile.longitude = longitude
        profile.save()

        return Response({
            'message': 'Location updated successfully',
            'latitude': profile.latitude,
            'longitude': profile.longitude,
        })     