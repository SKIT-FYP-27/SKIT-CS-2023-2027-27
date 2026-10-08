import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// data: [{ batch: "2023-2027", placementRate: 74, avgCGPA: 7.86, atRiskPercent: 8 }, ...]
export default function BatchComparisonChart({ data }) {
  return (
    <div className="panel p-5">
      <p className="stat-label mb-4">Placement rate by batch</p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="#E3DFD6" vertical={false} />
          <XAxis
            dataKey="batch"
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
            formatter={(value) => [`${value}%`, "Placement rate"]}
            contentStyle={{ borderRadius: 4, border: "1px solid #E3DFD6", fontSize: 13 }}
          />
          <Bar dataKey="placementRate" fill="#16233E" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
