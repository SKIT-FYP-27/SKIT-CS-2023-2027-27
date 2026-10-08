import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const TONE_BY_LEVEL = {
  Low: "#3F7A5C",
  Medium: "#B4872A",
  High: "#A6423A",
};

// data: [{ level: "Low", count: 167 }, ...]
export default function RiskDistributionChart({ data }) {
  return (
    <div className="panel p-5">
      <p className="stat-label mb-4">Student risk distribution</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="#E3DFD6" vertical={false} />
          <XAxis
            dataKey="level"
            tick={{ fill: "#6B7280", fontSize: 12 }}
            axisLine={{ stroke: "#E3DFD6" }}
            tickLine={false}
          />
          <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: 4, border: "1px solid #E3DFD6", fontSize: 13 }}
          />
          <Bar dataKey="count" radius={[3, 3, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.level} fill={TONE_BY_LEVEL[entry.level] ?? "#16233E"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
