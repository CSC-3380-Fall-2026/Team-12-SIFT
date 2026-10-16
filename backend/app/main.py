from fastapi import FastAPI

app = FastAPI()

media_storage: dict[str, list[str]] = {}

@app.get("/")
def root():
    return {"message": "Backend for SIFT project is running"}