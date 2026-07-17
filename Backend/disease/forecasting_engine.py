from .models import DiseaseProfile


def calculate_disease_risk(disease: DiseaseProfile, temperature_c: float,
                            humidity_percent: float, rainfall_mm: float) -> dict:
    """
    Calculates disease risk score (0-100) based on environmental thresholds
    extracted from Sri Lankan research papers.

    Sources:
    - Black Mold: Fernando et al. (2018), FCRDI — optimal temp 28-34°C, warm/moist conditions
    - Anthracnose: Herath et al. (2021), USJ — outbreak July-Aug, high humidity periods
    """

    risk_score = 0
    factors = []

    # --- TEMPERATURE RISK ---
    # Is current temperature within the disease's optimal growth range?
    if disease.min_temperature_c <= temperature_c <= disease.max_temperature_c:
        # Perfect temperature for disease — high contribution
        temp_risk = 40
        factors.append(f"Temperature {temperature_c}°C is in optimal range for {disease.name}")
    elif temperature_c > disease.max_temperature_c:
        # Above optimal — disease slows down
        temp_risk = 10
        factors.append(f"Temperature {temperature_c}°C is above optimal range — lower risk")
    else:
        # Below optimal — marginal risk
        temp_risk = 15
        factors.append(f"Temperature {temperature_c}°C is below optimal range — marginal risk")

    risk_score += temp_risk

    # --- HUMIDITY RISK ---
    # Fernando et al. (2018): "Warm, moist conditions favor disease development"
    if humidity_percent >= disease.min_humidity_percent:
        if humidity_percent >= 85:
            humidity_risk = 40   # Very high humidity — critical
            factors.append(f"Very high humidity {humidity_percent}% — critical disease risk")
        elif humidity_percent >= 75:
            humidity_risk = 30   # High humidity
            factors.append(f"High humidity {humidity_percent}% — disease favorable")
        else:
            humidity_risk = 20   # Moderate humidity
            factors.append(f"Moderate humidity {humidity_percent}% — some risk")
    else:
        humidity_risk = 5
        factors.append(f"Humidity {humidity_percent}% is below threshold — low risk")

    risk_score += humidity_risk

    # --- RAINFALL RISK ---
    # Recent rain = wet leaves/bulbs = fungal spread pathway
    # Herath et al. (2021): anthracnose outbreak during rainy period
    if rainfall_mm > 10:
        rainfall_risk = 20
        factors.append(f"Recent rainfall {rainfall_mm}mm — wet conditions increase disease spread")
    elif rainfall_mm > 5:
        rainfall_risk = 10
        factors.append(f"Some rainfall {rainfall_mm}mm — monitor closely")
    else:
        rainfall_risk = 0

    risk_score += rainfall_risk

    # Cap at 100
    risk_score = min(risk_score, 100)

    # --- RISK LEVEL CLASSIFICATION ---
    if risk_score >= 75:
        risk_level = 'CRITICAL'
        action = f"CRITICAL: Apply fungicide immediately. {disease.prevention}"
    elif risk_score >= 50:
        risk_level = 'HIGH'
        action = f"HIGH RISK: Inspect crops and prepare preventive treatment. {disease.prevention}"
    elif risk_score >= 25:
        risk_level = 'MEDIUM'
        action = f"MEDIUM RISK: Monitor daily for symptoms. {disease.prevention}"
    else:
        risk_level = 'LOW'
        action = f"LOW RISK: Conditions not favorable for {disease.name} today."

    return {
        'risk_score': round(risk_score, 1),
        'risk_level': risk_level,
        'alert_message': action,
        'contributing_factors': factors
    }


def run_all_disease_forecasts(temperature_c: float, humidity_percent: float,
                               rainfall_mm: float) -> list:
    """
    Runs forecasting against ALL disease profiles in the database.
    Returns a list of results sorted by risk score (highest first).
    """
    all_diseases = DiseaseProfile.objects.all()
    results = []

    for disease in all_diseases:
        result = calculate_disease_risk(disease, temperature_c, humidity_percent, rainfall_mm)
        result['disease'] = disease
        results.append(result)

    # Sort by risk score descending
    results.sort(key=lambda x: x['risk_score'], reverse=True)
    return results