from fastapi import FastAPI, HTTPException

from backend.app.annotations import (
    Annotation,
    AnnotationCreate,
    AnnotationUpdate,
    create_annotation,
    get_annotations,
    update_annotation,
    delete_annotation,
)


app = FastAPI()

media_storage: dict[str, list[str]] = {}

@app.get("/")
def root():
    return {"message": "Backend for SIFT project is running"}


@app.post("/annotations", response_model=Annotation, status_code=201)
def create_annotation_endpoint(annotation: AnnotationCreate):
    return create_annotation(annotation)


@app.get("/annotations/{media_id}", response_model=list[Annotation])
def get_annotations_endpoint(media_id: str):
    return get_annotations(media_id)


@app.put("/annotations/{annotation_id}", response_model=Annotation)
def update_annotation_endpoint(
    annotation_id: int,
    update: AnnotationUpdate,
):
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