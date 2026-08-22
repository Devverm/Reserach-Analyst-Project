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
    upsert_jobs,
)


# ============================================================
# CONFIGURATION
# ============================================================

# Number of jobs loaded from PostgreSQL at a time
DB_BATCH_SIZE = 500

# Number of texts embedded together
EMBEDDING_BATCH_SIZE = 64


# ============================================================
# INDEX JOBS
# ============================================================

def index_jobs():

    print("=" * 70)
    print("JOB VECTOR INDEXING")
    print("=" * 70)

    db = SessionLocal()

    try:

        # ----------------------------------------------------
        # Create Qdrant collection
        # ----------------------------------------------------

        create_collection()

        print("\nQdrant collection ready.")

        # ----------------------------------------------------
        # Count total jobs
        # ----------------------------------------------------

        total_jobs = (
            db.query(Job)
            .count()
        )

        print(
            f"Total jobs in PostgreSQL: "
            f"{total_jobs:,}"
        )

        # ----------------------------------------------------
        # Counters
        # ----------------------------------------------------

        indexed = 0
        errors = 0

        # ----------------------------------------------------
        # KEYSET PAGINATION
        # ----------------------------------------------------
        #
        # Instead of:
        #
        # OFFSET 500
        # OFFSET 1000
        # OFFSET 1500
        #
        # we use:
        #
        # WHERE id > last_id
        #
        # This is more efficient for large datasets.
        # ----------------------------------------------------

        last_id = 0

        while True:

            # ------------------------------------------------
            # Fetch next batch
            # ------------------------------------------------

            jobs = (
                db.query(Job)
                .filter(Job.id > last_id)
                .order_by(Job.id)
                .limit(DB_BATCH_SIZE)
                .all()
            )

            # ------------------------------------------------
            # No more jobs
            # ------------------------------------------------

            if not jobs:
                break

            first_id = jobs[0].id
            last_batch_id = jobs[-1].id

            print(
                "\nProcessing database IDs "
                f"{first_id:,} - {last_batch_id:,}"
            )

            # ------------------------------------------------
            # Generate embeddings and upsert to Qdrant
            # ------------------------------------------------

            try:

                count = upsert_jobs(
                    jobs,
                    embedding_batch_size=EMBEDDING_BATCH_SIZE,
                )

                indexed += count

                print(
                    f"Indexed: "
                    f"{indexed:,} / "
                    f"{total_jobs:,}"
                )

            except Exception as error:

                print("\nERROR processing batch:")
                print(error)

                # ------------------------------------------------
                # If a batch fails, try each job individually.
                # This prevents one bad record from stopping
                # the entire indexing process.
                # ------------------------------------------------

                for job in jobs:

                    try:

                        upsert_jobs(
                            [job],
                            embedding_batch_size=1,
                        )

                        indexed += 1

                    except Exception as job_error:

                        errors += 1

                        print(
                            f"\nFailed job ID: {job.id}"
                        )

                        print(
                            f"Title: {job.title}"
                        )

                        print(
                            f"Error: {job_error}"
                        )

                print(
                    f"\nRecovered from batch failure."
                )

                print(
                    f"Indexed: "
                    f"{indexed:,} / "
                    f"{total_jobs:,}"
                )

            # ------------------------------------------------
            # Move to next batch
            # ------------------------------------------------

            last_id = last_batch_id

        # ----------------------------------------------------
        # FINAL SUMMARY
        # ----------------------------------------------------

        print("\n" + "=" * 70)
        print("VECTOR INDEXING COMPLETE")
        print("=" * 70)

        print(
            f"Total jobs in PostgreSQL: "
            f"{total_jobs:,}"
        )

        print(
            f"Successfully indexed:     "
            f"{indexed:,}"
        )

        print(
            f"Errors:                    "
            f"{errors:,}"
        )

        print("=" * 70)

    finally:

        db.close()


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    index_jobs()