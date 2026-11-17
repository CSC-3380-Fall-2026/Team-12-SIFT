from dataclasses import dataclass
from typing import Literal
from uuid import UUID
from backend.app.schemas import Media
from backend.app.annotations import get_db_connection

MediaType = Literal["image", "document"]

@dataclass(frozen=True)
class StoredMedia:
    filename: str
    content_type: str
    file_data: bytes

def save_media(media_type: MediaType, filename: str, content_type: str, file_data: bytes) -> Media:
    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO media (media_type, filename, content_type, file_data)
                VALUES (%s, %s, %s, %s)
                RETURNING id, media_type, filename, content_type, octet_length(file_data) as size_bytes;
                """,
                (media_type, filename, content_type, file_data)
            )
            row = cursor.fetchone()
            if row is None:
                raise RuntimeError("Alert: Unable to save media record to the database.")
            return Media(
                id=row[0],
                media_type=row[1],
                filename=row[2],
                content_type=row[3],
                size_bytes=row[4]
            )

def get_media(media_id: UUID) -> StoredMedia | None:
    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT filename, content_type, file_data
                FROM media
                WHERE id = %s;
                """,
                (media_id,)
            )
            row = cursor.fetchone()
            if row is None:
                return None
            return StoredMedia(
                filename=row[0],
                content_type=row[1],
                file_data=row[2]
            )

def get_all_media() -> list[Media]:
    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, media_type, filename, content_type, octet_length(file_data)
                FROM media
                ORDER BY created_at DESC;
                """
            )
            rows = cursor.fetchall()
            return [
                Media(
                    id=row[0],
                    media_type=row[1],
                    filename=row[2],
                    content_type=row[3],
                    size_bytes=row[4]
                )
                for row in rows
            ]