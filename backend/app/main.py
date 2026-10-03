from fastapi import FastAPI

app = FastAPI()

media_storage: dict[str, list[str]] = {}

#not at all useful or correct yet, getting the baseline in
login_storage: dict[str, list[str]] = {}

@app.get("/")
def root():
    return {"message": "Backend for SIFT project is running"}