from pydantic import BaseModel, EmailStr, Field
from uuid import UUID
from backend.app.database import get_db_connection
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

class UserProfileUpdate(BaseModel):
    username: str | None = None
    email: EmailStr | None = None

class PasswordChange(BaseModel):
    curr_password: str
    new_password: str = Field(min_length=1)

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

def get_user_by_id(user_id: UUID) -> UserResponse | None:
    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, username, email
                FROM users
                WHERE id = %s
                """,
                (user_id,)
            )
            row = cursor.fetchone()
            if row is None:
                return None
            return UserResponse(id=row[0], username=row[1], email=row[2])

def authenticate_user(identifier: str, password: str) -> UserResponse | None:
    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, username, email, password_hash
                FROM users
                WHERE username = %s OR email = %s
                """,
                (identifier, identifier)
            )
            row = cursor.fetchone()
            if row is None:
                return None
            if not verify_password(password, row[3]):
                return None
            return UserResponse(id=row[0], username=row[1], email=row[2])

def update_user_profile(user_id: UUID, update: UserProfileUpdate) -> UserResponse | None:
    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE users
                SET username = COALESCE(%s, username),
                    email = COALESCE(%s, email)
                WHERE id = %s
                RETURNING id, username, email
                """,
                (update.username, update.email, user_id)
            )
            row = cursor.fetchone()
            if row is None:
                return None
            return UserResponse(id=row[0], username=row[1], email=row[2])

def update_user_password(user_id: UUID, curr_password: str, new_password: str) -> bool:
    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT password_hash
                FROM users
                WHERE id = %s
                """,
                (user_id,)
            )
            row = cursor.fetchone()
            if row is None or not verify_password(curr_password, row[0]):
                return False
            new_hash_password = hash_password(new_password)
            cursor.execute(
                """
                UPDATE users
                SET password_hash = %s
                WHERE id = %s
                """,
                (new_hash_password, user_id)
            )
            return True