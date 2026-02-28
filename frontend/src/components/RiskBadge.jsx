/**
 * RiskBadge — Color-coded risk level pill
 *
 * Normal → green
 * Medium → yellow
 * High   → red
 */
const RiskBadge = ({ level, score }) => {
  const config = {
    Normal: {
      bg: "var(--risk-normal-bg)",
      color: "var(--risk-normal)",
      border: "rgba(52, 211, 153, 0.2)",
    },
    Medium: {
      bg: "var(--risk-medium-bg)",
      color: "var(--risk-medium)",
      border: "rgba(251, 191, 36, 0.2)",
    },
    High: {
      bg: "var(--risk-high-bg)",
      color: "var(--risk-high)",
      border: "rgba(248, 113, 113, 0.2)",
    },
  };

  const style = config[level] || config.Normal;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "3px 10px",
          borderRadius: "20px",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.3px",
          background: style.bg,
          color: style.color,
          border: `1px solid ${style.border}`,
          textTransform: "uppercase",
        }}
      >
        <span
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: style.color,
          }}
        />
        {level}
      </span>
      {score > 0 && (
        <span
          style={{
            fontSize: "10px",
            color: "var(--text-muted)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {score}
        </span>
      )}
    </div>
  );
};

export default RiskBadge;
