from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class DailyCrowdnessPrediction(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,        
    )
    
    site_id: int
    h0: int = 0
    h1: int = 0
    h2: int = 0
    h3: int = 0
    h4: int = 0
    h5: int = 0
    h6: int = 0
    h7: int = 0
    h8: int = 0
    h9: int = 0
    h10: int = 0
    h11: int = 0
    h12: int = 0
    h13: int = 0
    h14: int = 0
    h15: int = 0
    h16: int = 0
    h17: int = 0
    h18: int = 0
    h19: int = 0
    h20: int = 0
    h21: int = 0
    h22: int = 0
    h23: int = 0

class WeeklyCrowdnessPrediction(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )
    
    site_id: int
    Monday: int = 0
    Tuesday: int = 0
    Wednesday: int = 0
    Thursday: int = 0
    Friday: int = 0
    Saturday: int = 0
    Sunday: int = 0

class Site(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )

    site_id: Optional[int] = None
    site_name: str
    site_name_short: str
    site_desc: Optional[str] = None
    site_url: Optional[str] = None
    site_banner_url: Optional[str] = None

    daily_prediction: Optional[DailyCrowdnessPrediction] = None
    weekly_prediction: Optional[WeeklyCrowdnessPrediction] = None

class RawCrowdnessReading(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )
    
    id: Optional[int] = None
    time: datetime
    site_id: int
    crowdness: int