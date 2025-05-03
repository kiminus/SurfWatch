from pydantic import BaseModel

class Crowdness(BaseModel):
    time: str # UTC time in ISO format
    crowdness: int # number of people in the site at that time

class WaveQuality(BaseModel):
    time: str # UTC time in ISO format
    quality: int # wave quality rating (0-10)
    tide: str # tide level (low, mid, high)

class SiteShort(BaseModel):
    '''very basic site info'''
    site_id: int
    site_name: str
    site_name_short: str

class SiteDetails(SiteShort):
    '''detailed site info'''
    site_desc: str
    site_url: str
    site_banner_url: str = None
    predict_daily_crowdness: list[Crowdness] = None

class Site(SiteDetails):
    '''full site info'''
    predict_hourly_crowdness: list[Crowdness] = None
    predict_hourly_wave_quality: list[WaveQuality] = None
    