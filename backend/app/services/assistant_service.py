from typing import Any

from backend.app.retrieval.retriever import retrieve_jobs
from backend.app.retrieval.ranking import rank_jobs


def process_assistant_query(
    query: str,
    limit: int = 10,
    requested_skills=None,
    requested_roles=None,
    requested_location=None,
    requested_experience=None,
) -> dict[str, Any]:
    """
    Process a natural-language job search request.

    Flow:

        User Query
            ↓
        Semantic Retrieval
            ↓
        Qdrant
            ↓
        Retrieved Jobs
            ↓
        Structured Ranking
            ↓
        Final Results
    """

    # ========================================================
    # VALIDATE QUERY
    # ========================================================

    if not query or not query.strip():
        return {
            "query": query,
            "total": 0,
            "jobs": [],
            "message": "Please provide a job search query.",
        }

    cleaned_query = query.strip()

    # ========================================================
    # SEMANTIC RETRIEVAL
    # ========================================================

    retrieved_jobs = retrieve_jobs(
        query=cleaned_query,
        limit=max(limit, 20),
    )

    if not retrieved_jobs:
        return {
            "query": cleaned_query,
            "total": 0,
            "jobs": [],
            "message": "No relevant jobs were found.",
        }

    # ========================================================
    # RANKING
    # ========================================================

    ranked_jobs = rank_jobs(
        jobs=retrieved_jobs,
        requested_skills=requested_skills,
        requested_roles=requested_roles,
        requested_location=requested_location,
        requested_experience=requested_experience,
    )

    # ========================================================
    # TOP RESULTS
    # ========================================================

    ranked_jobs = ranked_jobs[:limit]

    return {
        "query": cleaned_query,
        "total": len(ranked_jobs),
        "jobs": ranked_jobs,
        "message": "Jobs retrieved successfully.",
    }
