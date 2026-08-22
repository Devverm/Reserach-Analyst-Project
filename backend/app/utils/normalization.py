import re
from datetime import datetime


# ============================================================
# SOURCE NORMALIZATION
# ============================================================

def normalize_source(source: str | None) -> str:
    """
    Convert different source representations into
    a consistent source name.
    """

    if not source:
        return "Unknown"

    source = source.strip().lower()

    if "linkedin" in source:
        return "LinkedIn"

    if "internshala" in source:
        return "Internshala"

    if "indeed" in source:
        return "Indeed"

    if "naukri" in source:
        return "Naukri"

    if "glassdoor" in source:
        return "Glassdoor"

    if "bebee" in source:
        return "BeBee"

    if "grabjobs" in source:
        return "GrabJobs"

    return source.title()


# ============================================================
# TEXT NORMALIZATION
# ============================================================

def normalize_text(value: str | None) -> str | None:
    """
    Basic text normalization.
    """

    if value is None:
        return None

    value = str(value).strip()

    if not value:
        return None

    value = re.sub(r"\s+", " ", value)

    return value


# ============================================================
# SKILL NORMALIZATION
# ============================================================

def normalize_skill(skill: str) -> str:
    """
    Normalize an individual skill.
    """

    skill = skill.strip()

    if not skill:
        return ""

    return skill


def normalize_skills(skills) -> list[str]:
    """
    Convert skills into a clean list.
    """

    if not skills:
        return []

    if isinstance(skills, str):
        skills = skills.split(",")

    normalized = []

    for skill in skills:

        skill = normalize_skill(str(skill))

        if skill:
            normalized.append(skill)

    return list(dict.fromkeys(normalized))


# ============================================================
# ROLE NORMALIZATION
# ============================================================

def normalize_roles(roles) -> list[str]:
    """
    Convert roles into a clean list.
    """

    if not roles:
        return []

    if isinstance(roles, str):
        roles = roles.split(",")

    normalized = []

    for role in roles:

        role = normalize_text(str(role))

        if role:
            normalized.append(role)

    return list(dict.fromkeys(normalized))


# ============================================================
# LOCATION NORMALIZATION
# ============================================================

def normalize_location_type(value: str | None) -> list[str]:
    """
    Convert messy location requirement text into
    standardized work-mode categories.

    Possible categories:
    - Remote
    - Hybrid
    - Onsite
    - Unknown
    """

    if not value:
        return ["Unknown"]

    text = value.lower().strip()

    location_types = []

    if (
        "remote" in text
        or "work from home" in text
        or "wfh" in text
        or "home" in text
    ):
        location_types.append("Remote")

    if "hybrid" in text:
        location_types.append("Hybrid")

    if (
        "onsite" in text
        or "on-site" in text
        or "on site" in text
        or "wfo" in text
        or "work from office" in text
    ):
        location_types.append("Onsite")

    if not location_types:
        location_types.append("Unknown")

    return list(dict.fromkeys(location_types))


# ============================================================
# EXPERIENCE NORMALIZATION
# ============================================================

def normalize_experience(value) -> int | None:
    """
    Convert experience values into integers.
    """

    if value is None:
        return None

    try:
        return int(float(value))

    except (ValueError, TypeError):
        return None


# ============================================================
# SALARY NORMALIZATION
# ============================================================

def normalize_salary(value) -> float | None:
    """
    Convert salary values into numeric values.
    """

    if value is None:
        return None

    try:
        return float(value)

    except (ValueError, TypeError):
        return None


# ============================================================
# DATE NORMALIZATION
# ============================================================

def normalize_datetime(value) -> datetime | None:
    """
    Convert different date/time string formats from the
    raw dataset into Python datetime objects.

    Returns None if the value cannot be parsed.
    """

    if value is None:
        return None

    if isinstance(value, datetime):
        return value

    value = str(value).strip()

    if not value:
        return None

    # --------------------------------------------------------
    # Formats observed / commonly expected in the dataset
    # --------------------------------------------------------

    formats = [
        "%Y/%m/%d, %H:%M",
        "%Y/%m/%d %H:%M",
        "%Y-%m-%d, %H:%M",
        "%Y-%m-%d %H:%M",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%dT%H:%M:%S.%f",
        "%Y-%m-%d",
        "%Y/%m/%d",
    ]

    for fmt in formats:

        try:
            return datetime.strptime(value, fmt)

        except ValueError:
            continue

    # --------------------------------------------------------
    # Final fallback
    # --------------------------------------------------------

    try:

        return datetime.fromisoformat(
            value.replace("Z", "+00:00")
        ).replace(tzinfo=None)

    except (ValueError, TypeError):
        return None