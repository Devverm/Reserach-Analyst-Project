from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.routes.jobs import router as jobs_router
from backend.app.api.routes.assistant import (
    router as assistant_router,
)
from backend.app.api.routes.recommendations import (
    router as recommendations_router,
)
from backend.app.api.resume import (
    router as resume_router,
)


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="AI Powered Job Board",
    description="AI-powered job search and recommendation platform",
    version="1.0.0",
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# ROUTERS
# ============================================================

app.include_router(
    jobs_router
)

app.include_router(
    assistant_router
)

app.include_router(
    recommendations_router
)

app.include_router(
    resume_router
)


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "AI Powered Job Board API is running",
        "status": "healthy",
    }