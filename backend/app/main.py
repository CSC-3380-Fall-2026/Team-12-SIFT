# FastAPI routes and http status handling

from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.responses import Response
from uuid import UUID

"""
from backend.app.annotations import (
    create_annotation,
    get_annotations,
    update_annotation,
    delete_annotation,
)
"""

from backend.app.media import(
    get_media,
    saved_media,
)

from backend.app.schemas import(
    """
    Annotation,
    AnnotationCreate,
    AnnotationUpdate,
    """
    Media,
)


app = FastAPI()

#max size for uploads (10MB)
MAX_UPLOAD_BYTES = 10 * 1024 * 1024 

#allowed file types
ALLOWED_TYPES = {
    "png": ("image", "image/png"),
    "jpg": ("image", "image/jpg"),
    "jpeg": ("image", "image/jpeg"),
    "pdf": ("document", "application/pdf"),
    "txt": ("document", "text/plain"),
}

#allowed file bytes for further checking
ALLOWED_BYTES = {
    "png": b"\x89PNG\r\n\x1a\n",
    "jpg": b"\xff\xd8\xff",
    "jpeg": b"\xff\xd8\xff",
    "pdf": b"%PDF-",
}

#checks if type matches bytes
def type_match_byte(extension: str, file_data: bytes) -> bool:
    return file_data.startswith(ALLOWED_BYTES[extension])

#root
@app.get("/")
def root():
    return {"message": "Backend for SIFT project is running"}

#media
#status 201 means 'created'
@app.post("/media", response_model=Media, status_code=201)
async def upload_media(file: UploadFile = File(...)):
    #reads name and extracts the type (such as pdf or txt) 
    #calls it upload if theres no name provided
    filename = file.filename or "upload"
    extension = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    #checks that extension matches allowed types
    #415 means type not supported
    if extension not in ALLOWED_TYPES:
        raise HTTPException(status_code=415, detail="Unsupported File type")

    #checks that the file is correct size (413= too big) and also not empty(400= bad req)
    file_data = await file.read(MAX_UPLOAD_BYTES + 1)
    if len(file_data)>MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="File exceeds size limit")
    if len(file_data)==0:
        raise HTTPException(status_code=400, detail="File is empty")

    #checks that extension/type actually matches byte/content
    if not type_match_byte(extension, file_data):
        raise HTTPException(status_code=415, detail="File contents do not match type")

    #looks up types and saves after everything checks
    media_type, content_type = ALLOWED_TYPES[extension]

    #uses the tables for fastapi to convert to json
    return saved_media(
        media_type = media_type,
        filename = filename,
        content_type = content_type,
        file_data = file_data,
    )

#this is to download a previously uploaded file
@app.get("/media/{media_id}")
def get_media_endpoint(media_id: UUID):
    stored = get_media(media_id)

    if stored is None:
        raise HTTPException(status_code=404, detail="media not found")

    #sends file bytes back so teh browser displays correctly according to type
    return Response(
        content = stored.file_data,
        media_type= stored.content_type,
        headers = {"Content-Disposition": f'inline; filename="{stored.filename}"'},
    )

"""
#creates annotation
@app.post("/annotations", response_model=Annotation, status_code=201)
def create_annotation_endpoint(annotation: AnnotationCreate):
    return create_annotation(annotation)

#lists annotations attached to a media item
@app.get("/annotations/{media_id}", response_model=list[Annotation])
def get_annotations_endpoint(media_id: str):
    return get_annotations(media_id)

#change annotations text
@app.put("/annotations/{annotation_id}", response_model=Annotation)
def update_annotation_endpoint(
    annotation_id: int,
    update: AnnotationUpdate,
):
    annotation = update_annotation(annotation_id, update)

    if annotation is None:
        raise HTTPException(status_code=404, detail="Annotation not found")

    return annotation

#remove annotation
@app.delete("/annotations/{annotation_id}")
def delete_annotation_endpoint(annotation_id: int):
    deleted = delete_annotation(annotation_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Annotation not found")

    return {"message": "Annotation deleted successfully"}
    """