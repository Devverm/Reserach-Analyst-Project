import ChatWindow from "../components/ChatWindow";


function Assistant() {
  return (
    <div
      className="assistant-page"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 85% 5%, rgba(124, 58, 237, 0.08), transparent 28%), radial-gradient(circle at 10% 20%, rgba(79, 70, 229, 0.06), transparent 25%), #f7f8fc",
        padding: "46px 28px 80px",
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
              fontSize: "12px",
              fontWeight: "800",
              letterSpacing: "0.3px",
              marginBottom: "16px",
            }}
          >
            ✦ AI CAREER ASSISTANT
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
            Your AI-powered
            <span
              style={{
                display: "block",
                background:
                  "linear-gradient(90deg, #4f46e5, #7c3aed, #9333ea)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              job assistant.
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
            Tell me what kind of opportunity you're
            looking for. I'll understand your request
            and find the most relevant jobs for you.
          </p>

        </div>


        {/* ====================================================
            AI CAPABILITY CARDS
        ==================================================== */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, minmax(0, 1fr))",
            gap: "10px",
            marginBottom: "18px",
          }}
        >

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e7e9ef",
              borderRadius: "13px",
              padding: "14px 16px",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                marginBottom: "7px",
              }}
            >
              ✦
            </div>

            <div
              style={{
                fontSize: "12px",
                fontWeight: "800",
                color: "#374151",
              }}
            >
              Natural Language
            </div>

            <div
              style={{
                marginTop: "3px",
                fontSize: "11px",
                color: "#9ca3af",
              }}
            >
              Search naturally
            </div>
          </div>


          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e7e9ef",
              borderRadius: "13px",
              padding: "14px 16px",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                marginBottom: "7px",
              }}
            >
              🧠
            </div>

            <div
              style={{
                fontSize: "12px",
                fontWeight: "800",
                color: "#374151",
              }}
            >
              Semantic Matching
            </div>

            <div
              style={{
                marginTop: "3px",
                fontSize: "11px",
                color: "#9ca3af",
              }}
            >
              AI understands intent
            </div>
          </div>


          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e7e9ef",
              borderRadius: "13px",
              padding: "14px 16px",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                marginBottom: "7px",
              }}
            >
              🎯
            </div>

            <div
              style={{
                fontSize: "12px",
                fontWeight: "800",
                color: "#374151",
              }}
            >
              Relevant Jobs
            </div>

            <div
              style={{
                marginTop: "3px",
                fontSize: "11px",
                color: "#9ca3af",
              }}
            >
              Get ranked matches
            </div>
          </div>

        </div>


        {/* ====================================================
            CHAT WINDOW
        ==================================================== */}

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "20px",
            padding: "8px",
            boxShadow:
              "0 18px 45px rgba(15, 23, 42, 0.07)",
          }}
        >

          <ChatWindow />

        </div>


        {/* ====================================================
            EXAMPLE QUERIES
        ==================================================== */}

        <div
          style={{
            marginTop: "17px",
            textAlign: "center",
          }}
        >

          <div
            style={{
              color: "#9ca3af",
              fontSize: "11px",
              marginBottom: "9px",
              fontWeight: "600",
            }}
          >
            Try asking
          </div>


          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "7px",
            }}
          >

            {[
              "Remote Python developer jobs",
              "Data scientist jobs in Bengaluru",
              "AI engineer with ML experience",
            ].map((text) => (

              <span
                key={text}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  color: "#6b7280",
                  padding: "7px 11px",
                  borderRadius: "999px",
                  fontSize: "10px",
                }}
              >
                {text}
              </span>

            ))}

          </div>

        </div>

      </div>


      {/* ======================================================
          RESPONSIVE STYLES
      ====================================================== */}

      <style>{`

        @media (max-width: 750px) {

          .assistant-page {
            padding:
              30px
              15px
              60px !important;
          }

          .assistant-page > div {
            max-width: 100% !important;
          }

          .assistant-page
          > div
          > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }

        }

      `}</style>

    </div>
  );
}


export default Assistant;