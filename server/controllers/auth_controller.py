from fastapi import HTTPException
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.models.user import UserProfile, UserAuth
from models.user import UserProfile as PydanticUserProfile, UserAuth as PydanticUserAuth, UserRegister as PydanticUserRegister, UserLogin as PydanticUserLogin
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

async def get_user(db: AsyncSession, user_id: int) -> PydanticUserProfile:
    """
    Get a user by ID from the database. Return `None` if not found, `user_id` is unique.
    """
    result = await db.execute(select(UserProfile).filter(UserProfile.user_id == user_id))
    db_user =  result.scalars().first()
    
    if not db_user: return None
    # do internal validation make sure the required fields are present
    assert db_user.user_id == user_id, f"User ID {user_id} not found in database."
    assert db_user.display_name, f"User ID {user_id} has no display name"
    assert db_user.email, f"User ID {user_id} has no email"
    assert db_user.streak_days >= 0, f"User ID {user_id} has invalid streak days"
    
    # then, fetch from the user auth to get the username
    result = await db.execute(select(UserAuth).filter(UserAuth.user_id == user_id))
    db_auth = result.scalars().first()
    if not db_auth: return PydanticUserProfile.model_validate({**db_user.__dict__, "username": None})
        
    return PydanticUserProfile.model_validate({**db_user.__dict__, "username": db_auth.username})

async def get_user_auth(db: AsyncSession, user_id: int) -> PydanticUserAuth:
    """
    Get user authentication details by user ID from the database. Return `None` if not found.
    """
    result = await db.execute(select(UserAuth).filter(UserAuth.user_id == user_id))
    db_auth = result.scalars().first()
    
    if not db_auth: return None
    # do internal validation make sure the required fields are present
    assert db_auth.user_id == user_id, f"User ID {user_id} not found in database."
    assert db_auth.username, f"User ID {user_id} has no username"
    assert db_auth.hashed_password, f"User ID {user_id} has no hashed password"
    
    return PydanticUserAuth.model_validate(db_auth)

async def get_user_auth_by_username(db: AsyncSession, username: str) -> PydanticUserAuth:
    """
    Get user authentication details by username from the database. Return `None` if not found.
    """
    result = await db.execute(select(UserAuth).filter(UserAuth.username == username))
    db_auth = result.scalars().first()
    
    if not db_auth: return None
    # do internal validation make sure the required fields are present
    assert db_auth.username == username, f"Username {username} not found in database."
    assert db_auth.hashed_password, f"Username {username} has no hashed password"
    
    return PydanticUserAuth.model_validate(db_auth)

async def create_user(db: AsyncSession, register: PydanticUserRegister) -> int:
    """
    Create a new user in the database. return the user ID if success, throw `409 HTTPException` error if unsuccessful.
    """
    # validate there are no duplicate usernames or emails
    exist_username = await db.execute(select(UserAuth).filter(UserAuth.username == register.username))
    if exist_username.scalars().first():
        raise HTTPException(status_code=409, detail="Username already exists")
    
    exist_email = await db.execute(select(UserProfile).filter(UserProfile.email == register.email))
    if exist_email.scalars().first():
        raise HTTPException(status_code=409, detail="Email already exists")
    
    # hash password for security 
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

    