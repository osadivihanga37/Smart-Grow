from django.db import models


class DiseaseProfile(models.Model):
    """
    Reference data for each disease — thresholds extracted from research papers.
    """
    name = models.CharField(max_length=100)
    pathogen = models.CharField(max_length=100)

    # Environmental thresholds that trigger this disease
    min_temperature_c = models.FloatField(help_text="Minimum temperature for disease development")
    max_temperature_c = models.FloatField(help_text="Maximum temperature for disease development")
    min_humidity_percent = models.FloatField(help_text="Minimum humidity % that favors disease")

    # Risk info
    max_yield_loss_percent = models.FloatField(help_text="Maximum yield loss if untreated")
    symptoms = models.TextField(help_text="Visible symptoms to look for")
    prevention = models.TextField(help_text="Recommended prevention/action")

    # Source citation
    research_source = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.name} ({self.pathogen})"


class DiseaseAlert(models.Model):
    """
    A disease risk alert generated for a specific farmer based on weather conditions.
    """
    RISK_LEVELS = [
        ('LOW', 'Low Risk'),
        ('MEDIUM', 'Medium Risk'),
        ('HIGH', 'High Risk'),
        ('CRITICAL', 'Critical - Take Action Now'),
    ]

    # Firebase Auth UID — no longer a ForeignKey to Django's User.
    farmer_uid = models.CharField(max_length=128, db_index=True)

    disease = models.ForeignKey(DiseaseProfile, on_delete=models.CASCADE)

    # Weather at time of alert
    temperature_c = models.FloatField()
    humidity_percent = models.FloatField()
    rainfall_mm = models.FloatField(default=0)

    risk_level = models.CharField(max_length=10, choices=RISK_LEVELS)
    risk_score = models.FloatField(help_text="0-100 risk score")
    alert_message = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.farmer_uid} - {self.disease.name} - {self.risk_level}"