from sqlalchemy import Integer, String, Boolean, create_engine, ForeignKey
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

# --- Base Model ---
# Base class for our ORM models
class Base(DeclarativeBase):
    pass

# --- User ORM Model ---
class UserProfile(Base):
    """SQLAlchemy User model corresponding to the database table."""
    __tablename__ = "users"

    user_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    display_name: Mapped[str] = mapped_column(String(50))
    streak_days: Mapped[int] = mapped_column(Integer, default=0)
    avatar_url: Mapped[str] = mapped_column(String(255), nullable=True)

    show_streak: Mapped[bool] = mapped_column(Boolean, default=True)

class UserAuth(Base):
    """SQLAlchemy UserAuth model corresponding to the database table."""
    __tablename__ = "user_auths"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"))
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)