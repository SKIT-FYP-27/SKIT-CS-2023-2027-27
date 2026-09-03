import Navbar from "../../../components/common/Navbar";
import StatCard from "../../../components/common/StatCard";

// Sprint 5 scaffold — to be built out with department analytics,
// batch comparisons, and placement trends once HOD APIs are available.
export default function HODDashboard() {
  return (
    <div>
      <Navbar title="Department Health" subtitle="CSE Department · Batch 2023-2027" />
      <div className="px-8 py-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Total students" value="—" />
          <StatCard label="Avg. CGPA" value="—" />
          <StatCard label="Placement rate" value="—" />
          <StatCard label="At-risk students" value="—" deltaTone="alert" />
        </div>
        <div className="panel p-5 text-sm text-slate">
          Batch comparison and placement trend charts land here in Sprint 5.
        </div>
      </div>
    </div>
  );
}
