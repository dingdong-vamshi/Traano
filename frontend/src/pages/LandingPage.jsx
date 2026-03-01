import { useState, useEffect, useRef } from "react";
import { Link, Navigate } from "react-router-dom";

/* ===== Animated Counter Hook ===== */
const useCounter = (target, duration = 2000) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const startTime = performance.now();
                    const animate = (now) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // ease-out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.floor(eased * target));
                        if (progress < 1) requestAnimationFrame(animate);
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration]);

    return { count, ref };
};

/* ===== Data ===== */
const features = [
    {
        icon: "⚡",
        title: "Smart Anomaly Detection",
        desc: "Statistical engine spots duplicate charges, unusually large transactions, and vendors you rarely use — instantly.",
        gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
        glow: "rgba(99, 102, 241, 0.15)",
    },
    {
        icon: "🛡️",
        title: "Secure Data Isolation",
        desc: "Every user gets a completely isolated workspace. Your financial data is never shared or accessible by others.",
        gradient: "linear-gradient(135deg, #06d6a0 0%, #34d399 100%)",
        glow: "rgba(6, 214, 160, 0.15)",
    },
    {
        icon: "📊",
        title: "Intelligent Risk Scoring",
        desc: "Each transaction is scored and classified into Normal, Medium, or High risk so you always know where you stand.",
        gradient: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
        glow: "rgba(245, 158, 11, 0.15)",
    },
    {
        icon: "📈",
        title: "Visual Spending Trends",
        desc: "Beautiful charts break down your spending by category, time, and risk level with an interactive dashboard.",
        gradient: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
        glow: "rgba(59, 130, 246, 0.15)",
    },
];

const steps = [
    { icon: "👤", title: "Create Account", desc: "Sign up in seconds. Your private, encrypted workspace is ready immediately." },
    { icon: "📄", title: "Upload CSV", desc: "Drop your bank statement. Our parser auto-detects columns and formats." },
    { icon: "🧠", title: "AI Processing", desc: "Normalization, anomaly detection, and risk scoring happen in real-time." },
    { icon: "🎯", title: "View Insights", desc: "Explore your interactive dashboard with charts, filters, and drill-downs." },
];

const stats = [
    { value: 10000, suffix: "+", label: "Transactions Analyzed" },
    { value: 99, suffix: "%", label: "Detection Accuracy" },
    { value: 256, suffix: "-bit", label: "Encryption Standard" },
    { value: 3, suffix: "s", label: "Average Processing" },
];

/* ===== Stat Card ===== */
const StatCard = ({ value, suffix, label }) => {
    const { count, ref } = useCounter(value);
    return (
        <div ref={ref} style={{ textAlign: "center" }}>
            <div
                className="shimmer-text"
                style={{ fontSize: "42px", fontWeight: 800, lineHeight: 1.1 }}
            >
                {count}
                <span style={{ fontSize: "28px" }}>{suffix}</span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "6px", fontWeight: 500 }}>
                {label}
            </p>
        </div>
    );
};

