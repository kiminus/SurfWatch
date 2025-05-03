import os
from typing import AsyncGenerator
from dotenv import load_dotenv
from sqlalchemy import create_engine, Table, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

from server.database.models.user import Base
from server.models.user import UserSettings
from ..utils import logger
import database



# --- Settings using pydantic-settings ---
class Settings(UserSettings):
    """Loads environment variables."""
    database_hostname: str
    database_port: str
    database_password: str
    database_name: str
    database_username: str
    secret_key: str # For session signing

    class Config:
        env_file = ".env"

logger = logger.create_logger("database")
logger.info("database.py: init")
settings = Settings()


# --- Database URL ---
# Using asyncmy driver for asyncio compatibility with MySQL
DATABASE_URL = f"mysql+asyncmy://{settings.database_username}:{settings.database_password}@{settings.database_hostname}:{settings.database_port}/{settings.database_name}"
logger.info(f"connecting to database: {DATABASE_URL}")

# --- SQLAlchemy Engine and Session ---
# Create the async engine
engine = create_async_engine(DATABASE_URL, echo=True)

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
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)