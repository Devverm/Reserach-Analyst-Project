import { useState, useRef, useEffect } from "react";

import Jobs from "./pages/Jobs";
import Assistant from "./pages/Assistant";
import Recommendations from "./pages/Recommendations";
import ResumeUpload from "./components/ResumeUpload";


function App() {
  const [page, setPage] = useState("jobs");

  const [profileOpen, setProfileOpen] = useState(false);

  const [modal, setModal] = useState(null);

  const profileRef = useRef(null);


  // ============================================================
  // CLOSE PROFILE DROPDOWN WHEN CLICKING OUTSIDE
  // ============================================================

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);


  // ============================================================
  // NAVIGATION ITEMS
  // ============================================================

  const navItems = [
    {
      id: "jobs",
      label: "Jobs",
      icon: "⌕",
    },
    {
      id: "assistant",
      label: "AI Assistant",
      icon: "✦",
    },
    {
      id: "recommendations",
      label: "Recommendations",
      icon: "♢",
    },
    {
      id: "resume",
      label: "Resume Match",
      icon: "▣",
    },
  ];


  // ============================================================
  // NAVIGATION
  // ============================================================

  const navigateTo = (pageName) => {
    setPage(pageName);
    setProfileOpen(false);
    setModal(null);
  };


  // ============================================================
  // OPEN PROFILE MODAL
  // ============================================================

  const openModal = (type) => {
    setProfileOpen(false);
    setModal(type);
  };


  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f8fc",
      }}
    >

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: "1px solid #e8eaf0",
          padding: "0 32px",
        }}
      >

        <div
          style={{
            maxWidth: "1250px",
            height: "76px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "30px",
          }}
        >

          {/* =================================================
              LOGO
          ================================================= */}

          <button
            onClick={() => navigateTo("jobs")}
            style={{
              border: "none",
              background: "transparent",
              padding: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexShrink: 0,
            }}
          >

            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "11px",
                background:
                  "linear-gradient(135deg, #4f46e5, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "19px",
                fontWeight: "800",
                boxShadow:
                  "0 6px 15px rgba(79, 70, 229, 0.22)",
              }}
            >
              ✦
            </div>


            <div
              style={{
                textAlign: "left",
                lineHeight: "1.05",
              }}
            >

              <div
                style={{
                  fontSize: "17px",
                  fontWeight: "800",
                  color: "#111827",
                  letterSpacing: "-0.5px",
                }}
              >
                JobMatch
              </div>

              <div
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  color: "#7c3aed",
                  letterSpacing: "0.8px",
                }}
              >
                AI POWERED
              </div>

            </div>

          </button>


          {/* =================================================
              NAVIGATION LINKS
          ================================================= */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              flex: 1,
              justifyContent: "center",
            }}
          >

            {navItems.map((item) => {

              const active = page === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  style={{
                    position: "relative",
                    border: "none",
                    background:
                      active
                        ? "#f1f3ff"
                        : "transparent",
                    color:
                      active
                        ? "#4f46e5"
                        : "#6b7280",
                    padding: "10px 14px",
                    borderRadius: "9px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight:
                      active
                        ? "700"
                        : "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    transition:
                      "all 0.2s ease",
                  }}
                >

                  <span
                    style={{
                      fontSize: "15px",
                    }}
                  >
                    {item.icon}
                  </span>

                  {item.label}

                  {active && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "-17px",
                        left: "50%",
                        transform:
                          "translateX(-50%)",
                        width: "24px",
                        height: "3px",
                        borderRadius: "999px",
                        background:
                          "linear-gradient(90deg, #4f46e5, #8b5cf6)",
                      }}
                    />
                  )}

                </button>
              );
            })}

          </div>


          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexShrink: 0,
            }}
          >

            {/* NOTIFICATION */}

            <button
              onClick={() => openModal("notifications")}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                border:
                  "1px solid #e5e7eb",
                background: "#ffffff",
                color: "#6b7280",
                cursor: "pointer",
                fontSize: "15px",
              }}
              title="Notifications"
            >
              ♧
            </button>


            {/* =================================================
                PROFILE BUTTON
            ================================================= */}

            <div
              ref={profileRef}
              style={{
                position: "relative",
              }}
            >

              <button
                onClick={() =>
                  setProfileOpen(
                    (previous) => !previous
                  )
                }
                style={{
                  height: "38px",
                  padding: "0 11px",
                  borderRadius: "10px",
                  border:
                    profileOpen
                      ? "1px solid #c4b5fd"
                      : "1px solid #e5e7eb",
                  background:
                    profileOpen
                      ? "#faf9ff"
                      : "#ffffff",
                  color: "#374151",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >

                <span
                  style={{
                    width: "25px",
                    height: "25px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #ddd6fe, #c7d2fe)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#4f46e5",
                    fontWeight: "800",
                    fontSize: "10px",
                  }}
                >
                  AI
                </span>

                Profile

                <span
                  style={{
                    color: "#9ca3af",
                    fontSize: "10px",
                  }}
                >
                  {profileOpen ? "▴" : "▾"}
                </span>

              </button>


              {/* =================================================
                  PROFILE DROPDOWN
              ================================================= */}

              {profileOpen && (

                <div
                  style={{
                    position: "absolute",
                    top: "48px",
                    right: 0,
                    width: "255px",
                    background: "#ffffff",
                    border:
                      "1px solid #e8eaf0",
                    borderRadius: "16px",
                    padding: "8px",
                    boxShadow:
                      "0 20px 45px rgba(15, 23, 42, 0.12)",
                    zIndex: 2000,
                  }}
                >

                  {/* PROFILE HEADER */}

                  <div
                    style={{
                      padding: "13px 12px",
                      borderBottom:
                        "1px solid #f0f1f5",
                      marginBottom: "6px",
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >

                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "12px",
                          background:
                            "linear-gradient(135deg, #4f46e5, #8b5cf6)",
                          color: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "800",
                          fontSize: "13px",
                        }}
                      >
                        AI
                      </div>

                      <div>

                        <div
                          style={{
                            color: "#111827",
                            fontSize: "13px",
                            fontWeight: "800",
                          }}
                        >
                          Job Seeker
                        </div>

                        <div
                          style={{
                            color: "#9ca3af",
                            fontSize: "10px",
                            marginTop: "2px",
                          }}
                        >
                          AI-powered profile
                        </div>

                      </div>

                    </div>

                  </div>


                  {/* MY PROFILE */}

                  <ProfileMenuItem
                    icon="👤"
                    title="My Profile"
                    subtitle="View your profile"
                    onClick={() =>
                      openModal("profile")
                    }
                  />


                  {/* JOB PREFERENCES */}

                  <ProfileMenuItem
                    icon="🎯"
                    title="Job Preferences"
                    subtitle="Role, location & experience"
                    onClick={() =>
                      openModal("preferences")
                    }
                  />


                  {/* MY SKILLS */}

                  <ProfileMenuItem
                    icon="✦"
                    title="My Skills"
                    subtitle="Skills used for matching"
                    onClick={() =>
                      openModal("skills")
                    }
                  />


                  {/* RESUME */}

                  <ProfileMenuItem
                    icon="📄"
                    title="Resume"
                    subtitle="Upload or analyze resume"
                    onClick={() =>
                      navigateTo("resume")
                    }
                  />


                  <div
                    style={{
                      height: "1px",
                      background: "#f0f1f5",
                      margin: "6px 4px",
                    }}
                  />


                  {/* SETTINGS */}

                  <ProfileMenuItem
                    icon="⚙"
                    title="Settings"
                    subtitle="Application preferences"
                    onClick={() =>
                      openModal("settings")
                    }
                  />

                </div>

              )}

            </div>

          </div>

        </div>

      </nav>


      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      {page === "jobs" && <Jobs />}

      {page === "assistant" && <Assistant />}

      {page === "recommendations" && (
        <Recommendations />
      )}

      {page === "resume" && (
        <ResumeUpload />
      )}


      {/* =====================================================
          PROFILE MODAL
      ===================================================== */}

      {modal && (
        <ProfileModal
          type={modal}
          onClose={() => setModal(null)}
          navigateTo={navigateTo}
        />
      )}

    </div>
  );
}


