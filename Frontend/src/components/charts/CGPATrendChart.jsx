import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// data: [{ semester: "Sem 1", cgpa: 7.8 }, ...]
export default function CGPATrendChart({ data }) {
  return (
    <div className="panel p-5">
      <p className="stat-label mb-4">CGPA trend across semesters</p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="#E3DFD6" vertical={false} />
          <XAxis
            dataKey="semester"
            tick={{ fill: "#6B7280", fontSize: 12 }}
            axisLine={{ stroke: "#E3DFD6" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 10]}
            tick={{ fill: "#6B7280", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 4,
              border: "1px solid #E3DFD6",
              fontSize: 13,
            }}
          />
          <Line
            type="monotone"
            dataKey="cgpa"
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
