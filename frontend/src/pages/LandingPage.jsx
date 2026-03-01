import { Link, Navigate } from "react-router-dom";

/**
 * LandingPage — FinTech SaaS landing for Traano
 * Uses the app's dark design system for a cohesive premium look.
 */

const features = [
    {
        icon: "⚡",
        title: "Smart Anomaly Detection",
        desc: "Instantly spot duplicate charges, unusually large transactions, or vendors you don't typically use.",
        color: "var(--primary)",
        bg: "rgba(99, 102, 241, 0.1)",
    },
    {
        icon: "🛡️",
        title: "Isolated & Secure",
        desc: "Your data is yours. Strict per-user isolation ensures complete privacy for your financial records.",
        color: "var(--accent)",
        bg: "rgba(6, 214, 160, 0.1)",
    },
    {
        icon: "📊",
        title: "Risk Scoring",
        desc: "Every transaction gets scored. Instantly see your Normal, Medium, and High risk breakdown.",
        color: "var(--warning)",
        bg: "rgba(245, 158, 11, 0.1)",
    },
    {
        icon: "📈",
        title: "Spending Trends",
        desc: "Visualize your spending patterns across different categories with beautiful interactive charts.",
        color: "#60a5fa",
        bg: "rgba(96, 165, 250, 0.1)",
    },
];

const steps = [
    { num: "01", title: "Create Account", desc: "Sign up securely to get your private workspace." },
    { num: "02", title: "Upload CSV", desc: "Drop in your bank statements. We handle the formatting." },
    { num: "03", title: "Analyze Transactions", desc: "Our engine normalizes data and runs anomaly detection." },
    { num: "04", title: "Visual Insights", desc: "Explore your dashboard for risks and spending trends." },
];

