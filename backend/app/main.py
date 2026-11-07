from fastapi import FastAPI, HTTPException, UploadFile, File, Response
from backend.app.schemas import UserCreate, Media
from backend.app.users import UserResponse, create_user
from backend.app.annotations import (
    Annotation,
    AnnotationCreate,
    AnnotationUpdate,
    create_annotation,
    get_annotations,
    update_annotation,
    delete_annotation,
)
from backend.app.media import save_media, get_media, get_all_media
from psycopg.errors import UniqueViolation
from uuid import UUID

# start fastapi application
app = FastAPI()

# fastapi endpoint

@app.get("/")
def root():
    return {"message": "SIFT's backend is running!"}

# media endpoints
@app.post("/media", response_model=Media, status_code=201)
async def upload_media_endpoint(file: UploadFile = File(...)):
    filename = file.filename or "unnamed"
    content_type = file.content_type or "application/octet-stream"
    if content_type.startswith("image/"):
        media_type = "image"
    elif content_type in (
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ):
        media_type = "document"
    else:
        raise HTTPException(status_code=415, detail="Unsupported file type")
    file_data = await file.read()
    try:
        return save_media(
            media_type=media_type,
            filename=filename,
            content_type=content_type,
            file_data=file_data,
        )
    finally:
        await file.close()

@app.get("/media", response_model=list[Media])
def get_all_media_endpoint():
    return get_all_media()

@app.get("/media/{media_id}")
def get_media_endpoint(media_id: UUID):
    media = get_media(media_id)
    if media is None:
        raise HTTPException(status_code=404, detail="Media not found")
    return Response(
        content=media.file_data,
        media_type=media.content_type,
    )

# annotation endpoints

@app.post("/annotations", response_model=Annotation, status_code=201)
def create_annotation_endpoint(annotation: AnnotationCreate):
    return create_annotation(annotation)

@app.get("/annotations/{media_id}", response_model=list[Annotation])
def get_annotations_endpoint(media_id: str):
    return get_annotations(media_id)

@app.put("/annotations/{annotation_id}", response_model=Annotation)
def update_annotation_endpoint(annotation_id: int, update: AnnotationUpdate):
    annotation = update_annotation(annotation_id, update)
    if annotation is None:
        raise HTTPException(status_code=404, detail="Annotation not found")
    return annotation

@app.delete("/annotations/{annotation_id}")
def delete_annotation_endpoint(annotation_id: int):
    deleted = delete_annotation(annotation_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Annotation not found")
    return {"message": "Annotation deleted successfully"}

@app.post("/register", response_model=UserResponse, status_code=201)
def register_user(user: UserCreate):
    try:
        return create_user(user)
    except UniqueViolation:
        raise HTTPException(
            status_code=409,
            detail="Username or email address already in use. Please try a different one."
        )