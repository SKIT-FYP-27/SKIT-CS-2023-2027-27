import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// data: [{ year: "2026", placementRate: 74, avgPackageLPA: 7.9 }, ...]
export default function PlacementTrendChart({ data }) {
  return (
    <div className="panel p-5">
      <p className="stat-label mb-4">Placement rate — year over year</p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="#E3DFD6" vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fill: "#6B7280", fontSize: 12 }}
            axisLine={{ stroke: "#E3DFD6" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#6B7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            formatter={(value, name) =>
              name === "placementRate" ? [`${value}%`, "Placement rate"] : [`₹${value} LPA`, "Avg. package"]
            }
            contentStyle={{ borderRadius: 4, border: "1px solid #E3DFD6", fontSize: 13 }}
          />
          <Line
            type="monotone"
            dataKey="placementRate"
            stroke="#B4872A"
            strokeWidth={2}
            dot={{ r: 3, fill: "#16233E" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
