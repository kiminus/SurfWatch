from typing import Dict, List, Optional

from database.database import db_init, get_db
from models.user import UserAuth, UserRegister, UserLogin, UserProfile
import controllers.auth_controller as auth
import controllers.site_controller as site_controller

from models.site import Site, RawCrowdnessReading, WaveQualityReading
from utils import logger
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import (  # Consolidated FastAPI imports
    Depends,
    FastAPI,
    HTTPException,
    Request,
    Response,
    File,
    UploadFile,
    Form,
)
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
import os

logger = logger.create_logger("Server Main")

latest_image_store = {
    "filename": None,
    "media_type": None,
    "metadata": None,  # latest RawCrowdnessReading stored
}


@asynccontextmanager
async def app_init(app: FastAPI):
    # Code to run on startup
    logger.info("Application startup...")
    logger.info("Creating database tables if they don't exist...")
    await db_init()
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
# origins = [
#     "http://localhost",
#
#     "http://localhost:8081", # Expo web default
#     "https://agrishakov.com",
#     "https://www.agrishakov.com",
#     # TODO: REMEMBER TO ADD YOUR PRODUCTION URL HERE
# ]
origins = [
    "http://localhost:3000",  # React dev server
    "http://localhost:8081",  # Expo web default
    "https://agrishakov.com",
    "https://www.agrishakov.com",
    "http://localhost:19006",
    # Add your frontend domain here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # Important for cookies
    allow_methods=["*"],  # ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


@app.options("/{full_path:path}")
async def options_handler(request: Request):
    return Response(status_code=200)


# region Auth
@app.get("/users/me")
async def get_current_user(
    request: Request, db: AsyncSession = Depends(get_db)
) -> Optional[UserProfile]:
    """
    Dependency to get the current user from the request. return `None` if the user is not authenticated.
    """
    session_id = request.cookies.get(SESSION_COOKIE_NAME)
    if not session_id:
        return None
    user_id = active_sessions.get(session_id)
    if not user_id:
        return None
    user = await auth.get_user(db, user_id)
    if not user:
        return None
    logger.info(f"Session ID {session_id} found, user: {user}")
    return user


async def get_current_user_auth(request, db: AsyncSession) -> Optional[UserAuth]:
    """dependency to get the current user auth from the request. return `None` if the user is not authenticated."""
    user = await get_current_user(request, db)
    return auth.get_user_auth(user.user_id)


@app.post("/auth/register")
async def register_user(
    register: UserRegister, db: AsyncSession = Depends(get_db)
) -> int:
    """register a new user. return the `user_id` on success, throw `HTTPException` error if unsuccessful."""
    # validate the registration data against the UserRegister model
    if not register:
        raise HTTPException(
            status_code=401,
            detail="Invalid registration data, or not conforming to the model `UserRegister`",
        )
    if not register.username:
        raise HTTPException(status_code=401, detail="Missing required field: username")
    if not register.password:
        raise HTTPException(status_code=401, detail="Missing required field: password")
    if not register.email:
        raise HTTPException(status_code=401, detail="Missing required field: email")
    if not register.displayName:
        raise HTTPException(
            status_code=401, detail="Missing required field: displayName"
        )

    return await auth.create_user(db, register)


@app.post("/auth/login")
async def login_user(
    response: Response, login: UserLogin, db: AsyncSession = Depends(get_db)
) -> str:
    """login a user. On success, set session cookie. on failure, throw `HTTPException` error.
    even there is already a session cookie, it will be replaced with a new one."""
    # get the user auth from the database
    user_auth = await auth.get_user_auth_by_username(db, login.username)
    if not user_auth:
        raise HTTPException(status_code=401, detail="Invalid username")
    if not auth.verify_password(login.password, user_auth.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid password")

    session_id = await auth.generate_session_id()
    active_sessions[session_id] = user_auth.user_id
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=session_id,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=60 * 60 * 24,
    )  # 1 day expiration
    return session_id


@app.post("/auth/logout")
async def logout_user(response: Response, request: Request):
    """
    Logs out the user by removing the session from the server-side store
    and clearing the session cookie.

    Returns a JSON response indicating success or failure.
    """
    session_id = request.cookies.get(SESSION_COOKIE_NAME)
    if not session_id or session_id not in active_sessions:
        raise HTTPException(status_code=401, detail="User not logged in")

    # Get user info for logging before deletion
    user_id = active_sessions[session_id]
    logger.info(f"Logout request for user ID: {user_id}")

    # Delete session
    del active_sessions[session_id]
    logger.info(f"Removed session {session_id[:8]}... from server store.")

    # Clear the cookie
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value="",
        httponly=True,
        secure=True,  # Should match login settings
        samesite="none",
        max_age=0,  # Expire immediately
    )

    return {"status": "success", "message": "Logged out successfully"}


