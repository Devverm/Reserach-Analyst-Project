import { useState, useEffect } from "react";
import { semanticSearchJobs, getJobSources } from "../services/api";

function Jobs() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [skill, setSkill] = useState("");
  const [experience, setExperience] = useState("");
  const [source, setSource] = useState("");
  const [sources, setSources] = useState([]);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  // ============================================================
  // LOAD AVAILABLE JOB SOURCES (for the dropdown)
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    getJobSources()
      .then((data) => {
        if (!cancelled) {
          setSources(data.sources || []);
        }
      })
      .catch((err) => {
        console.error("Failed to load job sources:", err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ============================================================
  // SEARCH
  // ============================================================

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!query.trim()) {
      setError("Please enter a job search query.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSearched(true);

      const data = await semanticSearchJobs({
        query: query.trim(),
        location,
        skill,
        source,
        experience,
        limit: 20,
      });

      setJobs(data.results || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong while searching.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // QUICK SEARCH
  // ============================================================

  const handleQuickSearch = (value) => {
    setQuery(value);
  };

  // ============================================================
  // HELPERS
  // ============================================================

  const getMatchScore = (job) => Math.round((job.final_score || 0) * 100);

  const getSemanticScore = (job) =>
    ((job.similarity_score || 0) * 100).toFixed(1);

  const getInitials = (company = "") => {
    if (!company) return "AI";
    return company
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const getMatchStyle = (score) => {
    if (score >= 80) {
      return {
        background: "#ecfdf5",
        color: "#047857",
        border: "1px solid #bbf7d0",
      };
    }
    if (score >= 60) {
      return {
        background: "#eef2ff",
        color: "#4f46e5",
        border: "1px solid #c7d2fe",
      };
    }
    return {
      background: "#f5f3ff",
      color: "#7a2f6e",
      border: "1px solid #ddd6fe",
    };
  };

  const quickSearches = [
    "Python Developer",
    "Data Scientist",
    "Machine Learning",
    "AI Engineer",
    "Data Analyst",
    "Remote Jobs",
  ];

  return (
    <div className="jobs-page">
      {/* ======================================================
          PAGE STYLES
      ====================================================== */}
      <style>{`

        * { box-sizing: border-box; }

        .jobs-page {
          min-height: 100vh;
          background: #f7f4ee;
          color: #111827;
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          padding: 46px 28px 80px;
        }

        .jobs-container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
        }

        /* HERO */

        .hero { margin-bottom: 30px; }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 13px;
          border-radius: 999px;
          background: #f3e8f4;
          color: #7a2f6e;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.3px;
          margin-bottom: 18px;
        }

        .hero-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #7a2f6e;
        }

        .hero-title {
          margin: 0;
          max-width: 780px;
          font-size: clamp(34px, 4.6vw, 54px);
          line-height: 1.08;
          letter-spacing: -1.6px;
          font-weight: 800;
          color: #111827;
        }

        .hero-gradient {
          color: #7a2f6e;
        }

        .hero-description {
          max-width: 650px;
          margin: 18px 0 0;
          color: #6b7280;
          font-size: 16px;
          line-height: 1.65;
        }

        /* SEARCH PANEL */

        .search-panel {
          background: #ffffff;
          border: 1px solid #ececf0;
          border-radius: 20px;
          padding: 14px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
          margin-bottom: 18px;
        }

        .search-row {
          display: grid;
          gap: 10px;
        }

        .search-row-top {
          grid-template-columns: 2.4fr 1.6fr auto;
        }

        .search-row-bottom {
          grid-template-columns: repeat(4, 1fr);
          margin-top: 10px;
        }

        .search-field { position: relative; min-width: 0; }

        .field-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 15px;
          pointer-events: none;
          z-index: 1;
        }

        .search-input {
          width: 100%;
          height: 54px;
          padding: 0 14px 0 42px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: #fafbfc;
          color: #111827;
          font-size: 13px;
          outline: none;
          transition: border 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }

        .search-input.no-icon {
          padding-left: 14px;
        }

        .search-input:focus {
          background: white;
          border-color: #b9a4f0;
          box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.08);
        }

        .search-input::placeholder { color: #9ca3af; }

        .search-button {
          height: 54px;
          padding: 0 26px;
          border: none;
          border-radius: 12px;
          background: #3f1d3a;
          color: white;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .search-button:hover:not(:disabled) {
          opacity: 0.92;
        }

        .search-button:disabled { opacity: 0.6; cursor: not-allowed; }

        /* QUICK SEARCH */

        .quick-searches {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          margin: 0 0 34px;
        }

        .popular-label {
          color: #6b7280;
          font-size: 12px;
          font-weight: 700;
          margin-right: 3px;
        }

        .quick-button {
          border: 1px solid #e2e5ec;
          background: white;
          color: #5b6474;
          padding: 7px 13px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .quick-button:hover {
          color: #7a2f6e;
          border-color: #ddd0f5;
          background: #f8f5fd;
        }

        /* ERROR */

        .error-box {
          background: #fff1f2;
          color: #be123c;
          border: 1px solid #fecdd3;
          padding: 14px 17px;
          border-radius: 13px;
          margin-bottom: 25px;
          font-size: 13px;
          font-weight: 600;
        }

        /* RESULTS HEADER */

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 15px;
          margin-bottom: 18px;
        }

        .results-title {
          margin: 0;
          font-size: 26px;
          letter-spacing: -0.8px;
          font-weight: 800;
          color: #111827;
        }

        .results-title-number { color: #7a2f6e; }
        .results-title-light { color: #6b7280; font-weight: 500; }

        .results-subtitle {
          margin: 5px 0 0;
          color: #9ca3af;
          font-size: 12px;
        }

        .ai-ranked {
          display: flex;
          align-items: center;
          gap: 7px;
          background: white;
          border: 1px solid #e5e7eb;
          padding: 9px 13px;
          border-radius: 10px;
          color: #6b7280;
          font-size: 11px;
          font-weight: 600;
        }

        .ai-ranked-icon { color: #7a2f6e; font-size: 14px; }

        /* JOB GRID */

        .job-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        /* JOB CARD */

        .job-card {
          position: relative;
          background: #ffffff;
          border: 1px solid #ececf0;
          border-radius: 16px;
          padding: 19px;
          min-height: 340px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 5px 18px rgba(15, 23, 42, 0.03);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border 0.25s ease;
        }

        .job-card:hover {
          transform: translateY(-3px);
          border-color: #ddd0f5;
          box-shadow: 0 16px 30px rgba(15, 23, 42, 0.08);
        }

        .company-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 17px;
        }

        .company-info { display: flex; align-items: center; gap: 10px; min-width: 0; }

        .company-logo {
          width: 43px;
          height: 43px;
          flex-shrink: 0;
          border-radius: 12px;
          background: #f4eefb;
          border: 1px solid #e6d9f7;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7a2f6e;
          font-size: 12px;
          font-weight: 800;
        }

        .company-name {
          color: #6b7280;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .verified-text { margin-top: 3px; color: #a1a8b5; font-size: 10px; }

        .match-badge {
          flex-shrink: 0;
          padding: 6px 9px;
          border-radius: 9px;
          font-size: 11px;
          font-weight: 800;
        }

        .job-title {
          margin: 0 0 12px;
          color: #111827;
          font-size: 18px;
          line-height: 1.3;
          letter-spacing: -0.35px;
          font-weight: 800;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .job-meta { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 14px; }

        .meta-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 8px;
          border-radius: 7px;
          background: #fafafa;
          color: #6b7280;
          font-size: 10px;
          border: 1px solid #eeeeef;
        }

        .job-description {
          margin: 0 0 14px;
          color: #737b8a;
          font-size: 12px;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .skills-container { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 1px; }

        .skill-pill {
          background: #f8f4fd;
          border: 1px solid #ecdffa;
          color: #7a2f6e;
          padding: 5px 8px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 600;
        }

        .more-pill {
          background: #fafafa;
          border: 1px solid #e5e7eb;
          color: #6b7280;
          padding: 5px 8px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 600;
        }

        .job-bottom { margin-top: auto; padding-top: 16px; }
        .divider { height: 1px; background: #edf0f4; margin-bottom: 13px; }

        .bottom-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .semantic-label { color: #8b93a1; font-size: 10px; margin-bottom: 3px; }
        .semantic-score { color: #111827; font-size: 14px; font-weight: 800; }

        .match-button {
          border: 1px solid #e1e4ef;
          background: #ffffff;
          color: #7a2f6e;
          padding: 8px 11px;
          border-radius: 9px;
          font-size: 10px;
          font-weight: 800;
          cursor: default;
        }

        /* LOADING */

        .loading-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .skeleton {
          height: 340px;
          border-radius: 16px;
          background: linear-gradient(90deg, #ffffff 25%, #f2f3f7 50%, #ffffff 75%);
          background-size: 200% 100%;
          animation: skeletonLoading 1.4s infinite;
          border: 1px solid #ececf0;
        }

        @keyframes skeletonLoading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* EMPTY */

        .empty-state {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 70px 30px;
          text-align: center;
          box-shadow: 0 8px 25px rgba(15, 23, 42, 0.04);
        }

        .empty-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 15px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f4eefb;
          font-size: 25px;
        }

        .empty-title { margin: 0 0 8px; color: #111827; font-size: 18px; }
        .empty-text { margin: 0; color: #6b7280; font-size: 13px; }

        /* TABLET */

        @media (max-width: 1050px) {
          .search-row-top { grid-template-columns: 1fr; }
          .search-row-bottom { grid-template-columns: repeat(2, 1fr); }
          .job-grid, .loading-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        /* MOBILE */

        @media (max-width: 700px) {
          .jobs-page { padding: 28px 15px 60px; }
          .hero-title { font-size: 36px; letter-spacing: -1.2px; }
          .hero-description { font-size: 14px; }
          .search-panel { padding: 10px; border-radius: 16px; }
          .search-row-bottom { grid-template-columns: 1fr; }
          .search-button { width: 100%; }
          .results-header { align-items: flex-start; flex-direction: column; }
          .job-grid, .loading-grid { grid-template-columns: 1fr; }
          .job-card { min-height: 315px; }
        }

        @media (max-width: 430px) {
          .jobs-page { padding-left: 11px; padding-right: 11px; }
          .hero-title { font-size: 30px; }
          .results-title { font-size: 22px; }
          .job-card { padding: 16px; }
        }

      `}</style>

      {/* ======================================================
          MAIN CONTAINER
      ====================================================== */}
      <div className="jobs-container">
        {/* HERO */}
        <section className="hero">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            AI-POWERED JOB SEARCH
          </div>

          <h1 className="hero-title">
            Find the right job.
            <br />
            Let AI find the <span className="hero-gradient">match.</span>
          </h1>

          <p className="hero-description">
            Discover opportunities that match your skills, experience and
            career goals using AI-powered semantic search.
          </p>
        </section>

        {/* SEARCH PANEL */}
        <form onSubmit={handleSearch} className="search-panel">
          {/* TOP ROW: query, location, search button */}
          <div className="search-row search-row-top">
            <div className="search-field">
              <span className="field-icon">🔍</span>
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by job title, skills or company"
                className="search-input"
              />
            </div>

            <div className="search-field">
              <span className="field-icon">📍</span>
              <input
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Search by city or country"
                className="search-input"
              />
            </div>

            <button type="submit" disabled={loading} className="search-button">
              {loading ? "Searching..." : "Search jobs"}
            </button>
          </div>

          {/* BOTTOM ROW: skill, experience, ai matching label, source */}
          <div className="search-row search-row-bottom">
            <div className="search-field">
              <input
                type="text"
                value={skill}
                onChange={(event) => setSkill(event.target.value)}
                placeholder="Skill"
                className="search-input no-icon"
              />
            </div>

            <div className="search-field">
              <input
                type="number"
                min="0"
                value={experience}
                onChange={(event) => setExperience(event.target.value)}
                placeholder="Experience in years"
                className="search-input no-icon"
              />
            </div>

            <div className="search-field">
              <input
                type="text"
                value="AI semantic matching"
                readOnly
                className="search-input no-icon"
                style={{ color: "#9ca3af", cursor: "default" }}
              />
            </div>

            <div className="search-field">
              <select
                value={source}
                onChange={(event) => setSource(event.target.value)}
                className="search-input no-icon"
              >
                <option value="">All sources</option>
                {sources.map((sourceOption) => (
                  <option key={sourceOption} value={sourceOption}>
                    {sourceOption}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>

        {/* QUICK SEARCH */}
        <div className="quick-searches">
          <span className="popular-label">Popular:</span>
          {quickSearches.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleQuickSearch(item)}
              className="quick-button"
            >
              {item}
            </button>
          ))}
        </div>

        {/* ERROR */}
        {error && <div className="error-box">⚠️ {error}</div>}

        {/* RESULTS HEADER */}
        {searched && !error && (
          <div className="results-header">
            <div>
              <h2 className="results-title">
                <span className="results-title-number">{jobs.length}</span>{" "}
                <span className="results-title-light">AI-matched jobs</span>
              </h2>
              <p className="results-subtitle">
                Ranked by AI relevance to your search
              </p>
            </div>

            <div className="ai-ranked">
              <span className="ai-ranked-icon">✦</span>
              AI Ranked
              <span>•</span>
              Best Match
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="loading-grid">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="skeleton" />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {searched && !loading && !error && jobs.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔎</div>
            <h3 className="empty-title">No matching jobs found</h3>
            <p className="empty-text">
              Try changing your keywords, location or skill.
            </p>
          </div>
        )}

        {/* JOB GRID */}
        {!loading && !error && jobs.length > 0 && (
          <div className="job-grid">
            {jobs.map((job, index) => {
              const matchScore = getMatchScore(job);
              const semanticScore = getSemanticScore(job);
              const matchStyle = getMatchStyle(matchScore);

              return (
                <article
                  key={job.id || job.source_job_id || index}
                  className="job-card"
                >
                  <div className="company-header">
                    <div className="company-info">
                      <div className="company-logo">
                        {getInitials(job.company)}
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div className="company-name">
                          {job.company || "Company"}
                        </div>
                        <div className="verified-text">
                          ✓ Verified opportunity
                        </div>
                      </div>
                    </div>

                    <div
                      className="match-badge"
                      style={{
                        background: matchStyle.background,
                        color: matchStyle.color,
                        border: matchStyle.border,
                      }}
                    >
                      ✦ {matchScore}%
                    </div>
                  </div>

                  <h3 className="job-title">{job.title || "Untitled Job"}</h3>

                  <div className="job-meta">
                    <span className="meta-pill">
                      📍{job.location || "Location not specified"}
                    </span>
                    {job.employment_type && (
                      <span className="meta-pill">💼{job.employment_type}</span>
                    )}
                  </div>

                  {job.description && (
                    <p className="job-description">{job.description}</p>
                  )}

                  {job.skills && job.skills.length > 0 && (
                    <div className="skills-container">
                      {job.skills.slice(0, 6).map((jobSkill, skillIndex) => (
                        <span key={skillIndex} className="skill-pill">
                          {jobSkill}
                        </span>
                      ))}
                      {job.skills.length > 6 && (
                        <span className="more-pill">
                          +{job.skills.length - 6}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="job-bottom">
                    <div className="divider" />
                    <div className="bottom-row">
                      <div>
                        <div className="semantic-label">Semantic match</div>
                        <strong className="semantic-score">
                          {semanticScore}%
                        </strong>
                      </div>

                      <button type="button" className="match-button">
                        AI Match →
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Jobs;