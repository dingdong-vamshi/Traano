import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axiosInstance.post("/auth/register", formData);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "13px 16px",
        borderRadius: "12px",
        border: "1px solid var(--border-light)",
        background: "var(--surface)",
        color: "var(--text-primary)",
        fontSize: "14px",
        fontFamily: "inherit",
        outline: "none",
        transition: "border-color 0.3s, box-shadow 0.3s",
    };

    return (
        <div
            style={{
                minHeight: "calc(100vh - 64px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 24px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Floating orbs */}
            <div
                style={{
                    position: "absolute",
                    top: "-60px",
                    right: "20%",
                    width: "400px",
                    height: "400px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 60%)",
                    animation: "float 9s ease-in-out infinite",
                    pointerEvents: "none",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "-100px",
                    left: "10%",
                    width: "350px",
                    height: "350px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(6, 214, 160, 0.08) 0%, transparent 60%)",
                    animation: "floatReverse 11s ease-in-out infinite",
                    pointerEvents: "none",
                }}
            />

            {/* Grid */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                        "linear-gradient(rgba(99, 102, 241, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.02) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                    pointerEvents: "none",
                }}
            />

            <div
                className="animate-slide-up"
                style={{ width: "100%", maxWidth: "420px", position: "relative", zIndex: 1 }}
            >
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <div
                        style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "16px",
                            background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "24px",
                            fontWeight: 800,
                            color: "white",
                            margin: "0 auto 20px",
                            boxShadow: "0 8px 24px rgba(139, 92, 246, 0.3)",
                        }}
                    >
                        T
                    </div>
                    <h2
                        style={{
                            fontSize: "28px",
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            marginBottom: "8px",
                        }}
                    >
                        Create your account
                    </h2>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            style={{
                                color: "var(--primary-light)",
                                textDecoration: "none",
                                fontWeight: 500,
                            }}
                        >
                            Sign in →
                        </Link>
                    </p>
                </div>

                {/* Form Card */}
                <div
                    className="glass"
                    style={{
                        padding: "36px 28px",
                        borderRadius: "20px",
                        animation: "glowPulse 4s ease-in-out infinite",
                    }}
                >
                    <form
                        onSubmit={handleSubmit}
                        style={{ display: "flex", flexDirection: "column", gap: "22px" }}
                    >
                        {error && (
                            <div
                                className="animate-fade-in"
                                style={{
                                    padding: "12px 16px",
                                    borderRadius: "12px",
                                    background: "rgba(239, 68, 68, 0.08)",
                                    border: "1px solid rgba(239, 68, 68, 0.15)",
                                    color: "var(--danger-light)",
                                    fontSize: "13px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        <div>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: "var(--text-secondary)",
                                    marginBottom: "8px",
                                }}
                            >
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "var(--primary)";
                                    e.target.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "var(--border-light)";
                                    e.target.style.boxShadow = "none";
                                }}
                            />
                        </div>

                        <div>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: "var(--text-secondary)",
                                    marginBottom: "8px",
                                }}
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "var(--primary)";
                                    e.target.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "var(--border-light)";
                                    e.target.style.boxShadow = "none";
                                }}
                            />
                        </div>

                        <div>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: "var(--text-secondary)",
                                    marginBottom: "8px",
                                }}
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "var(--primary)";
                                    e.target.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "var(--border-light)";
                                    e.target.style.boxShadow = "none";
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="glow-btn"
                            style={{
                                padding: "14px",
                                borderRadius: "12px",
                                border: "none",
                                background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                                color: "white",
                                fontSize: "15px",
                                fontWeight: 600,
                                cursor: loading ? "not-allowed" : "pointer",
                                fontFamily: "inherit",
                                opacity: loading ? 0.6 : 1,
                                transition: "opacity 0.2s",
                                boxShadow: "0 4px 20px rgba(139, 92, 246, 0.3)",
                                marginTop: "4px",
                            }}
                        >
                            {loading ? "Creating account..." : "Create Account →"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
