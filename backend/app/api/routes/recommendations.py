from typing import Any

from fastapi import APIRouter, HTTPException, Query

from backend.app.services.recommendation_service import (
    get_recommendations,
)


router = APIRouter(
    prefix="/api/recommendations",
    tags=["Recommendations"],
)


@router.get("")
def recommendations(
    profile: str = Query(
        ...,
        min_length=1,
        description="User profile or job preferences",
    ),
    limit: int = Query(
        default=10,
        ge=1,
        le=20,
        description="Number of recommendations",
    ),
) -> dict[str, Any]:

    try:
        result = get_recommendations(
            profile=profile,
            limit=limit,
        )

        return result

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Recommendation generation failed: {str(exc)}",
        ) from exc