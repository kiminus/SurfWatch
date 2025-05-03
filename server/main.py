from utils import logger
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from passlib.context import CryptContext
import os

@asynccontextmanager
async def app_init(app: FastAPI):
    yield

app = FastAPI(lifespan=app_init)

load_dotenv()
logger = logger.create_logger("Server Main")
SECRET = os.getenv("SECRET_KEY")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# region Auth

# endregion