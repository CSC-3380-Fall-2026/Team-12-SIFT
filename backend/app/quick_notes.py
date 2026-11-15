from backend.app.annotations import get_db_connection
from dataclasses import dataclass

@dataclass(frozen=True)
class QuickNote:
    id: int
    text: str

class QuickNoteCreate(BaseModel):
    text: str

class QuickNoteUpdate(BaseModel):
    text: str

def create_quick_note(text: str) -> QuickNote:
    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO quick_notes (text)
                VALUES (%s)
                RETURNING id, text;
                """,
                (text,)
            )
            row = cursor.fetchone()
            if row is None:
                raise RuntimeError("A problem occurred and Quick Note was unable to be created.")
            return QuickNote(id=row[0], text=row[1])

def get_all_quick_notes() -> list[QuickNote]:
    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, text
                FROM quick_notes
                ORDER BY created_at DESC;
                """
            )
            rows = cursor.fetchall()
            return [
                QuickNote(id=row[0], text=row[1])
                for row in rows
            ]

def update_quick_note(note_id: int, text: str) -> QuickNote | None:
    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE quick_notes
                SET text = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id, text;
                """,
                (text, note_id)
            )
            row = cursor.fetchone()
            if row is None:
                return None
            return QuickNote(id=row[0], text=row[1])

def delete_quick_note(note_id: int) -> bool:
    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                DELETE FROM quick_notes
                WHERE id = %s
                RETURNING id;
                """,
                (note_id,)
            )
            row = cursor.fetchone()
            return row is not None