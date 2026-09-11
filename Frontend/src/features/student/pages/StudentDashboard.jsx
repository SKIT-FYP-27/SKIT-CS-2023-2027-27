import Navbar from "../../../components/common/Navbar";
import StatCard from "../../../components/common/StatCard";
import Badge from "../../../components/common/Badge";
import Loader from "../../../components/common/Loader";
import CGPATrendChart from "../../../components/charts/CGPATrendChart";
import DigitalTwinTimeline from "../components/DigitalTwinTimeline";
import { useAuth } from "../../../auth/AuthContext";
import useStudentProfile from "../../../hooks/useStudentProfile";
import { formatCGPA, formatPercent } from "../../../utils/formatters";

const SKILL_STATUS_TONE = {
  verified: "navy",
  "in-progress": "gold",
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data: student, loading, error } = useStudentProfile(user?.id);

  if (loading) {
    return (
      <div>
        <Navbar title={`Welcome back, ${user?.name?.split(" ")[0] ?? "Student"}`} />
        <Loader label="Loading dashboard" />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div>
        <Navbar title={`Welcome back, ${user?.name?.split(" ")[0] ?? "Student"}`} />
        <div className="px-8 py-6">
          <p className="panel p-5 text-sm text-alert">
            Could not load your dashboard. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const history = student.academicHistory;
  const latest = history[history.length - 1];
  const previous = history[history.length - 2];
  const cgpaDelta = previous ? latest.cgpa - previous.cgpa : 0;
  const totalBacklogs = history.reduce((sum, row) => sum + row.backlogs, 0);
  const chartData = history.map((row) => ({ semester: row.semester.replace("Semester", "Sem"), cgpa: row.cgpa }));
  const topSkills = [...student.skills].sort((a, b) => b.proficiency - a.proficiency).slice(0, 4);

  return (
    <div>
      <Navbar
        title={`Welcome back, ${student.name.split(" ")[0]}`}
        subtitle={`${student.id} · Batch ${student.batch}`}
      />

      <div className="px-8 py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Current CGPA"
            value={formatCGPA(latest.cgpa)}
            delta={previous ? `${cgpaDelta >= 0 ? "+" : ""}${cgpaDelta.toFixed(2)} vs last sem` : undefined}
            deltaTone={cgpaDelta >= 0 ? "rise" : "alert"}
          />
          <StatCard
            label="Attendance"
            value={formatPercent(student.attendance)}
            delta={student.attendance >= 75 ? "Above threshold" : "Below threshold"}
            deltaTone={student.attendance >= 75 ? "rise" : "alert"}
          />
          <StatCard label="Backlogs" value={totalBacklogs} />
          <StatCard
            label="Readiness score"
            value={student.placement.readinessScore}
            delta="Skill dev. suggested"
            deltaTone="gold"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CGPATrendChart data={chartData} />
          </div>
          <div className="panel p-5">
            <p className="stat-label mb-4">Skills snapshot</p>
            <div className="flex flex-wrap gap-2">
              {topSkills.map((skill) => (
                <Badge key={skill.name} tone={SKILL_STATUS_TONE[skill.status] ?? "navy"}>
                  {skill.name}
                  {skill.status === "in-progress" ? " — in progress" : ""}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DigitalTwinTimeline stages={student.lifecycle} />
      </div>
    </div>
  );
}
