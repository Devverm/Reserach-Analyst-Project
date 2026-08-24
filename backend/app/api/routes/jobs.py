from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.models.job import Job
from backend.app.schemas.job import (
    JobListResponse,
    JobResponse,
)

from backend.app.retrieval.retriever import retrieve_jobs
from backend.app.retrieval.ranking import rank_jobs


router = APIRouter(
    prefix="/api/jobs",
    tags=["Jobs"],
)


# ============================================================
# STANDARD SEARCH + FILTERS
# ============================================================

@router.get(
    "",
    response_model=JobListResponse,
)
def search_jobs(
    q: str | None = Query(
        default=None,
        description="Search by job title, company, description or domain",
    ),

    location: str | None = Query(
        default=None,
        description="Filter by location",
    ),

    employment_type: str | None = Query(
        default=None,
        description="Filter by employment type",
    ),

    domain: str | None = Query(
        default=None,
        description="Filter by job domain",
    ),

    skill: str | None = Query(
        default=None,
        description="Filter by skill",
    ),

    source: str | None = Query(
        default=None,
        description="Filter by job source/platform (e.g. LinkedIn, Naukri, Indeed)",
    ),

    min_experience: int | None = Query(
        default=None,
        ge=0,
        description="Minimum required experience",
    ),

    max_experience: int | None = Query(
        default=None,
        ge=0,
        description="Maximum required experience",
    ),

    location_type: str | None = Query(
        default=None,
        description="Remote, Hybrid or Onsite",
    ),

    limit: int = Query(
        default=20,
        ge=1,
        le=100,
    ),

    offset: int = Query(
        default=0,
        ge=0,
    ),

    db: Session = Depends(get_db),
):
    """
    Search and filter jobs using PostgreSQL.
    """

    query = db.query(Job)

    # ========================================================
    # TEXT SEARCH
    # ========================================================

    if q:

        search_term = f"%{q.strip()}%"

        query = query.filter(
            or_(
                Job.title.ilike(search_term),
                Job.company.ilike(search_term),
                Job.description.ilike(search_term),
                Job.domain.ilike(search_term),
            )
        )

    # ========================================================
    # LOCATION
    # ========================================================

    if location:

        query = query.filter(
            Job.location.ilike(
                f"%{location.strip()}%"
            )
        )

    # ========================================================
    # EMPLOYMENT TYPE
    # ========================================================

    if employment_type:

        query = query.filter(
            Job.employment_type.ilike(
                employment_type.strip()
            )
        )

    # ========================================================
    # DOMAIN
    # ========================================================

    if domain:

        query = query.filter(
            Job.domain.ilike(
                domain.strip()
            )
        )

    # ========================================================
    # SKILL
    # ========================================================

    if skill:

        query = query.filter(
            Job.skills.any(
                skill.strip()
            )
        )

    # ========================================================
    # SOURCE
    # ========================================================

    if source:

        query = query.filter(
            Job.source.ilike(
                source.strip()
            )
        )

    # ========================================================
    # LOCATION TYPE
    # ========================================================

    if location_type:

        query = query.filter(
            Job.location_type.any(
                location_type.strip()
            )
        )

    # ========================================================
    # EXPERIENCE
    # ========================================================

    if min_experience is not None:

        query = query.filter(
            or_(
                Job.max_experience.is_(None),
                Job.max_experience >= min_experience,
            )
        )

    if max_experience is not None:

        query = query.filter(
            or_(
                Job.min_experience.is_(None),
                Job.min_experience <= max_experience,
            )
        )

    # ========================================================
    # TOTAL COUNT
    # ========================================================

    total = query.with_entities(
        func.count(Job.id)
    ).scalar()

    # ========================================================
    # PAGINATION
    # ========================================================

    jobs = (
        query
        .order_by(
            Job.posted_at.desc().nullslast(),
            Job.id.desc(),
        )
        .offset(offset)
        .limit(limit)
        .all()
    )

    return JobListResponse(
        total=total or 0,
        limit=limit,
        offset=offset,
        jobs=jobs,
    )


