import sys
from pathlib import Path


# ============================================================
# PROJECT PATH
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[1]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


# ============================================================
# IMPORT DATABASE
# ============================================================

from backend.app.core.database import engine, Base

# Import models so SQLAlchemy knows about them
from backend.app.models.job import Job


# ============================================================
# CREATE TABLES
# ============================================================

def init_database():

    print("=" * 60)
    print("DATABASE INITIALIZATION")
    print("=" * 60)

    try:

        print("\nConnecting to PostgreSQL...")

        # Test the connection
        with engine.connect() as connection:

            print("PostgreSQL connection successful!")

        print("\nCreating database tables...")

        Base.metadata.create_all(
            bind=engine
        )

        print("Database tables created successfully!")

        print("\nTables:")
        print("  - jobs")

        print("\nDatabase initialization complete.")

    except Exception as error:

        print("\nDATABASE INITIALIZATION FAILED")
        print("-" * 60)
        print(error)
        print("-" * 60)

        raise


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    init_database()