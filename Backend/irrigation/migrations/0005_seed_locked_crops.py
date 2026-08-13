from django.db import migrations

# These 5 crops are shown in the app's "Select Crop" list as locked/"coming
# soon" options, alongside Big Onion (the only fully supported crop so far).
# daily_water_requirement_mm and optimal_soil_moisture_percent are placeholders
# (0.0) since no recommendation logic runs for a locked crop — they must be
# replaced with real FCRDI/DOA-sourced figures before is_available is set True.
LOCKED_CROPS = [
    "Red Onion",
    "Chilli",
    "Potato",
    "Tomato",
    "Maize",
]


def seed_data(apps, schema_editor):
    CropWaterProfile = apps.get_model("irrigation", "CropWaterProfile")
    for name in LOCKED_CROPS:
        CropWaterProfile.objects.update_or_create(
            crop_name=name,
            defaults=dict(
                daily_water_requirement_mm=0.0,
                optimal_soil_moisture_percent=0.0,
                is_available=False,
            ),
        )


def remove_data(apps, schema_editor):
    CropWaterProfile = apps.get_model("irrigation", "CropWaterProfile")
    CropWaterProfile.objects.filter(crop_name__in=LOCKED_CROPS).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("irrigation", "0004_cropwaterprofile_is_available"),
    ]

    operations = [
        migrations.RunPython(seed_data, remove_data),
    ]
