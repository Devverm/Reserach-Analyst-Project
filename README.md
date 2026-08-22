# 🤖 AI Job Research & Matching Platform

> An AI-powered job discovery platform that helps users search, understand, and find relevant job opportunities through natural-language search, semantic matching, personalized recommendations, and resume-based matching.

## 📸 Project Screenshots

> **Note:** The preview images in this repository are representative UI mockups based on the project's current design. Replace them with the actual exported application screenshots when available.

### Jobs
![Jobs Page](screenshots/jobs.png)

### AI Job Assistant
![AI Job Assistant](screenshots/ai-assistant.png)

### Recommendations
![Recommendations](screenshots/recommendations.png)

### Resume Match
![Resume Match](screenshots/resume-match.png)

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

### 🔎 Job Search

Users can browse and search a large collection of job opportunities using:

- Job title
- Company
- Location
- Skills
- Experience
- Employment type
- Other job attributes

### 🤖 AI Job Assistant

Users can search for jobs using natural language.

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

Capabilities include natural-language search, intent understanding, semantic matching, relevant retrieval, and ranked results.

### 🧠 Semantic Job Matching

The platform uses semantic similarity to identify jobs related in meaning, even when exact keywords differ.

```text
Machine Learning Engineer
```

can be semantically related to:

```text
AI Engineer with Deep Learning experience
```

Flow:

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

Jobs are ranked using:

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

Users can upload PDF or DOCX resumes.

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

PDF files use `pypdf`, DOCX files use `python-docx`, and FastAPI uploads require `python-multipart`.

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

---

## 📊 Dataset

The raw job dataset is stored at:

```text
data/raw/jobs.json
```

During development, the ingestion pipeline processed approximately **56,769 job records**.

After duplicate handling:

```text
45,579 jobs inserted
11,190 duplicates
0 errors
```

---

## 📁 Project Structure

```text
Research Analyst project/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── services/
│   │   └── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── package.json
├── scripts/
├── data/
├── screenshots/
│   ├── jobs.png
│   ├── ai-assistant.png
│   ├── recommendations.png
│   └── resume-match.png
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
```

Never commit `.env` or real credentials.

### PostgreSQL

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
Job Data → Processing → Embeddings → Qdrant → Vector Search
```

---

## ▶️ Run the Application

### Backend

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

### Frontend

Open a second terminal:

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

The same visual language is maintained across Jobs, AI Assistant, Recommendations, and Resume Match.

---

## 🔐 Security

Never commit:

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

### `ModuleNotFoundError: No module named 'backend'`

Run from the project root:

```bash
python -m uvicorn backend.app.main:app --reload
```

### Missing `pypdf`

```bash
pip install pypdf
```

### Missing `python-docx`

```bash
pip install python-docx
```

Import:

```python
from docx import Document
```

### Missing `python-multipart`

```bash
pip install python-multipart
```

### PostgreSQL connection error

Check that PostgreSQL is running and verify the database, username, password, host, port, and `DATABASE_URL`.

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

### Frontend

- [x] Jobs page
- [x] AI Job Assistant
- [x] Recommendations page
- [x] Resume Match
- [x] Recommendation cards
- [x] Consistent UI design
- [x] Responsive styling

### Data & Retrieval

- [x] Raw job dataset
- [x] PostgreSQL job storage
- [x] Duplicate handling
- [x] Embedding pipeline
- [x] Qdrant vector search infrastructure

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
- Production deployment
- Automated job-data updates
- Analytics dashboard

---

## 👥 Contributors


### Project Collaborator
Backend / Frontend / AI Development

---

## 📄 License

This project is currently intended for educational, portfolio, and development purposes.
