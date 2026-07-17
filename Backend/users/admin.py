from django.contrib import admin
from .models import FarmerProfile


@admin.register(FarmerProfile)
class FarmerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'district', 'phone_number', 'farm_size_acres', 'created_at')
    search_fields = ('user__username', 'user__email', 'district', 'phone_number')
    list_filter = ('district',)
    ordering = ('-created_at',)
    list_per_page = 25
    autocomplete_fields = ('user',)