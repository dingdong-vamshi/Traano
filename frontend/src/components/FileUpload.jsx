import { useState, useRef } from "react";
import axiosInstance from "../api/axios";

/**
 * FileUpload — Drag & drop CSV upload with progress
 *
 * Props:
 *   onUploadSuccess(data) — called after successful upload
 */
const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);
    setResult(null);
    if (e.dataTransfer.files[0]) validateAndSet(e.dataTransfer.files[0]);
  };

  const validateAndSet = (f) => {
    const ext = f.name.split(".").pop().toLowerCase();
    if (ext !== "csv") {
      setError("Only CSV files are supported.");
      return;
    }
    if (f.size > 50 * 1024 * 1024) {
      setError("File must be under 50MB.");
      return;
    }
    setFile(f);
    setError(null);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("statement", file);

    try {
      const res = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 300000, // 5 min timeout for large files
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });

      setResult(res.data);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      if (onUploadSuccess) onUploadSuccess(res.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const formatSize = (b) =>
    b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(1) + " KB" : (b / 1048576).toFixed(1) + " MB";

  return (
    <div>
      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        id="file-drop-zone"
        style={{
          border: `2px dashed ${dragActive ? "var(--primary)" : "var(--border-light)"}`,
          borderRadius: "16px",
          padding: "52px 24px",
          textAlign: "center",
          cursor: uploading ? "default" : "pointer",
          transition: "all 0.25s ease",
          background: dragActive ? "rgba(99, 102, 241, 0.06)" : "var(--surface-card)",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 14px",
            fontSize: "24px",
          }}
        >
          📄
        </div>
        <p style={{ fontSize: "15px", fontWeight: 600, marginBottom: "6px" }}>
          {dragActive ? "Drop your file here" : "Drag & drop your CSV statement"}
        </p>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
          or click to browse • CSV only • Max 50MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={(e) => {
            if (e.target.files[0]) validateAndSet(e.target.files[0]);
          }}
          style={{ display: "none" }}
          id="file-input"
        />
      </div>

      {/* Selected File */}
      {file && (
        <div
          className="animate-fade-in"
          style={{
            marginTop: "12px",
            padding: "14px 18px",
            borderRadius: "10px",
            background: "var(--surface-card)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                padding: "4px 8px",
                borderRadius: "6px",
                background: "rgba(52, 211, 153, 0.12)",
                color: "var(--accent)",
              }}
            >
              CSV
            </span>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600 }}>{file.name}</p>
              <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                {formatSize(file.size)}
              </p>
            </div>
          </div>
          <button
            onClick={() => { setFile(null); if (inputRef.current) inputRef.current.value = ""; }}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        id="upload-btn"
        style={{
          width: "100%",
          marginTop: "14px",
          padding: "13px",
          borderRadius: "10px",
          border: "none",
          fontSize: "14px",
          fontWeight: 600,
          cursor: file && !uploading ? "pointer" : "not-allowed",
          background: file && !uploading
            ? "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))"
            : "var(--surface-elevated)",
          color: file && !uploading ? "white" : "var(--text-muted)",
          transition: "all 0.25s",
          position: "relative",
          overflow: "hidden",
          fontFamily: "inherit",
        }}
      >
        {uploading ? `Uploading... ${progress}%` : "Upload & Analyze"}
        {uploading && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: "3px",
              width: `${progress}%`,
              background: "var(--accent)",
              transition: "width 0.3s",
            }}
          />
        )}
      </button>

      {/* Error */}
      {error && (
        <div
          className="animate-fade-in"
          style={{
            marginTop: "10px",
            padding: "10px 14px",
            borderRadius: "8px",
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.15)",
            color: "var(--danger-light)",
            fontSize: "12px",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Success Result */}
      {result && (
        <div
          className="animate-fade-in"
          style={{
            marginTop: "10px",
            padding: "14px 18px",
            borderRadius: "10px",
            background: "rgba(52, 211, 153, 0.06)",
            border: "1px solid rgba(52, 211, 153, 0.15)",
          }}
        >
          <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--accent-light)", marginBottom: "8px" }}>
            ✅ {result.totalProcessed} transactions processed
          </p>
          {result.riskDistribution && (
            <div style={{ display: "flex", gap: "12px", fontSize: "12px" }}>
              <span style={{ color: "var(--risk-normal)" }}>
                Normal: {result.riskDistribution.Normal}
              </span>
              <span style={{ color: "var(--risk-medium)" }}>
                Medium: {result.riskDistribution.Medium}
              </span>
              <span style={{ color: "var(--risk-high)" }}>
                High: {result.riskDistribution.High}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
