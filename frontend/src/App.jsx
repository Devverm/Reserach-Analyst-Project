import { useState } from "react";

import Jobs from "./pages/Jobs";
import Assistant from "./pages/Assistant";
import Recommendations from "./pages/Recommendations";
import ResumeUpload from "./components/ResumeUpload";


function App() {
  const [page, setPage] = useState("jobs");

  return (
    <div>
      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav
        style={{
          background: "#111827",
          padding: "18px 30px",
          display: "flex",
          gap: "15px",
        }}
      >

        {/* JOB SEARCH */}

        <button
          onClick={() => setPage("jobs")}
          style={{
            padding: "12px 22px",
            border: "none",
            borderRadius: "8px",
            background:
              page === "jobs"
                ? "#2563eb"
                : "#374151",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Job Search
        </button>


        {/* AI ASSISTANT */}

        <button
          onClick={() => setPage("assistant")}
          style={{
            padding: "12px 22px",
            border: "none",
            borderRadius: "8px",
            background:
              page === "assistant"
                ? "#7c3aed"
                : "#374151",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          AI Assistant
        </button>


        {/* RECOMMENDATIONS */}

        <button
          onClick={() =>
            setPage("recommendations")
          }
          style={{
            padding: "12px 22px",
            border: "none",
            borderRadius: "8px",
            background:
              page === "recommendations"
                ? "#059669"
                : "#374151",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Recommendations
        </button>


        {/* RESUME AI MATCHING */}

        <button
          onClick={() =>
            setPage("resume")
          }
          style={{
            padding: "12px 22px",
            border: "none",
            borderRadius: "8px",
            background:
              page === "resume"
                ? "#ea580c"
                : "#374151",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Resume Matching
        </button>

      </nav>


      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      {page === "jobs" && (
        <Jobs />
      )}


      {page === "assistant" && (
        <Assistant />
      )}


      {page === "recommendations" && (
        <Recommendations />
      )}


      {page === "resume" && (
        <ResumeUpload />
      )}

    </div>
  );
}


export default App;