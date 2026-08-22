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
# RESET JOB TABLE
# ============================================================

def reset_jobs():

    print("=" * 60)
    print("RESET JOB TABLE")
    print("=" * 60)

    db = SessionLocal()

    try:

        count = db.query(Job).count()

        print(f"\nCurrent jobs in database: {count}")

        if count == 0:

            print("Database is already empty.")
            return

        confirmation = input(
            "\nDelete ALL jobs from the jobs table? "
            "Type YES to continue: "
        )

        if confirmation != "YES":

            print("\nReset cancelled.")

            return

        db.query(Job).delete(
            synchronize_session=False
        )

        db.commit()

        print("\nAll test jobs have been removed.")

        remaining = db.query(Job).count()

        print(
            f"Remaining jobs in database: {remaining}"
        )

    except Exception as error:

        db.rollback()

        print("\nRESET FAILED")
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
    reset_jobs()