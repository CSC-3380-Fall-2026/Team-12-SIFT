
from fastapi import FastAPI

# Initialize the FastAPI application for the SIFT backend.
app = FastAPI()


# SIFT-7: Per-User Media Storage
#
# This dictionary organizes media identifiers by user ID.
# Each key is a string representing a user ID.
# Each value is a list of strings representing that user's media.
#
# Example:
# media_storage["user123"] = ["photo.jpg", "video.mp4"]
#
# This is temporary, in-memory storage. It does not save actual files
# or persist data after the backend server restarts.
#
# Other backend functions can use this dictionary to associate
# media identifiers with individual users.
media_storage: dict[str, list[str]] = {}


# Root API endpoint.
# GET / returns a JSON message confirming that the backend is running.
@app.get("/")
def root():
    return {"message": "Backend for SIFT project is running"}
