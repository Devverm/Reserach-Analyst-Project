function RecommendationCard({ job }) {
  const finalScore = Math.round((job.final_score || 0) * 100);
  const semanticScore = Math.round((job.similarity_score || 0) * 100);
  const skillScore = Math.round((job.skill_match || 0) * 100);
  const roleScore = Math.round((job.role_match || 0) * 100);
  const locationScore = Math.round((job.location_match || 0) * 100);

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e1e7",
        borderRadius: "18px",
        padding: "24px 26px",
        boxShadow: "0 2px 10px rgba(31, 24, 34, 0.035)",
        transition:
          "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.transform = "translateY(-2px)";
        event.currentTarget.style.boxShadow =
          "0 12px 30px rgba(31, 24, 34, 0.08)";
        event.currentTarget.style.borderColor = "#d8cbd8";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = "translateY(0)";
        event.currentTarget.style.boxShadow =
          "0 2px 10px rgba(31, 24, 34, 0.035)";
        event.currentTarget.style.borderColor = "#e5e1e7";
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h2
            style={{
              margin: "0 0 7px",
              color: "#17131a",
              fontSize: "18px",
              lineHeight: "1.35",
              fontWeight: "750",
              letterSpacing: "-0.35px",
            }}
          >
            {job.title || "Job Title"}
          </h2>

          <div
            style={{
              color: "#625c64",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            {job.company || "Company not specified"}
          </div>
        </div>

        {/* MATCH BADGE */}

        <div
          style={{
            flexShrink: 0,
            padding: "7px 11px",
            borderRadius: "999px",
            background:
              finalScore >= 70 ? "#eefaf4" : "#f4edf5",
            color:
              finalScore >= 70 ? "#087443" : "#684461",
            fontSize: "11px",
            fontWeight: "750",
            whiteSpace: "nowrap",
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
          marginTop: "11px",
          color: "#777078",
          fontSize: "11px",
          lineHeight: "1.5",
        }}
      >
        📍 {job.location || "Location not specified"}
      </div>

      {/* =====================================================
          SKILLS
      ===================================================== */}

      {Array.isArray(job.skills) && job.skills.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            marginTop: "14px",
          }}
        >
          {job.skills.slice(0, 12).map((skill, index) => (
            <span
              key={index}
              style={{
                background: "#f8f4f9",
                border: "1px solid #eee6f0",
                color: "#684461",
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
          marginTop: "18px",
          paddingTop: "14px",
          borderTop: "1px solid #eeecef",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
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
                fontWeight: "750",
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
                fontWeight: "650",
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
            background: "#faf9fa",
            border: "1px solid #eeecef",
            borderRadius: "8px",
            padding: "5px 9px",
            fontSize: "10px",
            color: "#777078",
          }}
        >
          Skill{" "}
          <strong style={{ color: "#514a52" }}>
            {skillScore}%
          </strong>
        </div>

        <div
          style={{
            background: "#faf9fa",
            border: "1px solid #eeecef",
            borderRadius: "8px",
            padding: "5px 9px",
            fontSize: "10px",
            color: "#777078",
          }}
        >
          Role{" "}
          <strong style={{ color: "#514a52" }}>
            {roleScore}%
          </strong>
        </div>

        <div
          style={{
            background: "#faf9fa",
            border: "1px solid #eeecef",
            borderRadius: "8px",
            padding: "5px 9px",
            fontSize: "10px",
            color: "#777078",
          }}
        >
          Location{" "}
          <strong style={{ color: "#514a52" }}>
            {locationScore}%
          </strong>
        </div>
      </div>
    </div>
  );
}

export default RecommendationCard;