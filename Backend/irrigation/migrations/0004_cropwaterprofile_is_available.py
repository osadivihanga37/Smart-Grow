from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('irrigation', '0003_remove_irrigationrecommendation_farmer_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='cropwaterprofile',
            name='is_available',
            field=models.BooleanField(
                default=True,
                help_text="False = shown in app as a locked/'coming soon' crop, not yet supported for recommendations",
            ),
        ),
    ]
