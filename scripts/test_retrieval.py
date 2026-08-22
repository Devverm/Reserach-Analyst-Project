import sys
from pathlib import Path


# ============================================================
# PROJECT PATH
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[1]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


# ============================================================
# IMPORTS
# ============================================================

from backend.app.retrieval.retriever import (
    retrieve_jobs,
)

from backend.app.retrieval.ranking import (
    rank_jobs,
)


# ============================================================
# TEST CONFIGURATION
# ============================================================

QUERY = (
    "Python Data Scientist "
    "with machine learning experience "
    "in Bengaluru"
)

REQUESTED_SKILLS = [
    "Python",
    "Machine Learning",
]

REQUESTED_ROLES = [
    "Data Scientist",
]

REQUESTED_LOCATION = "Bengaluru"

REQUESTED_EXPERIENCE = 3

RETRIEVAL_LIMIT = 20


# ============================================================
# TEST RETRIEVAL + RANKING
# ============================================================

def test_retrieval():

    print("=" * 70)
    print("SEMANTIC RETRIEVAL + RANKING TEST")
    print("=" * 70)

    print(
        f"\nQuery:\n{QUERY}"
    )

    print(
        "\nRetrieving jobs from Qdrant..."
    )

    # --------------------------------------------------------
    # Semantic retrieval
    # --------------------------------------------------------

    jobs = retrieve_jobs(
        query=QUERY,
        limit=RETRIEVAL_LIMIT,
    )

    print(
        f"Retrieved {len(jobs)} jobs."
    )

    if not jobs:

        print(
            "\nNo jobs were returned."
        )

        return

    # --------------------------------------------------------
    # Ranking
    # --------------------------------------------------------

    ranked_jobs = rank_jobs(
        jobs=jobs,
        requested_skills=REQUESTED_SKILLS,
        requested_roles=REQUESTED_ROLES,
        requested_location=REQUESTED_LOCATION,
        requested_experience=REQUESTED_EXPERIENCE,
    )

    # --------------------------------------------------------
    # Display results
    # --------------------------------------------------------

    print("\n" + "=" * 70)
    print("TOP RANKED JOBS")
    print("=" * 70)

    for index, job in enumerate(
        ranked_jobs[:10],
        start=1,
    ):

        print(
            f"\n{index}. "
            f"{job.get('title')}"
        )

        print(
            f"   Company: "
            f"{job.get('company')}"
        )

        print(
            f"   Location: "
            f"{job.get('location')}"
        )

        print(
            f"   Skills: "
            f"{job.get('skills')}"
        )

        print(
            f"   Similarity: "
            f"{job.get('similarity_score', 0):.4f}"
        )

        print(
            f"   Skill Match: "
            f"{job.get('skill_match', 0):.4f}"
        )

        print(
            f"   Role Match: "
            f"{job.get('role_match', 0):.4f}"
        )

        print(
            f"   Location Match: "
            f"{job.get('location_match', 0):.4f}"
        )

        print(
            f"   Experience Match: "
            f"{job.get('experience_match', 0):.4f}"
        )

        print(
            f"   FINAL SCORE: "
            f"{job.get('final_score', 0):.4f}"
        )

    print("\n" + "=" * 70)
    print("RETRIEVAL + RANKING TEST COMPLETE")
    print("=" * 70)


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    test_retrieval()

