from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.core.database import Base


class Job(Base):
    __tablename__ = "jobs"

    # ============================================================
    # PRIMARY IDENTIFICATION
    # ============================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    source_job_id: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    source: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    # ============================================================
    # BASIC JOB INFORMATION
    # ============================================================

    company: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
        index=True,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    # ============================================================
    # JOB CLASSIFICATION
    # ============================================================

    domain: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )

    roles: Mapped[list[str] | None] = mapped_column(
        ARRAY(String),
        nullable=True,
    )

    skills: Mapped[list[str] | None] = mapped_column(
        ARRAY(String),
        nullable=True,
    )

    # ============================================================
    # LOCATION
    # ============================================================

    location: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    location_type: Mapped[list[str] | None] = mapped_column(
        ARRAY(String),
        nullable=True,
    )

    # ============================================================
    # EMPLOYMENT
    # ============================================================

    employment_type: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )

    schedule_type: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    # ============================================================
    # EXPERIENCE
    # ============================================================

    min_experience: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    max_experience: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    # ============================================================
    # SALARY
    # ============================================================

    min_salary: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    max_salary: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    # ============================================================
    # APPLICATION
    # ============================================================

    apply_url: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # ============================================================
    # DATES
    # ============================================================

    posted_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
        index=True,
    )

    published_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    # ============================================================
    # AI ENRICHMENT
    # ============================================================

    ai_enriched: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    ai_enrichment_version: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    # ============================================================
    # DATABASE TIMESTAMPS
    # ============================================================

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )