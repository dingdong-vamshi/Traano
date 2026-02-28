import { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar, Legend,
} from "recharts";

/**
 * Charts — Three responsive visualizations
 *
 * 1. Transaction Trend (LineChart) — daily volume over time
 * 2. Category Distribution (PieChart) — volume breakdown
 * 3. Risk Distribution (BarChart) — Normal / Medium / High counts
 */

const PIE_COLORS = ["#6366f1", "#8b5cf6", "#06d6a0", "#f59e0b", "#ef4444", "#ec4899", "#14b8a6", "#f97316"];
const RISK_COLORS = { Normal: "#34d399", Medium: "#fbbf24", High: "#f87171" };

// Dark tooltip styling
const tooltipStyle = {
  backgroundColor: "#1e293b",
  border: "1px solid #334155",
  borderRadius: "8px",
  fontSize: "12px",
  color: "#f1f5f9",
};

const Charts = ({ transactions }) => {
  // --- 1. Transaction Trend Data (all types) ---
  const spendingTrend = useMemo(() => {
    const dailyMap = {};
    for (const tx of transactions) {
      const day = new Date(tx.date).toISOString().split("T")[0];
      dailyMap[day] = (dailyMap[day] || 0) + Math.abs(tx.amount);
    }
    return Object.entries(dailyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
        amount: Math.round(amount),
      }));
  }, [transactions]);

  // --- 2. Category Distribution Data (all types) ---
  const categoryData = useMemo(() => {
    const catMap = {};
    for (const tx of transactions) {
      const cat = tx.category || "Uncategorized";
      catMap[cat] = (catMap[cat] || 0) + Math.abs(tx.amount);
    }
    return Object.entries(catMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value: Math.round(value) }));
  }, [transactions]);

  // --- 3. Risk Distribution Data ---
  const riskData = useMemo(() => {
    const counts = { Normal: 0, Medium: 0, High: 0 };
    for (const tx of transactions) {
      counts[tx.riskLevel] = (counts[tx.riskLevel] || 0) + 1;
    }
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      fill: RISK_COLORS[name],
    }));
  }, [transactions]);

  const cardStyle = {
    background: "var(--surface-card)",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    padding: "20px",
  };

  const titleStyle = {
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text-secondary)",
    marginBottom: "16px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  if (transactions.length === 0) return null;

  // Custom tooltip formatter for currency
  const formatINR = (v) =>
    "₹" + v.toLocaleString("en-IN");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "14px",
        marginBottom: "28px",
      }}
      className="animate-fade-in"
    >
      {/* Spending Trend — full width */}
      <div style={{ ...cardStyle, gridColumn: "1 / -1" }}>
        <p style={titleStyle}>📈 Transaction Trend</p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={spendingTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "var(--text-muted)" }}
              axisLine={{ stroke: "var(--border)" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--text-muted)" }}
              axisLine={{ stroke: "var(--border)" }}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v) => [formatINR(v), "Volume"]}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={{ fill: "var(--primary)", r: 3 }}
              activeDot={{ r: 5, fill: "var(--primary-light)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category Distribution */}
      <div style={cardStyle}>
        <p style={titleStyle}>🏷️ Category Breakdown</p>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              stroke="none"
            >
              {categoryData.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v) => [formatINR(v), "Volume"]}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", color: "var(--text-muted)" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Distribution */}
      <div style={cardStyle}>
        <p style={titleStyle}>🛡️ Risk Distribution</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={riskData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "var(--text-muted)" }}
              axisLine={{ stroke: "var(--border)" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--text-muted)" }}
              axisLine={{ stroke: "var(--border)" }}
              allowDecimals={false}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
              {riskData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
