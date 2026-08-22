import ChatWindow from "../components/ChatWindow";

function Assistant() {
  const popularSearches = [
    "Remote Python developer jobs",
    "Data scientist jobs in Bengaluru",
    "AI engineer with ML experience",
  ];

  return (
    <div
      className="assistant-page"
      style={{
        minHeight: "100vh",
        background: "#f8f7f5",
        color: "#17141a",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: "55px 28px 80px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1120px",
          margin: "0 auto",
        }}
      >
        {/* =====================================================
            MAIN AI ASSISTANT CARD
        ===================================================== */}

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e8e3e7",
            borderRadius: "22px",
            overflow: "hidden",
            boxShadow: "0 8px 30px rgba(55, 35, 55, 0.04)",
          }}
        >
          {/* HEADER */}

          <div
            style={{
              padding: "30px 34px 25px",
              borderBottom: "1px solid #eee9ed",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "13px",
                background: "#f1e8f0",
                color: "#6b3f63",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "19px",
                flexShrink: 0,
              }}
            >
              ✦
            </div>

            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "23px",
                  lineHeight: "1.2",
                  fontWeight: "800",
                  letterSpacing: "-0.5px",
                  color: "#17141a",
                }}
              >
                AI Job Assistant
              </h1>

              <p
                style={{
                  margin: "5px 0 0",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  color: "#77717a",
                }}
              >
                Describe the opportunity you're looking for and let AI
                find relevant jobs.
              </p>
            </div>
          </div>

          {/* SEARCH + RESULTS */}

          <ChatWindow />
        </div>

        {/* =====================================================
            POPULAR SEARCHES
        ===================================================== */}

        <div
          style={{
            marginTop: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "13px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "1px",
                background: "#b8b0b8",
              }}
            />

            <span
              style={{
                color: "#625b63",
                fontSize: "12px",
                fontWeight: "700",
              }}
            >
              Popular searches
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {popularSearches.map((search) => (
              <div
                key={search}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "10px 15px",
                  background: "#ffffff",
                  border: "1px solid #e4dfe5",
                  borderRadius: "999px",
                  color: "#625b63",
                  fontSize: "11px",
                  fontWeight: "500",
                }}
              >
                <span
                  style={{
                    color: "#6b3f63",
                    fontSize: "12px",
                  }}
                >
                  ↗
                </span>

                {search}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =====================================================
          RESPONSIVE
      ===================================================== */}

      <style>{`
        @media (max-width: 700px) {
          .assistant-page {
            padding: 25px 14px 60px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Assistant;