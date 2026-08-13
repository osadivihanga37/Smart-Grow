from django.db import migrations

# Placeholder advisory rows for crops shown as locked/"coming soon" in the
# Crop Advisory screen. No real DCS/DOA figures are populated yet — these
# exist only so the crop appears in the app's crop list; all numeric fields
# are 0 and must be replaced with verified research data before is_available
# is switched to True.
LOCKED_CROPS = [
    "Red Onion",
    "Chilli",
    "Potato",
    "Tomato",
    "Maize",
]


def seed_data(apps, schema_editor):
    CropAdvisory = apps.get_model("crops", "CropAdvisory")
    for name in LOCKED_CROPS:
        CropAdvisory.objects.update_or_create(
            crop_name=name,
            region="Dambulla",
            defaults=dict(
                average_yield_mt_per_ha=0.0,
                best_irrigation_method="-",
                best_irrigation_yield=0.0,
                best_land_type="-",
                best_land_type_yield=0.0,
                best_seed_variety="-",
                best_seed_variety_yield=0.0,
                harvest_start_month="-",
                harvest_end_month="-",
                production_cost_per_kg=0.0,
                data_source="Coming soon",
                is_available=False,
            ),
        )


def remove_data(apps, schema_editor):
    CropAdvisory = apps.get_model("crops", "CropAdvisory")
    CropAdvisory.objects.filter(crop_name__in=LOCKED_CROPS, region="Dambulla").delete()


class Migration(migrations.Migration):

    dependencies = [
        ("crops", "0003_cropadvisory_is_available"),
    ]

    operations = [
        migrations.RunPython(seed_data, remove_data),
    ]
