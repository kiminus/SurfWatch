from sqlalchemy import Integer, String, Boolean, create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.ext.declarative import DeclarativeBase, Mapped, mapped_column

# --- Base Model ---
# Base class for our ORM models
class Base(DeclarativeBase):
    pass

# --- User ORM Model ---
class User(Base):
    """SQLAlchemy User model corresponding to the database table."""
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=True) # Allow null email initially
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    display_name: Mapped[str] = mapped_column(String(50), nullable=True)
    streak_days: Mapped[int] = mapped_column(Integer, default=0)
    avatar_url: Mapped[str] = mapped_column(String(255), nullable=True)
    # Add other fields as needed (e.g., is_active, is_superuser)
    # For UserSettings/UserPreference, consider separate tables with relationships
    # or potentially JSON columns if your DB supports it well.
    # Example for a simple setting:
    show_streak: Mapped[bool] = mapped_column(Boolean, default=True)