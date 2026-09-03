import Navbar from "../../../components/common/Navbar";
import StatCard from "../../../components/common/StatCard";
import Badge from "../../../components/common/Badge";
import CGPATrendChart from "../../../components/charts/CGPATrendChart";
import DigitalTwinTimeline from "../components/DigitalTwinTimeline";
import { useAuth } from "../../../auth/AuthContext";

// Placeholder data — replace with useStudentProfile() once
// Harsh's student APIs (Sprint 1) are live.
const CGPA_DATA = [
  { semester: "Sem 1", cgpa: 7.6 },
  { semester: "Sem 2", cgpa: 7.9 },
  { semester: "Sem 3", cgpa: 8.1 },
  { semester: "Sem 4", cgpa: 8.4 },
];

const LIFECYCLE = [
  { label: "Admission", status: "complete" },
  { label: "Sem 1", status: "complete" },
  { label: "Sem 2", status: "complete" },
  { label: "Sem 3", status: "complete" },
  { label: "Sem 4", status: "current" },
  { label: "Projects", status: "upcoming" },
  { label: "Skills", status: "upcoming" },
  { label: "Internships", status: "upcoming" },
  { label: "Placement", status: "upcoming" },
];

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <Navbar
        title={`Welcome back, ${user?.name?.split(" ")[0] ?? "Student"}`}
        subtitle={`${user?.id ?? ""} · Batch ${user?.batch ?? ""}`}
      />

      <div className="px-8 py-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Current CGPA" value="8.40" delta="+0.3 vs last sem" deltaTone="rise" />
          <StatCard label="Attendance" value="86%" delta="Above threshold" deltaTone="rise" />
          <StatCard label="Backlogs" value="0" />
          <StatCard label="Readiness score" value="72" delta="Skill dev. suggested" deltaTone="gold" />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <CGPATrendChart data={CGPA_DATA} />
          </div>
          <div className="panel p-5">
            <p className="stat-label mb-4">Skills snapshot</p>
            <div className="flex flex-wrap gap-2">
              <Badge tone="navy">React.js</Badge>
              <Badge tone="navy">PostgreSQL</Badge>
              <Badge tone="navy">Python</Badge>
              <Badge tone="gold">SQL — in progress</Badge>
            </div>
          </div>
        </div>

        <DigitalTwinTimeline stages={LIFECYCLE} />
      </div>
    </div>
  );
}
