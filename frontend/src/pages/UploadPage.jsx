import { useNavigate } from "react-router-dom";
import FileUpload from "../components/FileUpload";

/**
 * UploadPage — Standalone CSV upload page
 *
 * On success → redirects to /dashboard
 */
const UploadPage = () => {
  const navigate = useNavigate();

  const handleSuccess = (data) => {
    // Short delay so user sees the success message
    setTimeout(() => navigate("/dashboard"), 1200);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface)" }}>
      {/* Ambient Gradient */}
      <div
        style={{
          position: "fixed",
          top: "-30%",
          right: "-15%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <header
        style={{
          padding: "18px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "15px",
              fontWeight: 800,
              color: "white",
            }}
          >
            T
          </div>
          <h1 style={{ fontSize: "18px", fontWeight: 700 }}>
            <span className="gradient-text">Traano</span>
          </h1>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--text-secondary)",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
          id="nav-dashboard"
        >
          Dashboard →
        </button>
      </header>

      {/* Upload Card */}
      <main
        style={{
          maxWidth: "520px",
          margin: "0 auto",
          padding: "60px 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="animate-slide-up">
          <h2
            style={{
              fontSize: "26px",
              fontWeight: 700,
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            Upload Statement
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-secondary)",
              textAlign: "center",
              marginBottom: "32px",
              lineHeight: 1.5,
            }}
          >
            Upload your CSV bank statement to extract transactions,
            <br />
            detect anomalies, and analyze spending patterns.
          </p>
          <FileUpload onUploadSuccess={handleSuccess} />
        </div>
      </main>
    </div>
  );
};

export default UploadPage;
