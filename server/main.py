import logging
import os
from contextlib import asynccontextmanager


from dotenv import load_dotenv
from fastapi import FastAPI



logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

@asynccontextmanager
async def app_init(app: FastAPI):
    load_dotenv()
    global PID, EMAIL
    PID = os.getenv("PID")
    EMAIL = os.getenv("EMAIL")
    yield

app = FastAPI(lifespan=app_init)

# region Auth

# endregion