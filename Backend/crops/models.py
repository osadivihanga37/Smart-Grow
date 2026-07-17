from django.db import models


class CropAdvisory(models.Model):
    """
    Advisory data for a crop in a specific region, sourced from
    DCS Big Onion Survey 2021 (Yala Season).
    """
    crop_name = models.CharField(max_length=100, default="Big Onion")
    region = models.CharField(max_length=100, default="Dambulla")

    average_yield_mt_per_ha = models.FloatField(default=20.4)

    best_irrigation_method = models.CharField(
        max_length=200, default="Agri Well + Irrigation System"
    )
    best_irrigation_yield = models.FloatField(default=20.73)

    best_land_type = models.CharField(max_length=100, default="Paddy land")
    best_land_type_yield = models.FloatField(default=19.31)

    best_seed_variety = models.CharField(max_length=100, default="Local & Import mix")
    best_seed_variety_yield = models.FloatField(default=20.47)

    harvest_start_month = models.CharField(max_length=20, default="September")
    harvest_end_month = models.CharField(max_length=20, default="October")

    production_cost_per_kg = models.FloatField(default=39.45)

    data_source = models.CharField(
        max_length=200, default="DCS Big Onion Survey 2021 (Yala Season)"
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Crop Advisory"
        verbose_name_plural = "Crop Advisories"
        unique_together = ("crop_name", "region")

    def __str__(self):
        return f"{self.crop_name} — {self.region}"