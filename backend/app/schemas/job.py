from datetime import datetime

from pydantic import BaseModel, ConfigDict


# ============================================================
# JOB RESPONSE
# ============================================================

class JobResponse(BaseModel):
    """
    Schema used when returning a single job through the API.
    """

    model_config = ConfigDict(
        from_attributes=True
    )

    id: int

    source_job_id: str
    source: str

    company: str
    title: str
    description: str

    domain: str | None = None

    roles: list[str] | None = None
    skills: list[str] | None = None

    location: str | None = None
    location_type: list[str] | None = None

    employment_type: str | None = None
    schedule_type: str | None = None

    min_experience: int | None = None
    max_experience: int | None = None

    min_salary: float | None = None
    max_salary: float | None = None

    apply_url: str | None = None

    posted_at: datetime | None = None
    published_at: datetime | None = None

    ai_enriched: bool
    ai_enrichment_version: str | None = None

    created_at: datetime
    updated_at: datetime


# ============================================================
# JOB LIST RESPONSE
# ============================================================

class JobListResponse(BaseModel):
    """
    Schema used when returning multiple jobs
    with pagination information.
    """

    total: int

    limit: int

    offset: int

    jobs: list[JobResponse]