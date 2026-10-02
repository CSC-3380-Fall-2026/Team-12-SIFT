from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Backend for SIFT project is running"}