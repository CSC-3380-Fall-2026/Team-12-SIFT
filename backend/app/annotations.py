


from backend.app.database import get_db_connection
from backend.app.schemas import Annotation, AnnotationCreate, AnnotationUpdate


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