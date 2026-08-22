import { useState } from "react";

import RecommendationCard from "../components/RecommendationCard";


const API_BASE_URL = "http://127.0.0.1:8000";


function Recommendations() {
  const [profile, setProfile] = useState(
    "Python Data Scientist with Machine Learning experience in Bengaluru"
  );

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  // ============================================================
  // GET RECOMMENDATIONS
  // ============================================================

  const getRecommendations = async () => {
    if (!profile.trim()) {
      setError(
        "Please describe the type of job you are looking for."
      );

      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      params.append(
        "profile",
        profile
      );

      params.append(
        "limit",
        "10"
      );

      const response = await fetch(
        `${API_BASE_URL}/api/recommendations?${params.toString()}`
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          `Recommendation request failed: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();

      setJobs(
        data.jobs || []
      );

    } catch (err) {
      console.error(
        "Recommendation error:",
        err
      );

      setError(
        err.message ||
        "Failed to load recommendations."
      );

      setJobs([]);

    } finally {
      setLoading(false);
    }
  };


  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 85% 5%, rgba(124, 58, 237, 0.08), transparent 28%), radial-gradient(circle at 10% 20%, rgba(79, 70, 229, 0.06), transparent 25%), #f7f8fc",
        padding: "46px 28px 80px",
        boxSizing: "border-box",
        color: "#111827",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: "1050px",
          margin: "0 auto",
        }}
      >

        {/* ====================================================
            HERO
        ==================================================== */}

        <div
          style={{
            marginBottom: "30px",
          }}
        >

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 13px",
              borderRadius: "999px",
              background:
                "linear-gradient(135deg, #ede9fe, #f5f3ff)",
              border: "1px solid #ddd6fe",
              color: "#6d28d9",
              fontSize: "11px",
              fontWeight: "800",
              letterSpacing: "0.3px",
              marginBottom: "16px",
            }}
          >
            ✦ AI-POWERED RECOMMENDATIONS
          </div>


          <h1
            style={{
              margin: 0,
              fontSize: "clamp(38px, 5vw, 58px)",
              lineHeight: "1.04",
              letterSpacing: "-2.5px",
              fontWeight: "850",
              color: "#111827",
            }}
          >
            Jobs picked
            <span
              style={{
                display: "block",
                background:
                  "linear-gradient(90deg, #4f46e5, #7c3aed, #9333ea)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              for you.
            </span>
          </h1>


          <p
            style={{
              maxWidth: "650px",
              margin: "17px 0 0",
              color: "#6b7280",
              fontSize: "16px",
              lineHeight: "1.65",
            }}
          >
            Tell us about your skills, experience and
            preferred role. Our AI will find opportunities
            that best match your profile.
          </p>

        </div>


        {/* ====================================================
            PROFILE INPUT CARD
        ==================================================== */}

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e7e9ef",
            borderRadius: "20px",
            padding: "25px",
            boxShadow:
              "0 18px 45px rgba(15, 23, 42, 0.06)",
            marginBottom: "32px",
          }}
        >

          {/* CARD HEADER */}

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "13px",
              marginBottom: "20px",
            }}
          >

            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "11px",
                background:
                  "linear-gradient(135deg, #4f46e5, #7c3aed)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "18px",
                flexShrink: 0,
                boxShadow:
                  "0 7px 18px rgba(99, 102, 241, 0.22)",
              }}
            >
              ✦
            </div>


            <div>

              <h2
                style={{
                  margin: "0 0 4px",
                  fontSize: "18px",
                  fontWeight: "800",
                  color: "#111827",
                }}
              >
                Build your job profile
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#9ca3af",
                  fontSize: "12px",
                }}
              >
                Describe the role, skills, experience or
                location you're targeting.
              </p>

            </div>

          </div>


          {/* PROFILE TEXTAREA */}

          <textarea
            value={profile}
            onChange={(event) =>
              setProfile(event.target.value)
            }
            placeholder="Example: Python Data Scientist with Machine Learning experience in Bengaluru"
            rows={4}
            style={{
              width: "100%",
              padding: "16px",
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

              event.target.style.boxShadow =
                "none";
            }}
          />


          {/* ACTION AREA */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "15px",
              flexWrap: "wrap",
              marginTop: "13px",
            }}
          >

            <span
              style={{
                color: "#9ca3af",
                fontSize: "11px",
              }}
            >
              ✦ Personalized semantic matching
            </span>


            <button
              onClick={getRecommendations}
              disabled={loading}
              style={{
                padding: "11px 20px",
                border: "none",
                borderRadius: "10px",
                background: loading
                  ? "#a78bfa"
                  : "linear-gradient(135deg, #4f46e5, #7c3aed)",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: "750",
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
                boxShadow:
                  "0 6px 16px rgba(99, 102, 241, 0.20)",
                transition:
                  "transform 0.2s ease",
              }}
            >
              {loading
                ? "Finding Jobs..."
                : "Get Recommendations  →"}
            </button>

          </div>


          {/* ERROR */}

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
                marginTop: "18px",
                fontSize: "12px",
              }}
            >
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

        </div>


        {/* ====================================================
            RESULTS
        ==================================================== */}

        {jobs.length > 0 && (

          <div>

            {/* RESULTS HEADER */}

            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: "15px",
                marginBottom: "17px",
              }}
            >

              <div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "9px",
                  }}
                >

                  <h2
                    style={{
                      margin: 0,
                      color: "#111827",
                      fontSize: "22px",
                      fontWeight: "800",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {jobs.length} Recommended Jobs
                  </h2>


                  <span
                    style={{
                      background: "#ede9fe",
                      color: "#6d28d9",
                      padding: "5px 8px",
                      borderRadius: "999px",
                      fontSize: "9px",
                      fontWeight: "800",
                    }}
                  >
                    AI MATCHED
                  </span>

                </div>


                <p
                  style={{
                    margin: "5px 0 0",
                    color: "#9ca3af",
                    fontSize: "11px",
                  }}
                >
                  Ranked according to your profile
                </p>

              </div>


              <div
                style={{
                  color: "#6b7280",
                  fontSize: "11px",
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  padding: "7px 10px",
                  borderRadius: "9px",
                }}
              >
                ✦ Personalized results
              </div>

            </div>


            {/* RECOMMENDATION CARDS */}

            <div
              style={{
                display: "grid",
                gap: "14px",
              }}
            >

              {jobs.map(
                (job, index) => (

                  <div
                    key={
                      job.id || index
                    }
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e7e9ef",
                      borderRadius: "15px",
                      padding: "3px",
                      transition:
                        "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                    }}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.transform =
                        "translateY(-2px)";

                      event.currentTarget.style.boxShadow =
                        "0 12px 28px rgba(15, 23, 42, 0.07)";

                      event.currentTarget.style.borderColor =
                        "#d8d2ff";
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.transform =
                        "translateY(0)";

                      event.currentTarget.style.boxShadow =
                        "none";

                      event.currentTarget.style.borderColor =
                        "#e7e9ef";
                    }}
                  >

                    <RecommendationCard
                      job={job}
                    />

                  </div>

                )
              )}

            </div>

          </div>

        )}

      </div>


      {/* ======================================================
          RESPONSIVE
      ====================================================== */}

      <style>{`

        @media (max-width: 700px) {

          .recommendations-page {
            padding:
              30px
              15px
              60px !important;
          }

        }

      `}</style>

    </div>
  );
}


export default Recommendations;