# endregion


@app.get("/sites/rec", response_model=List[Site])
async def get_recommendations(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Get recommendations for the user.
    This is a placeholder function and should be implemented.
    for now, return all sites in the database
    """
    return await site_controller.get_all_sites(db)


from fastapi import Body
from fastapi.responses import StreamingResponse, JSONResponse
import io
import json
import shutil
from controllers import site_controller
from ai.surf import calculate_surfers
from pydantic import ValidationError
from datetime import datetime


@app.put("/cam/wave")
async def update_wave_quality(
    wave_quality: WaveQualityReading = Body(
        ..., description="Wave quality reading in JSON format"
    ),
    db: AsyncSession = Depends(get_db),
):
    """
    Updates the wave quality reading for a site.
    This is a placeholder function and should be implemented.
    """
    return await site_controller.update_wave_quality_reading(db, wave_quality)


@app.put("/cam")
async def upload_image_and_data(
    image: UploadFile = File(...),
    video: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    """
    Receives an image and JSON data matching RawCrowdnessReading.
    Stores the latest image and its metadata in memory.
    """
    UPLOAD_DIRECTORY = "uploaded_files"
    os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)
    received_files_info = {}
    image_filename_on_server = ""
    video_filename_on_server = ""

    try:
        # Image process
        if not image.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400, detail="Invalid image format for 'image' part."
            )

        contents = await image.read()
        # Save to file
        image_filename_on_server = os.path.join(UPLOAD_DIRECTORY, image.filename)
        with open(image_filename_on_server, "wb") as buffer:
            buffer.write(contents)
        latest_image_store["filename"] = image_filename_on_server
        latest_image_store["media_type"] = image.content_type
        received_files_info["image"] = {
            "filename": image.filename,
            "content_type": image.content_type,
            "saved_path": image_filename_on_server,
        }
        print(f"Received and saved image: {image_filename_on_server}")
        # Video process
        if not video.content_type.startswith("video/"):
            raise HTTPException(
                status_code=400, detail="Invalid video format for 'video' part."
            )

        video_filename_on_server = os.path.join(UPLOAD_DIRECTORY, video.filename)
        with open(video_filename_on_server, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)
        received_files_info["video"] = {
            "filename": video.filename,
            "content_type": video.content_type,
            "saved_path": video_filename_on_server,
        }
        print(f"Received and saved video: {video_filename_on_server}")

        surf_num = calculate_surfers(image_filename_on_server)
        time = datetime.now()
        data = RawCrowdnessReading(
            time=time,
            site_id=1,
            crowdness=surf_num,
        )

        try:
            created_db_entry = await site_controller.create_raw_crowdness_reading(
                db=db, reading_data=data
            )
            site_controller.update_hourly_crowdness_prediction(db, data.site_id, time.hour, surf_num)
            
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"An error occurred while processing your request: {str(e)}",
            )

        # error handling + response
        latest_image_store["metadata"] = created_db_entry.model_dump(mode="json")
        return JSONResponse(
            status_code=200,
            content={
                "message": "Files received successfully",
                "uploaded_files_details": received_files_info,
                "uploaded_data": created_db_entry.model_dump(mode="json"),
            },
        )

    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error processing upload: {e}")
        if os.path.exists(image_filename_on_server):
            os.remove(image_filename_on_server)
        if os.path.exists(video_filename_on_server):
            os.remove(video_filename_on_server)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    finally:
        if image and not image.file.closed:
            image.file.close()
        if video and not video.file.closed:
            video.file.close()


@app.get("/get_image")
async def get_latest_image():
    """
    Returns the latest image stored in memory.
    """
    if latest_image_store["filename"] is None:
        raise HTTPException(status_code=404, detail="No image available.")

    with open(latest_image_store["filename"], "rb") as image_file:
        image_bytes = image_file.read()
    media_type = latest_image_store["media_type"]

    return StreamingResponse(io.BytesIO(image_bytes), media_type=media_type)


@app.get("/weather")
async def get_weather_data():
    """
    Placeholder endpoint for weather data.
    This should be implemented to fetch real weather data.
    """
    # For now, return a dummy response
    return {"temperature": 22.5, "humidity": 60, "condition": "Sunny"}
