import os
from typing import AsyncGenerator
from dotenv import load_dotenv
from sqlalchemy import create_engine, Table, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

from database.models.user import Base, UserProfile, UserAuth
from database.models.site import Site
from utils import logger
import json
import asyncio

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
        # Load initial data for users
        with open("store/reserved_users.json", "r") as file:
            users_data = json.load(file)
            for user in users_data:
                session.add(UserProfile(**user))

        # Load initial data for sites
        with open("store/reserved_sites.json", "r") as file:
            sites_data = json.load(file)
            for site in sites_data:
                session.add(Site(**site))

        # Load initial data for user_auths
        with open("store/reserved_user_auths.json", "r") as file:
            user_auths_data = json.load(file)
            for user_auth in user_auths_data:
                session.add(UserAuth(**user_auth))

        await session.commit()

async def main():
    await create_db_and_tables()
    await load_initial_data()

# Run the main function
if __name__ == "__main__":
    asyncio.run(main())

