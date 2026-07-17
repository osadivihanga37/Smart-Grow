from django.urls import path
from .views import DiseaseProfileListView, DiseaseForecastView, DiseaseAlertHistoryView

urlpatterns = [
    path('profiles/', DiseaseProfileListView.as_view(), name='disease-profiles'),
    path('forecast/', DiseaseForecastView.as_view(), name='disease-forecast'),
    path('alerts/', DiseaseAlertHistoryView.as_view(), name='disease-alerts'),
]