import Navbar from "../../../components/common/Navbar";
import StatCard from "../../../components/common/StatCard";
import Loader from "../../../components/common/Loader";
import PlacementTrendChart from "../../../components/charts/PlacementTrendChart";
import useHODAnalytics from "../../../hooks/useHODAnalytics";

export default function PlacementStatistics() {
  const { data, loading, error } = useHODAnalytics();

  if (loading) {
    return (
      <div>
        <Navbar title="Placement Statistics" subtitle="CSE Department" />
        <Loader label="Loading placement statistics" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <Navbar title="Placement Statistics" subtitle="CSE Department" />
        <div className="px-8 py-6">
          <p className="panel p-5 text-sm text-alert">
            Could not load placement statistics. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const { placementTrend, topRecruiters, overview } = data;
  const latest = placementTrend[placementTrend.length - 1];
  const maxOffers = Math.max(...topRecruiters.map((r) => r.offers));

  return (
    <div>
      <Navbar title="Placement Statistics" subtitle="CSE Department" />
      <div className="px-8 py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="Current placement rate" value={`${overview.placementRate}%`} />
          <StatCard label="Avg. package (latest year)" value={`₹${latest.avgPackageLPA} LPA`} />
          <StatCard
            label="Total offers (top recruiters)"
            value={topRecruiters.reduce((sum, r) => sum + r.offers, 0)}
          />
        </div>

        <PlacementTrendChart data={placementTrend} />

        <div className="panel p-5">
          <p className="stat-label mb-4">Top recruiters</p>
          <div className="space-y-3">
            {topRecruiters.map((recruiter) => (
              <div key={recruiter.company} className="flex items-center gap-3">
                <span className="text-sm text-ink w-40 shrink-0 truncate">{recruiter.company}</span>
                <div className="flex-1 h-2.5 bg-line rounded overflow-hidden">
                  <div
                    className="h-full bg-gold rounded"
                    style={{ width: `${(recruiter.offers / maxOffers) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-slate w-16 text-right">{recruiter.offers} offers</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
