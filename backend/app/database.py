import psycopg
import os

from dotenv import load_dotenv

load_dotenv()

connection = psycopg.connect(
    host="localhost",
    port=5432,
    dbname="sift",
    user="postgres",
    password=os.getenv("POSTGRES_PASSWORD")
)

print("Successfully connected to database!")

connection.close()