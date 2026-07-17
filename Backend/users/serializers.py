from django.contrib.auth.models import User
from rest_framework import serializers
from .models import FarmerProfile

class FarmerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmerProfile
        fields = ['id', 'district', 'phone_number', 'latitude', 'longitude', 'farm_size_acres']


class UserSerializer(serializers.ModelSerializer):
    farmer_profile = FarmerProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'farmer_profile']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    phone_number = serializers.CharField(write_only=True, required=False, allow_blank=True)
    district = serializers.CharField(write_only=True, required=False, default='Dambulla')

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'phone_number', 'district']

    def create(self, validated_data):
        phone_number = validated_data.pop('phone_number', '')
        district = validated_data.pop('district', 'Dambulla')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )

        FarmerProfile.objects.create(
            user=user,
            phone_number=phone_number,
            district=district
        )

        return user