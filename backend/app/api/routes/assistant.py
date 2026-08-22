from typing import Any

from fastapi import APIRouter, HTTPException, Query

from backend.app.services.assistant_service import (
    process_assistant_query,
)


router = APIRouter(
    prefix="/api/assistant",
    tags=["AI Assistant"],
)


@router.get("")
def assistant_search(
    q: str = Query(
        ...,
        min_length=1,
        description="Natural-language job search query",
    ),
    limit: int = Query(
        default=10,
        ge=1,
        le=20,
        description="Number of jobs to return",
    ),
) -> dict[str, Any]:

    try:
        result = process_assistant_query(
            query=q,
            limit=limit,
        )

        return result

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Assistant search failed: {str(exc)}",
        ) from exc
