from server.database.models.user import Base
from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.ext.declarative import DeclarativeBase, Mapped, mapped_column


class Site(Base):
    """SQLAlchemy Site model corresponding to the database table."""
    __tablename__ = "sites"
    site_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    site_name: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    site_name_short: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)

    site_desc: Mapped[str] = mapped_column(Text, nullable=True)
    site_url: Mapped[str] = mapped_column(String(255), nullable=True)
    site_banner_url: Mapped[str] = mapped_column(String(255), nullable=True)

    daily_crowdness: Mapped[list["CrowdnessData"]] = mapped_column(nullable=True)  # List of 24 CrowdnessData objects
    weekly_crowdness: Mapped[list["CrowdnessData"]] = mapped_column(nullable=True)  # List of 7 CrowdnessData objects


class CrowdnessData(Base):
    """SQLAlchemy DailyCrowdness model corresponding to the database table."""
    __tablename__ = "daily_crowdness"
    time: Mapped[str] = mapped_column(DateTime, primary_key=True, index=True)
    crowdness: Mapped[int] = mapped_column(Integer, nullable=False)  # number of people in the site at that time


class RawCrowdnessReading(Base):
    """SQLAlchemy RawCrowdnessReading model corresponding to the database table."""
    __tablename__ = "raw_crowdness_readings"
    time: Mapped[str] = mapped_column(DateTime(timezone=True), primary_key=True, index=True)
    site_id: Mapped[int] = mapped_column(Integer, nullable=False, foreign_key="sites.site_id")  
    crowdness: Mapped[int] = mapped_column(Integer, nullable=False)
