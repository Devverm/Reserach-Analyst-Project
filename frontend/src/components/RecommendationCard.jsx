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
        background: "white",
        padding: "25px",
        borderRadius: "14px",
        marginBottom: "18px",
        boxShadow: "0 5px 18px rgba(0,0,0,0.07)",
      }}
    >
      {/* JOB TITLE */}

      <h2
        style={{
          margin: "0 0 8px",
          color: "#111827",
        }}
      >
        {job.title || "Job Title"}
      </h2>

      {/* COMPANY */}

      <h3
        style={{
          margin: "0 0 10px",
          color: "#374151",
        }}
      >
        {job.company || "Company not specified"}
      </h3>

      {/* LOCATION */}

      <p
        style={{
          color: "#6b7280",
          marginBottom: "15px",
        }}
      >
        📍 {job.location || "Location not specified"}
      </p>

      {/* SKILLS */}

      {Array.isArray(job.skills) &&
        job.skills.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "18px",
            }}
          >
            {job.skills.map((skill, index) => (
              <span
                key={index}
                style={{
                  background: "#eef2ff",
                  color: "#3730a3",
                  padding: "7px 12px",
                  borderRadius: "20px",
                  fontSize: "14px",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        )}

      {/* MAIN MATCH SCORE */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "15px",
          flexWrap: "wrap",
        }}
      >
        <strong
          style={{
            fontSize: "19px",
            color: "#111827",
          }}
        >
          AI Match: {finalScore}%
        </strong>

        <span
          style={{
            color: "#6b7280",
          }}
        >
          Semantic: {semanticScore}%
        </span>
      </div>

      {/* MATCH BREAKDOWN */}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          fontSize: "14px",
          color: "#6b7280",
        }}
      >
        <span>
          Skill: {skillScore}%
        </span>

        <span>
          Role: {roleScore}%
        </span>

        <span>
          Location: {locationScore}%
        </span>
      </div>
    </div>
  );
}

export default RecommendationCard;