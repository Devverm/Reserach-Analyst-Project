# 🤖 JobMatch — AI Job Research & Matching Platform

![Status](https://img.shields.io/badge/status-live-brightgreen)
![Backend](https://img.shields.io/badge/backend-FastAPI-009688)
![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB)
![Database](https://img.shields.io/badge/database-PostgreSQL-336791)
![Vector%20DB](https://img.shields.io/badge/vector%20db-Qdrant-DC244C)
![License](https://img.shields.io/badge/license-Educational-lightgrey)

> An AI-powered job discovery platform that helps users search, understand, and find relevant job opportunities through natural-language search, semantic matching, personalized recommendations, and resume-based matching.

---

## 📑 Table of Contents

- [Project Preview](#-project-preview)
- [Overview](#-overview)
- [Core Features](#-core-features)
- [System Architecture](#️-system-architecture)
- [Technology Stack](#️-technology-stack)
- [Dataset](#-dataset)
- [Project Structure](#-project-structure)
- [Installation & Setup](#️-installation--setup)
- [Running the Application](#️-run-the-application)
- [API Reference](#-api-reference)
- [Testing](#-testing)
- [UI Design](#-ui-design)
- [Security](#-security)
- [Git Workflow](#-git-workflow)
- [Common Issues](#️-common-issues)
- [Project Status](#-project-status)
- [Future Improvements](#-future-improvements)
- [License](#-license)

---

## 📸 Project Preview

The application provides a professional and consistent interface with a warm creamy background, white cards, and muted mauve accents.

### Jobs

![Jobs Page](screenshots/jobs.png)

The **Jobs** section allows users to browse and search available job opportunities using information such as job title, company, location, skills, experience, and job source platform.

### AI Job Assistant

![AI Job Assistant](screenshots/ai-assistant.png)

The **AI Job Assistant** allows users to describe the type of job they are looking for using natural language.

Example:

```text
Find remote Python developer jobs
```

The assistant processes the request and helps retrieve relevant opportunities.

### Recommendations

![Recommendations](screenshots/recommendations.png)

The **Recommendations** section presents personalized job matches.

Recommendations can show:

- AI Match
- Semantic Match
- Skill Match
- Role Match
- Location Match

### Resume Match

![Resume Match](screenshots/resume-match.png)

The **Resume Match** functionality allows users to upload a resume and receive job recommendations based on their profile.

Supported formats:

- PDF
- DOCX

---

## 📌 Overview

Traditional job portals often depend heavily on keyword-based search.

This project makes job discovery more intelligent by allowing users to describe their requirements naturally.

Example:

```text
Find remote Python Data Scientist jobs with Machine Learning experience.
```

Instead of relying only on exact keywords, the platform uses semantic retrieval and matching techniques to identify relevant opportunities.

The application combines:

- React/Vite frontend
- FastAPI backend
- PostgreSQL database
- Qdrant vector database
- Resume processing
- Semantic job matching
- Recommendation and ranking logic

---

## ✨ Core Features

### 🔎 Job Search & Filtering

Users can browse and search a large collection of job opportunities, and narrow results using multiple filters at once.

Job information can include:

- Job title
- Company
- Location
- Skills
- Experience (years)
- Employment type
- Source platform

Structured job data is stored in PostgreSQL.

### 🗂️ Job Source Filter

Because job listings are aggregated from many different scraped platforms, raw source values are normalized into a clean, recognizable set of categories for filtering:

| Category | Description |
|---|---|
| LinkedIn | Jobs sourced from LinkedIn |
| Naukri | Jobs sourced from Naukri.com |
| Indeed | Jobs sourced from Indeed |
| Internshala | Jobs sourced from Internshala |
| Glassdoor | Jobs sourced from Glassdoor |
| BeBee | Jobs sourced from BeBee |
| GrabJobs | Jobs sourced from GrabJobs |
| Other | Any remaining source not in the list above |

Users can select a source from the dropdown on the Jobs page to view listings from that platform only, in addition to keyword, location, skill, and experience filters.

### 🤖 AI Job Assistant

The AI Job Assistant supports natural-language job discovery.

Examples:

```text
Find remote Python developer jobs
```

```text
Show me Data Scientist jobs in Bengaluru
```

```text
Find AI Engineer jobs with Machine Learning experience
```

Capabilities include:

- Natural-language search
- Intent understanding
- Semantic matching
- Relevant job retrieval
- Ranked job results

### 🧠 Semantic Job Matching

The platform uses semantic similarity to identify jobs related in meaning, even when exact keywords differ.

```text
Machine Learning Engineer
```

can be semantically related to:

```text
AI Engineer with Deep Learning experience
```

**Semantic Search Flow**

```text
User Query
    ↓
Query Processing
    ↓
Embedding Generation
    ↓
Qdrant Vector Search
    ↓
Relevant Jobs
    ↓
Matching / Ranking
    ↓
Final Results
```

### 🎯 Personalized Recommendations

Jobs are ranked using multiple matching factors:

- Semantic similarity
- Skill match
- Role match
- Location match
- Overall relevance

Example:

```text
AI Match       86%
Semantic       82%
Skill          90%
Role           88%
Location       85%
```

### 📄 Resume Match

Users can upload resumes to find relevant job opportunities.

Supported formats:

- PDF
- DOCX

**Flow**

```text
Resume Upload
      ↓
FastAPI Upload API
      ↓
PDF / DOCX Text Extraction
      ↓
Resume Analysis
      ↓
Job Matching
      ↓
Ranking
      ↓
Relevant Job Recommendations
```

PDF files are processed using `pypdf`, DOCX files using `python-docx`, and FastAPI file uploads require `python-multipart`.

---

## 🏗️ System Architecture

```text
                         ┌───────────────────┐
                         │       USER        │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │  React + Vite UI  │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │    FastAPI API    │
                         │      Backend      │
                         └─────────┬─────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ▼                    ▼                    ▼
       ┌───────────────┐    ┌──────────────┐    ┌────────────────┐
       │  PostgreSQL   │    │    Qdrant    │    │ Resume Parser  │
       │ Structured Job│    │   Vectors    │    │ PDF / DOCX     │
       │     Data      │    │ Embeddings   │    │ Text Extraction│
       └───────┬───────┘    └──────┬───────┘    └───────┬────────┘
               │                   │                    │
               └───────────────────┼────────────────────┘
                                   ▼
                         ┌───────────────────┐
                         │ Matching & Ranking│
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │ Relevant Job      │
                         │ Recommendations   │
                         └───────────────────┘
```

**Deployment topology**

| Component | Hosting | Notes |
|---|---|---|
| Frontend (static site) | Render | Vite production build served as static assets |
| Backend (web service) | Render | FastAPI on Python 3, free tier |
| Relational database | Neon | Managed PostgreSQL, serverless |
| Vector database | Qdrant Cloud | Managed vector search cluster |

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Frontend Tooling | Vite |
| Backend | FastAPI |
| Language | Python |
| API Server | Uvicorn |
| Relational Database | PostgreSQL |
| Vector Database | Qdrant |
| Data Validation | Pydantic |
| Database Access | SQLAlchemy |
| PDF Processing | pypdf |
| DOCX Processing | python-docx |
| File Upload | python-multipart |
| Version Control | Git / GitHub |
| Hosting | Render |

---

## 📊 Dataset

The raw job dataset is stored at:

```text
data/raw/jobs.json
```

During development, the ingestion pipeline processed approximately:

```text
56,769 job records
```

After duplicate handling:

```text
45,579 jobs inserted
11,190 duplicates
0 errors
```

Example:

```text
INGESTION COMPLETE

Processed:   56,769
Inserted:    45,579
Duplicates:  11,190
Errors:      0
```

The same dataset was subsequently embedded and indexed into Qdrant, giving **45,579 vectors** available for semantic search.

---

## 📁 Project Structure

```text
Research Analyst project/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   └── jobs.py          # Job search, semantic search, sources
│   │   │   ├── resume.py
│   │   │   └── ...
│   │   ├── models/
│   │   │   └── job.py               # SQLAlchemy Job model
│   │   ├── retrieval/
│   │   │   ├── retriever.py         # Qdrant vector retrieval
│   │   │   ├── ranking.py           # Hybrid ranking logic
│   │   │   └── vector_store.py      # Qdrant client
│   │   ├── services/
│   │   │   ├── resume_service.py
│   │   │   └── ...
│   │   ├── utils/
│   │   │   ├── normalization.py     # Source/text/skill normalization
│   │   │   └── deduplication.py
│   │   └── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── RecommendationCard.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Jobs.jsx
│   │   │   ├── Assistant.jsx
│   │   │   ├── Recommendations.jsx
│   │   │   └── ...
│   │   └── services/
│   │       └── api.js
│   └── package.json
│
├── scripts/
│   ├── init_db.py
│   ├── ingest_jobs.py
│   ├── index_jobs.py
│   ├── generate_embeddings.py
│   ├── deduplicate_jobs.py
│   ├── enrich_jobs.py
│   ├── inspect_dataset.py
│   ├── verify_database.py
│   ├── reset_jobs.py
│   ├── test_ingestion.py
│   ├── test_retrieval.py
│   └── test_vector_store.py
│
├── data/
│   ├── raw/
│   │   └── jobs.json
│   ├── processed/
│   └── qdrant/
│
├── screenshots/
│   ├── jobs.png
│   ├── ai-assistant.png
│   ├── recommendations.png
│   └── resume-match.png
│
├── .env.example
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Setup

### Clone

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd "Research Analyst project"
```

### Backend

```bash
python -m venv venv
venv\Scripts\activate
pip install -r backend\requirements.txt
```

If needed:

```bash
pip install pypdf
pip install python-docx
pip install python-multipart
```

### Environment Variables

Create `.env` using `.env.example`:

```env
DATABASE_URL=postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE

QDRANT_URL=YOUR_QDRANT_URL
QDRANT_API_KEY=YOUR_QDRANT_API_KEY

GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY

CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

> Never commit `.env` or real credentials to GitHub.

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `QDRANT_URL` | Yes | Qdrant Cloud cluster endpoint |
| `QDRANT_API_KEY` | Yes | Qdrant Cloud API key |
| `GOOGLE_API_KEY` | Optional | Reserved for future AI-assistant integrations |
| `CORS_ORIGINS` | Yes (production) | Comma-separated list of allowed frontend origins |

### PostgreSQL

The application uses PostgreSQL for structured job data.

Connection format:

```text
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE
```

Initialize:

```bash
python scripts\init_db.py
```

Ingest jobs:

```bash
python scripts\ingest_jobs.py
```

Verify:

```bash
python scripts\verify_database.py
```

### Qdrant

Configure Qdrant through `.env`.

Pipeline:

```text
Job Data
   ↓
Text Processing
   ↓
Embedding Generation
   ↓
Qdrant
   ↓
Vector Similarity Search
   ↓
Relevant Jobs
```

Index the dataset:

```bash
python scripts\index_jobs.py
```

---

## ▶️ Run the Application

### Terminal 1 — Backend

From the project root:

```bash
python -m uvicorn backend.app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

### API Documentation

```text
http://127.0.0.1:8000/docs
```

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 📡 API Reference

Base path: `/api/jobs`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/jobs` | Search and filter jobs (title, location, skill, source, experience, employment type) |
| `GET` | `/api/jobs/semantic-search` | Natural-language semantic search via Qdrant + hybrid ranking |
| `GET` | `/api/jobs/sources` | List normalized job source categories for the filter dropdown |
| `GET` | `/api/jobs/{job_id}` | Get a single job by database ID |

**Example — filtered search**

```text
GET /api/jobs?q=python&location=bangalore&source=LinkedIn&limit=20
```

**Example — semantic search**

```text
GET /api/jobs/semantic-search?q=remote+machine+learning+engineer&limit=20
```

Full interactive documentation is available at `/docs` (Swagger UI) once the backend is running.

---

## 🧪 Testing

```bash
python scripts\test_ingestion.py
```

```bash
python scripts\test_retrieval.py
```

```bash
python scripts\test_vector_store.py
```

---

## 🎨 UI Design

The frontend follows a consistent professional design system:

- Warm creamy background
- White content cards
- Muted mauve accent color
- Rounded corners
- Subtle shadows
- Minimal borders
- Consistent spacing
- Responsive layouts
- Clean typography

The same visual language is maintained across:

- Jobs
- AI Assistant
- Recommendations
- Resume Match

---

## 🔐 Security

Never commit sensitive information.

Do not commit:

```text
.env
```

Do not expose:

```text
DATABASE_PASSWORD
QDRANT_API_KEY
GOOGLE_API_KEY
```

Use `.env` locally and `.env.example` for documenting required variables.

---

## 🔀 Git Workflow

```bash
git pull origin main
git status
git add .
git commit -m "your commit message"
git push origin main
```

Example:

```bash
git add .
git commit -m "docs: add project README and screenshots"
git push origin main
```

---

## ⚠️ Common Issues

### Backend module error

Use the command from the project root:

```bash
python -m uvicorn backend.app.main:app --reload
```

### Missing pypdf

```bash
pip install pypdf
```

### Missing python-docx

```bash
pip install python-docx
```

Python import:

```python
from docx import Document
```

### Missing python-multipart

```bash
pip install python-multipart
```

### PostgreSQL connection error

Check that PostgreSQL is running and verify:

- Database
- Username
- Password
- Host
- Port
- `DATABASE_URL`

### 422 error on an API route

If a route with a static path segment (e.g. `/sources`) returns a 422 "unable to parse string as an integer" error, check that it's declared **above** any dynamic route like `/{job_id}` in the router file — FastAPI matches routes in declaration order.

---

## 📈 Project Status

### Backend

- [x] FastAPI backend
- [x] PostgreSQL integration
- [x] Database initialization
- [x] Job ingestion
- [x] Duplicate handling
- [x] Database verification
- [x] Resume upload
- [x] PDF processing
- [x] DOCX processing
- [x] Recommendation APIs
- [x] Semantic search infrastructure
- [x] Job source normalization & filtering

### Frontend

- [x] Jobs page
- [x] AI Job Assistant
- [x] Recommendations page
- [x] Resume Match
- [x] Recommendation cards
- [x] Consistent UI design
- [x] Responsive styling
- [x] Source filter dropdown

### Data & Retrieval

- [x] Raw job dataset
- [x] PostgreSQL job storage
- [x] Duplicate handling
- [x] Embedding pipeline
- [x] Qdrant vector search infrastructure

### Deployment

- [x] Backend deployed (Render)
- [x] Frontend deployed (Render)
- [x] Managed PostgreSQL (Neon)
- [x] Managed vector database (Qdrant Cloud)

---

## 🚀 Future Improvements

- Advanced job filtering
- Improved recommendation ranking
- User profiles
- Saved jobs
- Job application tracking
- Authentication and authorization
- Advanced resume analysis
- Explainable recommendation scores
- Improved semantic retrieval
- Automated job-data updates
- Analytics dashboard
- Custom domain and HTTPS certificate
- Paid-tier hosting to remove cold-start delay

---

## 🔗 Demo & Deployment

- 🎥 **Demo Video:**
  https://drive.google.com/file/d/1uQmn0x3y66qPHPfD3rBNqjfA8NKOS9Yg/view?usp=sharing

- 🚀 **Live Deployment:**
  https://reserach-analyst-project.onrender.com

---

## 📄 License

This project is currently intended for educational, portfolio, and development purposes.
