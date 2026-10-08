import Navbar from "../../../components/common/Navbar";
import StatCard from "../../../components/common/StatCard";
import Badge from "../../../components/common/Badge";
import Loader from "../../../components/common/Loader";
import CGPATrendChart from "../../../components/charts/CGPATrendChart";
import RiskDistributionChart from "../../../components/charts/RiskDistributionChart";
import useHODAnalytics from "../../../hooks/useHODAnalytics";
import { RISK_LEVELS } from "../../../utils/constants";

export default function HODDashboard() {
  const { data, loading, error } = useHODAnalytics();

  if (loading) {
    return (
      <div>
        <Navbar title="Department Health" subtitle="CSE Department" />
        <Loader label="Loading department analytics" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <Navbar title="Department Health" subtitle="CSE Department" />
        <div className="px-8 py-6">
          <p className="panel p-5 text-sm text-alert">
            Could not load department analytics. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const { overview, cgpaTrend, riskDistribution, atRiskStudents } = data;
  const cgpaChartData = cgpaTrend.map((row) => ({ semester: row.semester, cgpa: row.avgCGPA }));

  return (
    <div>
      <Navbar title="Department Health" subtitle="CSE Department · Batch 2023-2027" />
      <div className="px-8 py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total students" value={overview.totalStudents} />
          <StatCard label="Avg. CGPA" value={overview.avgCGPA.toFixed(2)} />
          <StatCard
            label="Placement rate"
            value={`${overview.placementRate}%`}
            delta="Across all batches"
            deltaTone="rise"
          />
          <StatCard
            label="At-risk students"
            value={overview.atRiskCount}
            delta="Needs faculty attention"
            deltaTone="alert"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CGPATrendChart data={cgpaChartData} />
          <RiskDistributionChart data={riskDistribution} />
        </div>

        <div className="panel p-5">
          <p className="stat-label mb-4">Students requiring attention</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate border-b border-line">
                  <th className="py-2 pr-4 font-medium">Student ID</th>
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">CGPA</th>
                  <th className="py-2 pr-4 font-medium">Attendance</th>
                  <th className="py-2 font-medium">Risk level</th>
                </tr>
              </thead>
              <tbody>
                {atRiskStudents.map((student) => {
                  const risk = RISK_LEVELS[student.riskLevel];
                  return (
                    <tr key={student.id} className="border-b border-line last:border-0">
                      <td className="py-2 pr-4 text-ink">{student.id}</td>
                      <td className="py-2 pr-4 text-ink">{student.name}</td>
                      <td className="py-2 pr-4 text-slate">{student.cgpa.toFixed(1)}</td>
                      <td className="py-2 pr-4 text-slate">{student.attendance}%</td>
                      <td className="py-2">
                        <Badge tone={risk?.tone ?? "navy"}>{risk?.label ?? student.riskLevel}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
