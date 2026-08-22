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
      console.error(err);

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
  // MATCH COLOR
  // ============================================================

  function getMatchColor(score) {
    if (score >= 75) {
      return {
        background: "#eefaf4",
        color: "#087443",
        border: "#d3eee0",
      };
    }

    if (score >= 50) {
      return {
        background: "#f5eef5",
        color: "#684461",
        border: "#eadfea",
      };
    }

    return {
      background: "#faf3ed",
      color: "#9a5b32",
      border: "#f0dfd0",
    };
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",

        // SAME CREAMY BACKGROUND AS JOBS,
        // AI ASSISTANT AND RECOMMENDATIONS
        background: "#f8f7f2",

        padding: "42px 24px 80px",
        boxSizing: "border-box",

        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

        color: "#17131a",
      }}
    >
      <div
        style={{
          maxWidth: "1050px",
          margin: "0 auto",
        }}
      >
        {/* ======================================================
            HERO
        ====================================================== */}

        <div
          style={{
            marginBottom: "28px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(34px, 5vw, 52px)",
              lineHeight: "1.02",
              letterSpacing: "-2px",
              fontWeight: "800",
              color: "#17131a",
            }}
          >
            Find jobs that
            <br />

            <span
              style={{
                color: "#684461",
              }}
            >
              match your resume.
            </span>
          </h1>

          <p
            style={{
              margin: "15px 0 0",
              maxWidth: "650px",
              color: "#777078",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            Upload your resume and let AI analyze your skills,
            experience, and profile to discover relevant job
            opportunities.
          </p>
        </div>

        {/* ======================================================
            UPLOAD CARD
        ====================================================== */}

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e1e0",
            borderRadius: "20px",
            padding: "26px",
            boxShadow:
              "0 4px 18px rgba(40, 32, 35, 0.04)",
          }}
        >
          {/* CARD HEADER */}

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
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "17px",
              }}
            >
              ✦
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  color: "#17131a",
                  fontSize: "19px",
                  fontWeight: "750",
                  letterSpacing: "-0.3px",
                }}
              >
                Upload your resume
              </h2>

              <p
                style={{
                  margin: "4px 0 0",
                  color: "#918a90",
                  fontSize: "11px",
                }}
              >
                PDF or DOCX • Resume analysis
              </p>
            </div>
          </div>

          {/* FILE DROP AREA */}

          <label
            style={{
              display: "block",
              marginTop: "18px",

              border: file
                ? "1px solid #cbb9c9"
                : "1px dashed #d8d3d1",

              borderRadius: "15px",

              padding: "34px 24px",

              textAlign: "center",

              cursor: "pointer",

              background: file
                ? "#fbf8fb"
                : "#fcfbf9",

              transition:
                "all 0.2s ease",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.borderColor =
                "#684461";

              event.currentTarget.style.background =
                "#fbf8fb";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.borderColor =
                file
                  ? "#cbb9c9"
                  : "#d8d3d1";

              event.currentTarget.style.background =
                file
                  ? "#fbf8fb"
                  : "#fcfbf9";
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                margin: "0 auto 14px",
                borderRadius: "14px",
                background: "#f5eef5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "23px",
              }}
            >
              📄
            </div>

            <div
              style={{
                fontSize: "15px",
                fontWeight: "700",
                color: "#302a30",
              }}
            >
              Choose your resume
            </div>

            <div
              style={{
                marginTop: "7px",
                color: "#969095",
                fontSize: "11px",
              }}
            >
              Drag & drop or click to browse
            </div>

            <div
              style={{
                marginTop: "5px",
                color: "#aaa4a8",
                fontSize: "10px",
              }}
            >
              PDF and DOCX files supported
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

          {/* ====================================================
              SELECTED FILE
          ==================================================== */}

          {file && (
            <div
              style={{
                marginTop: "14px",
                padding: "12px 14px",
                borderRadius: "12px",
                background: "#faf6fa",
                border: "1px solid #eadfea",
                display: "flex",
                alignItems: "center",
                gap: "11px",
              }}
            >
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "9px",
                  background: "#f1e7f1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                }}
              >
                📎
              </div>

              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    color: "#4d3949",
                    fontSize: "12px",
                    fontWeight: "700",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {file.name}
                </div>

                <div
                  style={{
                    marginTop: "3px",
                    color: "#91848f",
                    fontSize: "10px",
                  }}
                >
                  Ready for analysis
                </div>
              </div>

              <span
                style={{
                  background: "#eefaf4",
                  color: "#087443",
                  padding: "5px 8px",
                  borderRadius: "999px",
                  fontSize: "9px",
                  fontWeight: "700",
                }}
              >
                Selected
              </span>
            </div>
          )}

          {/* ====================================================
              ERROR
          ==================================================== */}

          {error && (
            <div
              style={{
                marginTop: "14px",
                padding: "11px 13px",
                borderRadius: "10px",
                background: "#faf3f3",
                border: "1px solid #efd8d8",
                color: "#a34848",
                fontSize: "11px",
                fontWeight: "600",
              }}
            >
              ⚠ {error}
            </div>
          )}

          {/* ====================================================
              ANALYZE BUTTON
          ==================================================== */}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "18px",
            }}
          >
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              style={{
                padding: "11px 18px",
                border: "none",
                borderRadius: "9px",

                background:
                  !file || loading
                    ? "#d6d1d3"
                    : "#684461",

                color: "#ffffff",

                fontSize: "11px",
                fontWeight: "700",

                cursor:
                  !file || loading
                    ? "not-allowed"
                    : "pointer",

                transition:
                  "transform 0.2s ease, opacity 0.2s ease",

                opacity:
                  !file || loading ? 0.65 : 1,
              }}
            >
              {loading
                ? "Analyzing Resume..."
                : "Analyze Resume →"}
            </button>
          </div>
        </div>

        {/* ======================================================
            RESULTS
        ====================================================== */}

        {result && (
          <div
            style={{
              marginTop: "34px",
            }}
          >
            {/* ==================================================
                SUCCESS HEADER
            ================================================== */}

            <div
              style={{
                background: "#ffffff",
                borderRadius: "18px",
                padding: "24px",
                border: "1px solid #e5e1e0",
                boxShadow:
                  "0 4px 18px rgba(40, 32, 35, 0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "11px",
                    background: "#eefaf4",
                    color: "#087443",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    fontWeight: "800",
                  }}
                >
                  ✓
                </div>

                <div>
                  <h2
                    style={{
                      margin: 0,
                      color: "#17131a",
                      fontSize: "18px",
                      fontWeight: "750",
                    }}
                  >
                    Resume Analysis Complete
                  </h2>

                  <p
                    style={{
                      margin: "4px 0 0",
                      color: "#087443",
                      fontSize: "11px",
                      fontWeight: "600",
                    }}
                  >
                    Your resume was successfully analyzed.
                  </p>
                </div>
              </div>

              {/* RESUME DETAILS */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
                <div
                  style={{
                    background: "#faf9f7",
                    border: "1px solid #eeece9",
                    borderRadius: "11px",
                    padding: "13px 15px",
                  }}
                >
                  <div
                    style={{
                      color: "#9a9398",
                      fontSize: "9px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Resume
                  </div>

                  <div
                    style={{
                      marginTop: "5px",
                      color: "#302a30",
                      fontSize: "12px",
                      fontWeight: "700",
                      wordBreak: "break-word",
                    }}
                  >
                    {result.filename}
                  </div>
                </div>

                <div
                  style={{
                    background: "#faf9f7",
                    border: "1px solid #eeece9",
                    borderRadius: "11px",
                    padding: "13px 15px",
                  }}
                >
                  <div
                    style={{
                      color: "#9a9398",
                      fontSize: "9px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Resume Content
                  </div>

                  <div
                    style={{
                      marginTop: "5px",
                      color: "#302a30",
                      fontSize: "12px",
                      fontWeight: "700",
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
                  marginTop: "34px",
                }}
              >
                {/* SECTION HEADER */}

                <div
                  style={{
                    marginBottom: "16px",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "25px",
                      color: "#17131a",
                      fontWeight: "750",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    Jobs matched to your resume.
                  </h2>

                  <p
                    style={{
                      margin: "5px 0 0",
                      color: "#918a90",
                      fontSize: "11px",
                    }}
                  >
                    Ranked according to your skills,
                    experience, and profile.
                  </p>
                </div>

                {/* ==================================================
                    JOB CARDS
                ================================================== */}

                {result.recommendations.jobs.map(
                  (job, index) => {
                    const finalScore =
                      percentage(job.final_score);

                    const semanticScore =
                      percentage(job.similarity_score);

                    const skillScore =
                      percentage(job.skill_match);

                    const roleScore =
                      percentage(job.role_match);

                    const locationScore =
                      percentage(job.location_match);

                    const matchColor =
                      getMatchColor(finalScore);

                    return (
                      <div
                        key={
                          job.id ||
                          job.source_job_id ||
                          index
                        }
                        style={{
                          background: "#ffffff",
                          borderRadius: "17px",
                          padding: "22px 24px",
                          marginBottom: "12px",
                          border: "1px solid #e5e1e0",
                          boxShadow:
                            "0 2px 10px rgba(40, 32, 35, 0.035)",
                          transition:
                            "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                        }}
                        onMouseEnter={(event) => {
                          event.currentTarget.style.transform =
                            "translateY(-2px)";

                          event.currentTarget.style.boxShadow =
                            "0 12px 30px rgba(40, 32, 35, 0.08)";

                          event.currentTarget.style.borderColor =
                            "#d8cbd8";
                        }}
                        onMouseLeave={(event) => {
                          event.currentTarget.style.transform =
                            "translateY(0)";

                          event.currentTarget.style.boxShadow =
                            "0 2px 10px rgba(40, 32, 35, 0.035)";

                          event.currentTarget.style.borderColor =
                            "#e5e1e0";
                        }}
                      >
                        {/* TOP */}

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: "18px",
                          }}
                        >
                          <div
                            style={{
                              minWidth: 0,
                              flex: 1,
                            }}
                          >
                            <h2
                              style={{
                                margin: "0 0 6px",
                                color: "#17131a",
                                fontSize: "17px",
                                lineHeight: "1.35",
                                fontWeight: "750",
                                letterSpacing: "-0.3px",
                              }}
                            >
                              {job.title ||
                                "Untitled Job"}
                            </h2>

                            <div
                              style={{
                                color: "#625c64",
                                fontSize: "12px",
                                fontWeight: "600",
                              }}
                            >
                              {job.company ||
                                "Company not specified"}
                            </div>
                          </div>

                          {/* MATCH BADGE */}

                          <div
                            style={{
                              flexShrink: 0,
                              padding: "7px 11px",
                              borderRadius: "999px",
                              background:
                                matchColor.background,
                              color:
                                matchColor.color,
                              border:
                                `1px solid ${matchColor.border}`,
                              fontSize: "10px",
                              fontWeight: "750",
                              whiteSpace: "nowrap",
                            }}
                          >
                            ✦ {finalScore}% Match
                          </div>
                        </div>

                        {/* LOCATION */}

                        {job.location && (
                          <div
                            style={{
                              marginTop: "10px",
                              color: "#777078",
                              fontSize: "11px",
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
                              gap: "6px",
                              marginTop: "13px",
                            }}
                          >
                            {job.skills
                              .slice(0, 12)
                              .map(
                                (skill, skillIndex) => (
                                  <span
                                    key={skillIndex}
                                    style={{
                                      background: "#f8f4f9",
                                      border:
                                        "1px solid #eee6f0",
                                      color: "#684461",
                                      padding:
                                        "5px 9px",
                                      borderRadius:
                                        "999px",
                                      fontSize: "10px",
                                      fontWeight: "600",
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
                            alignItems: "center",
                            justifyContent:
                              "space-between",
                            flexWrap: "wrap",
                            gap: "12px",
                            marginTop: "16px",
                            paddingTop: "13px",
                            borderTop:
                              "1px solid #eeecef",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "17px",
                              flexWrap: "wrap",
                            }}
                          >
                            <span
                              style={{
                                color: "#4e474f",
                                fontSize: "11px",
                                fontWeight: "600",
                              }}
                            >
                              AI Match{" "}
                              <strong
                                style={{
                                  color: "#684461",
                                }}
                              >
                                {finalScore}%
                              </strong>
                            </span>

                            <span
                              style={{
                                color: "#99939a",
                                fontSize: "11px",
                              }}
                            >
                              Semantic{" "}
                              <strong
                                style={{
                                  color: "#6e676f",
                                }}
                              >
                                {semanticScore}%
                              </strong>
                            </span>
                          </div>

                          <span
                            style={{
                              color: "#aaa4aa",
                              fontSize: "10px",
                            }}
                          >
                            Resume matched
                          </span>
                        </div>

                        {/* MATCH BREAKDOWN */}

                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "7px",
                            marginTop: "11px",
                          }}
                        >
                          <span
                            style={{
                              background: "#faf9fa",
                              border:
                                "1px solid #eeecef",
                              color: "#777078",
                              padding: "5px 9px",
                              borderRadius: "8px",
                              fontSize: "10px",
                            }}
                          >
                            Skill{" "}
                            <strong
                              style={{
                                color: "#514a52",
                              }}
                            >
                              {skillScore}%
                            </strong>
                          </span>

                          <span
                            style={{
                              background: "#faf9fa",
                              border:
                                "1px solid #eeecef",
                              color: "#777078",
                              padding: "5px 9px",
                              borderRadius: "8px",
                              fontSize: "10px",
                            }}
                          >
                            Role{" "}
                            <strong
                              style={{
                                color: "#514a52",
                              }}
                            >
                              {roleScore}%
                            </strong>
                          </span>

                          <span
                            style={{
                              background: "#faf9fa",
                              border:
                                "1px solid #eeecef",
                              color: "#777078",
                              padding: "5px 9px",
                              borderRadius: "8px",
                              fontSize: "10px",
                            }}
                          >
                            Location{" "}
                            <strong
                              style={{
                                color: "#514a52",
                              }}
                            >
                              {locationScore}%
                            </strong>
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ======================================================
          RESPONSIVE
      ====================================================== */}

      <style>{`
        @media (max-width: 700px) {
          .resume-page {
            padding-left: 15px !important;
            padding-right: 15px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ResumeUpload;