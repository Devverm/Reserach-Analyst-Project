from io import BytesIO

from pypdf import PdfReader
from docx import Document

from backend.app.services.recommendation_service import (
    get_recommendations,
)


# ============================================================
# EXTRACT TEXT FROM PDF
# ============================================================

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract text from a PDF resume.
    """

    pdf_file = BytesIO(file_bytes)

    reader = PdfReader(pdf_file)

    pages_text = []

    for page in reader.pages:
        text = page.extract_text()

        if text:
            pages_text.append(text)

    return "\n".join(pages_text).strip()


# ============================================================
# EXTRACT TEXT FROM DOCX
# ============================================================

def extract_text_from_docx(file_bytes: bytes) -> str:
    """
    Extract text from a DOCX resume.
    """

    docx_file = BytesIO(file_bytes)

    document = Document(docx_file)

    paragraphs = []

    for paragraph in document.paragraphs:

        text = paragraph.text.strip()

        if text:
            paragraphs.append(text)

    return "\n".join(paragraphs).strip()


# ============================================================
# PROCESS RESUME
# ============================================================

def process_resume(
    filename: str,
    file_bytes: bytes,
    limit: int = 10,
) -> dict:
    """
    Process an uploaded resume and generate
    personalized job recommendations.

    Supported formats:
    - PDF
    - DOCX
    """

    # ========================================================
    # VALIDATE FILE
    # ========================================================

    if not filename:
        raise ValueError(
            "Filename is required."
        )

    extension = (
        filename
        .lower()
        .split(".")[-1]
    )

    # ========================================================
    # EXTRACT RESUME TEXT
    # ========================================================

    if extension == "pdf":

        text = extract_text_from_pdf(
            file_bytes
        )

    elif extension == "docx":

        text = extract_text_from_docx(
            file_bytes
        )

    else:

        raise ValueError(
            "Unsupported file format. "
            "Please upload a PDF or DOCX resume."
        )

    # ========================================================
    # VALIDATE EXTRACTED TEXT
    # ========================================================

    if not text:

        raise ValueError(
            "Could not extract any text from the resume."
        )

    # ========================================================
    # GENERATE JOB RECOMMENDATIONS
    # ========================================================

    recommendations = get_recommendations(
        profile=text,
        limit=limit,
    )

    # ========================================================
    # RETURN RESULT
    # ========================================================

    return {
        "filename": filename,

        "characters": len(text),

        "text": text,

        "recommendations": recommendations,

        "message": (
            "Resume processed and job "
            "recommendations generated successfully."
        ),
    }