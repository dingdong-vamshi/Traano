import { Link, useNavigate } from "react-router-dom";

/**
 * Navbar — Top navigation bar
 * Shows Login/Register when logged out, Dashboard/Logout when logged in.
 * Uses the app's dark design tokens for seamless integration.
 */
const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        // Force re-render since localStorage change doesn't trigger state updates
        window.location.reload();
    };

    return (
        <nav
            style={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                padding: "0 32px",
                height: "64px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid var(--border)",
                background: "rgba(11, 17, 32, 0.85)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
            }}
        >
            {/* Logo */}
            <Link
                to="/"
                style={{
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                }}
            >
                <div
                    style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "10px",
                        background:
                            "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "16px",
                        fontWeight: 800,
                        color: "white",
                    }}
                >
                    T
                </div>
                <span className="gradient-text" style={{ fontSize: "20px", fontWeight: 700 }}>
                    Traano
                </span>
            </Link>

            {/* Right-side actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {token ? (
                    <>
                        <Link
                            to="/upload"
                            style={{
                                textDecoration: "none",
                                padding: "8px 16px",
                                borderRadius: "8px",
                                border: "1px solid var(--border)",
                                background: "transparent",
                                color: "var(--text-secondary)",
                                fontSize: "13px",
                                fontWeight: 500,
                                transition: "all 0.2s",
                            }}
                        >
                            Upload
                        </Link>
                        <Link
                            to="/dashboard"
                            style={{
                                textDecoration: "none",
                                padding: "8px 16px",
                                borderRadius: "8px",
                                border: "1px solid var(--border)",
                                background: "transparent",
                                color: "var(--text-secondary)",
                                fontSize: "13px",
                                fontWeight: 500,
                                transition: "all 0.2s",
                            }}
                        >
                            Dashboard
                        </Link>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: "8px 18px",
                                borderRadius: "8px",
                                border: "1px solid rgba(239, 68, 68, 0.3)",
                                background: "rgba(239, 68, 68, 0.08)",
                                color: "var(--danger-light)",
                                fontSize: "13px",
                                fontWeight: 500,
                                cursor: "pointer",
                                fontFamily: "inherit",
                                transition: "all 0.2s",
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            style={{
                                textDecoration: "none",
                                padding: "8px 18px",
                                borderRadius: "8px",
                                border: "1px solid var(--border)",
                                background: "transparent",
                                color: "var(--text-secondary)",
                                fontSize: "13px",
                                fontWeight: 500,
                                transition: "all 0.2s",
                            }}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            style={{
                                textDecoration: "none",
                                padding: "8px 18px",
                                borderRadius: "8px",
                                border: "none",
                                background:
                                    "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
                                color: "white",
                                fontSize: "13px",
                                fontWeight: 600,
                                transition: "all 0.2s",
                            }}
                        >
                            Get Started
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
