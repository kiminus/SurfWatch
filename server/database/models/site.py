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

    daily_crowdness: Mapped[list["CrowdnessData"]] = relationship("CrowdnessData", back_populates="site", lazy="joined")  # List of 24 CrowdnessData objects

class PredictDailyCrowdness(Base):
    """SQLAlchemy PredictDailyCrowdness model corresponding to the database table."""
    __tablename__ = "predict_daily_crowdness"
    site_id: Mapped[int] = mapped_column(Integer, ForeignKey("sites.site_id"), nullable=False)

class CrowdnessData(Base):
    """SQLAlchemy DailyCrowdness model corresponding to the database table."""
    __tablename__ = "daily_crowdness"
    time: Mapped[str] = mapped_column(DateTime, primary_key=True, index=True)
    crowdness: Mapped[int] = mapped_column(Integer, nullable=False)  # number of people in the site at that time
    site_id: Mapped[int] = mapped_column(Integer, ForeignKey("sites.site_id"), nullable=False)
    
class RawCrowdnessReading(Base):
    """SQLAlchemy RawCrowdnessReading model corresponding to the database table."""
    __tablename__ = "raw_crowdness_readings"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    time: Mapped[str] = mapped_column(DateTime(timezone=True), nullable=False)
    site_id: Mapped[int] = mapped_column(Integer, ForeignKey("sites.site_id"), nullable=False)
    crowdness: Mapped[int] = mapped_column(Integer, nullable=False)
