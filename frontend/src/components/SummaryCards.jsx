/**
 * SummaryCards — Dashboard KPI cards
 *
 * Displays: Total Transactions, Total Spending, Avg Value,
 * High Risk Count, Medium Risk Count
 */
const SummaryCards = ({ summary }) => {
  if (!summary) return null;

  const { totalTransactions, summary: typeSummary } = summary;

  // Sum all types (debit + credit + unknown) for total volume
  const totalVolume = typeSummary?.reduce((sum, s) => sum + Math.abs(s.total), 0) || 0;
  const avgValue = totalTransactions > 0 ? totalVolume / totalTransactions : 0;

  // Count risk levels from recent transactions or use summary data
  const highRisk = summary.riskCounts?.High || 0;
  const mediumRisk = summary.riskCounts?.Medium || 0;

  const formatINR = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  const cards = [
    {
      label: "Total Transactions",
      value: totalTransactions?.toLocaleString("en-IN") || "0",
      icon: "📊",
      color: "var(--primary-light)",
      glow: "rgba(99, 102, 241, 0.15)",
    },
    {
      label: "Total Volume",
      value: formatINR(totalVolume),
      icon: "💸",
      color: "var(--danger-light)",
      glow: "rgba(248, 113, 113, 0.15)",
    },
    {
      label: "Avg Transaction",
      value: formatINR(avgValue),
      icon: "📈",
      color: "var(--accent-light)",
      glow: "rgba(52, 211, 153, 0.15)",
    },
    {
      label: "High Risk",
      value: highRisk.toString(),
      icon: "🔴",
      color: "var(--danger-light)",
      glow: "rgba(248, 113, 113, 0.15)",
    },
    {
      label: "Medium Risk",
      value: mediumRisk.toString(),
      icon: "🟡",
      color: "var(--warning-light)",
      glow: "rgba(251, 191, 36, 0.15)",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
        gap: "14px",
        marginBottom: "28px",
      }}
      className="animate-fade-in"
    >
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            background: "var(--surface-card)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            padding: "20px",
            transition: "all 0.2s ease",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--border-light)";
            e.currentTarget.style.boxShadow = `0 8px 30px ${card.glow}`;
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
              }}
            >
              {card.label}
            </p>
            <span style={{ fontSize: "16px" }}>{card.icon}</span>
          </div>
          <p
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: card.color,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
