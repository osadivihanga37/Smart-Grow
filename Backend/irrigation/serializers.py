from rest_framework import serializers
from .models import CropWaterProfile, IrrigationRecommendation


class CropWaterProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CropWaterProfile
        fields = ['id', 'crop_name', 'daily_water_requirement_mm', 'optimal_soil_moisture_percent', 'is_available']


class IrrigationRecommendationSerializer(serializers.ModelSerializer):
    crop_name = serializers.CharField(source='crop.crop_name', read_only=True)

    class Meta:
        model = IrrigationRecommendation
        fields = [
            'id', 'crop', 'crop_name', 'temperature_c', 'humidity_percent',
            'rainfall_mm', 'moisture_deficit_mm', 'should_irrigate',
            'recommended_volume_liters', 'recommendation_note', 'created_at'
        ]
        read_only_fields = ['moisture_deficit_mm', 'should_irrigate', 'recommended_volume_liters']