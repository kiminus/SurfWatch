from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.models.user import UserAuth, UserProfile
from models.user import UserRegister, UserLogin
from utils import logger
import uuid

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.
    """
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.
    """
    return pwd_context.hash(password)

async def get_user(db: AsyncSession, user_id: int) -> UserProfile:
    """
    Get a user by ID from the database. Return `None` if not found, `user_id` is unique.
    """
    result = await db.execute(select(UserProfile).filter(UserProfile.user_id == user_id))
    return result.scalars().first()

async def get_user_auth(db: AsyncSession, user_id: int) -> UserAuth:
    """
    Get user authentication details by user ID from the database. Return `None` if not found.
    """
    result = await db.execute(select(UserAuth).filter(UserAuth.user_id == user_id))
    return result.scalars().first()

async def get_user_auth_by_username(db: AsyncSession, username: str) -> UserAuth:
    """
    Get user authentication details by username from the database. Return `None` if not found.
    """
    result = await db.execute(select(UserAuth).filter(UserAuth.username == username))
    return result.scalars().first()

async def get_user_by_username(db: AsyncSession, username: str) -> UserProfile:
    """
    Get a user by username from the database. Return `None` if not found. `username` is unique.
    """
    user_auth = await get_user_auth_by_username(db, username)
    return get_user(db, user_auth.user_id) if user_auth else None

async def get_user_by_email(db: AsyncSession, email: str) -> UserProfile:
    """
    Get a user by email from the database. Return `None` if not found. `email` is unique.
    """
    result = await db.execute(select(UserProfile).filter(UserProfile.email == email))
    return result.scalars().first()


async def create_user(db: AsyncSession, register: UserRegister) -> UserProfile:
    """
    Create a new user in the database.
    """
    hashed_password = hash_password(register.password)
    new_user = UserProfile(
        display_name=register.displayName,
        email=register.email,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    new_user_auth = UserAuth(
        user_id=new_user.user_id,
        username=register.username,
        hashed_password=hashed_password,
    )
    db.add(new_user_auth)
    await db.commit()
    await db.refresh(new_user_auth)

    logger.info(f"User {new_user_auth.username} ({new_user.display_name}) created with ID {new_user.user_id}.")

    return new_user.user_id  # Return the user ID of the newly created user


async def generate_session_id() -> str:
    """
    Generate a session ID for the user and store it in the database.
    """
    session_id = str(uuid.uuid4())  # Generate a unique session ID
    return session_id