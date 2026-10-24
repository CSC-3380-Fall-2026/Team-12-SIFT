#saving and retrieving the data using table

#THIS IS AN IDEA OF HOW IT SHOULD LOOK BUT NOT THE FINAL. WILL NEED UPDATING
#ONCE BACKEND IS REFACTORED AND FILE INFO IS DECIDED

"""
from datacalsses import dataclass
from typing import Literal
from uuid import UUID

#from backend.app.database import get_db_connection
from backend.app.schemas import Media

MediaType = Literal["image", "document"]

@dataclass(frozen=True)
class StoredMedia:
    filename: str
    content_type: str
    file_data: bytes

def saved_media(
    media_type: MediaType,
    filename: str,
    content_type: str,
    file_data: bytes,
) -> Media:
    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                we need to discuss file types
                INSERT INTO media (media_type, filename, content_type, file_data)
                VALUES (%s, %s, %s, %s)
                RETURNING id, media_type, filename, content_type,
                          octet_length(file_data)
                (media_type, filename, content_type, file_data),
            )
            row = cursor.fetchone()
    
    #checks that there is a record
    if row is None:
        raise RuntimeError("media record missing")

    return Media(
        id=row[0],
        media_type=row[1],
        filename=row[2],
        content_type=row[3],
        size_bytes=row[4],
    )

def get_media(media_id: UUID) -> Stored Media | None:
    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                #fix this
                SELECT filename, content_type, file_data
                FROM media
                WHERE id = %s,
                (media_id,),
            )
            row = cursor.fetchone()

    if row is None:
        return None

    return StoredMedia(
        filename=row[0],
        content_type=row[1],
        file_data=row[2],
    )
    """