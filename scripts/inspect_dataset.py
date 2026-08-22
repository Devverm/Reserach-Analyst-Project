import json
from collections import Counter
from pathlib import Path

import ijson


DATA_PATH = Path("data/raw/jobs.json")


def inspect_dataset():
    print("=" * 70)
    print("AI-POWERED JOB BOARD - DATASET INSPECTION")
    print("=" * 70)

    if not DATA_PATH.exists():
        print(f"\nERROR: Dataset not found at {DATA_PATH}")
        return

    print(f"\nDataset: {DATA_PATH}")
    print(f"File size: {DATA_PATH.stat().st_size / (1024 * 1024):.2f} MB")

    total_records = 0
    job_ids = set()

    fields = set()

    missing_counts = Counter()
    source_counts = Counter()
    domain_counts = Counter()
    employment_counts = Counter()
    location_counts = Counter()

    duplicate_job_ids = 0

    sample_jobs = []

    # Stream records one by one instead of loading the
    # entire 395 MB JSON file into memory.
    with open(DATA_PATH, "rb") as file:
        for job in ijson.items(file, "item"):
            total_records += 1

            # -------------------------------------------------
            # Collect schema
            # -------------------------------------------------

            fields.update(job.keys())

            # -------------------------------------------------
            # Collect sample records
            # -------------------------------------------------

            if len(sample_jobs) < 3:
                sample_jobs.append(job)

            # -------------------------------------------------
            # Duplicate job IDs
            # -------------------------------------------------

            job_id = job.get("job_id")

            if job_id:
                if job_id in job_ids:
                    duplicate_job_ids += 1
                else:
                    job_ids.add(job_id)

            # -------------------------------------------------
            # Missing values
            # -------------------------------------------------

            for field in job.keys():
                value = job.get(field)

                if value is None or value == "" or value == []:
                    missing_counts[field] += 1

            # -------------------------------------------------
            # Source
            # -------------------------------------------------

            source = job.get("via")

            if source:
                source_counts[str(source)] += 1

            # -------------------------------------------------
            # Domain
            # -------------------------------------------------

            domain = job.get("domain")

            if domain:
                domain_counts[str(domain)] += 1

            # -------------------------------------------------
            # Employment type
            # -------------------------------------------------

            employment_type = job.get("employmentType")

            if employment_type:
                employment_counts[str(employment_type)] += 1

            # -------------------------------------------------
            # Location requirement
            # -------------------------------------------------

            location_requirement = job.get("locationRequirement")

            if location_requirement:
                location_counts[str(location_requirement)] += 1

            # Progress indicator
            if total_records % 5000 == 0:
                print(f"Processed {total_records:,} records...", end="\r")

    # =========================================================
    # RESULTS
    # =========================================================

    print("\n")

    print("=" * 70)
    print("DATASET SUMMARY")
    print("=" * 70)

    print(f"Total records:        {total_records:,}")
    print(f"Unique job IDs:       {len(job_ids):,}")
    print(f"Duplicate job IDs:    {duplicate_job_ids:,}")
    print(f"Number of fields:     {len(fields)}")

    # =========================================================
    # SCHEMA
    # =========================================================

    print("\n" + "=" * 70)
    print("FIELDS")
    print("=" * 70)

    for field in sorted(fields):
        print(f"  - {field}")

    # =========================================================
    # MISSING VALUES
    # =========================================================

    print("\n" + "=" * 70)
    print("MISSING VALUES")
    print("=" * 70)

    for field in sorted(fields):
        print(f"{field:30} {missing_counts[field]:>10,}")

    # =========================================================
    # SOURCES
    # =========================================================

    print("\n" + "=" * 70)
    print("TOP JOB SOURCES")
    print("=" * 70)

    for source, count in source_counts.most_common(20):
        print(f"{source:40} {count:>10,}")

    # =========================================================
    # DOMAINS
    # =========================================================

    print("\n" + "=" * 70)
    print("DOMAINS")
    print("=" * 70)

    for domain, count in domain_counts.most_common():
        print(f"{domain:40} {count:>10,}")

    # =========================================================
    # EMPLOYMENT TYPES
    # =========================================================

    print("\n" + "=" * 70)
    print("EMPLOYMENT TYPES")
    print("=" * 70)

    for employment_type, count in employment_counts.most_common():
        print(f"{employment_type:40} {count:>10,}")

    # =========================================================
    # LOCATION REQUIREMENTS
    # =========================================================

    print("\n" + "=" * 70)
    print("LOCATION REQUIREMENTS")
    print("=" * 70)

    for location, count in location_counts.most_common():
        print(f"{location:40} {count:>10,}")

    # =========================================================
    # SAMPLE JOBS
    # =========================================================

    print("\n" + "=" * 70)
    print("SAMPLE JOBS")
    print("=" * 70)

    for index, job in enumerate(sample_jobs, start=1):
        print(f"\n--- Job {index} ---")

        print(f"Job ID:       {job.get('job_id')}")
        print(f"Company:      {job.get('company_name')}")
        print(f"Title:        {job.get('title')}")
        print(f"Source:       {job.get('via')}")
        print(f"Domain:       {job.get('domain')}")
        print(f"Employment:   {job.get('employmentType')}")

        print(
            f"Experience:   "
            f"{job.get('minExperienceRequired')} - "
            f"{job.get('maxExperienceRequired')}"
        )

        print(f"Skills:       {job.get('skills')}")
        print(f"Roles:        {job.get('roles')}")

    print("\n" + "=" * 70)
    print("INSPECTION COMPLETE")
    print("=" * 70)


if __name__ == "__main__":
    inspect_dataset()
