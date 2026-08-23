import { useState } from "react";
import RecommendationCard from "../components/RecommendationCard";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL !== undefined
    ? import.meta.env.VITE_API_BASE_URL
    : "http://127.0.0.1:8000";

function Recommendations() {
  const [query, setQuery] = useState(
    "Python Data Scientist with Machine Learning experience in Bengaluru"
  );

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRecommendations = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/recommendations?query=${encodeURIComponent(
          query
        )}`
      );

      const data = await response.json();

      if (Array.isArray(data)) {
        setJobs(data);
      } else if (Array.isArray(data.jobs)) {
        setJobs(data.jobs);
      } else if (Array.isArray(data.results)) {
        setJobs(data.results);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error("Recommendation error:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const popularSearches = [
    "Python Data Scientist",
    "Data Scientist Bengaluru",
    "Remote AI Engineer",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",

        // SAME CREAMY BACKGROUND AS THE OTHER SECTIONS
        background: "#f8f7f2",

        color: "#17131a",

        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

        padding: "42px 24px 80px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1050px",
          margin: "0 auto",
        }}
      >
        {/* =====================================================
            PROFILE SEARCH CARD
        ===================================================== */}

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e1e0",
            borderRadius: "20px",
            padding: "26px",
            boxShadow: "0 4px 18px rgba(40, 32, 35, 0.04)",
          }}
        >
          {/* HEADER */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              paddingBottom: "18px",
              borderBottom: "1px solid #eeeae8",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "11px",
                background: "#684461",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "17px",
              }}
            >
              ✦
            </div>

            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "20px",
                  lineHeight: "1.2",
                  fontWeight: "750",
                  letterSpacing: "-0.4px",
                  color: "#17131a",
                }}
              >
                Build your job profile
              </h1>

              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "11px",
                  color: "#8a8388",
                }}
              >
                Describe the role, skills, experience or location you're
                targeting.
              </p>
            </div>
          </div>

          {/* TEXT AREA */}

          <div
            style={{
              marginTop: "16px",
              border: "1px solid #e7e3e1",
              borderRadius: "13px",
              overflow: "hidden",
              background: "#ffffff",
            }}
          >
            <textarea
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Describe the opportunity you're looking for..."
              style={{
                width: "100%",
                minHeight: "125px",
                boxSizing: "border-box",
                border: "none",
                outline: "none",
                resize: "vertical",
                padding: "16px",
                fontFamily:
                  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fontSize: "13px",
                color: "#302a30",
                background: "#ffffff",
              }}
            />

            {/* BOTTOM BAR */}

            <div
              style={{
                borderTop: "1px solid #eeeae8",
                padding: "11px 13px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "15px",
              }}
            >
              <span
                style={{
                  color: "#9b9599",
                  fontSize: "10px",
                }}
              >
                ✦ Personalized semantic matching
              </span>

              <button
                onClick={getRecommendations}
                disabled={loading}
                style={{
                  border: "none",
                  borderRadius: "9px",
                  padding: "9px 16px",
                  background: "#684461",
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: "700",
                  cursor: loading ? "default" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Finding..." : "Get Recommendations →"}
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
            POPULAR SEARCHES
        ===================================================== */}

        <div
          style={{
            marginTop: "14px",
          }}
        >
          <div
            style={{
              color: "#8f898e",
              fontSize: "10px",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            Popular searches
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "7px",
            }}
          >
            {popularSearches.map((search) => (
              <button
                key={search}
                onClick={() => setQuery(search)}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e1e0",
                  borderRadius: "999px",
                  padding: "7px 11px",
                  color: "#6f676e",
                  fontSize: "10px",
                  cursor: "pointer",
                }}
              >
                ↗ {search}
              </button>
            ))}
          </div>
        </div>

        {/* =====================================================
            RESULTS
        ===================================================== */}

        {jobs.length > 0 && (
          <div
            style={{
              marginTop: "38px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "23px",
                    fontWeight: "750",
                    letterSpacing: "-0.5px",
                    color: "#17131a",
                  }}
                >
                  {jobs.length} Recommended Jobs
                </h2>

                <p
                  style={{
                    margin: "5px 0 0",
                    color: "#969095",
                    fontSize: "11px",
                  }}
                >
                  Ranked according to your profile
                </p>
              </div>

              <span
                style={{
                  background: "#f5eef5",
                  border: "1px solid #eadfea",
                  color: "#684461",
                  borderRadius: "999px",
                  padding: "6px 10px",
                  fontSize: "10px",
                  fontWeight: "700",
                }}
              >
                ✦ AI MATCHED
              </span>
            </div>

            {/* =================================================
                RECOMMENDATION CARDS
            ================================================= */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {jobs.map((job, index) => (
                <RecommendationCard
                  key={job.id || job.job_id || index}
                  job={job}
                />
              ))}
            </div>
          </div>
        )}

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {!loading && jobs.length === 0 && (
          <div
            style={{
              marginTop: "38px",
              textAlign: "center",
              color: "#9a9398",
              fontSize: "11px",
            }}
          >
            Enter your target role above to get personalized recommendations.
          </div>
        )}
      </div>
    </div>
  );
}

export default Recommendations;