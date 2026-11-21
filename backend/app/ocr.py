import os
import httpx
from fastapi import HTTPException

OCR_URL = "https://api.ocr.space/parse/image"

async def extract_text(file_data: bytes, filename: str) -> str:
    key = os.getenv("OCR_SPACE_API_KEY")
    if not key:
        raise HTTPException(
            status_code=500,
            detail="OCR API key is unconfigured."
        )
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                OCR_URL,
                headers={"apikey": key},
                files={
                    "file": (
                        filename,
                        file_data,
                        "application/octet-stream"
                    )
                },
                data={"OCREngine": "2"}
            )
        response.raise_for_status()
        result = response.json()
        if result.get("IsErroredOnProcessing"):
            error_msg = result.get("ErrorMessage", "Error: Failure in processing OCR.")
            if isinstance(error_msg, list):
                error_msg = ", ".join(str(msg) for msg in error_msg)
            raise HTTPException(
                status_code=422,
                detail=error_msg
            )
        results_parsed = result.get("ParsedResults", [])
        if not results_parsed:
            raise HTTPException(
                status_code=422,
                detail="Unable to extract any text."
            )
        pages_text = []
        for page in results_parsed:
            if page.get("ParsedText") and page.get("ParsedText").strip():
                pages_text.append(page.get("ParsedText").strip())
        if not pages_text:
            raise HTTPException(status_code=422, detail="Warning: Unable to extract any text.")
        extracted_text = "\n".join(pages_text)
        return extracted_text
    except httpx.HTTPError:
        raise HTTPException(
            status_code=502,
            detail="Unable to communicate with the OCR service. Please try again."
        )