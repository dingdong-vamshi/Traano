import { useState } from "react";
import RiskBadge from "./RiskBadge";

/**
 * TransactionTable — Sortable, paginated transaction list
 *
 * Columns: Date, Description, Category, Amount, Risk Level, Anomaly Score
 * Sorting: Click column headers to toggle sort
 * Pagination: 15 rows per page
 */
const ROWS_PER_PAGE = 15;

const TransactionTable = ({ transactions }) => {
  const [sortKey, setSortKey] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);

  // --- Sorting ---
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const sorted = [...transactions].sort((a, b) => {
    let aVal = a[sortKey];
    let bVal = b[sortKey];

    if (sortKey === "date") {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }
    if (sortKey === "amount") {
      aVal = Math.abs(aVal);
      bVal = Math.abs(bVal);
    }
    if (sortKey === "riskLevel") {
      const order = { High: 3, Medium: 2, Normal: 1 };
      aVal = order[aVal] || 0;
      bVal = order[bVal] || 0;
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // --- Pagination ---
  const totalPages = Math.ceil(sorted.length / ROWS_PER_PAGE);
  const paginated = sorted.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatCurrency = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Math.abs(n));

  const SortIcon = ({ active, order }) => (
    <span
      style={{
        marginLeft: "4px",
        fontSize: "10px",
        opacity: active ? 1 : 0.3,
        color: active ? "var(--primary-light)" : "var(--text-muted)",
      }}
    >
      {active ? (order === "asc" ? "▲" : "▼") : "⇅"}
    </span>
  );

  const headerStyle = {
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    cursor: "pointer",
    userSelect: "none",
    transition: "color 0.15s",
    padding: "12px 0",
  };

  if (transactions.length === 0) {
    return (
      <div
        style={{
          background: "var(--surface-card)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
          padding: "60px 32px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "36px", marginBottom: "12px" }}>📋</p>
        <p
          style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}
        >
          No transactions yet
        </p>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
          Upload a bank statement to see your data here.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        overflow: "hidden",
      }}
      className="animate-fade-in"
    >
      {/* Table Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "110px 1fr 120px 120px 100px 90px",
          gap: "8px",
          padding: "0 20px",
          borderBottom: "1px solid var(--border)",
          background: "rgba(99, 102, 241, 0.03)",
        }}
      >
        <div style={headerStyle} onClick={() => handleSort("date")}>
          Date <SortIcon active={sortKey === "date"} order={sortOrder} />
        </div>
        <div style={{ ...headerStyle, cursor: "default" }}>Description</div>
        <div style={headerStyle} onClick={() => handleSort("category")}>
          Category
        </div>
        <div
          style={{ ...headerStyle, textAlign: "right" }}
          onClick={() => handleSort("amount")}
        >
          Amount <SortIcon active={sortKey === "amount"} order={sortOrder} />
        </div>
        <div style={headerStyle} onClick={() => handleSort("riskLevel")}>
          Risk <SortIcon active={sortKey === "riskLevel"} order={sortOrder} />
        </div>
        <div
          style={{ ...headerStyle, textAlign: "right" }}
          onClick={() => handleSort("anomalyScore")}
        >
          Score{" "}
          <SortIcon active={sortKey === "anomalyScore"} order={sortOrder} />
        </div>
      </div>

      {/* Rows */}
      {paginated.map((tx, i) => (
        <div
          key={tx._id || i}
          style={{
            display: "grid",
            gridTemplateColumns: "110px 1fr 120px 120px 100px 90px",
            gap: "8px",
            padding: "12px 20px",
            borderBottom:
              i < paginated.length - 1
                ? "1px solid rgba(30, 41, 59, 0.6)"
                : "none",
            transition: "background 0.12s",
            alignItems: "center",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--surface-card-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          {/* Date */}
          <span
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatDate(tx.date)}
          </span>

          {/* Description */}
          <span
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--text-primary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {tx.description || "—"}
          </span>

          {/* Category */}
          <span
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {tx.category || "—"}
          </span>

          {/* Amount */}
          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              textAlign: "right",
              fontVariantNumeric: "tabular-nums",
              color:
                tx.type === "credit"
                  ? "var(--accent-light)"
                  : "var(--text-primary)",
            }}
          >
            {tx.type === "credit" ? "+" : "−"}
            {formatCurrency(tx.amount)}
          </span>

          {/* Risk Badge */}
          <RiskBadge level={tx.riskLevel} />

          {/* Score */}
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              textAlign: "right",
              fontVariantNumeric: "tabular-nums",
              color:
                tx.anomalyScore >= 60
                  ? "var(--risk-high)"
                  : tx.anomalyScore >= 30
                  ? "var(--risk-medium)"
                  : "var(--text-muted)",
            }}
          >
            {tx.anomalyScore}
          </span>
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 20px",
            borderTop: "1px solid var(--border)",
            fontSize: "12px",
            color: "var(--text-muted)",
          }}
        >
          <span>
            Showing {(page - 1) * ROWS_PER_PAGE + 1}–
            {Math.min(page * ROWS_PER_PAGE, sorted.length)} of {sorted.length}
          </span>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid var(--border)",
                background: "transparent",
                color: page === 1 ? "var(--text-muted)" : "var(--text-secondary)",
                fontSize: "12px",
                cursor: page === 1 ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              ← Prev
            </button>
            <span
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                color: "var(--text-secondary)",
              }}
            >
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid var(--border)",
                background: "transparent",
                color:
                  page === totalPages
                    ? "var(--text-muted)"
                    : "var(--text-secondary)",
                fontSize: "12px",
                cursor: page === totalPages ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
