from typing import List
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.site import Site as PydanticSite, WaveQualityReading as PydanticWaveQualityReading
from database.models.site import Site
from sqlalchemy.orm import selectinload
from database.models.site import RawCrowdnessReading as SQLAlchemyRawCrowdnessReading, WaveQualityReading as SQLAlchemyWaveQualityReading
from models.site import RawCrowdnessReading as PydanticRawCrowdnessReading

async def get_all_sites(db: AsyncSession) -> List[PydanticSite]:
    """
    Get all sites from the database.
    """
    result = await db.execute(select(Site).options(
        selectinload(Site.daily_prediction),
        selectinload(Site.weekly_prediction),
        selectinload(Site.wave_quality)
    ))
    sites = result.scalars().all()
    
    if not sites:
        raise HTTPException(status_code=404, detail="No sites found")
    
    for site in sites:
        # do internal validation make sure the required fields are present
        assert site.site_id, f"Site ID {site.site_id} not found in database."
        assert site.site_name, f"Site ID {site.site_id} has no name"
        assert site.site_name_short, f"Site ID {site.site_id} has no short name"
        assert site.site_desc, f"Site ID {site.site_id} has no description"
        assert site.site_url, f"Site ID {site.site_id} has no URL"
        # assert site.site_banner_url, f"Site ID {site.site_id} has no banner URL"
        
    return [PydanticSite.model_validate(site) for site in sites]

async def update_wave_quality_reading(db: AsyncSession, reading_data: PydanticWaveQualityReading) -> PydanticWaveQualityReading:
    """
    Update wave quality reading in the database.
    If the site_id does not exist, create that entry.
    """
    db_reading = await db.execute(select(SQLAlchemyWaveQualityReading).where(SQLAlchemyWaveQualityReading.site_id == reading_data.site_id))
    db_reading = db_reading.scalar_one_or_none()
    
    if db_reading is None:
        db_reading = SQLAlchemyWaveQualityReading(site_id=reading_data.site_id)
        db.add(db_reading)
    
    db_reading.wave_height = reading_data.wave_height
    db_reading.wave_speed = reading_data.wave_speed
    db_reading.wave_direction = reading_data.wave_direction
    db_reading.temperature = reading_data.temperature
    
    try:
        await db.commit()
        await db.refresh(db_reading)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to write wave quality reading to database: {str(e)}")
    
    return PydanticWaveQualityReading.model_validate(db_reading)

async def create_raw_crowdness_reading(db: AsyncSession, reading_data: PydanticRawCrowdnessReading) -> PydanticRawCrowdnessReading:
    """
    Create raw crowdedness data reading  in the database
    """
    db_reading = SQLAlchemyRawCrowdnessReading(
        time=reading_data.time,
        site_id=reading_data.site_id,
        crowdness=reading_data.crowdness
    )
    
    db.add(db_reading)
    
    try:
        await db.commit()
        await db.refresh(db_reading)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to write crowdness reading to database: {str(e)}")
    return PydanticRawCrowdnessReading.model_validate(db_reading)