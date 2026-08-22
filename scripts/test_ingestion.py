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
# IMPORTS
# ============================================================

from backend.app.core.database import SessionLocal
from backend.app.models.job import Job

from backend.app.utils.deduplication import (
    create_exact_job_key,
    is_duplicate,
)

from backend.app.utils.normalization import (
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

TEST_RECORDS = 10


# ============================================================
# APPLY URL
# ============================================================


def parse_apply_url(apply_options):

    if not apply_options:
        return None

    if isinstance(apply_options, list):
        for option in apply_options:
            if isinstance(option, dict):
                url = option.get("link") or option.get("url") or option.get("apply_url")

                if url:
                    return url

    return None


# ============================================================
# TRANSFORM JOB
# ============================================================


def transform_job(raw_job):

    return {
        "source_job_id": raw_job.get("job_id"),
        "source": normalize_source(raw_job.get("via")),
        "company": normalize_text(raw_job.get("company_name")) or "Unknown",
        "title": normalize_text(raw_job.get("title")) or "Untitled",
        "description": normalize_text(raw_job.get("description")) or "",
        "domain": normalize_text(raw_job.get("domain")),
        "roles": normalize_roles(raw_job.get("roles")),
        "skills": normalize_skills(raw_job.get("skills")),
        "location": normalize_text(raw_job.get("location")),
        "location_type": normalize_location_type(raw_job.get("locationRequirement")),
        "employment_type": normalize_text(raw_job.get("employmentType")),
        "schedule_type": normalize_text(raw_job.get("schedule_type")),
        "min_experience": normalize_experience(raw_job.get("minExperienceRequired")),
        "max_experience": normalize_experience(raw_job.get("maxExperienceRequired")),
        "min_salary": normalize_salary(raw_job.get("minSalary")),
        "max_salary": normalize_salary(raw_job.get("maxSalary")),
        "apply_url": parse_apply_url(raw_job.get("apply_options")),
        "posted_at": raw_job.get("posted_at"),
        "published_at": raw_job.get("publishedAt"),
        "ai_enriched": bool(raw_job.get("informationExtracted")),
        "ai_enrichment_version": None,
    }


# ============================================================
# TEST INGESTION
# ============================================================


def test_ingestion():

    print("=" * 60)
    print("TEST INGESTION")
    print("=" * 60)

    db = SessionLocal()

    seen_job_ids = set()
    seen_exact_keys = set()

    inserted = 0

    try:
        with open(DATA_PATH, "rb") as file:
            for raw_job in ijson.items(file, "item"):
                if inserted >= TEST_RECORDS:
                    break

                duplicate, reason = is_duplicate(
                    raw_job,
                    seen_job_ids,
                    seen_exact_keys,
                )

                if duplicate:
                    continue

                job_id = raw_job.get("job_id")

                if job_id:
                    seen_job_ids.add(job_id)

                exact_key = create_exact_job_key(raw_job)

                seen_exact_keys.add(exact_key)

                job_data = transform_job(raw_job)

                job = Job(**job_data)

                db.add(job)

                inserted += 1

                print(f"Inserted test job {inserted}: {job.title} | {job.company}")

        db.commit()

        print("\n" + "=" * 60)
        print("TEST INGESTION SUCCESSFUL")
        print("=" * 60)

        print(f"Records inserted: {inserted}")

    except Exception as error:
        db.rollback()

        print("\nTEST INGESTION FAILED")
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
    test_ingestion()
