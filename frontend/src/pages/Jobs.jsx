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
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 20px",
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >

        <h1
          style={{
            fontSize: "36px",
            marginBottom: "8px",
            color: "#111827",
          }}
        >
          AI-Powered Job Board
        </h1>

        <p
          style={{
            color: "#6b7280",
            fontSize: "17px",
            marginBottom: "30px",
          }}
        >
          Find relevant jobs using AI-powered
          semantic search.
        </p>


        {/* ================================================= */}
        {/* SEARCH BOX */}
        {/* ================================================= */}

        <form
          onSubmit={handleSearch}
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "14px",
            boxShadow:
              "0 4px 20px rgba(0,0,0,0.08)",
            marginBottom: "30px",
          }}
        >

          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            What kind of job are you looking for?
          </label>

          <input
            type="text"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Example: Python Data Scientist with machine learning experience"
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "16px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              boxSizing: "border-box",
              marginBottom: "18px",
            }}
          />


          {/* FILTERS */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
            }}
          >

            <div>

              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "6px",
                }}
              >
                Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
                placeholder="Bengaluru"
                style={{
                  width: "100%",
                  padding: "11px",
                  border:
                    "1px solid #d1d5db",
                  borderRadius: "7px",
                  boxSizing: "border-box",
                }}
              />

            </div>


            <div>

              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "6px",
                }}
              >
                Skill
              </label>

              <input
                type="text"
                value={skill}
                onChange={(event) =>
                  setSkill(event.target.value)
                }
                placeholder="Python"
                style={{
                  width: "100%",
                  padding: "11px",
                  border:
                    "1px solid #d1d5db",
                  borderRadius: "7px",
                  boxSizing: "border-box",
                }}
              />

            </div>


            <div>

              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  marginBottom: "6px",
                }}
              >
                Experience
              </label>

              <input
                type="number"
                min="0"
                value={experience}
                onChange={(event) =>
                  setExperience(event.target.value)
                }
                placeholder="3 years"
                style={{
                  width: "100%",
                  padding: "11px",
                  border:
                    "1px solid #d1d5db",
                  borderRadius: "7px",
                  boxSizing: "border-box",
                }}
              />

            </div>

          </div>


          {/* SEARCH BUTTON */}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "20px",
              padding: "13px 28px",
              border: "none",
              borderRadius: "8px",
              background: "#2563eb",
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? "Searching..."
              : "Search with AI"}
          </button>

        </form>


        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}


        {/* ================================================= */}
        {/* RESULTS */}
        {/* ================================================= */}

        {searched && !loading && !error && (
          <div>

            <h2
              style={{
                color: "#111827",
                marginBottom: "20px",
              }}
            >
              {jobs.length} AI-Matched Jobs
            </h2>


            {jobs.length === 0 ? (

              <div
                style={{
                  background: "white",
                  padding: "30px",
                  borderRadius: "12px",
                  textAlign: "center",
                  color: "#6b7280",
                }}
              >
                No matching jobs found.
              </div>

            ) : (

              <div
                style={{
                  display: "grid",
                  gap: "18px",
                }}
              >

                {jobs.map((job) => (

                  <div
                    key={job.id}
                    style={{
                      background: "white",
                      padding: "22px",
                      borderRadius: "12px",
                      boxShadow:
                        "0 2px 10px rgba(0,0,0,0.06)",
                    }}
                  >

                    {/* JOB TITLE */}

                    <h3
                      style={{
                        marginTop: 0,
                        marginBottom: "7px",
                        color: "#111827",
                        fontSize: "21px",
                      }}
                    >
                      {job.title}
                    </h3>


                    {/* COMPANY */}

                    <div
                      style={{
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "6px",
                      }}
                    >
                      {job.company}
                    </div>


                    {/* LOCATION */}

                    <div
                      style={{
                        color: "#6b7280",
                        marginBottom: "14px",
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
                            gap: "7px",
                            marginBottom: "15px",
                          }}
                        >

                          {job.skills
                            .slice(0, 8)
                            .map(
                              (jobSkill, index) => (

                                <span
                                  key={index}
                                  style={{
                                    background:
                                      "#eff6ff",
                                    color:
                                      "#1d4ed8",
                                    padding:
                                      "5px 10px",
                                    borderRadius:
                                      "20px",
                                    fontSize:
                                      "13px",
                                  }}
                                >
                                  {jobSkill}
                                </span>

                              )
                            )}

                        </div>

                      )}


                    {/* SCORE */}

                    <div
                      style={{
                        display: "flex",
                        gap: "15px",
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >

                      <strong>
                        AI Match:{" "}
                        {Math.round(
                          (job.final_score || 0) *
                            100
                        )}
                        %
                      </strong>

                      <span
                        style={{
                          color: "#6b7280",
                          fontSize: "14px",
                        }}
                      >
                        Semantic:{" "}
                        {(
                          (job.similarity_score ||
                            0) * 100
                        ).toFixed(1)}
                        %
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>
        )}

      </div>

    </div>
  );
}


export default Jobs;