import os
from typing import AsyncGenerator
from dotenv import load_dotenv
from fastapi import File
from sqlalchemy import create_engine, Table, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

from database.models.user import Base, UserProfile, UserAuth
from database.models.site import DailyCrowdnessPrediction, RawCrowdnessReading, Site, WeeklyCrowdnessPrediction
from utils import logger
import asyncio
from datetime import datetime, timedelta
import random

logger = logger.create_logger("database")
logger.info("database.py: init")

# Load environment variables from .env file
load_dotenv()
# --- Database Configuration ---
class Settings:
    """Settings class to hold database configuration."""
    database_hostname: str = os.getenv("DATABASE_HOSTNAME")
    database_port: str = os.getenv("DATABASE_PORT")
    database_username: str = os.getenv("DATABASE_USERNAME")
    database_password: str = os.getenv("DATABASE_PASSWORD")
    database_name: str = os.getenv("DATABASE_NAME")
    
settings = Settings()
# --- Database URL ---
DATABASE_URL = f"mysql+aiomysql://{settings.database_username}:{settings.database_password}@{settings.database_hostname}:{settings.database_port}/{settings.database_name}"
logger.info(f"connecting to database: {DATABASE_URL}")

# --- SQLAlchemy Engine and Session ---
# Create the async engine
engine = create_async_engine(DATABASE_URL, echo=False)

async_session_local = async_sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)


# --- Dependency to Get DB Session ---
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency that provides a database session per request."""
    async with async_session_local() as session:
        yield session

# --- Function to Create Tables ---
async def create_db_and_tables():
    """Creates database tables based on the ORM models."""
    async with engine.begin() as conn:
        # await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
        
# --- Function to Load Initial Data ---
async def load_initial_data():
    """Loads initial data into the database."""
    async with async_session_local() as session:
        # Example placeholder data for UserProfile
        user1 = UserProfile(
            user_id=1,
            email="john.doe@example.com",
            display_name="John Doe",
            streak_days=5,
            avatar_url="https://example.com/avatar1.png",
            show_streak=True
        )
        user2 = UserProfile(
            user_id=2,
            email="jane.smith@example.com",
            display_name="Jane Smith",
            streak_days=10,
            avatar_url="https://example.com/avatar2.png",
            show_streak=False
        )

        user_auth1 = UserAuth(
            user_id=1,
            username="johndoe",
            hashed_password="hashedpassword1"
        )
        user_auth2 = UserAuth(
            user_id=2,
            username="janesmith",
            hashed_password="hashedpassword2"
        )

        # Add all user data to the session
        session.add_all([user1, user2])
        await session.commit()  
        
        session.add_all([user_auth1, user_auth2])
        await session.commit()
        # Add sites
        site1 = Site(
            site_id=1,
            site_name="Sunny Beach",
            site_name_short="SunnyB",
            site_desc="A beautiful sunny beach perfect for surfing.",
            site_url="https://example.com/sunnybeach",
            site_banner_url="https://example.com/sunnybeach/banner.png"
        )
        site2 = Site(
            site_id=2,
            site_name="Rocky Point",
            site_name_short="RockyP",
            site_desc="A rocky point with challenging waves for advanced surfers.",
            site_url="https://example.com/rockypoint",
            site_banner_url="https://example.com/rockypoint/banner.png"
        )

        # Add all site data to the session
        session.add_all([site1, site2])

        # Commit the session to ensure sites are in the database
        await session.commit()

        # Daily predictions for sites
        daily_prediction1 = DailyCrowdnessPrediction(
            site_id=1,
            h0=0, h1=0, h2=0, h3=0,
            h4=2, h5=2, h6=2, h7=4,
            h8=6, h9=6, h10=8, h11=10,
            h12=10, h13=10, h14=10, h15=10,
            h16=8, h17=6, h18=4, h19=2,
            h20=0, h21=0, h22=0, h23=0
        )
        daily_prediction2 = DailyCrowdnessPrediction(
            site_id=2,
            h0=1, h1=1, h2=1, h3=1,
            h4=5, h5=5, h6=5, h7=10,
            h8=15, h9=15, h10=18, h11=20,
            h12=20, h13=20, h14=20, h15=20,
            h16=18, h17=15, h18=10, h19=5,
            h20=1, h21=1, h22=1, h23=1
        )
        # Weekly predictions for sites
        weekly_prediction1 = WeeklyCrowdnessPrediction(
            site_id=1,
            Monday=10, Tuesday=12, Wednesday=14,
            Thursday=16, Friday=18, Saturday=20,
            Sunday=12
        )
        weekly_prediction2 = WeeklyCrowdnessPrediction(
            site_id=2,
            Monday=20, Tuesday=22, Wednesday=24,
            Thursday=26, Friday=28, Saturday=30,
            Sunday=22
        )
        # Add all prediction data to the session
        session.add_all([
            daily_prediction1, daily_prediction2,
            weekly_prediction1, weekly_prediction2
        ])

        # Add sample raw crowdness data
        # Generate raw crowdness data for 2 sites
        raw_crowdness_data = []
        start_time = datetime.now() - timedelta(days=1)  # Start from 1 day ago
        for site_id in [1, 2]:
            for i in range(50):  # 50 readings per site
                raw_crowdness_data.append(
                    RawCrowdnessReading(
                        time=start_time + timedelta(minutes=i * 30),  # Every 30 minutes
                        site_id=site_id,
                        crowdness=random.randint(0, 20)  # Random crowdness between 0 and 100
                    )
                )

        # Add raw crowdness data to the session
        session.add_all(raw_crowdness_data)
        await session.commit()

async def db_init():
    await create_db_and_tables()
    # await load_initial_data()

# Run the main function
if __name__ == "__main__":
    asyncio.run(db_init())

