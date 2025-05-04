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

async def get_user_by_username(db: AsyncSession, username: str) -> UserProfile:
    """
    Get a user by username from the database. Return `None` if not found. `username` is unique.
    """
    user_id = await db.execute(select(UserAuth).filter(UserAuth.username == username))
    user_id = user_id.scalars().first()
    return get_user(db, user_id.user_id) if user_id else None

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

    new_user_auth = UserProfile.UserAuth(
        user_id=new_user.user_id,
        username=register.username,
        hashed_password=hashed_password,
    )
    db.add(new_user_auth)
    await db.commit()
    await db.refresh(new_user_auth)

    logger.info(f"User {new_user.username} created with ID {new_user.user_id}.")

    return new_user.user_id  # Return the user ID of the newly created user


async def generate_session_id(db: AsyncSession, auth: UserAuth) -> str:
    """
    Generate a session ID for the user and store it in the database.
    """
    session_id = str(uuid.uuid4())  # Generate a unique session ID
    auth.session_id = session_id  # Assuming the UserAuth model has a session_id field
    db.add(auth)
    await db.commit()
    await db.refresh(auth)

    logger.info(f"Session ID {session_id} generated for user {auth.username} with ID {auth.user_id}.")
    return session_id