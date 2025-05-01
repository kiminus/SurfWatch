import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, Table, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from ..utils import logger
import database

load_dotenv()
logger = logger.create_info_logger("database")
logger.info("database.py: init")



def init_db():
    os.load_dotenv();
    db_url = os.getenv("DATABASE_URL")
    db_user = os.getenv("DATABASE_USER")
    db_password = os.getenv("DATABASE_PASSWORD")
    db_name = os.getenv("DATABASE_NAME")
    db_host = os.getenv("DATABASE_HOST")
    db_port = os.getenv("DATABASE_PORT")

    global engine, metadata
    engine = create_engine(db_url, connect_args={
        "user": db_user,
        "password": db_password,
        "host": db_host,
        "port": db_port,
        "database": db_name
    })

    