# ============================================================
# AI SEMANTIC SEARCH
# ============================================================

@router.get(
    "/semantic-search",
)
def semantic_job_search(
    q: str = Query(
        ...,
        min_length=2,
        description=(
            "Natural language job search query"
        ),
    ),

    limit: int = Query(
        default=20,
        ge=1,
        le=50,
        description="Number of semantic candidates to retrieve",
    ),

    skill: str | None = Query(
        default=None,
        description="Optional skill to improve ranking",
    ),

    location: str | None = Query(
        default=None,
        description="Optional location to improve ranking",
    ),

    source: str | None = Query(
        default=None,
        description="Optional source/platform filter (e.g. LinkedIn, Naukri, Indeed)",
    ),

    experience: int | None = Query(
        default=None,
        ge=0,
        description="User experience in years",
    ),

    db: Session = Depends(get_db),
):
    """
    AI-powered semantic job search.

    Uses:
        1. Sentence Transformer embeddings
        2. Qdrant vector similarity search
        3. Hybrid ranking

    If a source filter is provided, retrieval limit is widened
    before ranking so that filtering by source afterward still
    returns a full page of results.
    """

    # ========================================================
    # RETRIEVE SEMANTIC CANDIDATES
    # ========================================================

    retrieval_limit = limit

    if source:
        # Qdrant doesn't store source in its payload, so we
        # over-fetch candidates here and filter by source
        # against Postgres afterward.
        retrieval_limit = min(limit * 3, 150)

    jobs = retrieve_jobs(
        query=q,
        limit=retrieval_limit,
    )

    # ========================================================
    # FILTER BY SOURCE (via Postgres lookup)
    # ========================================================

    if source and jobs:

        job_ids = [
            job.get("id")
            for job in jobs
            if job.get("id") is not None
        ]

        source_by_id = dict(
            db.query(Job.id, Job.source)
            .filter(Job.id.in_(job_ids))
            .all()
        )

        source_normalized = source.strip().lower()

        jobs = [
            job
            for job in jobs
            if (
                source_by_id.get(job.get("id"))
                and source_by_id.get(job.get("id")).strip().lower()
                == source_normalized
            )
        ]

        jobs = jobs[:limit]

    # ========================================================
    # PREPARE RANKING SIGNALS
    # ========================================================

    requested_skills = []

    if skill:
        requested_skills = [
            skill.strip()
        ]

    # ========================================================
    # RANK RESULTS
    # ========================================================

    ranked_jobs = rank_jobs(
        jobs=jobs,
        requested_skills=requested_skills,
        requested_roles=[],
        requested_location=location,
        requested_experience=experience,
    )

    # ========================================================
    # RETURN RESPONSE
    # ========================================================

    return {
        "query": q,
        "total": len(ranked_jobs),
        "results": ranked_jobs,
    }


# ============================================================
# LIST AVAILABLE JOB SOURCES (for dropdown filters)
# ============================================================
# NOTE: This route MUST stay above "/{job_id}" below, otherwise
# FastAPI will try to match "sources" as a job_id and fail with
# a 422 error, since job_id is typed as an integer.

@router.get(
    "/sources",
)
def get_job_sources(
    db: Session = Depends(get_db),
):
    """
    Return the list of distinct job sources/platforms currently
    present in the database (e.g. LinkedIn, Naukri, Indeed,
    Internshala), for populating a filter dropdown.
    """

    rows = (
        db.query(Job.source)
        .filter(Job.source.isnot(None))
        .distinct()
        .order_by(Job.source.asc())
        .all()
    )

    sources = [row[0] for row in rows if row[0]]

    return {
        "sources": sources,
    }


# ============================================================
# GET SINGLE JOB
# ============================================================

@router.get(
    "/{job_id}",
    response_model=JobResponse,
)
def get_job(
    job_id: int,
    db: Session = Depends(get_db),
):
    """
    Get a single job by database ID.
    """

    job = (
        db.query(Job)
        .filter(
            Job.id == job_id
        )
        .first()
    )

    if not job:

        raise HTTPException(
            status_code=404,
            detail="Job not found",
        )

    return job