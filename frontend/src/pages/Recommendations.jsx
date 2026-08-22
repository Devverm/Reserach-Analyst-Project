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
        background: "#f5f7fb",
        padding: "50px 8%",
        boxSizing: "border-box",
      }}
    >

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto 35px",
        }}
      >

        <h1
          style={{
            fontSize: "42px",
            marginBottom: "10px",
            color: "#111827",
          }}
        >
          Job Recommendations
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "#6b7280",
          }}
        >
          Get personalized job recommendations based on your
          profile.
        </p>

      </div>


      {/* ======================================================
          PROFILE INPUT
      ====================================================== */}

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto 35px",
          background: "white",
          padding: "30px",
          borderRadius: "16px",
          boxShadow:
            "0 8px 25px rgba(0,0,0,0.08)",
        }}
      >

        <h2
          style={{
            marginTop: 0,
            color: "#111827",
          }}
        >
          Tell us about your profile
        </h2>


        <textarea
          value={profile}
          onChange={(event) =>
            setProfile(event.target.value)
          }
          placeholder="Example: Python Data Scientist with Machine Learning experience in Bengaluru"
          rows={4}
          style={{
            width: "100%",
            padding: "15px",
            fontSize: "16px",
            borderRadius: "10px",
            border:
              "1px solid #d1d5db",
            boxSizing: "border-box",
            resize: "vertical",
            marginBottom: "20px",
          }}
        />


        <button
          onClick={getRecommendations}
          disabled={loading}
          style={{
            background: loading
              ? "#9ca3af"
              : "#7c3aed",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "14px 25px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: loading
              ? "not-allowed"
              : "pointer",
          }}
        >
          {loading
            ? "Finding Recommendations..."
            : "Get Recommendations"}
        </button>


        {/* ERROR */}

        {error && (
          <p
            style={{
              color: "#dc2626",
              marginTop: "20px",
            }}
          >
            {error}
          </p>
        )}

      </div>


      {/* ======================================================
          RESULTS
      ====================================================== */}

      {jobs.length > 0 && (

        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >

          <h2
            style={{
              color: "#111827",
              marginBottom: "20px",
            }}
          >
            {jobs.length} Recommended Jobs
          </h2>


          {/* ==================================================
              RECOMMENDATION CARDS
          ================================================== */}

          {jobs.map(
            (job, index) => (

              <RecommendationCard
                key={
                  job.id || index
                }
                job={job}
              />

            )
          )}

        </div>

      )}

    </div>
  );
}


export default Recommendations;