from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crops', '0002_seed_dambulla_bigonion'),
    ]

    operations = [
        migrations.AddField(
            model_name='cropadvisory',
            name='is_available',
            field=models.BooleanField(
                default=True,
                help_text="False = shown in app as a locked/'coming soon' crop, advisory data not yet populated",
            ),
        ),
    ]
