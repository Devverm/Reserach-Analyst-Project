import re
from hashlib import sha256


def normalize_for_matching(value: str | None) -> str:
    """
    Normalize text so that similar job values can be compared.
    """

    if not value:
        return ""

    value = str(value).lower().strip()

    # Remove punctuation
    value = re.sub(r"[^a-z0-9\s]", " ", value)

    # Normalize whitespace
    value = re.sub(r"\s+", " ", value)

    return value


def create_exact_job_key(job: dict) -> str:
    """
    Create a deterministic key using fields that should
    identify the same job across sources.
    """

    company = normalize_for_matching(
        job.get("company_name")
    )

    title = normalize_for_matching(
        job.get("title")
    )

    location = normalize_for_matching(
        job.get("location")
    )

    raw_key = f"{company}|{title}|{location}"

    return sha256(
        raw_key.encode("utf-8")
    ).hexdigest()


def create_content_key(job: dict) -> str:
    """
    Create a stronger key using the job description.

    This can help identify the same job when the
    location or formatting differs slightly.
    """

    company = normalize_for_matching(
        job.get("company_name")
    )

    title = normalize_for_matching(
        job.get("title")
    )

    description = normalize_for_matching(
        job.get("description")
    )

    raw_key = f"{company}|{title}|{description}"

    return sha256(
        raw_key.encode("utf-8")
    ).hexdigest()


def is_duplicate(
    job: dict,
    seen_job_ids: set[str],
    seen_exact_keys: set[str],
) -> tuple[bool, str | None]:
    """
    Determine whether a job is a duplicate.

    Returns:
        (True, reason)  -> duplicate
        (False, None)   -> unique
    """

    job_id = job.get("job_id")

    # ---------------------------------------------------------
    # Level 1: Exact job ID
    # ---------------------------------------------------------

    if job_id:

        if job_id in seen_job_ids:
            return True, "duplicate_job_id"

    # ---------------------------------------------------------
    # Level 2: Company + title + location
    # ---------------------------------------------------------

    exact_key = create_exact_job_key(job)

    if exact_key in seen_exact_keys:
        return True, "duplicate_company_title_location"

    return False, None