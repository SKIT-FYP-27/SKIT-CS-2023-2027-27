import Navbar from "../../../components/common/Navbar";
import StatCard from "../../../components/common/StatCard";
import Badge from "../../../components/common/Badge";
import Loader from "../../../components/common/Loader";
import ProgressBar from "../../../components/common/ProgressBar";
import { useAuth } from "../../../auth/AuthContext";
import useStudentProfile from "../../../hooks/useStudentProfile";
import { formatDate } from "../../../utils/formatters";

const APPLICATION_STATUS_TONE = {
  offer: "rise",
  "in-progress": "gold",
  applied: "navy",
};

export default function PlacementStatus() {
  const { user } = useAuth();
  const { data: student, loading, error } = useStudentProfile(user?.id);

  if (loading) {
    return (
      <div>
        <Navbar title="Placement Status" />
        <Loader label="Loading placement data" />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div>
        <Navbar title="Placement Status" />
        <div className="px-8 py-6">
          <p className="panel p-5 text-sm text-alert">
            Could not load placement data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const { placement } = student;

  return (
    <div>
      <Navbar title="Placement Status" subtitle={student.name} />

      <div className="px-8 py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="Status" value={placement.status} />
          <StatCard
            label="Offers received"
            value={placement.offers.length}
            delta={placement.offers.length > 0 ? "Congratulations!" : undefined}
            deltaTone="rise"
          />
          <div className="panel px-5 py-4">
            <p className="stat-label">Placement readiness</p>
            <div className="flex items-end gap-2 mt-1.5 mb-3">
              <span className="font-display text-3xl text-navy">{placement.readinessScore}</span>
              <span className="text-xs mb-1 text-slate">/ 100</span>
            </div>
            <ProgressBar value={placement.readinessScore} tone="gold" />
          </div>
        </div>

        <div className="panel p-5">
          <p className="stat-label mb-4">Applications</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate border-b border-line">
                  <th className="py-2 pr-4 font-medium">Company</th>
                  <th className="py-2 pr-4 font-medium">Role</th>
                  <th className="py-2 pr-4 font-medium">Package</th>
                  <th className="py-2 pr-4 font-medium">Stage</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {placement.appliedCompanies.map((application) => (
                  <tr key={application.company} className="border-b border-line last:border-0">
                    <td className="py-2 pr-4 text-ink">{application.company}</td>
                    <td className="py-2 pr-4 text-ink">{application.role}</td>
                    <td className="py-2 pr-4 text-slate">{application.package}</td>
                    <td className="py-2 pr-4 text-slate">{application.stage}</td>
                    <td className="py-2">
                      <Badge tone={APPLICATION_STATUS_TONE[application.status] ?? "navy"}>
                        {application.status.replace("-", " ")}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {placement.offers.length > 0 && (
          <div className="panel p-5">
            <p className="stat-label mb-4">Offers</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {placement.offers.map((offer) => (
                <div key={offer.company} className="border border-line rounded p-4">
                  <p className="text-sm text-ink font-medium">{offer.company}</p>
                  <p className="text-xs text-slate mt-1">{offer.role}</p>
                  <div className="flex items-center justify-between mt-3">
                    <Badge tone="rise">{offer.package}</Badge>
                    <span className="text-xs text-slate">{formatDate(offer.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
