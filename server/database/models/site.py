from typing import Optional
from database.models.user import Base
from sqlalchemy import DateTime, Integer, String, Text, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.orm import relationship


class Site(Base):
    """SQLAlchemy Site model corresponding to the database table."""
    __tablename__ = "sites"
    site_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    site_name: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    site_name_short: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)

    site_desc: Mapped[str] = mapped_column(Text, nullable=True)
    site_url: Mapped[str] = mapped_column(String(255), nullable=True)
    site_banner_url: Mapped[str] = mapped_column(String(255), nullable=True)

    daily_prediction = relationship("DailyCrowdnessPrediction", uselist=False, back_populates="sites", primaryjoin="Site.site_id==DailyCrowdnessPrediction.site_id")
    weekly_prediction = relationship("WeeklyCrowdnessPrediction", uselist=False, back_populates="sites", primaryjoin="Site.site_id==WeeklyCrowdnessPrediction.site_id")
    def __repr__(self):
        return f"<Site(site_id={self.site_id}, name='{self.name}')>"
    
class DailyCrowdnessPrediction(Base):
    __tablename__ = "daily_crowdness_prediction"
    # Assuming site_id is the primary key here and also links to Site
    site_id: Mapped[int] = mapped_column(Integer, ForeignKey("sites.site_id"), primary_key=True)
    
    h0: Mapped[int] = mapped_column(Integer, nullable=False, default=-1) 
    h1: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    h2: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    h3: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    h4: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    h5: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    h6: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    h7: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    h8: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    h9: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    h10: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    h11: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    h12: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    h13: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    h14: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    h15: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    h16: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    h17: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    h18: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    h19: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    h20: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    h21: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    h22: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    h23: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)    
    
    # Add back_populates to link back to Site
    sites = relationship("Site", back_populates="daily_prediction")
    
class WeeklyCrowdnessPrediction(Base):
    __tablename__ = "weekly_crowdness_prediction"
    # Assuming site_id is the primary key here and also links to Site
    site_id: Mapped[int] = mapped_column(Integer, ForeignKey("sites.site_id"), primary_key=True)
    
    Monday: Mapped[int] = mapped_column(Integer, nullable=False, default=-1) 
    Tuesday: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    Wednesday: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    Thursday: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    Friday: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    Saturday: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    Sunday: Mapped[int] = mapped_column(Integer, nullable=False, default=-1)
    
    
    # Add back_populates to link back to Site
    sites = relationship("Site", back_populates="weekly_prediction")
    
class RawCrowdnessReading(Base):
    """SQLAlchemy RawCrowdnessReading model corresponding to the database table."""
    __tablename__ = "raw_crowdness_readings"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    time: Mapped[str] = mapped_column(DateTime(timezone=True), nullable=False)
    site_id: Mapped[int] = mapped_column(Integer, ForeignKey("sites.site_id"), nullable=False)
    crowdness: Mapped[int] = mapped_column(Integer, nullable=False)

class WaveQualityReading(Base):
    """SQLAlchemy WaveQualityReading model corresponding to the database table."""
    __tablename__ = "wave_quality_readings"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    time: Mapped[str] = mapped_column(DateTime(timezone=True), nullable=False)
    site_id: Mapped[int] = mapped_column(Integer, ForeignKey("sites.site_id"), nullable=False)
    wave_height: Mapped[float] = mapped_column(Integer, nullable=False)
    wave_speed: Mapped[float] = mapped_column(Integer, nullable=False)
    wave_direction: Mapped[float] = mapped_column(String, nullable=False)