/* ===== Main Component ===== */
const LandingPage = () => {
    const token = localStorage.getItem("token");
    if (token) return <Navigate to="/dashboard" replace />;

    return (
        <div style={{ minHeight: "100vh", background: "var(--surface)", overflow: "hidden" }}>

            {/* ===== HERO ===== */}
            <section
                style={{
                    position: "relative",
                    padding: "100px 24px 80px",
                    textAlign: "center",
                    overflow: "hidden",
                }}
            >
                {/* Floating orbs */}
                <div
                    style={{
                        position: "absolute",
                        top: "-60px",
                        left: "15%",
                        width: "400px",
                        height: "400px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)",
                        animation: "float 8s ease-in-out infinite",
                        pointerEvents: "none",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        top: "100px",
                        right: "10%",
                        width: "300px",
                        height: "300px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
                        animation: "floatReverse 10s ease-in-out infinite",
                        pointerEvents: "none",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: "-100px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "600px",
                        height: "600px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(6, 214, 160, 0.06) 0%, transparent 70%)",
                        animation: "float 12s ease-in-out infinite",
                        pointerEvents: "none",
                    }}
                />

                {/* Grid pattern overlay */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage:
                            "linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                        pointerEvents: "none",
                    }}
                />

                <div style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto" }}>
                    {/* Badge */}
                    <div
                        className="animate-slide-up stagger-1"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "7px 18px",
                            borderRadius: "99px",
                            background: "rgba(99, 102, 241, 0.08)",
                            border: "1px solid rgba(99, 102, 241, 0.2)",
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "var(--primary-light)",
                            marginBottom: "36px",
                            animation: "fadeIn 0.5s ease-out forwards, borderGlow 3s ease-in-out infinite",
                        }}
                    >
                        <span style={{ fontSize: "14px" }}>✨</span>
                        AI-Powered Finance Intelligence
                    </div>

                    {/* Heading */}
                    <h1
                        className="animate-slide-up stagger-2"
                        style={{
                            fontSize: "clamp(40px, 7vw, 72px)",
                            fontWeight: 800,
                            lineHeight: 1.05,
                            letterSpacing: "-0.03em",
                            marginBottom: "24px",
                            color: "var(--text-primary)",
                        }}
                    >
                        Personal Finance
                        <br />
                        <span className="shimmer-text">Anomaly Detection</span>
                    </h1>

                    {/* Subtitle */}
                    <p
                        className="animate-slide-up stagger-3"
                        style={{
                            maxWidth: "520px",
                            margin: "0 auto 44px",
                            fontSize: "17px",
                            lineHeight: 1.7,
                            color: "var(--text-secondary)",
                        }}
                    >
                        Upload your bank statements. Our intelligence engine uncovers hidden patterns,
                        detects abnormal spending, and scores your financial risk — in seconds.
                    </p>

                    {/* CTA Buttons */}
                    <div
                        className="animate-slide-up stagger-4"
                        style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}
                    >
                        <Link
                            to="/register"
                            className="glow-btn"
                            style={{
                                textDecoration: "none",
                                padding: "16px 36px",
                                borderRadius: "14px",
                                background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
                                color: "white",
                                fontSize: "15px",
                                fontWeight: 600,
                                boxShadow: "0 4px 24px rgba(99, 102, 241, 0.35)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            Get Started Free
                            <span style={{ fontSize: "18px" }}>→</span>
                        </Link>
                        <Link
                            to="/login"
                            style={{
                                textDecoration: "none",
                                padding: "16px 36px",
                                borderRadius: "14px",
                                background: "var(--surface-card)",
                                border: "1px solid var(--border-light)",
                                color: "var(--text-secondary)",
                                fontSize: "15px",
                                fontWeight: 500,
                                transition: "all 0.25s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "var(--primary)";
                                e.currentTarget.style.color = "var(--text-primary)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "var(--border-light)";
                                e.currentTarget.style.color = "var(--text-secondary)";
                            }}
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== STATS BAR ===== */}
            <section
                style={{
                    maxWidth: "900px",
                    margin: "0 auto 60px",
                    padding: "0 24px",
                }}
            >
                <div
                    className="glass"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        padding: "36px 24px",
                        borderRadius: "20px",
                        gap: "8px",
                    }}
                >
                    {stats.map((s, i) => (
                        <div
                            key={s.label}
                            style={{
                                borderRight: i < stats.length - 1 ? "1px solid var(--border)" : "none",
                            }}
                        >
                            <StatCard {...s} />
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== FEATURES ===== */}
            <section style={{ padding: "60px 24px 80px", maxWidth: "1100px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "56px" }}>
                    <p
                        style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "var(--primary-light)",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            marginBottom: "12px",
                        }}
                    >
                        Features
                    </p>
                    <h2
                        style={{
                            fontSize: "36px",
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            marginBottom: "12px",
                        }}
                    >
                        Everything you need to stay secure
                    </h2>
                    <p style={{ fontSize: "15px", color: "var(--text-secondary)", maxWidth: "500px", margin: "0 auto" }}>
                        Enterprise-grade transaction analysis, built for personal finance peace of mind.
                    </p>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: "20px",
                    }}
                >
                    {features.map((f, i) => (
                        <div
                            key={f.title}
                            className={`glass card-lift animate-slide-up stagger-${i + 1}`}
                            style={{
                                padding: "32px 24px",
                                borderRadius: "18px",
                                cursor: "default",
                            }}
                        >
                            <div
                                style={{
                                    width: "52px",
                                    height: "52px",
                                    borderRadius: "14px",
                                    background: f.gradient,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "24px",
                                    marginBottom: "22px",
                                    boxShadow: `0 8px 24px ${f.glow}`,
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
                            <p style={{ fontSize: "14px", lineHeight: 1.65, color: "var(--text-secondary)" }}>
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
                    maxWidth: "1000px",
                    margin: "0 auto",
                    position: "relative",
                }}
            >
                <div style={{ textAlign: "center", marginBottom: "56px" }}>
                    <p
                        style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "var(--accent-light)",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            marginBottom: "12px",
                        }}
                    >
                        How It Works
                    </p>
                    <h2
                        style={{
                            fontSize: "36px",
                            fontWeight: 700,
                            color: "var(--text-primary)",
                        }}
                    >
                        Four simple steps to clarity
                    </h2>
                </div>

                {/* Timeline connector */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "24px",
                        position: "relative",
                    }}
                >
                    {steps.map((s, i) => (
                        <div
                            key={s.title}
                            className={`animate-slide-up stagger-${i + 1}`}
                            style={{
                                textAlign: "center",
                                padding: "36px 20px",
                                borderRadius: "18px",
                                background: "var(--surface-card)",
                                border: "1px solid var(--border)",
                                transition: "border-color 0.3s, box-shadow 0.3s",
                                cursor: "default",
                                position: "relative",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "var(--primary)";
                                e.currentTarget.style.boxShadow = "0 0 30px rgba(99, 102, 241, 0.1)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "var(--border)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            {/* Step number badge */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: "-14px",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    width: "28px",
                                    height: "28px",
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
                                    color: "white",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {i + 1}
                            </div>
                            <div style={{ fontSize: "36px", marginBottom: "16px" }}>{s.icon}</div>
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

            {/* ===== CTA SECTION ===== */}
            <section
                style={{
                    padding: "80px 24px",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Background glow */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "-100px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "700px",
                        height: "400px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 60%)",
                        pointerEvents: "none",
                    }}
                />

                <div
                    className="glass"
                    style={{
                        maxWidth: "700px",
                        margin: "0 auto",
                        padding: "56px 40px",
                        borderRadius: "24px",
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <h2
                        style={{
                            fontSize: "32px",
                            fontWeight: 700,
                            marginBottom: "16px",
                            color: "var(--text-primary)",
                        }}
                    >
                        Ready to take control of your finances?
                    </h2>
                    <p
                        style={{
                            fontSize: "15px",
                            color: "var(--text-secondary)",
                            marginBottom: "32px",
                            maxWidth: "480px",
                            margin: "0 auto 32px",
                            lineHeight: 1.6,
                        }}
                    >
                        Join thousands of users who trust Traano to keep their spending in check and detect anomalies before they become problems.
                    </p>
                    <Link
                        to="/register"
                        className="glow-btn"
                        style={{
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "16px 40px",
                            borderRadius: "14px",
                            background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
                            color: "white",
                            fontSize: "16px",
                            fontWeight: 600,
                            boxShadow: "0 4px 24px rgba(99, 102, 241, 0.35)",
                        }}
                    >
                        Start Analyzing Now
                        <span style={{ fontSize: "20px" }}>🚀</span>
                    </Link>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer
                style={{
                    borderTop: "1px solid var(--border)",
                    padding: "40px 24px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "16px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                        style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "8px",
                            background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "13px",
                            fontWeight: 800,
                            color: "white",
                        }}
                    >
                        T
                    </div>
                    <span className="gradient-text" style={{ fontSize: "18px", fontWeight: 700 }}>
                        Traano
                    </span>
                </div>
                <p
                    style={{
                        fontSize: "13px",
                        color: "var(--text-muted)",
                    }}
                >
                    © {new Date().getFullYear()} Traano. All rights reserved. Built with 🔒 for security and privacy.
                </p>
            </footer>
        </div>
    );
};

export default LandingPage;
