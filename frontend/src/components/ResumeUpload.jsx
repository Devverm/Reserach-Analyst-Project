import { useState } from "react";


function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");


  // ============================================================
  // FILE SELECTION
  // ============================================================

  function handleFileChange(event) {
    const selectedFile = event.target.files[0];

    setError("");
    setResult(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const fileName = selectedFile.name.toLowerCase();

    if (
      !fileName.endsWith(".pdf") &&
      !fileName.endsWith(".docx")
    ) {
      setFile(null);
      setError("Please upload a PDF or DOCX resume.");
      return;
    }

    setFile(selectedFile);
  }


  // ============================================================
  // UPLOAD RESUME
  // ============================================================

  async function handleUpload() {
    if (!file) {
      setError("Please select a resume first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        "http://127.0.0.1:8000/api/resume/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          `Resume upload failed: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();

      setResult(data);

    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while processing the resume."
      );
    } finally {
      setLoading(false);
    }
  }


  // ============================================================
  // SCORE HELPER
  // ============================================================

  function percentage(value) {
    return Math.round((value || 0) * 100);
  }


  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        background: "#f3f6fb",
        padding: "50px 25px 80px",
      }}
    >

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >

        {/* ======================================================
            PAGE HEADER
        ====================================================== */}

        <div
          style={{
            marginBottom: "30px",
          }}
        >
          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "38px",
              color: "#111827",
            }}
          >
            Resume AI Matching
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "18px",
              color: "#6b7280",
            }}
          >
            Upload your resume and discover jobs that match
            your skills, experience, and profile.
          </p>
        </div>


        {/* ======================================================
            UPLOAD CARD
        ====================================================== */}

        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "35px",
            boxShadow:
              "0 8px 25px rgba(15, 23, 42, 0.08)",
            border: "1px solid #e5e7eb",
          }}
        >

          <h2
            style={{
              marginTop: 0,
              marginBottom: "8px",
              color: "#111827",
              fontSize: "24px",
            }}
          >
            Upload Your Resume
          </h2>

          <p
            style={{
              color: "#6b7280",
              marginBottom: "25px",
            }}
          >
            Our AI will analyze your resume and find the
            most relevant job opportunities.
          </p>


          {/* FILE UPLOAD AREA */}

          <label
            style={{
              display: "block",
              border: "2px dashed #cbd5e1",
              borderRadius: "12px",
              padding: "35px 20px",
              textAlign: "center",
              cursor: "pointer",
              background: "#f8fafc",
            }}
          >

            <div
              style={{
                fontSize: "42px",
                marginBottom: "10px",
              }}
            >
              📄
            </div>

            <div
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#1f2937",
              }}
            >
              Choose your resume
            </div>

            <div
              style={{
                marginTop: "8px",
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              PDF or DOCX files supported
            </div>

            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              style={{
                display: "none",
              }}
            />

          </label>


          {/* SELECTED FILE */}

          {file && (
            <div
              style={{
                marginTop: "20px",
                padding: "15px 18px",
                borderRadius: "10px",
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >

              <span
                style={{
                  fontSize: "22px",
                }}
              >
                📎
              </span>

              <div>
                <div
                  style={{
                    fontWeight: "600",
                    color: "#1e3a8a",
                  }}
                >
                  {file.name}
                </div>

                <div
                  style={{
                    color: "#64748b",
                    fontSize: "13px",
                    marginTop: "3px",
                  }}
                >
                  Ready for AI analysis
                </div>
              </div>

            </div>
          )}


          {/* ERROR */}

          {error && (
            <div
              style={{
                marginTop: "18px",
                padding: "14px 16px",
                borderRadius: "8px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#b91c1c",
                fontWeight: "500",
              }}
            >
              {error}
            </div>
          )}


          {/* ANALYZE BUTTON */}

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            style={{
              marginTop: "25px",
              padding: "14px 28px",
              border: "none",
              borderRadius: "9px",
              background:
                !file || loading
                  ? "#94a3b8"
                  : "#7c3aed",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "700",
              cursor:
                !file || loading
                  ? "not-allowed"
                  : "pointer",
              boxShadow:
                !file || loading
                  ? "none"
                  : "0 5px 15px rgba(124, 58, 237, 0.25)",
            }}
          >
            {loading
              ? "Analyzing Resume..."
              : "Analyze Resume"}
          </button>

        </div>


        {/* ======================================================
            RESULTS
        ====================================================== */}

        {result && (
          <div
            style={{
              marginTop: "40px",
            }}
          >

            {/* SUCCESS HEADER */}

            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "28px",
                border: "1px solid #d1fae5",
                boxShadow:
                  "0 6px 20px rgba(15, 23, 42, 0.06)",
              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >

                <span
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "#dcfce7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                  }}
                >
                  ✓
                </span>

                <div>

                  <h2
                    style={{
                      margin: 0,
                      color: "#111827",
                    }}
                  >
                    Resume Analysis Complete
                  </h2>

                  <p
                    style={{
                      margin:
                        "5px 0 0",
                      color: "#15803d",
                    }}
                  >
                    Your resume was successfully analyzed.
                  </p>

                </div>

              </div>


              {/* RESUME DETAILS */}

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                  marginTop: "25px",
                }}
              >

                <div
                  style={{
                    background: "#f8fafc",
                    padding: "15px 20px",
                    borderRadius: "10px",
                    minWidth: "240px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#64748b",
                    }}
                  >
                    Resume
                  </div>

                  <div
                    style={{
                      marginTop: "5px",
                      fontWeight: "600",
                      color: "#1f2937",
                    }}
                  >
                    {result.filename}
                  </div>
                </div>


                <div
                  style={{
                    background: "#f8fafc",
                    padding: "15px 20px",
                    borderRadius: "10px",
                    minWidth: "200px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#64748b",
                    }}
                  >
                    Resume Content
                  </div>

                  <div
                    style={{
                      marginTop: "5px",
                      fontWeight: "600",
                      color: "#1f2937",
                    }}
                  >
                    {result.characters} characters
                  </div>
                </div>

              </div>

            </div>


            {/* ==================================================
                RECOMMENDED JOBS
            ================================================== */}

            {result.recommendations?.jobs && (
              <div
                style={{
                  marginTop: "40px",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >

                  <div>

                    <h2
                      style={{
                        margin: 0,
                        fontSize: "28px",
                        color: "#111827",
                      }}
                    >
                      {result.recommendations.total} Recommended Jobs
                    </h2>

                    <p
                      style={{
                        marginTop: "6px",
                        color: "#6b7280",
                      }}
                    >
                      Jobs ranked according to your resume.
                    </p>

                  </div>

                </div>


                {/* JOB CARDS */}

                {result.recommendations.jobs.map(
                  (job, index) => (

                    <div
                      key={
                        job.id ||
                        job.source_job_id ||
                        index
                      }
                      style={{
                        background: "#ffffff",
                        borderRadius: "14px",
                        padding: "25px",
                        marginBottom: "18px",
                        border: "1px solid #e5e7eb",
                        boxShadow:
                          "0 5px 18px rgba(15, 23, 42, 0.06)",
                      }}
                    >

                      {/* JOB TITLE */}

                      <h2
                        style={{
                          margin:
                            "0 0 7px",
                          color: "#111827",
                          fontSize: "23px",
                        }}
                      >
                        {job.title ||
                          "Untitled Job"}
                      </h2>


                      {/* COMPANY */}

                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#374151",
                        }}
                      >
                        {job.company ||
                          "Company not specified"}
                      </div>


                      {/* LOCATION */}

                      {job.location && (
                        <div
                          style={{
                            marginTop: "10px",
                            color: "#6b7280",
                            fontSize: "15px",
                          }}
                        >
                          📍 {job.location}
                        </div>
                      )}


                      {/* SKILLS */}

                      {job.skills?.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                            marginTop: "17px",
                          }}
                        >

                          {job.skills.map(
                            (skill, skillIndex) => (

                              <span
                                key={skillIndex}
                                style={{
                                  background: "#eef2ff",
                                  color: "#4338ca",
                                  padding:
                                    "6px 11px",
                                  borderRadius: "20px",
                                  fontSize: "13px",
                                  fontWeight: "500",
                                }}
                              >
                                {skill}
                              </span>

                            )
                          )}

                        </div>
                      )}


                      {/* SCORE SECTION */}

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: "18px",
                          marginTop: "22px",
                          paddingTop: "18px",
                          borderTop:
                            "1px solid #e5e7eb",
                        }}
                      >

                        {/* AI MATCH */}

                        <div
                          style={{
                            fontSize: "17px",
                            fontWeight: "700",
                            color: "#111827",
                          }}
                        >
                          AI Match:{" "}
                          <span
                            style={{
                              color: "#7c3aed",
                            }}
                          >
                            {percentage(
                              job.final_score
                            )}
                            %
                          </span>
                        </div>


                        {/* SEMANTIC */}

                        <div
                          style={{
                            color: "#6b7280",
                            fontSize: "15px",
                          }}
                        >
                          Semantic:{" "}
                          <strong>
                            {percentage(
                              job.similarity_score
                            )}
                            %
                          </strong>
                        </div>

                      </div>


                      {/* MATCH BREAKDOWN */}

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "10px",
                          marginTop: "13px",
                        }}
                      >

                        <span
                          style={{
                            background: "#f0fdf4",
                            color: "#15803d",
                            padding:
                              "5px 10px",
                            borderRadius: "6px",
                            fontSize: "13px",
                          }}
                        >
                          Skill:{" "}
                          {percentage(
                            job.skill_match
                          )}
                          %
                        </span>

                        <span
                          style={{
                            background: "#eff6ff",
                            color: "#1d4ed8",
                            padding:
                              "5px 10px",
                            borderRadius: "6px",
                            fontSize: "13px",
                          }}
                        >
                          Role:{" "}
                          {percentage(
                            job.role_match
                          )}
                          %
                        </span>

                        <span
                          style={{
                            background: "#fff7ed",
                            color: "#c2410c",
                            padding:
                              "5px 10px",
                            borderRadius: "6px",
                            fontSize: "13px",
                          }}
                        >
                          Location:{" "}
                          {percentage(
                            job.location_match
                          )}
                          %
                        </span>

                      </div>

                    </div>

                  )
                )}

              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}


export default ResumeUpload;