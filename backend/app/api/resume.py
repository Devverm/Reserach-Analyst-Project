from typing import Any

from fastapi import APIRouter, File, HTTPException, UploadFile

from backend.app.services.resume_service import (
    process_resume,
)


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/api/resume",
    tags=["Resume"],
)


# ============================================================
# RESUME UPLOAD
# ============================================================

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
) -> dict[str, Any]:
    """
    Upload and process a resume.

    Supported formats:
    - PDF
    - DOCX
    """

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No filename provided.",
        )

    filename = file.filename.lower()

    # --------------------------------------------------------
    # Validate file type
    # --------------------------------------------------------

    if not (
        filename.endswith(".pdf")
        or filename.endswith(".docx")
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file format. "
                "Please upload a PDF or DOCX resume."
            ),
        )

    try:
        # ----------------------------------------------------
        # Read uploaded file
        # ----------------------------------------------------

        file_bytes = await file.read()

        if not file_bytes:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty.",
            )

        # ----------------------------------------------------
        # Process resume
        # ----------------------------------------------------

        result = process_resume(
            filename=file.filename,
            file_bytes=file_bytes,
        )

        return result

    except HTTPException:
        raise

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=f"Resume processing failed: {str(exc)}",
        ) from exc