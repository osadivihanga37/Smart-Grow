import pandas as pd


# Constants derived from FCRDI research paper (Sumanaratne, 1999)
# Big onion optimal depletion level: 0.2 to 0.4 AWC
# Soil moisture retention in root zone: 12-16mm
# Best irrigation interval: daily to every 2 days
OPTIMAL_DEPLETION_THRESHOLD = 0.3   # midpoint of 0.2-0.4 range
SOIL_MOISTURE_RETENTION_MM = 14.0   # midpoint of 12-16mm from paper
IRRIGATION_TRIGGER_MM = SOIL_MOISTURE_RETENTION_MM * OPTIMAL_DEPLETION_THRESHOLD  # 4.2mm


def calculate_moisture_deficit(crop_water_requirement_mm, rainfall_mm, humidity_percent, temperature_c):
    """
    Calculates daily moisture deficit for Big Onion in Dambulla dry zone conditions.
    
    Based on:
    - Sumanaratne (1999): Irrigation Water Requirement of Big Onion in Rhodustalfs, Sri Lanka
    - Department of Census and Statistics (2021): Big Onion Survey, Matale District
    
    Logic:
    1. Start with crop's daily water requirement (from FCRDI research)
    2. Subtract effective rainfall
    3. Apply evapotranspiration adjustment for local temperature/humidity
    4. Compare against soil moisture retention capacity
    """
    df = pd.DataFrame([{
        'water_requirement': crop_water_requirement_mm,
        'rainfall': rainfall_mm,
        'humidity': humidity_percent,
        'temperature': temperature_c
    }])

    # ET adjustment: higher temp = more evaporation = higher water need
    # Based on Dambulla avg temp range of 27-33°C during yala season
    df['temp_adjustment'] = (df['temperature'] - 28) * 0.05  # 0.05mm per degree above 28°C

    # Humidity adjustment: higher humidity = less evaporation
    df['humidity_adjustment'] = (df['humidity'] - 60) * 0.02  # 0.02mm per % above 60%

    # Adjusted daily requirement
    df['adjusted_requirement'] = (
        df['water_requirement']
        + df['temp_adjustment']
        - df['humidity_adjustment']
    )

    # Only count rainfall that actually reaches the root zone
    # Big onion has shallow roots (15-20cm) so heavy rain mostly drains away
    # Cap effective rainfall at 80% of soil moisture retention capacity
    max_effective_rainfall = SOIL_MOISTURE_RETENTION_MM * 0.8
    df['effective_rainfall'] = df['rainfall'].clip(upper=max_effective_rainfall)

    # Final moisture deficit
    df['moisture_deficit'] = df['adjusted_requirement'] - df['effective_rainfall']

    deficit = float(df['moisture_deficit'].iloc[0])
    return round(max(deficit, 0), 2)


def get_irrigation_decision(moisture_deficit_mm, farm_size_acres=1.0):
    """
    Makes irrigation decision based on FCRDI paper findings:
    - Irrigate when deficit exceeds the trigger threshold (4.2mm = 0.3 AWC depletion)
    - Daily irrigation gives best yield (30.4 t/ha vs 14.5 t/ha at 4-day intervals)
    
    Volume calculation:
    - 1 acre = 4046.86 sq meters
    - 1mm of water over 1 sq meter = 1 liter
    """
    # FCRDI paper: trigger irrigation at 0.3 AWC depletion
    # This = 4.2mm deficit in Dambulla Rhodustalf soil
    should_irrigate = moisture_deficit_mm > IRRIGATION_TRIGGER_MM

    if not should_irrigate:
        return {
            'should_irrigate': False,
            'recommended_volume_liters': 0,
            'irrigation_trigger_mm': IRRIGATION_TRIGGER_MM,
            'recommendation_note': 'Soil moisture is adequate. No irrigation needed today.'
        }

    farm_area_sqm = farm_size_acres * 4046.86
    volume_liters = moisture_deficit_mm * farm_area_sqm

    # Urgency level based on deficit severity
    if moisture_deficit_mm > SOIL_MOISTURE_RETENTION_MM * 0.5:
        urgency = 'HIGH - Irrigate immediately to prevent yield loss'
    else:
        urgency = 'NORMAL - Irrigate today as per recommended schedule'

    return {
        'should_irrigate': True,
        'recommended_volume_liters': round(volume_liters, 2),
        'irrigation_trigger_mm': IRRIGATION_TRIGGER_MM,
        'recommendation_note': urgency
    }