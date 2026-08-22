import ChatWindow from "../components/ChatWindow";


function Assistant() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 20px",
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >

        <h1
          style={{
            fontSize: "36px",
            marginBottom: "8px",
            color: "#111827",
          }}
        >
          AI Job Assistant
        </h1>

        <p
          style={{
            color: "#6b7280",
            fontSize: "17px",
            marginBottom: "30px",
          }}
        >
          Search for jobs using natural language
          powered by AI.
        </p>


        <ChatWindow />

      </div>

    </div>
  );
}


export default Assistant;