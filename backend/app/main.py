
# FastAPI provides the framework for creating HTTP API endpoints.
# HTTPException allows endpoints to return HTTP errors, such as 404
# when a requested annotation does not exist.
from fastapi import FastAPI, HTTPException

# Import the annotation data models and database functions.
# The models define the data accepted and returned by the API.
# The functions in annotations.py perform the actual database operations.
#
# Keeping the database logic separate from the API endpoints makes
# the backend easier to understand, test, and maintain.
from backend.app.annotations import (
    Annotation,
    AnnotationCreate,
    AnnotationUpdate,
    create_annotation,
    get_annotations,
    update_annotation,
    delete_annotation,
)


# Create the FastAPI application instance.
# The decorators below register HTTP routes with this application.
#
# When the backend server starts, FastAPI uses this instance to
# receive incoming requests and direct them to the correct function.
app = FastAPI()

media_storage: dict[str, list[str]] = {}

# GET /
#
# This is the backend's root endpoint.
# It returns a JSON message confirming that the application is running.
#
# Developers can visit this route to check whether the API server
# is responding. It does not query the database.
@app.get("/")
def root():
    return {"message": "Backend for SIFT project is running"}


# POST /annotations
#
# Creates a new annotation for a media item.
#
# FastAPI reads the incoming JSON request body and validates it
# against the AnnotationCreate model. This requires the user ID,
# media ID, annotation text, and x/y coordinates.
#
# After validation, the endpoint calls create_annotation() from
# annotations.py to insert the annotation into PostgreSQL.
#
# The database function returns the saved annotation, including
# its generated ID. FastAPI returns it as JSON with HTTP status 201.
#
# Use this endpoint when the frontend needs to save a new annotation.
@app.post("/annotations", response_model=Annotation, status_code=201)
def create_annotation_endpoint(annotation: AnnotationCreate):
    return create_annotation(annotation)


# GET /annotations/{media_id}
#
# Retrieves annotations belonging to a specific media item.
#
# FastAPI extracts media_id from the URL and passes it to
# get_annotations(), which queries the PostgreSQL database.
#
# The response_model specifies that the endpoint returns a list
# of Annotation objects. FastAPI serializes the list into JSON.
#
# If no annotations exist for that media ID, an empty list is returned.
#
# Use this endpoint when displaying annotations for a selected media item.
@app.get("/annotations/{media_id}", response_model=list[Annotation])
def get_annotations_endpoint(media_id: str):
    return get_annotations(media_id)


# PUT /annotations/{annotation_id}
#
# Updates the text and position of an existing annotation.
#
# FastAPI reads annotation_id from the URL and validates the JSON
# request body using the AnnotationUpdate model.
#
# The endpoint calls update_annotation() to modify the database row.
# If the database function returns None, the requested ID was not
# found, so HTTPException returns a 404 response.
#
# Otherwise, the updated Annotation object is returned as JSON.
#
# Use this endpoint when a user edits an annotation or moves its position.
@app.put("/annotations/{annotation_id}", response_model=Annotation)
def update_annotation_endpoint(
    annotation_id: int,
    update: AnnotationUpdate,
):
    annotation = update_annotation(annotation_id, update)

    if annotation is None:
        raise HTTPException(status_code=404, detail="Annotation not found")

    return annotation


# DELETE /annotations/{annotation_id}
#
# Deletes an existing annotation using its database ID.
#
# FastAPI extracts annotation_id from the URL and calls
# delete_annotation() to remove the matching PostgreSQL record.
#
# The database function returns True when a record was deleted
# and False when the ID was not found.
#
# If the annotation does not exist, this endpoint returns HTTP 404.
# Otherwise, it returns a JSON message confirming successful deletion.
#
# Use this endpoint when a user removes an annotation from a media item.
@app.delete("/annotations/{annotation_id}")
def delete_annotation_endpoint(annotation_id: int):
    deleted = delete_annotation(annotation_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Annotation not found")

    return {"message": "Annotation deleted successfully"}
