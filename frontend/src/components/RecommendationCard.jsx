function RecommendationCard({ job }) {
  const finalScore = Math.round(
    (job.final_score || 0) * 100
  );

  const semanticScore = Math.round(
    (job.similarity_score || 0) * 100
  );

  const skillScore = Math.round(
    (job.skill_match || 0) * 100
  );

  const roleScore = Math.round(
    (job.role_match || 0) * 100
  );

  const locationScore = Math.round(
    (job.location_match || 0) * 100
  );

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "22px",
        borderRadius: "13px",
        border: "1px solid #e8eaf0",
        boxShadow: "none",
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

      {/* =====================================================
          TOP SECTION
      ===================================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
        }}
      >

        <div>

          {/* JOB TITLE */}

          <h2
            style={{
              margin: "0 0 6px",
              color: "#111827",
              fontSize: "18px",
              lineHeight: "1.35",
              fontWeight: "800",
              letterSpacing: "-0.3px",
            }}
          >
            {job.title || "Job Title"}
          </h2>


          {/* COMPANY */}

          <div
            style={{
              color: "#4b5563",
              fontSize: "13px",
              fontWeight: "650",
            }}
          >
            {job.company || "Company not specified"}
          </div>

        </div>


        {/* AI MATCH BADGE */}

        <div
          style={{
            flexShrink: 0,
            padding: "7px 10px",
            borderRadius: "9px",
            background:
              finalScore >= 70
                ? "#ecfdf5"
                : "#f5f3ff",
            color:
              finalScore >= 70
                ? "#047857"
                : "#6d28d9",
            fontSize: "11px",
            fontWeight: "800",
          }}
        >
          ✦ {finalScore}% Match
        </div>

      </div>


      {/* =====================================================
          LOCATION
      ===================================================== */}

      <div
        style={{
          marginTop: "10px",
          color: "#6b7280",
          fontSize: "12px",
        }}
      >
        📍 {job.location || "Location not specified"}
      </div>


      {/* =====================================================
          SKILLS
      ===================================================== */}

      {Array.isArray(job.skills) &&
        job.skills.length > 0 && (

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            marginTop: "14px",
            marginBottom: "16px",
          }}
        >

          {job.skills
            .slice(0, 12)
            .map((skill, index) => (

              <span
                key={index}
                style={{
                  background: "#f5f3ff",
                  border:
                    "1px solid #ede9fe",
                  color: "#5b21b6",
                  padding: "5px 9px",
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


      {/* =====================================================
          SCORE SUMMARY
      ===================================================== */}

      <div
        style={{
          borderTop:
            "1px solid #f0f1f5",
          paddingTop: "14px",
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
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >

          {/* AI MATCH */}

          <span
            style={{
              color: "#374151",
              fontSize: "11px",
              fontWeight: "650",
            }}
          >
            AI Match{" "}
            <strong
              style={{
                color: "#4f46e5",
              }}
            >
              {finalScore}%
            </strong>
          </span>


          {/* SEMANTIC */}

          <span
            style={{
              color: "#9ca3af",
              fontSize: "11px",
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
          Personalized match
        </span>

      </div>


      {/* =====================================================
          MATCH BREAKDOWN
      ===================================================== */}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "7px",
          marginTop: "12px",
        }}
      >

        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #eef0f4",
            borderRadius: "7px",
            padding: "5px 8px",
            fontSize: "10px",
            color: "#6b7280",
          }}
        >
          Skill <strong>{skillScore}%</strong>
        </div>


        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #eef0f4",
            borderRadius: "7px",
            padding: "5px 8px",
            fontSize: "10px",
            color: "#6b7280",
          }}
        >
          Role <strong>{roleScore}%</strong>
        </div>


        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #eef0f4",
            borderRadius: "7px",
            padding: "5px 8px",
            fontSize: "10px",
            color: "#6b7280",
          }}
        >
          Location <strong>{locationScore}%</strong>
        </div>

      </div>

    </div>
  );
}


export default RecommendationCard;