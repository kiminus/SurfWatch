import pydantic


class WeatherData(pydantic.BaseModel):
    site_id: int
    temperature: float
    weather_icon_url: str
    wind_direction: str
    wind_speed: float