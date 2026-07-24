from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import CropWaterProfile, IrrigationRecommendation
from .serializers import CropWaterProfileSerializer, IrrigationRecommendationSerializer
from .weather_service import get_current_weather
from .recommendation_engine import calculate_moisture_deficit, get_irrigation_decision
from smartgrow.translations import get_message
from smartgrow.language_utils import get_lang
from smartgrow.firebase_config import get_firestore_client


class CropWaterProfileListView(generics.ListAPIView):
    queryset = CropWaterProfile.objects.all()
    serializer_class = CropWaterProfileSerializer
    permission_classes = [IsAuthenticated]


class GetIrrigationRecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        lang = get_lang(request)
        crop_id = request.data.get('crop_id')
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')

        if not all([crop_id, latitude, longitude]):
            return Response(
                {'error': get_message('missing_fields', lang)},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            crop = CropWaterProfile.objects.get(id=crop_id)
        except CropWaterProfile.DoesNotExist:
            return Response(
                {'error': get_message('crop_not_found', lang)},
                status=status.HTTP_404_NOT_FOUND
            )

        weather = get_current_weather(latitude, longitude)
        if weather is None:
            return Response(
                {'error': get_message('weather_error', lang)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        deficit = calculate_moisture_deficit(
            crop_water_requirement_mm=crop.daily_water_requirement_mm,
            rainfall_mm=weather['rainfall_mm'],
            humidity_percent=weather['humidity_percent'],
            temperature_c=weather['temperature_c']
        )

        # Farm size now lives in the farmer's Firestore profile doc, not
        # Django's ORM (there's no more farmer_profile relation).
        farm_size = 1.0
        db = get_firestore_client()
        profile_doc = db.collection('farmer_profiles').document(request.user.uid).get()
        if profile_doc.exists:
            profile_data = profile_doc.to_dict()
            if profile_data.get('farm_size_acres'):
                farm_size = profile_data['farm_size_acres']

        decision = get_irrigation_decision(deficit, farm_size)

        # Build translated message
        if not decision['should_irrigate']:
            rec_message = get_message('no_irrigation', lang)
        elif decision['recommended_volume_liters'] and deficit > 7:
            rec_message = get_message('irrigate_urgent', lang)
        else:
            rec_message = get_message('irrigate_normal', lang)

        # Add volume info
        if decision['should_irrigate']:
            rec_message += ' ' + get_message(
                'volume_info', lang,
                volume=int(decision['recommended_volume_liters']),
                acres=round(farm_size, 1)
            )

        recommendation = IrrigationRecommendation.objects.create(
            farmer_uid=request.user.uid,
            crop=crop,
            temperature_c=weather['temperature_c'],
            humidity_percent=weather['humidity_percent'],
            rainfall_mm=weather['rainfall_mm'],
            moisture_deficit_mm=round(deficit, 2),
            should_irrigate=decision['should_irrigate'],
            recommended_volume_liters=decision['recommended_volume_liters'],
            recommendation_note=rec_message,
        )

        return Response({
            **IrrigationRecommendationSerializer(recommendation).data,
            'message': rec_message,
            'language': lang
        }, status=status.HTTP_201_CREATED)


class IrrigationHistoryView(generics.ListAPIView):
    serializer_class = IrrigationRecommendationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return IrrigationRecommendation.objects.filter(farmer_uid=self.request.user.uid)