const LandingPage = () => {
    const token = localStorage.getItem("token");
    if (token) return <Navigate to="/dashboard" replace />;

    return (
        <div style={{ minHeight: "100vh", background: "var(--surface)" }}>

            {/* ===== HERO ===== */}
            <section
                style={{
                    position: "relative",
                    overflow: "hidden",
                    padding: "100px 24px 120px",
                    textAlign: "center",
                }}
            >
                {/* Ambient gradients */}
                <div
                    style={{
                        position: "absolute",
                        top: "-200px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "800px",
                        height: "800px",
                        borderRadius: "50%",
                        background:
                            "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 60%)",
                        pointerEvents: "none",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: "-300px",
                        right: "-200px",
                        width: "600px",
                        height: "600px",
                        borderRadius: "50%",
                        background:
                            "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 60%)",
                        pointerEvents: "none",
                    }}
                />

                <div className="animate-slide-up" style={{ position: "relative", zIndex: 1 }}>
                    {/* Badge */}
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "6px 16px",
                            borderRadius: "99px",
                            background: "rgba(99, 102, 241, 0.1)",
                            border: "1px solid rgba(99, 102, 241, 0.2)",
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "var(--primary-light)",
                            marginBottom: "32px",
                        }}
                    >
                        ✨ AI-Powered Finance Intelligence
                    </div>

                    <h1
                        style={{
                            fontSize: "clamp(36px, 6vw, 64px)",
                            fontWeight: 800,
                            lineHeight: 1.1,
                            marginBottom: "24px",
                            color: "var(--text-primary)",
                        }}
                    >
                        Personal Finance
                        <br />
                        <span className="gradient-text">Anomaly Detection</span>
                    </h1>

                    <p
                        style={{
                            maxWidth: "560px",
                            margin: "0 auto 40px",
                            fontSize: "17px",
                            lineHeight: 1.7,
                            color: "var(--text-secondary)",
                        }}
                    >
                        Securely upload your bank statements. Let our intelligence engine uncover
                        hidden patterns, detect abnormal spending, and score your financial risk
                        in seconds.
                    </p>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "14px",
                            flexWrap: "wrap",
                        }}
                    >
                        <Link
                            to="/register"
                            style={{
                                textDecoration: "none",
                                padding: "14px 32px",
                                borderRadius: "12px",
                                background:
                                    "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
                                color: "white",
                                fontSize: "15px",
                                fontWeight: 600,
                                boxShadow: "0 4px 24px rgba(99, 102, 241, 0.35)",
                                transition: "all 0.25s",
                            }}
                        >
                            Get Started for Free →
                        </Link>
                        <Link
                            to="/login"
                            style={{
                                textDecoration: "none",
                                padding: "14px 32px",
                                borderRadius: "12px",
                                background: "var(--surface-card)",
                                border: "1px solid var(--border)",
                                color: "var(--text-secondary)",
                                fontSize: "15px",
                                fontWeight: 500,
                                transition: "all 0.25s",
                            }}
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== FEATURES ===== */}
            <section style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "56px" }}>
                    <h2
                        style={{
                            fontSize: "32px",
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            marginBottom: "12px",
                        }}
                    >
                        Everything you need to stay secure
                    </h2>
                    <p style={{ fontSize: "15px", color: "var(--text-secondary)" }}>
                        Enterprise-grade transaction analysis, built for personal finance.
                    </p>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: "20px",
                    }}
                >
                    {features.map((f) => (
                        <div
                            key={f.title}
                            className="glass"
                            style={{
                                padding: "32px 24px",
                                borderRadius: "16px",
                                transition: "transform 0.25s, box-shadow 0.25s",
                                cursor: "default",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-4px)";
                                e.currentTarget.style.boxShadow = `0 8px 32px ${f.bg}`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "12px",
                                    background: f.bg,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "22px",
                                    marginBottom: "20px",
                                }}
                            >
                                {f.icon}
                            </div>
                            <h3
                                style={{
                                    fontSize: "17px",
                                    fontWeight: 700,
                                    color: "var(--text-primary)",
                                    marginBottom: "10px",
                                }}
                            >
                                {f.title}
                            </h3>
                            <p style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--text-secondary)" }}>
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section
                style={{
                    padding: "80px 24px",
                    maxWidth: "1100px",
                    margin: "0 auto",
                }}
            >
                <div style={{ textAlign: "center", marginBottom: "56px" }}>
                    <h2
                        style={{
                            fontSize: "32px",
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            marginBottom: "12px",
                        }}
                    >
                        How Traano Works
                    </h2>
                    <p style={{ fontSize: "15px", color: "var(--text-secondary)" }}>
                        Four simple steps to financial clarity.
                    </p>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "24px",
                    }}
                >
                    {steps.map((s) => (
                        <div
                            key={s.num}
                            style={{
                                textAlign: "center",
                                padding: "32px 20px",
                                borderRadius: "16px",
                                background: "var(--surface-card)",
                                border: "1px solid var(--border)",
                                transition: "border-color 0.3s",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.borderColor = "var(--primary)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.borderColor = "var(--border)")
                            }
                        >
                            <div
                                className="gradient-text"
                                style={{
                                    fontSize: "40px",
                                    fontWeight: 800,
                                    marginBottom: "16px",
                                }}
                            >
                                {s.num}
                            </div>
                            <h3
                                style={{
                                    fontSize: "16px",
                                    fontWeight: 700,
                                    marginBottom: "8px",
                                    color: "var(--text-primary)",
                                }}
                            >
                                {s.title}
                            </h3>
                            <p style={{ fontSize: "13px", lineHeight: 1.6, color: "var(--text-muted)" }}>
                                {s.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer
                style={{
                    borderTop: "1px solid var(--border)",
                    padding: "40px 24px",
                    textAlign: "center",
                }}
            >
                <span className="gradient-text" style={{ fontSize: "18px", fontWeight: 700 }}>
                    Traano
                </span>
                <p
                    style={{
                        marginTop: "10px",
                        fontSize: "13px",
                        color: "var(--text-muted)",
                    }}
                >
                    © {new Date().getFullYear()} Traano. All rights reserved. Built for
                    security and privacy.
                </p>
            </footer>
        </div>
    );
};

export default LandingPage;
