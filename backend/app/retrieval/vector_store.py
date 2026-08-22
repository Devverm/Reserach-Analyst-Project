from pathlib import Path

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

EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"

VECTOR_SIZE = 384


# ============================================================
# SINGLETONS
# ============================================================

_model = None
_client = None


# ============================================================
# EMBEDDING MODEL
# ============================================================

def get_embedding_model():
    """
    Load the embedding model only when embedding functionality
    is actually required.

    The SentenceTransformer import is intentionally performed
    inside this function to reduce FastAPI startup memory usage.
    """

    global _model

    if _model is None:

        print(
            f"Loading embedding model: "
            f"{EMBEDDING_MODEL_NAME}"
        )

        # Lazy import to reduce application startup memory usage
        from sentence_transformers import SentenceTransformer

        _model = SentenceTransformer(
            EMBEDDING_MODEL_NAME
        )

        print("Embedding model loaded.")

    return _model


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
    Convert a job record into meaningful text for embedding.
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
# SINGLE EMBEDDING
# ============================================================

def create_embedding(text):
    """
    Generate one normalized embedding.
    """

    model = get_embedding_model()

    embedding = model.encode(
        text,
        normalize_embeddings=True,
    )

    return embedding.tolist()


# ============================================================
# BATCH EMBEDDINGS
# ============================================================

def create_embeddings(
    texts,
    batch_size=64,
):
    """
    Generate embeddings for multiple texts at once.

    Batch encoding is significantly more efficient than
    generating one embedding at a time.
    """

    if not texts:
        return []

    model = get_embedding_model()

    embeddings = model.encode(
        texts,
        batch_size=batch_size,
        show_progress_bar=False,
        normalize_embeddings=True,
    )

    return embeddings.tolist()


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
    Generate embeddings for a batch of jobs and upsert
    all vectors into Qdrant.
    """

    if not jobs:
        return 0

    client = get_qdrant_client()

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
    Search Qdrant using semantic similarity.
    """

    if not query or not query.strip():
        return []

    client = get_qdrant_client()

    query_vector = create_embedding(
        query
    )

    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_vector,
        limit=limit,
    ).points

    return results