from pathlib import Path
import hashlib
import math
import re

from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    PointStruct,
    VectorParams,
)


# ============================================================
# CONFIGURATION
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[3]

QDRANT_PATH = PROJECT_ROOT / "data" / "qdrant"

COLLECTION_NAME = "jobs"

# Lightweight fixed-size vector.
VECTOR_SIZE = 384


# ============================================================
# SINGLETON
# ============================================================

_client = None


# ============================================================
# TEXT TOKENIZATION
# ============================================================

def tokenize(text):
    """
    Convert text into normalized tokens.
    """

    if not text:
        return []

    return re.findall(
        r"[a-zA-Z0-9]+",
        text.lower(),
    )


# ============================================================
# LIGHTWEIGHT EMBEDDING
# ============================================================

def create_embedding(text):
    """
    Create a lightweight deterministic text embedding.

    This implementation avoids heavy ML dependencies such as
    sentence-transformers and PyTorch.

    The resulting vector has a fixed size of 384 dimensions
    and is normalized for cosine similarity.
    """

    vector = [0.0] * VECTOR_SIZE

    tokens = tokenize(text)

    if not tokens:
        return vector

    for token in tokens:

        digest = hashlib.md5(
            token.encode("utf-8")
        ).digest()

        index = int.from_bytes(
            digest[:4],
            byteorder="little",
        ) % VECTOR_SIZE

        sign = (
            1.0
            if digest[4] % 2 == 0
            else -1.0
        )

        vector[index] += sign

    # Normalize vector for cosine similarity.
    magnitude = math.sqrt(
        sum(value * value for value in vector)
    )

    if magnitude > 0:

        vector = [
            value / magnitude
            for value in vector
        ]

    return vector


# ============================================================
# BATCH EMBEDDINGS
# ============================================================

def create_embeddings(
    texts,
    batch_size=64,
):
    """
    Generate lightweight embeddings for multiple texts.

    batch_size is retained for API compatibility.
    """

    if not texts:
        return []

    return [
        create_embedding(text)
        for text in texts
    ]


# ============================================================
# QDRANT CLIENT
# ============================================================

def get_qdrant_client():
    """
    Create and reuse a local persistent Qdrant client.
    """

    global _client

    if _client is None:

        QDRANT_PATH.mkdir(
            parents=True,
            exist_ok=True,
        )

        _client = QdrantClient(
            path=str(QDRANT_PATH)
        )

    return _client


# ============================================================
# COLLECTION
# ============================================================

def create_collection():
    """
    Create the jobs collection if it does not already exist.
    """

    client = get_qdrant_client()

    existing_collections = (
        client.get_collections()
    )

    collection_names = {
        collection.name
        for collection
        in existing_collections.collections
    }

    if COLLECTION_NAME in collection_names:
        return

    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(
            size=VECTOR_SIZE,
            distance=Distance.COSINE,
        ),
    )

    print(
        f"Created Qdrant collection: "
        f"{COLLECTION_NAME}"
    )


# ============================================================
# JOB TEXT
# ============================================================

def build_job_text(job):
    """
    Convert a job record into meaningful text.
    """

    roles = job.roles or []
    skills = job.skills or []

    return " ".join(
        [
            f"Job Title: {job.title or ''}",
            f"Company: {job.company or ''}",
            f"Domain: {job.domain or ''}",
            f"Roles: {', '.join(roles)}",
            f"Skills: {', '.join(skills)}",
            f"Location: {job.location or ''}",
            f"Employment Type: {job.employment_type or ''}",
            f"Schedule Type: {job.schedule_type or ''}",
            (
                "Experience: "
                f"{job.min_experience or ''} "
                "to "
                f"{job.max_experience or ''} years"
            ),
            f"Description: {job.description or ''}",
        ]
    )


# ============================================================
# BATCH JOB TEXTS
# ============================================================

def build_job_texts(jobs):
    """
    Convert multiple jobs into embedding-ready text.
    """

    return [
        build_job_text(job)
        for job in jobs
    ]


# ============================================================
# JOB PAYLOAD
# ============================================================

def build_job_payload(job):
    """
    Build the metadata stored alongside the vector.
    """

    return {
        "job_id": job.id,
        "source_job_id": job.source_job_id,
        "title": job.title,
        "company": job.company,
        "domain": job.domain,
        "skills": job.skills or [],
        "roles": job.roles or [],
        "location": job.location,
        "location_type": job.location_type or [],
        "employment_type": job.employment_type,
        "schedule_type": job.schedule_type,
        "min_experience": job.min_experience,
        "max_experience": job.max_experience,
        "min_salary": job.min_salary,
        "max_salary": job.max_salary,
    }


# ============================================================
# BATCH UPSERT
# ============================================================

def upsert_jobs(
    jobs,
    embedding_batch_size=64,
):
    """
    Generate lightweight embeddings for jobs and
    upsert them into Qdrant.
    """

    if not jobs:
        return 0

    client = get_qdrant_client()

    # Make sure the collection exists.
    create_collection()

    texts = build_job_texts(jobs)

    embeddings = create_embeddings(
        texts,
        batch_size=embedding_batch_size,
    )

    points = []

    for job, embedding in zip(
        jobs,
        embeddings,
    ):

        points.append(
            PointStruct(
                id=job.id,
                vector=embedding,
                payload=build_job_payload(job),
            )
        )

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=points,
    )

    return len(points)


# ============================================================
# SINGLE JOB UPSERT
# ============================================================

def upsert_job(job):
    """
    Convenience function for indexing one job.
    """

    return upsert_jobs(
        [job]
    )


# ============================================================
# SEMANTIC SEARCH
# ============================================================

def semantic_search(
    query,
    limit=10,
):
    """
    Search Qdrant using cosine similarity.
    """

    if not query or not query.strip():
        return []

    client = get_qdrant_client()

    # Make sure the collection exists.
    create_collection()

    query_vector = create_embedding(
        query
    )

    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_vector,
        limit=limit,
    ).points

    return results