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

from backend.app.core.database import SessionLocal
from backend.app.models.job import Job

from backend.app.retrieval.vector_store import (
    create_collection,
    upsert_job,
    semantic_search,
)


# ============================================================
# TEST
# ============================================================

def test_vector_store():

    print("=" * 60)
    print("VECTOR STORE TEST")
    print("=" * 60)

    db = SessionLocal()

    try:

        # ----------------------------------------------------
        # Create Qdrant collection
        # ----------------------------------------------------

        create_collection()

        print("\nQdrant collection ready.")

        # ----------------------------------------------------
        # Get 10 jobs from PostgreSQL
        # ----------------------------------------------------

        jobs = (
            db.query(Job)
            .order_by(Job.id)
            .limit(10)
            .all()
        )

        print(
            f"Found {len(jobs)} jobs in PostgreSQL."
        )

        # ----------------------------------------------------
        # Index the 10 jobs
        # ----------------------------------------------------

        for job in jobs:

            print(
                f"Indexing: "
                f"{job.title} | {job.company}"
            )

            upsert_job(job)

        print(
            "\nSuccessfully indexed "
            f"{len(jobs)} jobs into Qdrant."
        )

        # ----------------------------------------------------
        # Semantic search
        # ----------------------------------------------------

        query = (
            "Python Data Scientist "
            "with machine learning experience"
        )

        print("\n" + "=" * 60)
        print("SEMANTIC SEARCH TEST")
        print("=" * 60)

        print(f"\nQuery: {query}")

        results = semantic_search(
            query,
            limit=5,
        )

        print(
            f"\nResults returned: {len(results)}"
        )

        # ----------------------------------------------------
        # Display results
        # ----------------------------------------------------

        for index, result in enumerate(
            results,
            start=1,
        ):

            payload = result.payload or {}

            print(
                f"\n{index}. "
                f"{payload.get('title')}"
            )

            print(
                f"   Company: "
                f"{payload.get('company')}"
            )

            print(
                f"   Location: "
                f"{payload.get('location')}"
            )

            print(
                f"   Score: "
                f"{result.score:.4f}"
            )

        print("\n" + "=" * 60)
        print("VECTOR STORE TEST COMPLETE")
        print("=" * 60)

    except Exception as error:

        print("\nVECTOR STORE TEST FAILED")
        print("-" * 60)
        print(error)
        print("-" * 60)

        raise

    finally:

        db.close()


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    test_vector_store()