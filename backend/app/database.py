#creates postgresql connections

import psycopg
import os

from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    return psycopg.connect(
        host="localhost",
        port=5432,
        dbname="sift",
        user="postgres",
        password=os.getenv("POSTGRES_PASSWORD"),
        connect_timeout=5,
    )