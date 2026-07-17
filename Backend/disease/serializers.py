from rest_framework import serializers
from .models import DiseaseProfile, DiseaseAlert


class DiseaseProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiseaseProfile
        fields = ['id', 'name', 'pathogen', 'min_temperature_c', 'max_temperature_c',
                  'min_humidity_percent', 'max_yield_loss_percent', 'symptoms',
                  'prevention', 'research_source']


class DiseaseAlertSerializer(serializers.ModelSerializer):
    disease_name = serializers.CharField(source='disease.name', read_only=True)
    pathogen = serializers.CharField(source='disease.pathogen', read_only=True)

    class Meta:
        model = DiseaseAlert
        fields = ['id', 'disease', 'disease_name', 'pathogen', 'temperature_c',
                  'humidity_percent', 'rainfall_mm', 'risk_level', 'risk_score',
                  'alert_message', 'created_at']