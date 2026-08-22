import { useState } from "react";
import { assistantSearch } from "../services/api";

function ChatWindow() {
  const [query, setQuery] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

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

      const data = await assistantSearch({
        query: query.trim(),
        limit: 10,
      });

      setJobs(data.jobs || []);
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

  return (
    <div
      style={{
        background: "#ffffff",
      }}
    >
      {/* =====================================================
          SEARCH SECTION
      ===================================================== */}

      <div
        style={{
          padding: "28px 34px 30px",
          background: "#ffffff",
        }}
      >
        <form onSubmit={handleSearch}>
          <div
            style={{
              border: "1px solid #e1dce1",
              borderRadius: "17px",
              background: "#ffffff",
              overflow: "hidden",
              boxShadow:
                "0 5px 18px rgba(55, 35, 55, 0.035)",
            }}
          >
            {/* TEXTAREA */}

            <textarea
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Example: Find Python Data Scientist jobs in Bengaluru"
              rows={4}
              style={{
                width: "100%",
                minHeight: "125px",
                boxSizing: "border-box",
                border: "none",
                outline: "none",
                resize: "vertical",
                padding: "18px",
                background: "#ffffff",
                color: "#17141a",
                fontSize: "14px",
                lineHeight: "1.6",
                fontFamily:
                  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
            />

            {/* SEARCH FOOTER */}

            <div
              style={{
                borderTop: "1px solid #eee9ed",
                padding: "9px 10px 9px 15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "15px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  color: "#99929b",
                  fontSize: "10px",
                  fontWeight: "500",
                }}
              >
                ✦ AI-powered semantic job search
              </span>

              <button
                type="submit"
                disabled={loading}
                style={{
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px 17px",
                  background: "#6b3f63",
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: "750",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                }}
              >
                {loading ? "Finding Jobs..." : "Search Jobs →"}
              </button>
            </div>
          </div>
        </form>

        {/* =====================================================
            QUICK SEARCHES
        ===================================================== */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
            marginTop: "14px",
          }}
        >
          <span
            style={{
              color: "#99929b",
              fontSize: "10px",
              fontWeight: "600",
              marginRight: "2px",
            }}
          >
            Try:
          </span>

          {[
            "Python Developer",
            "Data Scientist Bengaluru",
            "Remote AI Engineer",
          ].map((text) => (
            <button
              key={text}
              type="button"
              onClick={() => setQuery(text)}
              style={{
                border: "1px solid #e4dfe5",
                background: "#ffffff",
                color: "#625b63",
                borderRadius: "999px",
                padding: "6px 10px",
                fontSize: "10px",
                cursor: "pointer",
              }}
            >
              {text}
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div
          style={{
            margin: "0 34px 25px",
            padding: "12px 14px",
            borderRadius: "10px",
            background: "#fff5f5",
            border: "1px solid #f0d4d4",
            color: "#b42318",
            fontSize: "12px",
          }}
        >
          ⚠ {error}
        </div>
      )}

      {/* =====================================================
          RESULTS
      ===================================================== */}

      {searched && !loading && !error && (
        <div
          style={{
            borderTop: "1px solid #eee9ed",
            padding: "28px 34px 34px",
            background: "#fcfbfc",
          }}
        >
          {/* RESULTS HEADER */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "15px",
              marginBottom: "18px",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  flexWrap: "wrap",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "20px",
                    fontWeight: "800",
                    color: "#17141a",
                    letterSpacing: "-0.4px",
                  }}
                >
                  {jobs.length} Jobs Found
                </h2>

                {jobs.length > 0 && (
                  <span
                    style={{
                      padding: "5px 9px",
                      borderRadius: "999px",
                      background: "#f1e8f0",
                      color: "#6b3f63",
                      fontSize: "9px",
                      fontWeight: "800",
                    }}
                  >
                    AI MATCHED
                  </span>
                )}
              </div>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#99929b",
                  fontSize: "11px",
                }}
              >
                Ranked according to AI relevance
              </p>
            </div>
          </div>

          {/* =====================================================
              NO RESULTS
          ===================================================== */}

          {jobs.length === 0 ? (
            <div
              style={{
                padding: "50px 20px",
                textAlign: "center",
                background: "#ffffff",
                border: "1px dashed #ddd6df",
                borderRadius: "15px",
              }}
            >
              <div
                style={{
                  fontSize: "28px",
                  marginBottom: "10px",
                }}
              >
                🔎
              </div>

              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#403a42",
                }}
              >
                No matching jobs found
              </div>

              <div
                style={{
                  marginTop: "5px",
                  fontSize: "11px",
                  color: "#aaa3ab",
                }}
              >
                Try changing your search criteria.
              </div>
            </div>
          ) : (
            /* ===================================================
               JOB RESULTS
            =================================================== */

            <div
              style={{
                display: "grid",
                gap: "12px",
              }}
            >
              {jobs.map((job, index) => {
                const matchScore = Math.round(
                  (job.final_score || 0) * 100
                );

                const semanticScore = (
                  (job.similarity_score || 0) * 100
                ).toFixed(1);

                return (
                  <div
                    key={job.id || index}
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e5e0e6",
                      borderRadius: "15px",
                      padding: "19px",
                      transition:
                        "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.transform =
                        "translateY(-2px)";

                      event.currentTarget.style.boxShadow =
                        "0 10px 25px rgba(55, 35, 55, 0.07)";
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.transform =
                        "translateY(0)";

                      event.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {/* JOB HEADER */}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "15px",
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            margin: "0 0 5px",
                            color: "#17141a",
                            fontSize: "15px",
                            fontWeight: "800",
                            lineHeight: "1.4",
                          }}
                        >
                          {job.title}
                        </h3>

                        <div
                          style={{
                            color: "#625b63",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          {job.company}
                        </div>
                      </div>

                      {/* MATCH */}

                      <div
                        style={{
                          flexShrink: 0,
                          padding: "6px 9px",
                          borderRadius: "8px",
                          background:
                            matchScore >= 70
                              ? "#edf8f3"
                              : "#f1e8f0",
                          color:
                            matchScore >= 70
                              ? "#237052"
                              : "#6b3f63",
                          fontSize: "10px",
                          fontWeight: "800",
                        }}
                      >
                        ✦ {matchScore}% Match
                      </div>
                    </div>

                    {/* LOCATION */}

                    <div
                      style={{
                        marginTop: "9px",
                        marginBottom: "11px",
                        color: "#77717a",
                        fontSize: "11px",
                      }}
                    >
                      📍 {job.location || "Location not specified"}
                    </div>

                    {/* SKILLS */}

                    {job.skills && job.skills.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "6px",
                          marginBottom: "14px",
                        }}
                      >
                        {job.skills.slice(0, 8).map(
                          (skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              style={{
                                background: "#f8f5f8",
                                color: "#62505f",
                                border: "1px solid #e8e0e7",
                                padding: "5px 8px",
                                borderRadius: "999px",
                                fontSize: "9px",
                                fontWeight: "600",
                              }}
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>
                    )}

                    {/* SCORES */}

                    <div
                      style={{
                        borderTop: "1px solid #f0edf1",
                        paddingTop: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "15px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            color: "#403a42",
                            fontSize: "10px",
                            fontWeight: "700",
                          }}
                        >
                          AI Match{" "}
                          <strong
                            style={{
                              color: "#6b3f63",
                            }}
                          >
                            {matchScore}%
                          </strong>
                        </span>

                        <span
                          style={{
                            color: "#99929b",
                            fontSize: "10px",
                          }}
                        >
                          Semantic{" "}
                          <strong
                            style={{
                              color: "#625b63",
                            }}
                          >
                            {semanticScore}%
                          </strong>
                        </span>
                      </div>

                      <span
                        style={{
                          color: "#aaa3ab",
                          fontSize: "9px",
                        }}
                      >
                        AI ranked result
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatWindow;