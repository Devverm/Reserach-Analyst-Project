import json
import sys
from pathlib import Path


import ijson


# ============================================================
# PROJECT PATH
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[1]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


# ============================================================
# PROJECT IMPORTS
# ============================================================

from backend.app.core.database import SessionLocal
from backend.app.models.job import Job

from backend.app.utils.deduplication import (
    create_exact_job_key,
    is_duplicate,
)

from backend.app.utils.normalization import (
    normalize_datetime,
    normalize_experience,
    normalize_location_type,
    normalize_roles,
    normalize_salary,
    normalize_skills,
    normalize_source,
    normalize_text,
)


# ============================================================
# CONFIGURATION
# ============================================================

DATA_PATH = PROJECT_ROOT / "data" / "raw" / "jobs.json"

BATCH_SIZE = 500


# ============================================================
# APPLY URL PARSER
# ============================================================

def parse_apply_url(apply_options):
    """
    Extract an application URL from the raw apply_options field.

    The dataset may contain:
    - a list of dictionaries
    - a JSON string representing a list
    - a single dictionary
    - None
    """

    if not apply_options:
        return None

    # --------------------------------------------------------
    # If apply_options is stored as a JSON string
    # --------------------------------------------------------

    if isinstance(apply_options, str):

        try:
            apply_options = json.loads(
                apply_options
            )

        except (json.JSONDecodeError, TypeError):
            return None

    # --------------------------------------------------------
    # If it is a dictionary
    # --------------------------------------------------------

    if isinstance(apply_options, dict):

        url = (
            apply_options.get("link")
            or apply_options.get("url")
            or apply_options.get("apply_url")
        )

        if url:
            return str(url)

    # --------------------------------------------------------
    # If it is a list
    # --------------------------------------------------------

    if isinstance(apply_options, list):

        for option in apply_options:

            if not isinstance(option, dict):
                continue

            url = (
                option.get("link")
                or option.get("url")
                or option.get("apply_url")
            )

            if url:
                return str(url)

    return None


# ============================================================
# TRANSFORM RAW JOB
# ============================================================

def transform_job(raw_job):
    """
    Convert a raw JSON job record into our canonical
    database structure.
    """

    source_job_id = normalize_text(
        raw_job.get("job_id")
    )

    if not source_job_id:
        raise ValueError(
            "Missing job_id"
        )

    return {
        # ----------------------------------------------------
        # Identification
        # ----------------------------------------------------

        "source_job_id": source_job_id,

        "source": normalize_source(
            raw_job.get("via")
        ),

        # ----------------------------------------------------
        # Basic information
        # ----------------------------------------------------

        "company": normalize_text(
            raw_job.get("company_name")
        ) or "Unknown",

        "title": normalize_text(
            raw_job.get("title")
        ) or "Untitled",

        "description": normalize_text(
            raw_job.get("description")
        ) or "",

        # ----------------------------------------------------
        # Classification
        # ----------------------------------------------------

        "domain": normalize_text(
            raw_job.get("domain")
        ),

        "roles": normalize_roles(
            raw_job.get("roles")
        ),

        "skills": normalize_skills(
            raw_job.get("skills")
        ),

        # ----------------------------------------------------
        # Location
        # ----------------------------------------------------

        "location": normalize_text(
            raw_job.get("location")
        ),

        "location_type": normalize_location_type(
            raw_job.get("locationRequirement")
        ),

        # ----------------------------------------------------
        # Employment
        # ----------------------------------------------------

        "employment_type": normalize_text(
            raw_job.get("employmentType")
        ),

        "schedule_type": normalize_text(
            raw_job.get("schedule_type")
        ),

        # ----------------------------------------------------
        # Experience
        # ----------------------------------------------------

        "min_experience": normalize_experience(
            raw_job.get("minExperienceRequired")
        ),

        "max_experience": normalize_experience(
            raw_job.get("maxExperienceRequired")
        ),

        # ----------------------------------------------------
        # Salary
        # ----------------------------------------------------

        "min_salary": normalize_salary(
            raw_job.get("minSalary")
        ),

        "max_salary": normalize_salary(
            raw_job.get("maxSalary")
        ),

        # ----------------------------------------------------
        # Application
        # ----------------------------------------------------

        "apply_url": parse_apply_url(
            raw_job.get("apply_options")
        ),

        # ----------------------------------------------------
        # Dates
        # ----------------------------------------------------

        "posted_at": normalize_datetime(
            raw_job.get("posted_at")
        ),

        "published_at": normalize_datetime(
            raw_job.get("publishedAt")
        ),

        # ----------------------------------------------------
        # AI enrichment
        # ----------------------------------------------------

        "ai_enriched": bool(
            raw_job.get("informationExtracted")
        ),

        "ai_enrichment_version": None,
    }


# ============================================================
# INSERT BATCH
# ============================================================

