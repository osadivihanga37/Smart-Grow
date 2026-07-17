from django.urls import path
from .views import CropWaterProfileListView, GetIrrigationRecommendationView, IrrigationHistoryView

urlpatterns = [
    path('crops/', CropWaterProfileListView.as_view(), name='crop-water-list'),
    path('recommend/', GetIrrigationRecommendationView.as_view(), name='irrigation-recommend'),
    path('history/', IrrigationHistoryView.as_view(), name='irrigation-history'),
]