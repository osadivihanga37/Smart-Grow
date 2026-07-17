from django.db import migrations


def seed_data(apps, schema_editor):
    CropAdvisory = apps.get_model("crops", "CropAdvisory")
    CropAdvisory.objects.update_or_create(
        crop_name="Big Onion",
        region="Dambulla",
        defaults=dict(
            average_yield_mt_per_ha=20.4,
            best_irrigation_method="Agri Well + Irrigation System",
            best_irrigation_yield=20.73,
            best_land_type="Paddy land",
            best_land_type_yield=19.31,
            best_seed_variety="Local & Import mix",
            best_seed_variety_yield=20.47,
            harvest_start_month="September",
            harvest_end_month="October",
            production_cost_per_kg=39.45,
            data_source="DCS Big Onion Survey 2021 (Yala Season)",
        ),
    )


def remove_data(apps, schema_editor):
    CropAdvisory = apps.get_model("crops", "CropAdvisory")
    CropAdvisory.objects.filter(crop_name="Big Onion", region="Dambulla").delete()


class Migration(migrations.Migration):

    dependencies = [
        ("crops", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_data, remove_data),
    ]