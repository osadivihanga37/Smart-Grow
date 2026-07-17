from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import DiseaseProfile, DiseaseAlert
from .serializers import DiseaseProfileSerializer, DiseaseAlertSerializer
from .forecasting_engine import run_all_disease_forecasts
from irrigation.weather_service import get_current_weather
from smartgrow.translations import get_message
from smartgrow.language_utils import get_lang


class DiseaseProfileListView(generics.ListAPIView):
    queryset = DiseaseProfile.objects.all()
    serializer_class = DiseaseProfileSerializer
    permission_classes = [IsAuthenticated]


class DiseaseForecastView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        lang = get_lang(request)
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')

        if not all([latitude, longitude]):
            return Response(
                {'error': get_message('missing_fields', lang)},
                status=status.HTTP_400_BAD_REQUEST
            )

        weather = get_current_weather(latitude, longitude)
        if weather is None:
            return Response(
                {'error': get_message('weather_error', lang)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        forecast_results = run_all_disease_forecasts(
            temperature_c=weather['temperature_c'],
            humidity_percent=weather['humidity_percent'],
            rainfall_mm=weather['rainfall_mm']
        )

        saved_alerts = []
        for result in forecast_results:
            disease = result['disease']

            # Build translated alert message based on risk level
            risk_level = result['risk_level']
            if risk_level == 'LOW':
                alert_msg = get_message('disease_low', lang, disease=disease.name)
            elif risk_level == 'MEDIUM':
                alert_msg = get_message('disease_medium', lang, disease=disease.name)
            elif risk_level == 'HIGH':
                alert_msg = get_message('disease_high', lang, disease=disease.name)
            else:  # CRITICAL
                alert_msg = get_message('disease_critical', lang,
                                        disease=disease.name,
                                        loss=int(disease.max_yield_loss_percent))

            alert = DiseaseAlert.objects.create(
                farmer=request.user,
                disease=disease,
                temperature_c=weather['temperature_c'],
                humidity_percent=weather['humidity_percent'],
                rainfall_mm=weather['rainfall_mm'],
                risk_level=risk_level,
                risk_score=result['risk_score'],
                alert_message=alert_msg,
            )
            saved_alerts.append(alert)

        return Response({
            'weather': weather,
            'language': lang,
            'alerts': DiseaseAlertSerializer(saved_alerts, many=True).data
        }, status=status.HTTP_201_CREATED)


class DiseaseAlertHistoryView(generics.ListAPIView):
    serializer_class = DiseaseAlertSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DiseaseAlert.objects.filter(farmer=self.request.user)