// ============================================================
// PROFILE MENU ITEM
// ============================================================

function ProfileMenuItem({
  icon,
  title,
  subtitle,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        border: "none",
        background: "transparent",
        borderRadius: "10px",
        padding: "9px 8px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        textAlign: "left",
        cursor: "pointer",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.background =
          "#f8f7ff";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.background =
          "transparent";
      }}
    >

      <span
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "9px",
          background: "#f5f3ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          flexShrink: 0,
        }}
      >
        {icon}
      </span>


      <span
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >

        <span
          style={{
            color: "#374151",
            fontSize: "12px",
            fontWeight: "700",
          }}
        >
          {title}
        </span>

        <span
          style={{
            color: "#9ca3af",
            fontSize: "9px",
          }}
        >
          {subtitle}
        </span>

      </span>

    </button>
  );
}


// ============================================================
// PROFILE MODAL
// ============================================================

function ProfileModal({
  type,
  onClose,
  navigateTo,
}) {

  const content = {

    profile: {
      icon: "👤",
      title: "My Profile",
      description:
        "Your AI-powered job seeker profile.",
      body: (
        <>
          <InfoRow
            label="Target Role"
            value="Data Scientist / AI Engineer"
          />

          <InfoRow
            label="Location"
            value="Bengaluru"
          />

          <InfoRow
            label="Experience"
            value="3+ years"
          />

          <InfoRow
            label="Profile Status"
            value="AI Profile Ready"
          />
        </>
      ),
    },


    preferences: {
      icon: "🎯",
      title: "Job Preferences",
      description:
        "Your preferred job search criteria.",
      body: (
        <>
          <InfoRow
            label="Preferred Role"
            value="Data Scientist"
          />

          <InfoRow
            label="Location"
            value="Bengaluru"
          />

          <InfoRow
            label="Work Type"
            value="Full-time"
          />

          <InfoRow
            label="Experience"
            value="3 years"
          />
        </>
      ),
    },


    skills: {
      icon: "✦",
      title: "My Skills",
      description:
        "Skills currently used by the AI matching system.",
      body: (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {[
            "Python",
            "Machine Learning",
            "SQL",
            "Pandas",
            "NumPy",
            "Scikit-learn",
            "TensorFlow",
            "Power BI",
            "Data Analysis",
            "Generative AI",
          ].map((skill) => (
            <span
              key={skill}
              style={{
                background: "#f1efff",
                color: "#5b4de8",
                padding: "8px 12px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      ),
    },


    settings: {
      icon: "⚙",
      title: "Settings",
      description:
        "Application preferences.",
      body: (
        <>
          <SettingRow
            title="AI Recommendations"
            description="Use AI to rank relevant jobs"
          />

          <SettingRow
            title="Semantic Matching"
            description="Match jobs using meaning and context"
          />

          <SettingRow
            title="Resume Matching"
            description="Use your resume to find relevant jobs"
          />
        </>
      ),
    },


    notifications: {
      icon: "♧",
      title: "Notifications",
      description:
        "Your JobMatch notifications.",
      body: (
        <div
          style={{
            textAlign: "center",
            padding: "25px 10px",
            color: "#9ca3af",
          }}
        >
          <div
            style={{
              fontSize: "32px",
              marginBottom: "10px",
            }}
          >
            🔔
          </div>

          <div
            style={{
              fontWeight: "700",
              color: "#374151",
              marginBottom: "5px",
            }}
          >
            No new notifications
          </div>

          <div
            style={{
              fontSize: "12px",
            }}
          >
            You're all caught up.
          </div>
        </div>
      ),
    },

  };


  const selected = content[type];

  if (!selected) {
    return null;
  }


  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(15, 23, 42, 0.35)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 5000,
        padding: "20px",
      }}
    >

      <div
        onClick={(event) =>
          event.stopPropagation()
        }
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#ffffff",
          borderRadius: "22px",
          boxShadow:
            "0 30px 80px rgba(15,23,42,0.2)",
          overflow: "hidden",
        }}
      >

        {/* HEADER */}

        <div
          style={{
            padding: "25px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom:
              "1px solid #eef0f5",
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
                borderRadius: "13px",
                background:
                  "linear-gradient(135deg, #4f46e5, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "18px",
              }}
            >
              {selected.icon}
            </div>

            <div>

              <h2
                style={{
                  margin: 0,
                  color: "#111827",
                  fontSize: "20px",
                }}
              >
                {selected.title}
              </h2>

              <p
                style={{
                  margin:
                    "4px 0 0",
                  color: "#9ca3af",
                  fontSize: "12px",
                }}
              >
                {selected.description}
              </p>

            </div>

          </div>


          <button
            onClick={onClose}
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              border:
                "1px solid #e5e7eb",
              background: "#ffffff",
              color: "#6b7280",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            ×
          </button>

        </div>


        {/* BODY */}

        <div
          style={{
            padding: "25px 28px",
          }}
        >
          {selected.body}
        </div>


        {/* FOOTER */}

        <div
          style={{
            padding: "16px 28px",
            borderTop:
              "1px solid #eef0f5",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >

          {type === "profile" && (
            <button
              onClick={() => {
                onClose();
                navigateTo("recommendations");
              }}
              style={primaryButtonStyle}
            >
              View Recommendations →
            </button>
          )}

          {type === "preferences" && (
            <button
              onClick={() => {
                onClose();
                navigateTo("jobs");
              }}
              style={primaryButtonStyle}
            >
              Search Jobs →
            </button>
          )}

          {type === "skills" && (
            <button
              onClick={() => {
                onClose();
                navigateTo("recommendations");
              }}
              style={primaryButtonStyle}
            >
              Find Matching Jobs →
            </button>
          )}

          {type === "settings" && (
            <button
              onClick={onClose}
              style={primaryButtonStyle}
            >
              Done
            </button>
          )}

          {type === "notifications" && (
            <button
              onClick={onClose}
              style={primaryButtonStyle}
            >
              Done
            </button>
          )}

        </div>

      </div>

    </div>
  );
}


// ============================================================
// INFO ROW
// ============================================================

function InfoRow({ label, value }) {
  return (
    <div
      style={{
        padding: "14px 0",
        borderBottom:
          "1px solid #f0f1f5",
        display: "flex",
        justifyContent: "space-between",
        gap: "20px",
      }}
    >

      <span
        style={{
          color: "#9ca3af",
          fontSize: "12px",
          fontWeight: "600",
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: "#111827",
          fontSize: "13px",
          fontWeight: "700",
          textAlign: "right",
        }}
      >
        {value}
      </span>

    </div>
  );
}


// ============================================================
// SETTINGS ROW
// ============================================================

function SettingRow({
  title,
  description,
}) {
  return (
    <div
      style={{
        padding: "15px 0",
        borderBottom:
          "1px solid #f0f1f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
      }}
    >

      <div>

        <div
          style={{
            color: "#374151",
            fontSize: "13px",
            fontWeight: "700",
            marginBottom: "4px",
          }}
        >
          {title}
        </div>

        <div
          style={{
            color: "#9ca3af",
            fontSize: "11px",
          }}
        >
          {description}
        </div>

      </div>


      <div
        style={{
          width: "38px",
          height: "21px",
          borderRadius: "999px",
          background:
            "linear-gradient(90deg, #4f46e5, #8b5cf6)",
          padding: "2px",
          boxSizing: "border-box",
        }}
      >

        <div
          style={{
            width: "17px",
            height: "17px",
            background: "#ffffff",
            borderRadius: "50%",
            marginLeft: "17px",
          }}
        />

      </div>

    </div>
  );
}


// ============================================================
// PRIMARY BUTTON STYLE
// ============================================================

const primaryButtonStyle = {
  border: "none",
  borderRadius: "10px",
  background:
    "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "#ffffff",
  padding: "11px 17px",
  fontSize: "12px",
  fontWeight: "700",
  cursor: "pointer",
};


export default App;
