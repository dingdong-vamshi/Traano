import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import SummaryCards from "../components/SummaryCards";
import Filters from "../components/Filters";
import TransactionTable from "../components/TransactionTable";
import Charts from "../components/Charts";

/**
 * Dashboard — Main analytics page
 *
 * Fetches transactions + summary from API.
 * Applies client-side filtering for instant responsiveness.
 * Renders: Summary Cards → Charts → Filters → Transaction Table
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    riskLevel: "All",
    category: "All",
    dateFrom: "",
    dateTo: "",
  });

  // Fetch all data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [txRes, summaryRes] = await Promise.all([
        axiosInstance.get("/transactions?limit=5000&order=desc"),
        axiosInstance.get("/transactions/summary"),
      ]);

      const txData = txRes.data.data?.transactions || [];
      setTransactions(txData);

      // Compute risk counts from transaction data
      const riskCounts = { Normal: 0, Medium: 0, High: 0 };
      txData.forEach((tx) => {
        riskCounts[tx.riskLevel] = (riskCounts[tx.riskLevel] || 0) + 1;
      });

      setSummary({
        ...summaryRes.data.data,
        riskCounts,
      });
    } catch (err) {
      setError("Failed to load data. Is the backend running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Client-side filtering ---
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Risk level
      if (filters.riskLevel !== "All" && tx.riskLevel !== filters.riskLevel)
        return false;

      // Category
      if (filters.category !== "All" && tx.category !== filters.category)
        return false;

      // Date range
      if (filters.dateFrom) {
        const from = new Date(filters.dateFrom);
        if (new Date(tx.date) < from) return false;
      }
      if (filters.dateTo) {
        const to = new Date(filters.dateTo);
        to.setHours(23, 59, 59);
        if (new Date(tx.date) > to) return false;
      }

      return true;
    });
  }, [transactions, filters]);

  // Extract unique categories for filter dropdown
  const categories = useMemo(() => {
    const cats = new Set(transactions.map((tx) => tx.category).filter(Boolean));
    return [...cats].sort();
  }, [transactions]);

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--surface)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid var(--border)",
              borderTopColor: "var(--primary)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 14px",
            }}
          />
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface)" }}>
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "14px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border)",
          background: "rgba(11, 17, 32, 0.9)",
          backdropFilter: "blur(10px)",
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
          <span
            style={{
              fontSize: "11px",
              color: "var(--text-muted)",
              marginLeft: "6px",
              padding: "2px 8px",
              borderRadius: "4px",
              background: "var(--surface-card)",
            }}
          >
            Dashboard
          </span>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={fetchData}
            id="refresh-btn"
            style={{
              padding: "7px 14px",
              borderRadius: "7px",
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--text-secondary)",
              fontSize: "12px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "var(--primary)";
              e.target.style.color = "var(--primary-light)";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "var(--border)";
              e.target.style.color = "var(--text-secondary)";
            }}
          >
            ↻ Refresh
          </button>
          <button
            onClick={() => navigate("/upload")}
            id="nav-upload"
            style={{
              padding: "7px 14px",
              borderRadius: "7px",
              border: "none",
              background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
              color: "white",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            + Upload
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px 20px",
        }}
      >
        {/* Error */}
        {error && (
          <div
            style={{
              padding: "14px 18px",
              borderRadius: "10px",
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.15)",
              color: "var(--danger-light)",
              fontSize: "13px",
              marginBottom: "20px",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Summary Cards */}
        <SummaryCards summary={summary} />

        {/* Charts */}
        <Charts transactions={filteredTransactions} />

        {/* Filters */}
        <Filters
          filters={filters}
          onChange={setFilters}
          categories={categories}
        />

        {/* Transaction Table */}
        <TransactionTable transactions={filteredTransactions} />
      </main>
    </div>
  );
};

export default Dashboard;
