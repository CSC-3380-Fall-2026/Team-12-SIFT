
import os

import psycopg
from dotenv import load_dotenv
from pydantic import BaseModel, Field


# Load variables from the .env file into the application's environment.
# This is used to access the PostgreSQL password without putting it
# directly in the source code.
load_dotenv()


# Pydantic model describing the information needed to create an annotation.
# Each annotation belongs to a user and a media item, contains text,
# and stores x/y coordinates representing its position on the media.
#
# The Field constraint prevents an empty text string from being submitted.
# Use this model when passing new annotation data to create_annotation().
class AnnotationCreate(BaseModel):
    user_id: str
    media_id: str
    text: str = Field(min_length=1)
    x: float
    y: float


# Represents an annotation that has been stored in the database.
# It inherits the fields from AnnotationCreate and includes the
# unique ID assigned by PostgreSQL.
#
# This model is used when returning annotation records to the API.
class Annotation(AnnotationCreate):
    id: int


# Creates a connection to the PostgreSQL database used by SIFT.
# psycopg handles communication between Python and PostgreSQL.
#
# The connection currently targets a local database named "sift".
# POSTGRES_PASSWORD must be configured in the environment or .env file.
#
# Other functions use this helper to execute SQL queries.
def get_db_connection():
    return psycopg.connect(
        host="localhost",
        port=5432,
        dbname="sift",
        user="postgres",
        password=os.getenv("POSTGRES_PASSWORD"),
        connect_timeout=5,
    )


# Saves a new annotation in the PostgreSQL annotations table.
#
# Accepts an AnnotationCreate object containing the annotation data.
# An INSERT query writes its fields to the database.
#
# The %s placeholders pass values separately from the SQL statement,
# avoiding unsafe SQL string concatenation.
#
# RETURNING id retrieves the ID assigned to the new database record.
# The function returns an Annotation object with that ID included.
#
# Call this function when a user creates an annotation on a media item.
def create_annotation(annotation: AnnotationCreate) -> Annotation:
    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO annotations (user_id, media_id, text, x, y)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
                """,
                (
                    annotation.user_id,
                    annotation.media_id,
                    annotation.text,
                    annotation.x,
                    annotation.y,
                ),
            )

            annotation_id = cursor.fetchone()[0]

    return Annotation(id=annotation_id, **annotation.model_dump())


# Retrieves annotations belonging to a specific media item.
#
# media_id is used in the WHERE clause to find matching records.
# ORDER BY id returns the results in ascending database ID order.
#
# fetchall() collects the matching rows, and the list comprehension
# converts each database row into a Pydantic Annotation object.
#
# Call this function when the frontend needs to display annotations
# for a selected media item. It returns an empty list if none exist.
def get_annotations(media_id: str) -> list[Annotation]:
    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, user_id, media_id, text, x, y
                FROM annotations
                WHERE media_id = %s
                ORDER BY id
                """,
                (media_id,),
            )

            rows = cursor.fetchall()

    return [
        Annotation(
            id=row[0],
            user_id=row[1],
            media_id=row[2],
            text=row[3],
            x=row[4],
            y=row[5],
        )
        for row in rows
    ]


# Pydantic model for editing an existing annotation.
# It allows the text and x/y position to be updated.
#
# The annotation's ID, user ID, and media ID are not changed.
# Text must contain at least one character.
#
# Use this model when passing edited annotation data to
# update_annotation().
class AnnotationUpdate(BaseModel):
    text: str = Field(min_length=1)
    x: float
    y: float


# Updates an existing annotation in PostgreSQL.
#
# annotation_id identifies which record to update.
# update contains the replacement text and coordinates.
#
# The UPDATE statement modifies the matching record.
# RETURNING retrieves the updated fields so they can be converted
# into an Annotation object.
#
# If no matching ID exists, the function returns None.
#
# Call this function when a user edits an annotation's text or position.
def update_annotation(
    annotation_id: int,
    update: AnnotationUpdate,
) -> Annotation | None:
    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE annotations
                SET text = %s, x = %s, y = %s
                WHERE id = %s
                RETURNING id, user_id, media_id, text, x, y
                """,
                (
                    update.text,
                    update.x,
                    update.y,
                    annotation_id,
                ),
            )

            row = cursor.fetchone()

    if row is None:
        return None

    return Annotation(
        id=row[0],
        user_id=row[1],
        media_id=row[2],
        text=row[3],
        x=row[4],
        y=row[5],
    )


# Deletes an annotation from the PostgreSQL database.
#
# annotation_id identifies the record that should be removed.
# DELETE removes the matching row from the annotations table.
#
# RETURNING id indicates whether a matching row was deleted.
# The function returns True when deletion succeeds and False
# when the annotation ID does not exist.
#
# Call this function when a user removes an annotation.
def delete_annotation(annotation_id: int) -> bool:
    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                DELETE FROM annotations
                WHERE id = %s
                RETURNING id
                """,
                (annotation_id,),
            )

            deleted_row = cursor.fetchone()

    return deleted_row is not None
