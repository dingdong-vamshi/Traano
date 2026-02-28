/**
 * Filters — Risk level, date range, category filtering
 *
 * Updates parent state via onChange callback.
 * Filters are applied client-side for responsiveness.
 */
const Filters = ({ filters, onChange, categories }) => {
  const riskLevels = ["All", "Normal", "Medium", "High"];

  const selectStyle = {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "var(--surface-card)",
    color: "var(--text-primary)",
    fontSize: "13px",
    fontFamily: "inherit",
    outline: "none",
    cursor: "pointer",
    transition: "border-color 0.2s",
    minWidth: "130px",
  };

  const inputStyle = {
    ...selectStyle,
    colorScheme: "dark",
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        alignItems: "center",
        marginBottom: "20px",
        padding: "14px 18px",
        borderRadius: "12px",
        background: "var(--surface-card)",
        border: "1px solid var(--border)",
      }}
      className="animate-fade-in"
    >
      {/* Label */}
      <span
        style={{
          fontSize: "12px",
          fontWeight: 600,
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.8px",
          marginRight: "4px",
        }}
      >
        Filters
      </span>

      {/* Risk Level */}
      <select
        value={filters.riskLevel}
        onChange={(e) => onChange({ ...filters, riskLevel: e.target.value })}
        style={selectStyle}
        id="filter-risk"
        onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
      >
        {riskLevels.map((level) => (
          <option key={level} value={level}>
            {level === "All" ? "All Risks" : level + " Risk"}
          </option>
        ))}
      </select>

      {/* Category */}
      <select
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        style={selectStyle}
        id="filter-category"
        onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
      >
        <option value="All">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Date From */}
      <input
        type="date"
        value={filters.dateFrom}
        onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
        style={inputStyle}
        id="filter-date-from"
        placeholder="From"
        onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
      />

      {/* Date To */}
      <input
        type="date"
        value={filters.dateTo}
        onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
        style={inputStyle}
        id="filter-date-to"
        placeholder="To"
        onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
      />

      {/* Clear */}
      {(filters.riskLevel !== "All" ||
        filters.category !== "All" ||
        filters.dateFrom ||
        filters.dateTo) && (
        <button
          onClick={() =>
            onChange({
              riskLevel: "All",
              category: "All",
              dateFrom: "",
              dateTo: "",
            })
          }
          style={{
            padding: "8px 14px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--text-muted)",
            fontSize: "12px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            e.target.style.color = "var(--danger-light)";
            e.target.style.borderColor = "var(--danger)";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "var(--text-muted)";
            e.target.style.borderColor = "var(--border)";
          }}
          id="filter-clear"
        >
          ✕ Clear
        </button>
      )}
    </div>
  );
};

export default Filters;
