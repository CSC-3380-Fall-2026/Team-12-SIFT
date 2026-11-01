import psycopg
from pydantic import BaseModel
from uuid import UUID
from backend.app.annotations import get_db_connection
from backend.app.schemas import UserCreate
from pwdlib import PasswordHash

password_hasher = PasswordHash.recommended()

# this model represents the data the user sends when logging in
class UserLogin(BaseModel):
    identifier: str
    password: str

# this model represents the secure information sent back
# IMPORTANT: this information does not include password_hash
class UserResponse(BaseModel):
    id: UUID
    username: str
    email: str

def hash_password(password: str) -> str:
    return password_hasher.hash(password)

def verify_password(password: str, hashed_password: str) -> bool:
    return password_hasher.verify(password, hashed_password)

def create_user(user: UserCreate) -> UserResponse:
    hashed_password = hash_password(user.password)
    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO users (username, email, password_hash)
                VALUES (%s, %s, %s)
                RETURNING id, username, email
                """,
                (
                    user.username,
                    user.email,
                    hashed_password
                )
            )
            # retrieve the returned row
            row = cursor.fetchone()
            return UserResponse(
                id=row[0],
                username=row[1],
                email=row[2]
            )