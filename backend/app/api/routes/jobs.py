from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_, func, or_
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.models.job import Job
from backend.app.schemas.job import (
    JobListResponse,
    JobResponse,
)

from backend.app.retrieval.retriever import retrieve_jobs
from backend.app.retrieval.ranking import rank_jobs

from backend.app.utils.normalization import normalize_source


router = APIRouter(
    prefix="/api/jobs",
    tags=["Jobs"],
)


# Platform names that the existing normalize_source() function
# recognizes explicitly. Anything else it returns is just the
# raw source title-cased, so for dropdown/filtering purposes we
# bucket everything outside this list into a single "Other"
# category to keep the filter usable.
KNOWN_PLATFORMS = [
    "LinkedIn",
    "Internshala",
    "Indeed",
    "Naukri",
    "Glassdoor",
    "BeBee",
    "GrabJobs",
]

OTHER_LABEL = "Other"


def _normalized_category(raw_source: str | None) -> str:
    """
    Normalize a raw source string down to one of the known
    platform categories, or "Other" if normalize_source() didn't
    recognize it as a specific platform.
    """

    normalized = normalize_source(raw_source)

    if normalized in KNOWN_PLATFORMS:
        return normalized

    return OTHER_LABEL


def _apply_source_filter(query, source: str):
    """
    Filter a Job query by a normalized/canonical source category
    (e.g. "LinkedIn", "Naukri", "Other"), matching against the
    messy underlying raw source strings.
    """

    source_clean = source.strip()

    if source_clean == OTHER_LABEL:
        # "Other" = doesn't match any known platform keyword.
        exclusions = [
            Job.source.ilike(f"%{platform}%")
            for platform in KNOWN_PLATFORMS
        ]
        return query.filter(and_(*[~cond for cond in exclusions]))

    # Known platform: match any raw source containing that keyword.
    return query.filter(Job.source.ilike(f"%{source_clean}%"))


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
        description="Filter by normalized job source/platform (e.g. LinkedIn, Naukri, Indeed, Other)",
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
        query = query.filter(Job.location.ilike(f"%{location.strip()}%"))

    # ========================================================
    # EMPLOYMENT TYPE
    # ========================================================

    if employment_type:
        query = query.filter(Job.employment_type.ilike(employment_type.strip()))

    # ========================================================
    # DOMAIN
    # ========================================================

    if domain:
        query = query.filter(Job.domain.ilike(domain.strip()))

    # ========================================================
    # SKILL
    # ========================================================

    if skill:
        query = query.filter(Job.skills.any(skill.strip()))

    # ========================================================
    # SOURCE (normalized)
    # ========================================================

    if source:
        query = _apply_source_filter(query, source)

    # ========================================================
    # LOCATION TYPE
    # ========================================================

    if location_type:
        query = query.filter(Job.location_type.any(location_type.strip()))

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

    total = query.with_entities(func.count(Job.id)).scalar()

    # ========================================================
    # PAGINATION
    # ========================================================

    jobs = (
        query.order_by(
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
        description=("Natural language job search query"),
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
        description="Optional normalized source/platform filter (e.g. LinkedIn, Naukri, Indeed, Other)",
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
    before ranking so that filtering by normalized source
    afterward still returns a full page of results.
    """

    # ========================================================
    # RETRIEVE SEMANTIC CANDIDATES
    # ========================================================

    retrieval_limit = limit

    if source:
        # Qdrant doesn't store source in its payload, so we
        # over-fetch candidates here and filter by normalized
        # source against Postgres afterward.
        retrieval_limit = min(limit * 3, 150)

    jobs = retrieve_jobs(
        query=q,
        limit=retrieval_limit,
    )

    # ========================================================
    # FILTER BY NORMALIZED SOURCE (via Postgres lookup)
    # ========================================================

    if source and jobs:
        job_ids = [job.get("id") for job in jobs if job.get("id") is not None]

        raw_source_by_id = dict(
            db.query(Job.id, Job.source).filter(Job.id.in_(job_ids)).all()
        )

        source_target = source.strip()

        jobs = [
            job
            for job in jobs
            if _normalized_category(raw_source_by_id.get(job.get("id")))
            == source_target
        ]

        jobs = jobs[:limit]

    # ========================================================
    # PREPARE RANKING SIGNALS
    # ========================================================

    requested_skills = []

    if skill:
        requested_skills = [skill.strip()]

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
# LIST AVAILABLE JOB SOURCES (normalized, for dropdown filters)
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
    Return the list of clean, normalized job source/platform
    categories currently present in the database (e.g. LinkedIn,
    Naukri, Indeed, Internshala, Glassdoor, Other), for populating
    a filter dropdown.

    The underlying `source` column contains hundreds of messy raw
    scraper site names, so this endpoint normalizes them down to a
    small set of recognizable categories rather than returning the
    raw values directly.
    """

    rows = (
        db.query(Job.source)
        .filter(Job.source.isnot(None))
        .distinct()
        .all()
    )

    normalized = {_normalized_category(row[0]) for row in rows}

    # Keep known platforms in a fixed, sensible order; only include
    # ones that actually have at least one job. "Other" goes last,
    # only if there are jobs that didn't match a known platform.
    ordered_sources = [
        platform for platform in KNOWN_PLATFORMS if platform in normalized
    ]

    if OTHER_LABEL in normalized:
        ordered_sources.append(OTHER_LABEL)

    return {
        "sources": ordered_sources,
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

    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found",
        )

    return job