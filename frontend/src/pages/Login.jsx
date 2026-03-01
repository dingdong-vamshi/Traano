import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

/**
 * Login — Sign-in page using the app's dark design system
 */
const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
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
            const response = await axiosInstance.post("/auth/login", formData);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.error || "Login failed. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "12px 14px",
        borderRadius: "10px",
        border: "1px solid var(--border-light)",
        background: "var(--surface)",
        color: "var(--text-primary)",
        fontSize: "14px",
        fontFamily: "inherit",
        outline: "none",
        transition: "border-color 0.2s",
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
            }}
        >
            {/* Ambient glow */}
            <div
                style={{
                    position: "absolute",
                    top: "-100px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "500px",
                    height: "500px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 60%)",
                    pointerEvents: "none",
                }}
            />

            <div
                className="animate-slide-up"
                style={{
                    width: "100%",
                    maxWidth: "420px",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <h2
                        style={{
                            fontSize: "28px",
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            marginBottom: "8px",
                        }}
                    >
                        Welcome back
                    </h2>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                        Sign in to access your dashboard.{" "}
                        <Link
                            to="/register"
                            style={{
                                color: "var(--primary-light)",
                                textDecoration: "none",
                                fontWeight: 500,
                            }}
                        >
                            Create account →
                        </Link>
                    </p>
                </div>

                <div
                    className="glass"
                    style={{ padding: "32px 28px", borderRadius: "16px" }}
                >
                    <form
                        onSubmit={handleSubmit}
                        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
                    >
                        {error && (
                            <div
                                style={{
                                    padding: "10px 14px",
                                    borderRadius: "10px",
                                    background: "rgba(239, 68, 68, 0.08)",
                                    border: "1px solid rgba(239, 68, 68, 0.15)",
                                    color: "var(--danger-light)",
                                    fontSize: "13px",
                                }}
                            >
                                ⚠️ {error}
                            </div>
                        )}

                        <div>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    color: "var(--text-secondary)",
                                    marginBottom: "6px",
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
                                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                                onBlur={(e) => (e.target.style.borderColor = "var(--border-light)")}
                            />
                        </div>

                        <div>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    color: "var(--text-secondary)",
                                    marginBottom: "6px",
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
                                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                                onBlur={(e) => (e.target.style.borderColor = "var(--border-light)")}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: "13px",
                                borderRadius: "10px",
                                border: "none",
                                background:
                                    "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
                                color: "white",
                                fontSize: "14px",
                                fontWeight: 600,
                                cursor: loading ? "not-allowed" : "pointer",
                                fontFamily: "inherit",
                                opacity: loading ? 0.6 : 1,
                                transition: "opacity 0.2s",
                                boxShadow: "0 4px 20px rgba(99, 102, 241, 0.3)",
                            }}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
