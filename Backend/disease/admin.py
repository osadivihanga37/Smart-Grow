from django.contrib import admin
from django.utils.html import format_html
from .models import DiseaseProfile, DiseaseAlert


@admin.register(DiseaseProfile)
class DiseaseProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'pathogen', 'min_temperature_c', 'max_temperature_c',
                    'min_humidity_percent', 'max_yield_loss_percent')
    search_fields = ('name', 'pathogen')
    ordering = ('name',)


@admin.register(DiseaseAlert)
class DiseaseAlertAdmin(admin.ModelAdmin):
    list_display = (
        'farmer_uid', 'disease', 'risk_badge', 'risk_score',
        'temperature_c', 'humidity_percent', 'created_at'
    )
    list_filter = ('risk_level', 'disease', 'created_at')
    search_fields = ('farmer_uid',)
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    list_per_page = 25
    autocomplete_fields = ('disease',)
    readonly_fields = (
        'risk_level', 'risk_score', 'temperature_c',
        'humidity_percent', 'created_at'
    )

    RISK_COLORS = {
        'LOW': '#4CAF50',
        'MEDIUM': '#FF9800',
        'HIGH': '#F44336',
        'CRITICAL': '#B71C1C',
    }

    @admin.display(description='Risk Level')
    def risk_badge(self, obj):
        color = self.RISK_COLORS.get(obj.risk_level, '#888')
        return format_html(
            '<span style="color: white; background-color: {}; '
            'padding: 3px 10px; border-radius: 10px; font-size: 12px; font-weight: bold;">{}</span>',
            color, obj.risk_level
        )