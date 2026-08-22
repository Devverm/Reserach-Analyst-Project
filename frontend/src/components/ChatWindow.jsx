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
        background: "white",
        borderRadius: "14px",
        padding: "25px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >

      <h2
        style={{
          marginTop: 0,
          color: "#111827",
        }}
      >
        AI Job Assistant
      </h2>

      <p
        style={{
          color: "#6b7280",
          marginBottom: "20px",
        }}
      >
        Describe the kind of job you are looking for in
        natural language.
      </p>


      <form onSubmit={handleSearch}>

        <textarea
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder="Example: Find Python Data Scientist jobs in Bengaluru"
          rows={4}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "16px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            boxSizing: "border-box",
            resize: "vertical",
          }}
        />


        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "15px",
            padding: "13px 25px",
            border: "none",
            borderRadius: "8px",
            background: "#7c3aed",
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
            ? "Finding Jobs..."
            : "Ask AI Assistant"}
        </button>

      </form>


      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "15px",
            borderRadius: "8px",
            marginTop: "20px",
          }}
        >
          {error}
        </div>
      )}


      {searched && !loading && !error && (
        <div style={{ marginTop: "30px" }}>

          <h3 style={{ color: "#111827" }}>
            {jobs.length} Jobs Found
          </h3>


          {jobs.length === 0 ? (

            <div
              style={{
                padding: "25px",
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
                gap: "15px",
              }}
            >

              {jobs.map((job) => (

                <div
                  key={job.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    padding: "18px",
                  }}
                >

                  <h3
                    style={{
                      marginTop: 0,
                      marginBottom: "6px",
                      color: "#111827",
                    }}
                  >
                    {job.title}
                  </h3>


                  <div
                    style={{
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "5px",
                    }}
                  >
                    {job.company}
                  </div>


                  <div
                    style={{
                      color: "#6b7280",
                      marginBottom: "12px",
                    }}
                  >
                    📍 {job.location || "Location not specified"}
                  </div>


                  {job.skills &&
                    job.skills.length > 0 && (

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        marginBottom: "12px",
                      }}
                    >

                      {job.skills
                        .slice(0, 8)
                        .map((skill, index) => (

                          <span
                            key={index}
                            style={{
                              background: "#f3e8ff",
                              color: "#6b21a8",
                              padding: "5px 9px",
                              borderRadius: "20px",
                              fontSize: "13px",
                            }}
                          >
                            {skill}
                          </span>

                        ))}

                    </div>

                  )}


                  <div
                    style={{
                      display: "flex",
                      gap: "15px",
                      flexWrap: "wrap",
                    }}
                  >

                    <strong>
                      AI Match:{" "}
                      {Math.round(
                        (job.final_score || 0) * 100
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
                        (job.similarity_score || 0) * 100
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
  );
}


export default ChatWindow;