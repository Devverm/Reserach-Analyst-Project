import { useState } from "react";
import { semanticSearchJobs } from "../services/api";

function Jobs() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [skill, setSkill] = useState("");
  const [experience, setExperience] = useState("");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

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
        experience,
        limit: 20,
      });

      setJobs(data.results || []);
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Something went wrong while searching."
      );

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

  const getMatchScore = (job) =>
    Math.round((job.final_score || 0) * 100);

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

  const getMatchClass = (score) => {
    if (score >= 80) return "match-high";
    if (score >= 60) return "match-medium";
    return "match-low";
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

      <style>{`

        * {
          box-sizing: border-box;
        }

        /* ========================================================
           PAGE
        ======================================================== */

        .jobs-page {
          min-height: 100vh;
          background: #f8f7f3;
          color: #16151c;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

          padding-bottom: 90px;
        }

        .jobs-container {
          width: min(1120px, calc(100% - 40px));
          margin: 0 auto;
        }


        /* ========================================================
           HERO
        ======================================================== */

        .hero-section {
          background:
            radial-gradient(
              circle at 75% 15%,
              rgba(111, 66, 193, 0.08),
              transparent 30%
            ),
            #f8f7f3;

          padding:
            78px
            0
            105px;
        }

        .hero-content {
          max-width: 780px;
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          margin-bottom: 20px;

          padding:
            8px
            13px;

          border-radius: 999px;

          background: #eee9f5;
          color: #684476;

          font-size: 11px;
          font-weight: 800;

          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .hero-eyebrow-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #70447c;
        }

        .hero-title {
          margin: 0;

          max-width: 760px;

          font-size:
            clamp(44px, 6vw, 72px);

          line-height: 0.98;

          letter-spacing: -3.5px;

          font-weight: 850;

          color: #16151c;
        }

        .hero-highlight {
          color: #70447c;
        }

        .hero-description {
          max-width: 650px;

          margin:
            24px
            0
            0;

          color: #6f6b72;

          font-size: 16px;
          line-height: 1.7;
        }


        /* ========================================================
           SEARCH SECTION
        ======================================================== */

        .search-wrapper {
          position: relative;

          margin-top: -55px;

          z-index: 5;
        }

        .search-card {
          background: #ffffff;

          border:
            1px solid
            #e7e4df;

          border-radius: 20px;

          box-shadow:
            0 20px 55px
            rgba(35, 28, 40, 0.10);

          overflow: hidden;
        }

        .main-search {
          display: grid;

          grid-template-columns:
            minmax(250px, 1.8fr)
            minmax(180px, 1fr)
            auto;

          gap: 0;

          padding: 10px;
        }

        .search-field {
          position: relative;

          display: flex;
          align-items: center;

          min-width: 0;
        }

        .search-field + .search-field {
          border-left:
            1px solid
            #ece9e5;
        }

        .search-icon {
          position: absolute;

          left: 17px;

          color: #77717a;

          font-size: 17px;

          pointer-events: none;
        }

        .search-input {
          width: 100%;

          height: 58px;

          border: none;

          outline: none;

          background: transparent;

          padding:
            0
            16px
            0
            46px;

          color: #242129;

          font-size: 14px;
        }

        .search-input::placeholder {
          color: #aaa5aa;
        }

        .location-input {
          padding-left: 46px;
        }

        .search-button {
          height: 58px;

          border: none;

          border-radius: 12px;

          padding:
            0
            25px;

          background: #684476;

          color: white;

          font-size: 13px;
          font-weight: 800;

          cursor: pointer;

          transition:
            transform 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease;
        }

        .search-button:hover:not(:disabled) {
          background: #573666;

          transform: translateY(-1px);

          box-shadow:
            0 8px 20px
            rgba(104, 68, 118, 0.22);
        }

        .search-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }


        /* ========================================================
           FILTERS
        ======================================================== */

        .filter-row {
          display: grid;

          grid-template-columns:
            1fr
            1fr
            1fr;

          gap: 10px;

          padding:
            0
            10px
            10px;
        }

        .filter-input {
          height: 45px;

          width: 100%;

          border:
            1px solid
            #e8e5e1;

          border-radius: 10px;

          background: #faf9f7;

          padding:
            0
            14px;

          color: #514b54;

          font-size: 12px;

          outline: none;

          transition: all 0.2s ease;
        }

        .filter-input:focus {
          background: white;

          border-color: #b9a5bf;

          box-shadow:
            0 0 0 3px
            rgba(104, 68, 118, 0.08);
        }


        /* ========================================================
           POPULAR SEARCHES
        ======================================================== */

        .quick-searches {
          display: flex;

          align-items: center;

          flex-wrap: wrap;

          gap: 8px;

          margin-top: 18px;
        }

        .popular-label {
          color: #8b858d;

          font-size: 11px;

          font-weight: 700;

          margin-right: 3px;
        }

        .quick-button {
          border:
            1px solid
            #dfdbd8;

          background: transparent;

          color: #68626a;

          padding:
            7px
            12px;

          border-radius: 999px;

          font-size: 11px;

          cursor: pointer;

          transition: all 0.2s ease;
        }

        .quick-button:hover {
          background: #eee8f0;

          color: #684476;

          border-color: #cbb9cf;

          transform: translateY(-1px);
        }


        /* ========================================================
           ERROR
        ======================================================== */

        .error-box {
          margin-top: 25px;

          padding:
            14px
            17px;

          border:
            1px solid
            #f1c8ce;

          border-radius: 12px;

          background: #fff5f6;

          color: #a63c4c;

          font-size: 13px;
          font-weight: 600;
        }


        /* ========================================================
           RESULTS SECTION
        ======================================================== */

        .results-section {
          padding-top: 70px;
        }

        .results-header {
          display: flex;

          justify-content: space-between;

          align-items: flex-end;

          gap: 20px;

          margin-bottom: 22px;
        }

        .results-title {
          margin: 0;

          font-size: 30px;

          letter-spacing: -1.1px;

          font-weight: 820;
        }

        .results-number {
          color: #684476;
        }

        .results-muted {
          color: #77727a;

          font-weight: 500;
        }

        .results-subtitle {
          margin:
            6px
            0
            0;

          color: #969197;

          font-size: 12px;
        }

        .ai-ranked {
          display: inline-flex;

          align-items: center;

          gap: 7px;

          padding:
            9px
            13px;

          border:
            1px solid
            #ded8e0;

          border-radius: 999px;

          background: #ffffff;

          color: #706a72;

          font-size: 11px;

          font-weight: 700;
        }

        .ai-star {
          color: #684476;
        }


        /* ========================================================
           JOB LIST
        ======================================================== */

        .job-list {
          display: flex;

          flex-direction: column;

          gap: 12px;
        }


        /* ========================================================
           JOB CARD
        ======================================================== */

        .job-card {
          display: grid;

          grid-template-columns:
            64px
            minmax(0, 1fr)
            auto;

          align-items: center;

          gap: 20px;

          background: #ffffff;

          border:
            1px solid
            #e8e5e2;

          border-radius: 15px;

          padding:
            22px
            24px;

          transition:
            transform 0.22s ease,
            box-shadow 0.22s ease,
            border-color 0.22s ease;
        }

        .job-card:hover {
          transform: translateY(-2px);

          border-color: #d7c9da;

          box-shadow:
            0 12px 30px
            rgba(35, 28, 40, 0.08);
        }


        /* ========================================================
           COMPANY LOGO
        ======================================================== */

        .company-logo {
          width: 56px;
          height: 56px;

          border-radius: 13px;

          display: flex;

          align-items: center;
          justify-content: center;

          background:
            linear-gradient(
              135deg,
              #eee8f0,
              #f6f2f7
            );

          border:
            1px solid
            #ddd3e0;

          color: #684476;

          font-size: 14px;

          font-weight: 850;

          letter-spacing: -0.4px;
        }


        /* ========================================================
           JOB INFORMATION
        ======================================================== */

        .job-content {
          min-width: 0;
        }

        .company-name {
          margin-bottom: 4px;

          color: #777078;

          font-size: 12px;

          font-weight: 650;
        }

        .job-title {
          margin: 0;

          color: #1d1a20;

          font-size: 19px;

          line-height: 1.25;

          letter-spacing: -0.4px;

          font-weight: 800;

          white-space: nowrap;

          overflow: hidden;

          text-overflow: ellipsis;
        }

        .verified {
          display: inline-flex;

          align-items: center;

          gap: 4px;

          margin-left: 7px;

          color: #8b858c;

          font-size: 10px;

          font-weight: 500;
        }

        .job-meta {
          display: flex;

          flex-wrap: wrap;

          gap: 13px;

          margin-top: 9px;
        }

        .meta-item {
          color: #77717a;

          font-size: 11px;
        }

        .meta-item strong {
          color: #565058;
          font-weight: 650;
        }


        /* ========================================================
           DESCRIPTION
        ======================================================== */

        .job-description {
          max-width: 720px;

          margin:
            10px
            0
            0;

          color: #8b858c;

          font-size: 11px;

          line-height: 1.55;

          display:
            -webkit-box;

          -webkit-line-clamp: 2;

          -webkit-box-orient: vertical;

          overflow: hidden;
        }


        /* ========================================================
           SKILLS
        ======================================================== */

        .skills {
          display: flex;

          flex-wrap: wrap;

          gap: 6px;

          margin-top: 10px;
        }

        .skill-pill {
          padding:
            5px
            9px;

          border:
            1px solid
            #e3dfe4;

          border-radius: 5px;

          background: #faf9fa;

          color: #716b73;

          font-size: 10px;

          font-weight: 600;
        }

        .more-pill {
          padding:
            5px
            9px;

          border-radius: 5px;

          background: #f1edf2;

          color: #684476;

          font-size: 10px;

          font-weight: 700;
        }


        /* ========================================================
           RIGHT SIDE
        ======================================================== */

        .job-score {
          display: flex;

          flex-direction: column;

          align-items: flex-end;

          gap: 12px;

          min-width: 120px;
        }

        .match-badge {
          padding:
            7px
            11px;

          border-radius: 7px;

          font-size: 11px;

          font-weight: 800;

          white-space: nowrap;
        }

        .match-high {
          background: #edf8f2;
          color: #26734c;
          border: 1px solid #d2eadc;
        }

        .match-medium {
          background: #f3eff6;
          color: #684476;
          border: 1px solid #ded3e2;
        }

        .match-low {
          background: #f7f4ef;
          color: #8a704d;
          border: 1px solid #eadfce;
        }

        .semantic {
          text-align: right;
        }

        .semantic-label {
          color: #aaa4aa;

          font-size: 9px;

          margin-bottom: 2px;
        }

        .semantic-value {
          color: #37313a;

          font-size: 13px;

          font-weight: 800;
        }

        .view-button {
          padding:
            8px
            13px;

          border:
            1px solid
            #ddd6df;

          border-radius: 8px;

          background: white;

          color: #684476;

          font-size: 10px;

          font-weight: 800;
        }


        /* ========================================================
           LOADING
        ======================================================== */

        .loading-list {
          display: flex;

          flex-direction: column;

          gap: 12px;
        }

        .skeleton {
          height: 142px;

          border:
            1px solid
            #e8e5e2;

          border-radius: 15px;

          background:
            linear-gradient(
              90deg,
              #ffffff 25%,
              #f0eeec 50%,
              #ffffff 75%
            );

          background-size: 200% 100%;

          animation:
            skeletonLoading 1.4s infinite;
        }

        @keyframes skeletonLoading {
          0% {
            background-position: 200% 0;
          }

          100% {
            background-position: -200% 0;
          }
        }


        /* ========================================================
           EMPTY
        ======================================================== */

        .empty-state {
          padding:
            75px
            25px;

          text-align: center;

          background: white;

          border:
            1px solid
            #e8e5e2;

          border-radius: 15px;
        }

        .empty-icon {
          width: 58px;
          height: 58px;

          display: flex;

          align-items: center;
          justify-content: center;

          margin:
            0
            auto
            16px;

          border-radius: 16px;

          background: #f0eaf2;

          color: #684476;

          font-size: 23px;
        }

        .empty-title {
          margin:
            0
            0
            7px;

          font-size: 18px;

          font-weight: 800;
        }

        .empty-text {
          margin: 0;

          color: #89838a;

          font-size: 13px;
        }


        /* ========================================================
           RESPONSIVE
        ======================================================== */

        @media (max-width: 850px) {

          .hero-section {
            padding:
              55px
              0
              90px;
          }

          .hero-title {
            font-size: 50px;
          }

          .main-search {
            grid-template-columns:
              1fr
              1fr
              auto;
          }

          .search-field + .search-field {
            border-left: none;
          }

          .job-card {
            grid-template-columns:
              56px
              minmax(0, 1fr);
          }

          .job-score {
            grid-column: 2;
            align-items: flex-start;
            flex-direction: row;
          }

          .semantic {
            text-align: left;
          }
        }


        @media (max-width: 650px) {

          .jobs-container {
            width:
              calc(100% - 24px);
          }

          .hero-section {
            padding:
              40px
              0
              75px;
          }

          .hero-title {
            font-size: 42px;

            letter-spacing: -2px;
          }

          .hero-description {
            font-size: 14px;
          }

          .search-wrapper {
            margin-top: -40px;
          }

          .main-search {
            display: flex;

            flex-direction: column;

            padding: 8px;
          }

          .search-field {
            border-bottom:
              1px solid
              #eeeae7;

            padding: 2px 0;
          }

          .search-button {
            width: 100%;
          }

          .filter-row {
            grid-template-columns: 1fr;

            padding:
              0
              8px
              8px;
          }

          .results-section {
            padding-top: 50px;
          }

          .results-header {
            flex-direction: column;

            align-items: flex-start;
          }

          .job-card {
            grid-template-columns:
              48px
              minmax(0, 1fr);

            padding:
              18px;
          }

          .company-logo {
            width: 46px;
            height: 46px;
          }

          .job-title {
            font-size: 16px;

            white-space: normal;
          }

          .job-score {
            grid-column: 1 / -1;

            flex-wrap: wrap;

            margin-top: 4px;
          }

          .view-button {
            display: none;
          }
        }

      `}</style>


      {/* ========================================================
          HERO
      ======================================================== */}

      <section className="hero-section">

        <div className="jobs-container">

          <div className="hero-content">

            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              AI-powered job search
            </div>

            <h1 className="hero-title">
              Find the right job.
              <br />
              Let AI find the{" "}
              <span className="hero-highlight">
                match.
              </span>
            </h1>

            <p className="hero-description">
              Discover opportunities that match your
              skills, experience and career goals using
              AI-powered semantic search.
            </p>

          </div>

        </div>

      </section>


      {/* ========================================================
          SEARCH
      ======================================================== */}

      <div className="search-wrapper">

        <div className="jobs-container">

          <form
            className="search-card"
            onSubmit={handleSearch}
          >

            <div className="main-search">

              {/* JOB SEARCH */}

              <div className="search-field">

                <span className="search-icon">
                  ⌕
                </span>

                <input
                  type="text"
                  value={query}
                  onChange={(event) =>
                    setQuery(event.target.value)
                  }
                  placeholder="Search by job title, skills or company"
                  className="search-input"
                />

              </div>


              {/* LOCATION */}

              <div className="search-field">

                <span className="search-icon">
                  ⌖
                </span>

                <input
                  type="text"
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                  placeholder="Search by city or country"
                  className="search-input location-input"
                />

              </div>


              {/* BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="search-button"
              >
                {loading
                  ? "Searching..."
                  : "Search jobs"}
              </button>

            </div>


            {/* FILTERS */}

            <div className="filter-row">

              <input
                type="text"
                value={skill}
                onChange={(event) =>
                  setSkill(event.target.value)
                }
                placeholder="Skill"
                className="filter-input"
              />

              <input
                type="number"
                min="0"
                value={experience}
                onChange={(event) =>
                  setExperience(event.target.value)
                }
                placeholder="Experience in years"
                className="filter-input"
              />

              <div className="filter-input" style={{
                display: "flex",
                alignItems: "center",
                color: "#8a848b"
              }}>
                AI semantic matching
              </div>

            </div>

          </form>


          {/* POPULAR */}

          <div className="quick-searches">

            <span className="popular-label">
              Popular:
            </span>

            {quickSearches.map((item) => (

              <button
                key={item}
                type="button"
                onClick={() =>
                  handleQuickSearch(item)
                }
                className="quick-button"
              >
                {item}
              </button>

            ))}

          </div>


          {/* ERROR */}

          {error && (
            <div className="error-box">
              ⚠ {error}
            </div>
          )}

        </div>

      </div>


      {/* ========================================================
          RESULTS
      ======================================================== */}

      <main className="jobs-container results-section">

        {searched && !error && (

          <div className="results-header">

            <div>

              <h2 className="results-title">

                <span className="results-number">
                  {jobs.length}
                </span>{" "}

                <span className="results-muted">
                  AI-matched jobs
                </span>

              </h2>

              <p className="results-subtitle">
                Ranked according to relevance to your search
              </p>

            </div>

            <div className="ai-ranked">
              <span className="ai-star">✦</span>
              AI Ranked
              <span>•</span>
              Best Match
            </div>

          </div>

        )}


        {/* ======================================================
            LOADING
        ====================================================== */}

        {loading && (

          <div className="loading-list">

            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="skeleton"
              />
            ))}

          </div>

        )}


        {/* ======================================================
            EMPTY
        ====================================================== */}

        {searched &&
          !loading &&
          !error &&
          jobs.length === 0 && (

            <div className="empty-state">

              <div className="empty-icon">
                ⌕
              </div>

              <h3 className="empty-title">
                No matching jobs found
              </h3>

              <p className="empty-text">
                Try changing your keywords,
                location or skill.
              </p>

            </div>

          )}


        {/* ======================================================
            JOB LIST
        ====================================================== */}

        {!loading &&
          !error &&
          jobs.length > 0 && (

            <div className="job-list">

              {jobs.map((job, index) => {

                const matchScore =
                  getMatchScore(job);

                const semanticScore =
                  getSemanticScore(job);

                const matchClass =
                  getMatchClass(matchScore);

                return (

                  <article
                    key={
                      job.id ||
                      job.source_job_id ||
                      index
                    }
                    className="job-card"
                  >

                    {/* COMPANY */}

                    <div className="company-logo">

                      {getInitials(
                        job.company
                      )}

                    </div>


                    {/* CONTENT */}

                    <div className="job-content">

                      <div className="company-name">

                        {job.company ||
                          "Company"}

                        <span className="verified">
                          ✓ Verified opportunity
                        </span>

                      </div>


                      <h3 className="job-title">
                        {job.title ||
                          "Untitled Job"}
                      </h3>


                      <div className="job-meta">

                        <span className="meta-item">
                          📍{" "}
                          <strong>
                            {job.location ||
                              "Location not specified"}
                          </strong>
                        </span>

                        {job.employment_type && (
                          <span className="meta-item">
                            💼{" "}
                            <strong>
                              {job.employment_type}
                            </strong>
                          </span>
                        )}

                      </div>


                      {job.description && (

                        <p className="job-description">
                          {job.description}
                        </p>

                      )}


                      {job.skills &&
                        job.skills.length > 0 && (

                          <div className="skills">

                            {job.skills
                              .slice(0, 6)
                              .map(
                                (
                                  jobSkill,
                                  skillIndex
                                ) => (

                                  <span
                                    key={skillIndex}
                                    className="skill-pill"
                                  >
                                    {jobSkill}
                                  </span>

                                )
                              )}

                            {job.skills.length > 6 && (

                              <span className="more-pill">
                                +
                                {job.skills.length - 6}
                              </span>

                            )}

                          </div>

                        )}

                    </div>


                    {/* SCORE */}

                    <div className="job-score">

                      <div
                        className={`match-badge ${matchClass}`}
                      >
                        ✦ {matchScore}% Match
                      </div>

                      <div className="semantic">

                        <div className="semantic-label">
                          Semantic match
                        </div>

                        <div className="semantic-value">
                          {semanticScore}%
                        </div>

                      </div>

                      <button
                        type="button"
                        className="view-button"
                      >
                        View job →
                      </button>

                    </div>

                  </article>

                );

              })}

            </div>

          )}

      </main>

    </div>
  );
}

export default Jobs;