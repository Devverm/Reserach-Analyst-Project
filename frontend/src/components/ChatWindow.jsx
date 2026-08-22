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
        err.message ||
        "Something went wrong while searching."
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
        borderRadius: "16px",
        padding: "28px",
      }}
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "14px",
          marginBottom: "22px",
        }}
      >

        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background:
              "linear-gradient(135deg, #4f46e5, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "20px",
            flexShrink: 0,
            boxShadow:
              "0 7px 18px rgba(99, 102, 241, 0.25)",
          }}
        >
          ✦
        </div>


        <div>

          <h2
            style={{
              margin: "0 0 5px",
              fontSize: "22px",
              fontWeight: "800",
              color: "#111827",
              letterSpacing: "-0.4px",
            }}
          >
            AI Job Assistant
          </h2>

          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: "13px",
              lineHeight: "1.5",
            }}
          >
            Describe the opportunity you're looking for
            and let AI find relevant jobs.
          </p>

        </div>

      </div>


      {/* =====================================================
          SEARCH AREA
      ===================================================== */}

      <form onSubmit={handleSearch}>

        <div
          style={{
            position: "relative",
          }}
        >

          <textarea
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Example: Find Python Data Scientist jobs in Bengaluru"
            rows={4}
            style={{
              width: "100%",
              padding: "16px 17px",
              fontSize: "14px",
              lineHeight: "1.6",
              color: "#111827",
              background: "#fafbff",
              border: "1px solid #e2e5ee",
              borderRadius: "13px",
              boxSizing: "border-box",
              resize: "vertical",
              outline: "none",
              fontFamily:
                "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              transition: "all 0.2s ease",
            }}
            onFocus={(event) => {
              event.target.style.border =
                "1px solid #8b5cf6";
              event.target.style.boxShadow =
                "0 0 0 4px rgba(139, 92, 246, 0.08)";
            }}
            onBlur={(event) => {
              event.target.style.border =
                "1px solid #e2e5ee";
              event.target.style.boxShadow = "none";
            }}
          />

        </div>


        {/* ===================================================
            SEARCH FOOTER
        =================================================== */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "15px",
            marginTop: "12px",
            flexWrap: "wrap",
          }}
        >

          <span
            style={{
              color: "#9ca3af",
              fontSize: "11px",
            }}
          >
            ✦ AI-powered semantic job search
          </span>


          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "11px 20px",
              border: "none",
              borderRadius: "10px",
              background:
                "linear-gradient(135deg, #4f46e5, #7c3aed)",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: "750",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              opacity: loading ? 0.7 : 1,
              boxShadow:
                "0 6px 16px rgba(99, 102, 241, 0.20)",
              transition: "transform 0.2s ease",
            }}
          >
            {loading
              ? "Finding Jobs..."
              : "Ask AI Assistant  →"}
          </button>

        </div>

      </form>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#fff1f2",
            border: "1px solid #fecdd3",
            color: "#be123c",
            padding: "13px 15px",
            borderRadius: "11px",
            marginTop: "20px",
            fontSize: "13px",
          }}
        >
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}


      {/* =====================================================
          SEARCH RESULTS
      ===================================================== */}

      {searched && !loading && !error && (
        <div
          style={{
            marginTop: "32px",
          }}
        >

          {/* RESULTS HEADER */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "15px",
              gap: "10px",
            }}
          >

            <div>

              <h3
                style={{
                  margin: 0,
                  color: "#111827",
                  fontSize: "19px",
                  fontWeight: "800",
                  letterSpacing: "-0.3px",
                }}
              >
                {jobs.length} Jobs Found
              </h3>

              <p
                style={{
                  margin: "4px 0 0",
                  color: "#9ca3af",
                  fontSize: "11px",
                }}
              >
                Ranked by AI relevance
              </p>

            </div>


            {jobs.length > 0 && (
              <div
                style={{
                  padding: "6px 10px",
                  borderRadius: "999px",
                  background: "#f5f3ff",
                  color: "#6d28d9",
                  fontSize: "10px",
                  fontWeight: "700",
                }}
              >
                AI MATCHED
              </div>
            )}

          </div>


          {/* NO RESULTS */}

          {jobs.length === 0 ? (

            <div
              style={{
                padding: "42px 20px",
                textAlign: "center",
                background: "#fafbff",
                border: "1px dashed #dfe3ec",
                borderRadius: "13px",
                color: "#6b7280",
              }}
            >

              <div
                style={{
                  fontSize: "30px",
                  marginBottom: "10px",
                }}
              >
                🔎
              </div>

              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#374151",
                  marginBottom: "4px",
                }}
              >
                No matching jobs found
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#9ca3af",
                }}
              >
                Try changing your search criteria.
              </div>

            </div>

          ) : (

            /* =================================================
               JOB CARDS
            ================================================= */

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
                      border: "1px solid #e8eaf0",
                      borderRadius: "14px",
                      padding: "18px",
                      transition:
                        "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                    }}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.transform =
                        "translateY(-2px)";
                      event.currentTarget.style.boxShadow =
                        "0 10px 25px rgba(15, 23, 42, 0.07)";
                      event.currentTarget.style.borderColor =
                        "#d8d2ff";
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.transform =
                        "translateY(0)";
                      event.currentTarget.style.boxShadow =
                        "none";
                      event.currentTarget.style.borderColor =
                        "#e8eaf0";
                    }}
                  >

                    {/* JOB TOP */}

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
                            color: "#111827",
                            fontSize: "16px",
                            fontWeight: "800",
                            lineHeight: "1.35",
                          }}
                        >
                          {job.title}
                        </h3>


                        <div
                          style={{
                            color: "#4b5563",
                            fontSize: "13px",
                            fontWeight: "650",
                          }}
                        >
                          {job.company}
                        </div>

                      </div>


                      {/* MATCH BADGE */}

                      <div
                        style={{
                          flexShrink: 0,
                          padding: "6px 9px",
                          borderRadius: "8px",
                          background:
                            matchScore >= 70
                              ? "#ecfdf5"
                              : "#f5f3ff",
                          color:
                            matchScore >= 70
                              ? "#047857"
                              : "#6d28d9",
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
                        color: "#6b7280",
                        fontSize: "12px",
                      }}
                    >
                      📍 {job.location || "Location not specified"}
                    </div>


                    {/* SKILLS */}

                    {job.skills &&
                      job.skills.length > 0 && (

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "6px",
                          marginBottom: "14px",
                        }}
                      >

                        {job.skills
                          .slice(0, 8)
                          .map((skill, skillIndex) => (

                            <span
                              key={skillIndex}
                              style={{
                                background: "#f5f3ff",
                                color: "#5b21b6",
                                border:
                                  "1px solid #ede9fe",
                                padding: "5px 8px",
                                borderRadius: "999px",
                                fontSize: "10px",
                                fontWeight: "600",
                              }}
                            >
                              {skill}
                            </span>

                          ))}

                      </div>

                    )}


                    {/* SCORE SECTION */}

                    <div
                      style={{
                        borderTop:
                          "1px solid #f0f1f5",
                        paddingTop: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "15px",
                        flexWrap: "wrap",
                      }}
                    >

                      <div
                        style={{
                          display: "flex",
                          gap: "15px",
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >

                        <span
                          style={{
                            fontSize: "11px",
                            color: "#374151",
                            fontWeight: "700",
                          }}
                        >
                          AI Match{" "}
                          <strong
                            style={{
                              color: "#4f46e5",
                            }}
                          >
                            {matchScore}%
                          </strong>
                        </span>


                        <span
                          style={{
                            fontSize: "11px",
                            color: "#9ca3af",
                          }}
                        >
                          Semantic{" "}
                          <strong
                            style={{
                              color: "#6b7280",
                            }}
                          >
                            {semanticScore}%
                          </strong>
                        </span>

                      </div>


                      <span
                        style={{
                          color: "#9ca3af",
                          fontSize: "10px",
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