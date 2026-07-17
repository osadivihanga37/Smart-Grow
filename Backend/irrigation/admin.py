from django.contrib import admin
from django.utils.html import format_html
from .models import CropWaterProfile, IrrigationRecommendation


@admin.register(CropWaterProfile)
class CropWaterProfileAdmin(admin.ModelAdmin):
    list_display = ('crop_name', 'daily_water_requirement_mm', 'optimal_soil_moisture_percent')
    search_fields = ('crop_name',)
    ordering = ('crop_name',)


@admin.register(IrrigationRecommendation)
class IrrigationRecommendationAdmin(admin.ModelAdmin):
    list_display = (
        'farmer', 'crop', 'irrigation_status', 'moisture_deficit_mm',
        'recommended_volume_liters', 'created_at'
    )
    list_filter = ('should_irrigate', 'created_at', 'crop')
    search_fields = ('farmer__username', 'farmer__email')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    list_per_page = 25
    autocomplete_fields = ('farmer', 'crop')
    readonly_fields = (
        'temperature_c', 'humidity_percent', 'rainfall_mm',
        'moisture_deficit_mm', 'should_irrigate',
        'recommended_volume_liters', 'recommendation_note', 'created_at'
    )

    @admin.display(description='Irrigate?')
    def irrigation_status(self, obj):
        if obj.should_irrigate:
            return format_html(
                '<span style="color: white; background-color: #1565C0; '
                'padding: 3px 10px; border-radius: 10px; font-size: 12px;">💧 {}</span>',
                'Yes'
            )
        return format_html(
            '<span style="color: white; background-color: #2E7D32; '
            'padding: 3px 10px; border-radius: 10px; font-size: 12px;">✅ {}</span>',
            'No'
        )