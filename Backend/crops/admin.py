from django.contrib import admin
from .models import CropAdvisory


@admin.register(CropAdvisory)
class CropAdvisoryAdmin(admin.ModelAdmin):
    list_display = (
        "crop_name",
        "region",
        "average_yield_mt_per_ha",
        "harvest_start_month",
        "harvest_end_month",
        "updated_at",
    )
    search_fields = ("crop_name", "region")
    ordering = ("crop_name", "region")
    list_per_page = 25