def insert_batch(
    db,
    batch,
):
    """
    Insert a batch of jobs.

    First attempts a single transaction for efficiency.

    If the batch fails because of one problematic record,
    rollback the batch and retry the records individually.

    This prevents one bad record from destroying an
    otherwise valid batch.
    """

    if not batch:
        return 0, 0

    # --------------------------------------------------------
    # Fast path: insert entire batch
    # --------------------------------------------------------

    try:

        db.add_all(batch)
        db.commit()

        return len(batch), 0

    except Exception:

        db.rollback()

    # --------------------------------------------------------
    # Safe path: insert records individually
    # --------------------------------------------------------

    inserted = 0
    errors = 0

    for job in batch:

        try:

            db.add(job)
            db.commit()

            inserted += 1

        except Exception as exc:

            db.rollback()

            errors += 1

            print(
                "\nDatabase error for job "
                f"'{job.source_job_id}' "
                f"({job.title}): {exc}"
            )

    return inserted, errors


# ============================================================
# INGEST JOBS
# ============================================================

def ingest_jobs():

    print("=" * 70)
    print("JOB DATA INGESTION")
    print("=" * 70)

    # --------------------------------------------------------
    # Check dataset
    # --------------------------------------------------------

    if not DATA_PATH.exists():

        raise FileNotFoundError(
            f"Dataset not found: {DATA_PATH}"
        )

    file_size_mb = (
        DATA_PATH.stat().st_size
        / (1024 * 1024)
    )

    print(f"\nDataset: {DATA_PATH}")
    print(f"Size: {file_size_mb:.2f} MB")

    # --------------------------------------------------------
    # Database session
    # --------------------------------------------------------

    db = SessionLocal()

    # --------------------------------------------------------
    # Duplicate tracking
    # --------------------------------------------------------

    seen_job_ids = set()
    seen_exact_keys = set()

    # --------------------------------------------------------
    # Batch storage
    # --------------------------------------------------------

    batch = []

    # --------------------------------------------------------
    # Counters
    # --------------------------------------------------------

    processed = 0
    inserted = 0
    duplicates = 0
    errors = 0

    try:

        # ====================================================
        # STREAM JSON FILE
        # ====================================================

        with open(
            DATA_PATH,
            "rb"
        ) as file:

            for raw_job in ijson.items(
                file,
                "item"
            ):

                processed += 1

                try:

                    # ----------------------------------------
                    # Duplicate detection
                    # ----------------------------------------

                    duplicate, reason = is_duplicate(
                        raw_job,
                        seen_job_ids,
                        seen_exact_keys,
                    )

                    if duplicate:

                        duplicates += 1

                        continue

                    # ----------------------------------------
                    # Validate job ID
                    # ----------------------------------------

                    job_id = normalize_text(
                        raw_job.get("job_id")
                    )

                    if not job_id:

                        errors += 1

                        print(
                            f"\nSkipping record "
                            f"{processed:,}: missing job_id"
                        )

                        continue

                    # ----------------------------------------
                    # Track job ID
                    # ----------------------------------------

                    seen_job_ids.add(
                        job_id
                    )

                    # ----------------------------------------
                    # Track exact matching key
                    # ----------------------------------------

                    exact_key = create_exact_job_key(
                        raw_job
                    )

                    seen_exact_keys.add(
                        exact_key
                    )

                    # ----------------------------------------
                    # Transform raw job
                    # ----------------------------------------

                    job_data = transform_job(
                        raw_job
                    )

                    # ----------------------------------------
                    # Create SQLAlchemy object
                    # ----------------------------------------

                    job = Job(
                        **job_data
                    )

                    batch.append(
                        job
                    )

                    # ----------------------------------------
                    # Insert batch
                    # ----------------------------------------

                    if len(batch) >= BATCH_SIZE:

                        batch_inserted, batch_errors = (
                            insert_batch(
                                db,
                                batch,
                            )
                        )

                        inserted += batch_inserted
                        errors += batch_errors

                        batch.clear()

                        print(
                            f"Processed: {processed:,} | "
                            f"Inserted: {inserted:,} | "
                            f"Duplicates: {duplicates:,} | "
                            f"Errors: {errors:,}",
                            end="\r",
                        )

                except Exception as exc:

                    errors += 1

                    print(
                        f"\nError processing record "
                        f"{processed:,}: {exc}"
                    )

        # ====================================================
        # INSERT REMAINING RECORDS
        # ====================================================

        if batch:

            batch_inserted, batch_errors = (
                insert_batch(
                    db,
                    batch,
                )
            )

            inserted += batch_inserted
            errors += batch_errors

            batch.clear()

        # ====================================================
        # FINAL SUMMARY
        # ====================================================

        print("\n")

        print("=" * 70)
        print("INGESTION COMPLETE")
        print("=" * 70)

        print(
            f"Processed:   {processed:,}"
        )

        print(
            f"Inserted:    {inserted:,}"
        )

        print(
            f"Duplicates:  {duplicates:,}"
        )

        print(
            f"Errors:      {errors:,}"
        )

    except Exception as exc:

        db.rollback()

        print("\n")
        print("=" * 70)
        print("INGESTION FAILED")
        print("=" * 70)

        print(exc)

        raise

    finally:

        db.close()


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    ingest_jobs()