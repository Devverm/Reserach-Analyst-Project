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


# ============================================================
# VERIFY DATABASE
# ============================================================

def verify_database():

    print("=" * 70)
    print("DATABASE VERIFICATION")
    print("=" * 70)

    db = SessionLocal()

    try:

        # ----------------------------------------------------
        # Total records
        # ----------------------------------------------------

        total_jobs = db.query(Job).count()

        print(f"\nTotal jobs in database: {total_jobs}")

        # ----------------------------------------------------
        # Display first 10 jobs
        # ----------------------------------------------------

        jobs = (
            db.query(Job)
            .order_by(Job.id)
            .limit(10)
            .all()
        )

        print("\n" + "=" * 70)
        print("STORED JOBS")
        print("=" * 70)

        for job in jobs:

            print("\n" + "-" * 70)

            print(f"Database ID:       {job.id}")
            print(f"Source Job ID:     {job.source_job_id}")
            print(f"Source:            {job.source}")
            print(f"Company:           {job.company}")
            print(f"Title:             {job.title}")
            print(f"Domain:            {job.domain}")

            print(
                f"Skills:            "
                f"{job.skills}"
            )

            print(
                f"Roles:             "
                f"{job.roles}"
            )

            print(
                f"Location:          "
                f"{job.location}"
            )

            print(
                f"Location Type:     "
                f"{job.location_type}"
            )

            print(
                f"Employment Type:   "
                f"{job.employment_type}"
            )

            print(
                f"Experience:        "
                f"{job.min_experience} - "
                f"{job.max_experience}"
            )

            print(
                f"AI Enriched:       "
                f"{job.ai_enriched}"
            )

        print("\n" + "=" * 70)
        print("DATABASE VERIFICATION COMPLETE")
        print("=" * 70)

    except Exception as error:

        print("\nDATABASE VERIFICATION FAILED")
        print("-" * 70)
        print(error)
        print("-" * 70)

        raise

    finally:

        db.close()


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    verify_database()