from typing import Dict

from sqlalchemy import select
from server.database.database import create_db_and_tables, get_db
from server.database.models.user import UserProfile
from server.models.user import UserRegister, UserLogin
import server.controllers.auth_controller as auth
from utils import logger
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession
import os

logger = logger.create_logger("Server Main")

@asynccontextmanager
async def app_init(app: FastAPI):
    # Code to run on startup
    logger.info("Application startup...")
    logger.info("Creating database tables if they don't exist...")
    await create_db_and_tables()
    logger.info("Database tables checked/created.")
    yield
    # Code to run on shutdown (optional)
    logger.info("Application shutdown.")

app = FastAPI(lifespan=app_init)

load_dotenv()
SECRET = os.getenv("SECRET_KEY")
SESSION_COOKIE_NAME = os.getenv("session_id")
active_sessions: Dict[str, int] = {}

# --- CORS Middleware ---
# Adjust origins as needed for production
origins = [
    "http://localhost",
    "http://localhost:8081", # Expo web default
    # TODO: REMEMBER TO ADD YOUR PRODUCTION URL HERE
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True, # Important for cookies
    allow_methods=["*"],
    allow_headers=["*"],
)
# region Auth
async def get_current_user(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Dependency to get the current user from the request.
    """
    session_id = request.cookies.get(SESSION_COOKIE_NAME)
    if not session_id:
        raise HTTPException(status_code=401, detail="Not authenticated, missing session ID")
    user_id = active_sessions.get(session_id)
    if not user_id:
        logger.warning(f"Session ID {session_id} not found in active sessions.")
        raise HTTPException(status_code=401, detail="Not authenticated, invalid session ID")
    user = auth.get_user(db, user_id)
    if not user:
        logger.warning(f"User ID {user_id} not found in database.")
        raise HTTPException(status_code=401, detail="Not authenticated, user not found associated with user id: {user_id}")
    logger.info(f"Session ID {session_id} found, user: {user}")
    return user


@app.post('/auth/register', response_model=int)
async def register_user(register: UserRegister, db: AsyncSession = Depends(get_db)):
    '''register a new user'''
    if not register:
        raise HTTPException(status_code=400, detail="Invalid registration data, or not conforming to the model `UserRegister`")
    # assume all fields are valid for simplicity
    if not register.username or not register.password or not register.email:
        raise HTTPException(status_code=400, detail="Missing required fields")
    
    exist_username = await auth.get_user_by_username(db, register.username)
    if exist_username:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    exist_email = await auth.get_user_by_email(db, register.email)
    if exist_email:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    return await auth.create_user(db, register)

@app.post('/auth/login')
async def login_user(response: Response, login: UserLogin, db: AsyncSession = Depends(get_db)):
    '''login a user'''
    user = await auth.get_user_by_username(db, login.username)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username")
    if not auth.verify_password(login.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid password")
    
    session_id = auth.generate_session_id(db, login)
    active_sessions[session_id] = user.user_id
    response.set_cookie(key=SESSION_COOKIE_NAME, value=session_id, httponly=True, secure=True, samesite="lax", max_age=60*60*24)  # 1 day expiration

@app.post('/auth/logout')
async def logout_user(response: Response, request: Request,
                      current_user: UserProfile = Depends(get_current_user)
                      ):
    """
    Logs out the user by removing the session from the server-side store
    and clearing the session cookie.
    """
    logger.info(f"Logout request for user: {current_user.username}")
    session_id = request.cookies.get(SESSION_COOKIE_NAME)

    # --- Simple Session Deletion ---
    if session_id and session_id in active_sessions:
        del active_sessions[session_id]
        logger.info(f"Removed session {session_id[:8]}... from server store.")
    elif session_id:
        logger.warning(f"Logout attempt with session ID not found in store: {session_id[:8]}...")
    # -----------------------------

    # Clear the cookie
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value="",
        httponly=True,
        secure=False, # Match settings used during set
        samesite="lax", # Match settings used during set
        max_age=0 # Expire immediately
    )
    response.status_code = 200
    return {"message": "Logged out successfully"}
# endregion