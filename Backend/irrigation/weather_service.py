import requests
from django.conf import settings


def get_current_weather(latitude, longitude):
    """
    Fetches current weather data from OpenWeatherMap API.
    Returns a dict with temperature, humidity, and rainfall — or None on failure.
    """
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        'lat': latitude,
        'lon': longitude,
        'appid': settings.OPENWEATHER_API_KEY,
        'units': 'metric'  
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        return {
            'temperature_c': data['main']['temp'],
            'humidity_percent': data['main']['humidity'],
          
            'rainfall_mm': data.get('rain', {}).get('1h', 0),
        }
    except requests.exceptions.RequestException as e:
        print(f"OpenWeatherMap API error: {e}")
        return None
    except (KeyError, ValueError) as e:
        print(f"Error parsing weather data: {e}")
        return None