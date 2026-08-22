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

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

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
      icon: "◇",
    },
    {
      id: "resume",
      label: "Resume Match",
      icon: "▣",
    },
  ];

  const navigateTo = (pageName) => {
    setPage(pageName);
    setProfileOpen(false);
    setModal(null);
  };

  const openModal = (type) => {
    setProfileOpen(false);
    setModal(type);
  };

  return (
    <div className="app-shell">

      {/* =====================================================
          TOP NAVIGATION
      ===================================================== */}

      <nav className="top-nav">
        <div className="nav-container">

          {/* LOGO */}

          <button
            className="brand"
            onClick={() => navigateTo("jobs")}
          >
            <div className="brand-mark">
              <span>✦</span>
            </div>

            <div className="brand-text">
              <div className="brand-name">
                JobMatch
              </div>

              <div className="brand-subtitle">
                AI POWERED
              </div>
            </div>
          </button>


          {/* NAVIGATION */}

          <div className="main-nav">
            {navItems.map((item) => {
              const active = page === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`nav-item ${
                    active ? "nav-item-active" : ""
                  }`}
                >
                  <span className="nav-icon">
                    {item.icon}
                  </span>

                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>


          {/* RIGHT SIDE */}

          <div className="nav-actions">

            <button
              className="icon-button"
              onClick={() =>
                openModal("notifications")
              }
              title="Notifications"
            >
              ♧
            </button>


            <div
              className="profile-wrapper"
              ref={profileRef}
            >

              <button
                className={`profile-button ${
                  profileOpen
                    ? "profile-button-active"
                    : ""
                }`}
                onClick={() =>
                  setProfileOpen(
                    (previous) => !previous
                  )
                }
              >

                <span className="avatar">
                  AI
                </span>

                <span className="profile-label">
                  Profile
                </span>

                <span className="profile-arrow">
                  {profileOpen ? "⌃" : "⌄"}
                </span>

              </button>


              {/* PROFILE DROPDOWN */}

              {profileOpen && (
                <div className="profile-dropdown">

                  <div className="profile-header">

                    <div className="large-avatar">
                      AI
                    </div>

                    <div>
                      <div className="profile-title">
                        Job Seeker
                      </div>

                      <div className="profile-description">
                        AI-powered profile
                      </div>
                    </div>

                  </div>


                  <ProfileMenuItem
                    icon="◉"
                    title="My Profile"
                    subtitle="View your profile"
                    onClick={() =>
                      openModal("profile")
                    }
                  />


                  <ProfileMenuItem
                    icon="◎"
                    title="Job Preferences"
                    subtitle="Role, location & experience"
                    onClick={() =>
                      openModal("preferences")
                    }
                  />


                  <ProfileMenuItem
                    icon="✦"
                    title="My Skills"
                    subtitle="Skills used for matching"
                    onClick={() =>
                      openModal("skills")
                    }
                  />


                  <ProfileMenuItem
                    icon="▤"
                    title="Resume"
                    subtitle="Upload or analyze resume"
                    onClick={() =>
                      navigateTo("resume")
                    }
                  />


                  <div className="menu-divider" />


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
          MAIN CONTENT
      ===================================================== */}

      <main className="page-container">

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

      </main>


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


      {/* =====================================================
          GLOBAL STYLES
      ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

          background: #f8f7f3;
          color: #171321;
        }


        button {
          font-family: inherit;
        }


        /* =====================================================
           APP SHELL
        ===================================================== */

        .app-shell {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 80% 0%,
              rgba(105, 72, 103, 0.055),
              transparent 30%
            ),
            #f8f7f3;
        }


        /* =====================================================
           NAVIGATION
        ===================================================== */

        .top-nav {
          position: sticky;
          top: 0;
          z-index: 1000;

          background:
            rgba(248, 247, 243, 0.92);

          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);

          border-bottom:
            1px solid rgba(38, 30, 45, 0.08);
        }


        .nav-container {
          width: min(1240px, calc(100% - 48px));
          height: 78px;
          margin: 0 auto;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 30px;
        }


        /* =====================================================
           BRAND
        ===================================================== */

        .brand {
          border: none;
          background: transparent;
          padding: 0;

          display: flex;
          align-items: center;
          gap: 11px;

          cursor: pointer;

          flex-shrink: 0;
        }


        .brand-mark {
          width: 40px;
          height: 40px;

          border-radius: 12px;

          background:
            linear-gradient(
              135deg,
              #39223d,
              #74466f
            );

          color: white;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 18px;

          box-shadow:
            0 8px 22px
            rgba(72, 40, 70, 0.18);
        }


        .brand-name {
          color: #171321;

          font-size: 17px;
          font-weight: 800;

          letter-spacing: -0.6px;

          line-height: 1;
        }


        .brand-subtitle {
          margin-top: 5px;

          color: #79506f;

          font-size: 8px;
          font-weight: 800;

          letter-spacing: 1.2px;
        }


        /* =====================================================
           MAIN NAV
        ===================================================== */

        .main-nav {
          display: flex;
          align-items: center;

          gap: 5px;

          flex: 1;
          justify-content: center;
        }


        .nav-item {
          position: relative;

          border: none;
          background: transparent;

          color: #716b76;

          padding: 10px 15px;

          border-radius: 999px;

          cursor: pointer;

          display: flex;
          align-items: center;
          gap: 7px;

          font-size: 13px;
          font-weight: 650;

          transition:
            background 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
        }


        .nav-item:hover {
          background: #eee9ed;
          color: #352336;
        }


        .nav-item-active {
          background: #eee6ec;
          color: #4b2949;
        }


        .nav-item-active:hover {
          background: #eee6ec;
        }


        .nav-icon {
          font-size: 15px;
          line-height: 1;
        }


        /* =====================================================
           RIGHT ACTIONS
        ===================================================== */

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 9px;

          flex-shrink: 0;
        }


        .icon-button {
          width: 39px;
          height: 39px;

          border-radius: 50%;

          border:
            1px solid #ddd7dd;

          background: #ffffff;

          color: #625a64;

          cursor: pointer;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 15px;

          transition:
            background 0.2s ease,
            border-color 0.2s ease;
        }


        .icon-button:hover {
          background: #f2edf1;
          border-color: #cfc5cf;
        }


        .profile-wrapper {
          position: relative;
        }


        .profile-button {
          height: 40px;

          padding: 4px 11px 4px 5px;

          border-radius: 999px;

          border:
            1px solid #ddd7dd;

          background: #ffffff;

          color: #352c37;

          cursor: pointer;

          display: flex;
          align-items: center;
          gap: 8px;

          font-size: 12px;
          font-weight: 700;

          transition: all 0.2s ease;
        }


        .profile-button:hover,
        .profile-button-active {
          border-color: #bdaabb;
          background: #fdfafd;
        }


        .avatar {
          width: 29px;
          height: 29px;

          border-radius: 50%;

          background:
            linear-gradient(
              135deg,
              #eadfe9,
              #d7c3d5
            );

          color: #5a3555;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 9px;
          font-weight: 800;
        }


        .profile-arrow {
          color: #958d96;
          font-size: 11px;
        }


        /* =====================================================
           PROFILE DROPDOWN
        ===================================================== */

        .profile-dropdown {
          position: absolute;

          top: 51px;
          right: 0;

          width: 265px;

          padding: 8px;

          background: #ffffff;

          border:
            1px solid #e6e0e5;

          border-radius: 18px;

          box-shadow:
            0 25px 60px
            rgba(39, 28, 40, 0.15);

          animation:
            dropdownIn 0.18s ease-out;
        }


        @keyframes dropdownIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }


        .profile-header {
          padding: 13px 12px;

          display: flex;
          align-items: center;

          gap: 11px;

          border-bottom:
            1px solid #f0ecef;

          margin-bottom: 6px;
        }


        .large-avatar {
          width: 39px;
          height: 39px;

          border-radius: 12px;

          background:
            linear-gradient(
              135deg,
              #39223d,
              #74466f
            );

          color: white;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 11px;
          font-weight: 800;
        }


        .profile-title {
          color: #27202a;

          font-size: 13px;
          font-weight: 800;
        }


        .profile-description {
          margin-top: 3px;

          color: #99919a;

          font-size: 10px;
        }


        .menu-divider {
          height: 1px;

          background: #f0ecef;

          margin: 6px 4px;
        }


        /* =====================================================
           PAGE
        ===================================================== */

        .page-container {
          min-height: calc(100vh - 78px);
        }


        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 900px) {

          .nav-container {
            width: min(
              100% - 28px,
              1240px
            );

            gap: 12px;
          }


          .main-nav {
            justify-content: flex-end;
          }


          .nav-item {
            padding: 9px 10px;
          }


          .nav-item span:last-child {
            display: none;
          }


          .profile-label {
            display: none;
          }

        }


        @media (max-width: 650px) {

          .nav-container {
            height: 68px;
          }


          .brand-text {
            display: none;
          }


          .nav-item {
            width: 38px;
            height: 38px;

            justify-content: center;

            padding: 0;
          }


          .icon-button {
            display: none;
          }


          .profile-button {
            width: 40px;
            padding: 4px;
            justify-content: center;
          }


          .profile-arrow {
            display: none;
          }

        }

      `}</style>

    </div>
  );
}


/* ============================================================
   PROFILE MENU ITEM
============================================================ */

function ProfileMenuItem({
  icon,
  title,
  subtitle,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="profile-menu-item"
      style={{
        width: "100%",
        border: "none",
        background: "transparent",
        borderRadius: "11px",
        padding: "9px 8px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        textAlign: "left",
        cursor: "pointer",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.background =
          "#f7f3f6";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.background =
          "transparent";
      }}
    >

      <span
        style={{
          width: "33px",
          height: "33px",
          borderRadius: "10px",
          background: "#f3edf2",
          color: "#684361",
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
            color: "#342c36",
            fontSize: "12px",
            fontWeight: "750",
          }}
        >
          {title}
        </span>

        <span
          style={{
            color: "#a19aa2",
            fontSize: "9px",
          }}
        >
          {subtitle}
        </span>

      </span>

    </button>
  );
}


/* ============================================================
   PROFILE MODAL
============================================================ */

function ProfileModal({
  type,
  onClose,
  navigateTo,
}) {

  const content = {

    profile: {
      icon: "◉",
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
      icon: "◎",
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
                background: "#f1eaf0",
                color: "#5b3554",
                padding: "8px 12px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: "650",
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
            padding: "30px 10px",
            color: "#99919a",
          }}
        >

          <div
            style={{
              fontSize: "32px",
              marginBottom: "10px",
            }}
          >
            ♧
          </div>

          <div
            style={{
              fontWeight: "750",
              color: "#3b333d",
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
          "rgba(28, 20, 29, 0.42)",
        backdropFilter: "blur(6px)",
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
          maxWidth: "540px",
          background: "#ffffff",
          borderRadius: "22px",
          boxShadow:
            "0 35px 90px rgba(29, 20, 30, 0.22)",
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
              "1px solid #eee9ed",
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
                width: "43px",
                height: "43px",
                borderRadius: "13px",
                background:
                  "linear-gradient(135deg, #39223d, #74466f)",
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
                  color: "#211a23",
                  fontSize: "20px",
                  letterSpacing: "-0.5px",
                }}
              >
                {selected.title}
              </h2>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#99919a",
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
              borderRadius: "50%",
              border:
                "1px solid #e5dfe5",
              background: "#ffffff",
              color: "#6d6570",
              cursor: "pointer",
              fontSize: "17px",
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
              "1px solid #eee9ed",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >

          {type === "profile" && (
            <button
              onClick={() => {
                onClose();
                navigateTo(
                  "recommendations"
                );
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
                navigateTo(
                  "recommendations"
                );
              }}
              style={primaryButtonStyle}
            >
              Find Matching Jobs →
            </button>
          )}


          {(type === "settings" ||
            type === "notifications") && (
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


/* ============================================================
   INFO ROW
============================================================ */

function InfoRow({ label, value }) {
  return (
    <div
      style={{
        padding: "14px 0",
        borderBottom:
          "1px solid #f0ecef",
        display: "flex",
        justifyContent: "space-between",
        gap: "20px",
      }}
    >

      <span
        style={{
          color: "#9b939c",
          fontSize: "12px",
          fontWeight: "600",
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: "#211a23",
          fontSize: "13px",
          fontWeight: "750",
          textAlign: "right",
        }}
      >
        {value}
      </span>

    </div>
  );
}


/* ============================================================
   SETTINGS ROW
============================================================ */

function SettingRow({
  title,
  description,
}) {
  return (
    <div
      style={{
        padding: "15px 0",
        borderBottom:
          "1px solid #f0ecef",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
      }}
    >

      <div>

        <div
          style={{
            color: "#342c36",
            fontSize: "13px",
            fontWeight: "700",
            marginBottom: "4px",
          }}
        >
          {title}
        </div>

        <div
          style={{
            color: "#9b939c",
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
            "linear-gradient(90deg, #4b2949, #805276)",
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


/* ============================================================
   PRIMARY BUTTON
============================================================ */

const primaryButtonStyle = {
  border: "none",
  borderRadius: "999px",

  background:
    "linear-gradient(135deg, #39223d, #74466f)",

  color: "#ffffff",

  padding: "11px 18px",

  fontSize: "12px",
  fontWeight: "750",

  cursor: "pointer",

  boxShadow:
    "0 8px 18px rgba(72, 40, 70, 0.18)",
};


export default App;