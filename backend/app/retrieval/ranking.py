# ============================================================
# JOB RANKING
# ============================================================

def calculate_skill_match(
    job_skills,
    requested_skills,
):
    """
    Calculate how many requested skills are present
    in the job's skill list.
    """

    if not requested_skills:
        return 0.0

    if not job_skills:
        return 0.0

    job_skills_normalized = {
        str(skill).strip().lower()
        for skill in job_skills
    }

    requested_skills_normalized = {
        str(skill).strip().lower()
        for skill in requested_skills
    }

    if not requested_skills_normalized:
        return 0.0

    matched_skills = (
        job_skills_normalized
        & requested_skills_normalized
    )

    return (
        len(matched_skills)
        / len(requested_skills_normalized)
    )


# ============================================================
# ROLE MATCH
# ============================================================

def calculate_role_match(
    job_roles,
    requested_roles,
):
    """
    Calculate how well the job roles match
    the requested roles.
    """

    if not requested_roles:
        return 0.0

    if not job_roles:
        return 0.0

    job_roles_normalized = {
        str(role).strip().lower()
        for role in job_roles
    }

    requested_roles_normalized = {
        str(role).strip().lower()
        for role in requested_roles
    }

    if not requested_roles_normalized:
        return 0.0

    matched_roles = (
        job_roles_normalized
        & requested_roles_normalized
    )

    return (
        len(matched_roles)
        / len(requested_roles_normalized)
    )


# ============================================================
# LOCATION MATCH
# ============================================================

def calculate_location_match(
    job_location,
    requested_location,
):
    """
    Calculate location match.
    """

    if not requested_location:
        return 0.0

    if not job_location:
        return 0.0

    job_location = (
        str(job_location)
        .strip()
        .lower()
    )

    requested_location = (
        str(requested_location)
        .strip()
        .lower()
    )

    if requested_location in job_location:
        return 1.0

    return 0.0


# ============================================================
# EXPERIENCE MATCH
# ============================================================

def calculate_experience_match(
    min_experience,
    max_experience,
    requested_experience,
):
    """
    Calculate experience compatibility.

    requested_experience can be a single number,
    representing the user's experience in years.
    """

    if requested_experience is None:
        return 0.0

    try:
        requested_experience = float(
            requested_experience
        )

    except (
        ValueError,
        TypeError,
    ):
        return 0.0

    # --------------------------------------------------------
    # No experience information in job
    # --------------------------------------------------------

    if (
        min_experience is None
        and max_experience is None
    ):
        return 0.0

    # --------------------------------------------------------
    # Only minimum experience available
    # --------------------------------------------------------

    if max_experience is None:

        return (
            1.0
            if requested_experience >= min_experience
            else 0.0
        )

    # --------------------------------------------------------
    # Only maximum experience available
    # --------------------------------------------------------

    if min_experience is None:

        return (
            1.0
            if requested_experience <= max_experience
            else 0.0
        )

    # --------------------------------------------------------
    # Experience falls inside job range
    # --------------------------------------------------------

    if (
        min_experience
        <= requested_experience
        <= max_experience
    ):
        return 1.0

    # --------------------------------------------------------
    # Close to required range
    # --------------------------------------------------------

    distance = min(
        abs(
            requested_experience
            - min_experience
        ),
        abs(
            requested_experience
            - max_experience
        ),
    )

    if distance <= 1:
        return 0.75

    if distance <= 2:
        return 0.5

    return 0.0


# ============================================================
# FINAL SCORE
# ============================================================

def calculate_final_score(
    similarity_score,
    skill_match=0.0,
    role_match=0.0,
    location_match=0.0,
    experience_match=0.0,
):
    """
    Calculate the final job relevance score.

    We give the highest weight to semantic similarity,
    while structured matching signals improve ranking.
    """

    final_score = (
        0.60 * similarity_score
        + 0.20 * skill_match
        + 0.10 * role_match
        + 0.05 * location_match
        + 0.05 * experience_match
    )

    return round(
        final_score,
        4,
    )


# ============================================================
# RANK JOBS
# ============================================================

def rank_jobs(
    jobs,
    requested_skills=None,
    requested_roles=None,
    requested_location=None,
    requested_experience=None,
):
    """
    Calculate relevance scores for retrieved jobs
    and return them sorted from highest to lowest.
    """

    requested_skills = (
        requested_skills or []
    )

    requested_roles = (
        requested_roles or []
    )

    ranked_jobs = []

    for job in jobs:

        skill_match = calculate_skill_match(
            job.get("skills", []),
            requested_skills,
        )

        role_match = calculate_role_match(
            job.get("roles", []),
            requested_roles,
        )

        location_match = calculate_location_match(
            job.get("location"),
            requested_location,
        )

        experience_match = (
            calculate_experience_match(
                job.get("min_experience"),
                job.get("max_experience"),
                requested_experience,
            )
        )

        similarity_score = float(
            job.get(
                "similarity_score",
                0.0,
            )
        )

        final_score = calculate_final_score(
            similarity_score=similarity_score,
            skill_match=skill_match,
            role_match=role_match,
            location_match=location_match,
            experience_match=experience_match,
        )

        ranked_job = {
            **job,

            "skill_match": round(
                skill_match,
                4,
            ),

            "role_match": round(
                role_match,
                4,
            ),

            "location_match": round(
                location_match,
                4,
            ),

            "experience_match": round(
                experience_match,
                4,
            ),

            "final_score": final_score,
        }

        ranked_jobs.append(
            ranked_job
        )

    # --------------------------------------------------------
    # Sort highest score first
    # --------------------------------------------------------

    ranked_jobs.sort(
        key=lambda job: job["final_score"],
        reverse=True,
    )

    return ranked_jobs