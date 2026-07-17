from django.db import models
from django.contrib.auth.models import User


class CropWaterProfile(models.Model):
    crop_name = models.CharField(max_length=100, unique=True)
    daily_water_requirement_mm = models.FloatField(
        help_text="Average daily water requirement in millimeters (FCRDI, 1999)"
    )
    optimal_soil_moisture_percent = models.FloatField(
        help_text="Ideal soil moisture percentage for this crop"
    )

    def __str__(self):
        return self.crop_name


class IrrigationRecommendation(models.Model):
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='irrigation_logs')
    crop = models.ForeignKey(CropWaterProfile, on_delete=models.SET_NULL, null=True)

    # Weather snapshot
    temperature_c = models.FloatField()
    humidity_percent = models.FloatField()
    rainfall_mm = models.FloatField(default=0)

    # Calculated outputs
    moisture_deficit_mm = models.FloatField()
    should_irrigate = models.BooleanField()
    recommended_volume_liters = models.FloatField(null=True, blank=True)

    # Research-based recommendation note
    recommendation_note = models.TextField(blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        action = "Irrigate" if self.should_irrigate else "Skip"
        return f"{self.farmer.username} - {self.crop} - {action} ({self.created_at.date()})"