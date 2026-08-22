import re
from typing import Any

from backend.app.retrieval.retriever import retrieve_jobs
from backend.app.retrieval.ranking import rank_jobs


# ============================================================
# EXTRACT SKILLS FROM PROFILE
# ============================================================

def extract_skills(profile: str) -> list[str]:
    """
    Extract commonly requested technical skills
    from the user's profile text.
    """

    skill_patterns = [
        "python",
        "machine learning",
        "deep learning",
        "sql",
        "pandas",
        "numpy",
        "scikit-learn",
        "tensorflow",
        "pytorch",
        "matplotlib",
        "seaborn",
        "power bi",
        "tableau",
        "excel",
        "statistics",
        "data analysis",
        "data visualization",
        "nlp",
        "langchain",
        "spark",
        "aws",
        "azure",
        "gcp",
        "docker",
        "kubernetes",
    ]

    profile_lower = profile.lower()

    found_skills = []

    for skill in skill_patterns:

        if skill in profile_lower:
            found_skills.append(skill)

    return found_skills


# ============================================================
# EXTRACT ROLE FROM PROFILE
# ============================================================

def extract_roles(profile: str) -> list[str]:
    """
    Extract common job roles from the user's profile.
    """

    role_patterns = [
        "data scientist",
        "data analyst",
        "data engineer",
        "machine learning engineer",
        "ml engineer",
        "ai engineer",
        "python developer",
        "software engineer",
        "research analyst",
        "business analyst",
        "statistician",
    ]

    profile_lower = profile.lower()

    found_roles = []

    for role in role_patterns:

        if role in profile_lower:
            found_roles.append(role)

    return found_roles


# ============================================================
# EXTRACT LOCATION
# ============================================================

def extract_location(profile: str) -> str | None:
    """
    Extract common Indian city names from the profile.
    """

    locations = [
        "bengaluru",
        "bangalore",
        "mumbai",
        "pune",
        "hyderabad",
        "chennai",
        "delhi",
        "new delhi",
        "gurugram",
        "gurgaon",
        "noida",
        "kolkata",
        "ahmedabad",
        "jaipur",
        "chandigarh",
        "kochi",
        "indore",
        "remote",
    ]

    profile_lower = profile.lower()

    for location in locations:

        if location in profile_lower:
            return location

    return None


# ============================================================
# EXTRACT EXPERIENCE
# ============================================================

def extract_experience(profile: str) -> float | None:
    """
    Extract years of experience from the profile.

    Examples:
        "3 years experience" -> 3
        "5 years of experience" -> 5
        "2 yrs experience" -> 2
    """

    pattern = r"(\d+(?:\.\d+)?)\s*(?:years?|yrs?)"

    match = re.search(
        pattern,
        profile.lower(),
    )

    if not match:
        return None

    try:
        return float(match.group(1))

    except (
        ValueError,
        TypeError,
    ):
        return None


# ============================================================
# GENERATE RECOMMENDATIONS
# ============================================================

def get_recommendations(
    profile: str,
    limit: int = 10,
) -> dict[str, Any]:
    """
    Generate personalized job recommendations.

    The profile is used for:

    1. Semantic retrieval
    2. Skill extraction
    3. Role extraction
    4. Location extraction
    5. Experience extraction
    6. Final ranking
    """

    # ========================================================
    # VALIDATE PROFILE
    # ========================================================

    if not profile or not profile.strip():

        return {
            "profile": profile,
            "total": 0,
            "jobs": [],
            "message": "Please provide your profile.",
        }

    cleaned_profile = profile.strip()

    # ========================================================
    # EXTRACT STRUCTURED INFORMATION
    # ========================================================

    requested_skills = extract_skills(
        cleaned_profile
    )

    requested_roles = extract_roles(
        cleaned_profile
    )

    requested_location = extract_location(
        cleaned_profile
    )

    requested_experience = extract_experience(
        cleaned_profile
    )

    # ========================================================
    # SEMANTIC RETRIEVAL
    # ========================================================

    retrieved_jobs = retrieve_jobs(
        query=cleaned_profile,
        limit=max(limit, 20),
    )

    if not retrieved_jobs:

        return {
            "profile": cleaned_profile,
            "total": 0,
            "jobs": [],
            "message": "No suitable job recommendations found.",
            "parsed_profile": {
                "skills": requested_skills,
                "roles": requested_roles,
                "location": requested_location,
                "experience": requested_experience,
            },
        }

    # ========================================================
    # RANK JOBS
    # ========================================================

    ranked_jobs = rank_jobs(
        jobs=retrieved_jobs,
        requested_skills=requested_skills,
        requested_roles=requested_roles,
        requested_location=requested_location,
        requested_experience=requested_experience,
    )

    # ========================================================
    # TOP RECOMMENDATIONS
    # ========================================================

    ranked_jobs = ranked_jobs[:limit]

    # ========================================================
    # RESPONSE
    # ========================================================

    return {
        "profile": cleaned_profile,

        "parsed_profile": {
            "skills": requested_skills,
            "roles": requested_roles,
            "location": requested_location,
            "experience": requested_experience,
        },

        "total": len(ranked_jobs),

        "jobs": ranked_jobs,

        "message": "Job recommendations generated successfully.",
    }