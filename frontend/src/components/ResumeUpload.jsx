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
  // MATCH SCORE COLOR
  // ============================================================

  function getMatchColor(score) {
    if (score >= 75) {
      return {
        background: "#ecfdf5",
        color: "#047857",
        border: "#a7f3d0",
      };
    }

    if (score >= 50) {
      return {
        background: "#f5f3ff",
        color: "#6d28d9",
        border: "#ddd6fe",
      };
    }

    return {
      background: "#fff7ed",
      color: "#c2410c",
      border: "#fed7aa",
    };
  }


  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        background:
          "linear-gradient(180deg, #f7f7ff 0%, #f8fafc 45%, #ffffff 100%)",
        padding: "45px 24px 80px",
        boxSizing: "border-box",
        fontFamily:
          "Inter, Arial, Helvetica, sans-serif",
      }}
    >

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >

        {/* ======================================================
            HERO
        ====================================================== */}

        <div
          style={{
            marginBottom: "32px",
          }}
        >

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "7px 12px",
              borderRadius: "999px",
              background: "#f3efff",
              color: "#6d28d9",
              fontSize: "11px",
              fontWeight: "800",
              letterSpacing: "0.2px",
              marginBottom: "14px",
            }}
          >
            ✦ AI-POWERED RESUME MATCHING
          </div>


          <h1
            style={{
              margin: "0",
              fontSize: "clamp(38px, 5vw, 58px)",
              lineHeight: "0.98",
              letterSpacing: "-2.5px",
              fontWeight: "850",
              color: "#111827",
              maxWidth: "650px",
            }}
          >
            Find jobs that
            <br />
            <span
              style={{
                color: "#5b4bea",
              }}
            >
              match your resume.
            </span>
          </h1>


          <p
            style={{
              marginTop: "18px",
              marginBottom: 0,
              maxWidth: "680px",
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#6b7280",
            }}
          >
            Upload your resume and let AI analyze your
            skills, experience, and profile to discover
            relevant job opportunities.
          </p>

        </div>


        {/* ======================================================
            UPLOAD CARD
        ====================================================== */}

        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "28px",
            border: "1px solid #e8eaf0",
            boxShadow:
              "0 15px 40px rgba(30, 27, 75, 0.06)",
          }}
        >

          {/* CARD HEADER */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "13px",
              marginBottom: "22px",
            }}
          >

            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background:
                  "linear-gradient(135deg, #7c3aed, #4f46e5)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "19px",
                boxShadow:
                  "0 8px 18px rgba(99, 70, 230, 0.2)",
              }}
            >
              ✦
            </div>


            <div>

              <h2
                style={{
                  margin: 0,
                  color: "#111827",
                  fontSize: "18px",
                  fontWeight: "800",
                }}
              >
                Upload your resume
              </h2>

              <p
                style={{
                  margin: "4px 0 0",
                  color: "#9ca3af",
                  fontSize: "12px",
                }}
              >
                PDF or DOCX • AI-powered analysis
              </p>

            </div>

          </div>


          {/* FILE DROP AREA */}

          <label
            style={{
              display: "block",
              border:
                file
                  ? "1.5px solid #c4b5fd"
                  : "1.5px dashed #d6d9e2",
              borderRadius: "16px",
              padding: "38px 25px",
              textAlign: "center",
              cursor: "pointer",
              background:
                file
                  ? "#faf9ff"
                  : "#fbfcfe",
              transition:
                "all 0.2s ease",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.borderColor =
                "#8b5cf6";

              event.currentTarget.style.background =
                "#faf8ff";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.borderColor =
                file
                  ? "#c4b5fd"
                  : "#d6d9e2";

              event.currentTarget.style.background =
                file
                  ? "#faf9ff"
                  : "#fbfcfe";
            }}
          >

            <div
              style={{
                width: "54px",
                height: "54px",
                margin: "0 auto 15px",
                borderRadius: "15px",
                background: "#f1edff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "25px",
              }}
            >
              📄
            </div>


            <div
              style={{
                fontSize: "16px",
                fontWeight: "750",
                color: "#1f2937",
              }}
            >
              Choose your resume
            </div>


            <div
              style={{
                marginTop: "7px",
                color: "#9ca3af",
                fontSize: "12px",
              }}
            >
              Drag & drop or click to browse
            </div>


            <div
              style={{
                marginTop: "5px",
                color: "#b0b5c0",
                fontSize: "11px",
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
                marginTop: "15px",
                padding: "13px 15px",
                borderRadius: "12px",
                background: "#f7f5ff",
                border: "1px solid #e9e4ff",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >

              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "9px",
                  background: "#ede9fe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "17px",
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
                    color: "#312e81",
                    fontSize: "13px",
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
                    color: "#8b85a8",
                    fontSize: "11px",
                  }}
                >
                  Ready for AI analysis
                </div>

              </div>


              <span
                style={{
                  background: "#ecfdf5",
                  color: "#047857",
                  padding: "5px 8px",
                  borderRadius: "999px",
                  fontSize: "10px",
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
                marginTop: "15px",
                padding: "12px 14px",
                borderRadius: "10px",
                background: "#fff1f2",
                border: "1px solid #fecdd3",
                color: "#be123c",
                fontSize: "12px",
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
              marginTop: "20px",
            }}
          >

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              style={{
                padding: "12px 20px",
                border: "none",
                borderRadius: "10px",
                background:
                  !file || loading
                    ? "#d1d5db"
                    : "linear-gradient(135deg, #7c3aed, #4f46e5)",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: "800",
                cursor:
                  !file || loading
                    ? "not-allowed"
                    : "pointer",
                boxShadow:
                  !file || loading
                    ? "none"
                    : "0 8px 18px rgba(99, 70, 230, 0.2)",
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
              marginTop: "38px",
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
                border: "1px solid #e8eaf0",
                boxShadow:
                  "0 12px 30px rgba(15, 23, 42, 0.05)",
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
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    background: "#ecfdf5",
                    color: "#059669",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "19px",
                    fontWeight: "800",
                  }}
                >
                  ✓
                </div>


                <div>

                  <h2
                    style={{
                      margin: 0,
                      color: "#111827",
                      fontSize: "19px",
                      fontWeight: "800",
                    }}
                  >
                    Resume Analysis Complete
                  </h2>

                  <p
                    style={{
                      margin: "4px 0 0",
                      color: "#059669",
                      fontSize: "12px",
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
                  gap: "12px",
                  marginTop: "22px",
                }}
              >

                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: "12px",
                    padding: "14px 16px",
                  }}
                >

                  <div
                    style={{
                      color: "#9ca3af",
                      fontSize: "10px",
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
                      color: "#1f2937",
                      fontSize: "13px",
                      fontWeight: "700",
                      wordBreak: "break-word",
                    }}
                  >
                    {result.filename}
                  </div>

                </div>


                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: "12px",
                    padding: "14px 16px",
                  }}
                >

                  <div
                    style={{
                      color: "#9ca3af",
                      fontSize: "10px",
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
                      color: "#1f2937",
                      fontSize: "13px",
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
                  marginTop: "38px",
                }}
              >

                {/* SECTION HEADER */}

                <div
                  style={{
                    marginBottom: "18px",
                  }}
                >

                  <div
                    style={{
                      display: "inline-flex",
                      padding: "6px 10px",
                      borderRadius: "999px",
                      background: "#f3efff",
                      color: "#6d28d9",
                      fontSize: "10px",
                      fontWeight: "800",
                      marginBottom: "10px",
                    }}
                  >
                    ✦ AI RESUME MATCHES
                  </div>


                  <h2
                    style={{
                      margin: 0,
                      fontSize: "28px",
                      color: "#111827",
                      fontWeight: "850",
                      letterSpacing: "-0.7px",
                    }}
                  >
                    Jobs matched to your resume.
                  </h2>


                  <p
                    style={{
                      margin: "6px 0 0",
                      color: "#9ca3af",
                      fontSize: "12px",
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
                          borderRadius: "15px",
                          padding: "20px",
                          marginBottom: "12px",
                          border:
                            "1px solid #e8eaf0",
                          transition:
                            "transform 0.2s ease, box-shadow 0.2s ease",
                        }}
                        onMouseEnter={(event) => {
                          event.currentTarget.style.transform =
                            "translateY(-2px)";

                          event.currentTarget.style.boxShadow =
                            "0 12px 28px rgba(15, 23, 42, 0.07)";
                        }}
                        onMouseLeave={(event) => {
                          event.currentTarget.style.transform =
                            "translateY(0)";

                          event.currentTarget.style.boxShadow =
                            "none";
                        }}
                      >

                        {/* TOP */}

                        <div
                          style={{
                            display: "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "flex-start",
                            gap: "15px",
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
                                margin:
                                  "0 0 5px",
                                color:
                                  "#111827",
                                fontSize:
                                  "18px",
                                lineHeight:
                                  "1.35",
                                fontWeight:
                                  "800",
                              }}
                            >
                              {job.title ||
                                "Untitled Job"}
                            </h2>


                            <div
                              style={{
                                color:
                                  "#4b5563",
                                fontSize:
                                  "12px",
                                fontWeight:
                                  "650",
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
                              padding:
                                "7px 10px",
                              borderRadius:
                                "9px",
                              background:
                                matchColor.background,
                              color:
                                matchColor.color,
                              border:
                                `1px solid ${matchColor.border}`,
                              fontSize:
                                "11px",
                              fontWeight:
                                "800",
                            }}
                          >
                            ✦ {finalScore}% Match
                          </div>

                        </div>


                        {/* LOCATION */}

                        {job.location && (

                          <div
                            style={{
                              marginTop:
                                "9px",
                              color:
                                "#6b7280",
                              fontSize:
                                "11px",
                            }}
                          >
                            📍 {job.location}
                          </div>

                        )}


                        {/* SKILLS */}

                        {job.skills?.length > 0 && (

                          <div
                            style={{
                              display:
                                "flex",
                              flexWrap:
                                "wrap",
                              gap: "6px",
                              marginTop:
                                "13px",
                            }}
                          >

                            {job.skills
                              .slice(0, 12)
                              .map(
                                (
                                  skill,
                                  skillIndex
                                ) => (

                                  <span
                                    key={
                                      skillIndex
                                    }
                                    style={{
                                      background:
                                        "#f5f3ff",
                                      border:
                                        "1px solid #ede9fe",
                                      color:
                                        "#5b21b6",
                                      padding:
                                        "5px 9px",
                                      borderRadius:
                                        "999px",
                                      fontSize:
                                        "10px",
                                      fontWeight:
                                        "600",
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
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "space-between",
                            flexWrap:
                              "wrap",
                            gap: "12px",
                            marginTop:
                              "16px",
                            paddingTop:
                              "13px",
                            borderTop:
                              "1px solid #f0f1f5",
                          }}
                        >

                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: "15px",
                              flexWrap:
                                "wrap",
                            }}
                          >

                            <span
                              style={{
                                color:
                                  "#374151",
                                fontSize:
                                  "11px",
                                fontWeight:
                                  "650",
                              }}
                            >
                              AI Match{" "}
                              <strong
                                style={{
                                  color:
                                    "#4f46e5",
                                }}
                              >
                                {finalScore}%
                              </strong>
                            </span>


                            <span
                              style={{
                                color:
                                  "#9ca3af",
                                fontSize:
                                  "11px",
                              }}
                            >
                              Semantic{" "}
                              <strong
                                style={{
                                  color:
                                    "#6b7280",
                                }}
                              >
                                {percentage(
                                  job.similarity_score
                                )}
                                %
                              </strong>
                            </span>

                          </div>


                          <span
                            style={{
                              color:
                                "#9ca3af",
                              fontSize:
                                "10px",
                            }}
                          >
                            Resume matched
                          </span>

                        </div>


                        {/* MATCH BREAKDOWN */}

                        <div
                          style={{
                            display:
                              "flex",
                            flexWrap:
                              "wrap",
                            gap: "6px",
                            marginTop:
                              "10px",
                          }}
                        >

                          <span
                            style={{
                              background:
                                "#f8fafc",
                              border:
                                "1px solid #eef0f4",
                              color:
                                "#6b7280",
                              padding:
                                "5px 8px",
                              borderRadius:
                                "7px",
                              fontSize:
                                "10px",
                            }}
                          >
                            Skill{" "}
                            <strong>
                              {percentage(
                                job.skill_match
                              )}
                              %
                            </strong>
                          </span>


                          <span
                            style={{
                              background:
                                "#f8fafc",
                              border:
                                "1px solid #eef0f4",
                              color:
                                "#6b7280",
                              padding:
                                "5px 8px",
                              borderRadius:
                                "7px",
                              fontSize:
                                "10px",
                            }}
                          >
                            Role{" "}
                            <strong>
                              {percentage(
                                job.role_match
                              )}
                              %
                            </strong>
                          </span>


                          <span
                            style={{
                              background:
                                "#f8fafc",
                              border:
                                "1px solid #eef0f4",
                              color:
                                "#6b7280",
                              padding:
                                "5px 8px",
                              borderRadius:
                                "7px",
                              fontSize:
                                "10px",
                            }}
                          >
                            Location{" "}
                            <strong>
                              {percentage(
                                job.location_match
                              )}
                              %
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

    </div>
  );
}


export default ResumeUpload;