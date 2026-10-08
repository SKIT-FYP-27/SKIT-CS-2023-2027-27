import Navbar from "../../../components/common/Navbar";
import Loader from "../../../components/common/Loader";
import BatchComparisonChart from "../../../components/charts/BatchComparisonChart";
import useHODAnalytics from "../../../hooks/useHODAnalytics";

export default function BatchComparison() {
  const { data, loading, error } = useHODAnalytics();

  if (loading) {
    return (
      <div>
        <Navbar title="Batch Comparison" subtitle="CSE Department" />
        <Loader label="Loading batch data" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <Navbar title="Batch Comparison" subtitle="CSE Department" />
        <div className="px-8 py-6">
          <p className="panel p-5 text-sm text-alert">
            Could not load batch comparison data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const { batchComparison } = data;

  return (
    <div>
      <Navbar title="Batch Comparison" subtitle="CSE Department · across all active batches" />
      <div className="px-8 py-6 space-y-6">
        <BatchComparisonChart data={batchComparison} />

        <div className="panel p-5">
          <p className="stat-label mb-4">Batch-wise breakdown</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate border-b border-line">
                  <th className="py-2 pr-4 font-medium">Batch</th>
                  <th className="py-2 pr-4 font-medium">Avg. CGPA</th>
                  <th className="py-2 pr-4 font-medium">Placement rate</th>
                  <th className="py-2 font-medium">At-risk %</th>
                </tr>
              </thead>
              <tbody>
                {batchComparison.map((row) => (
                  <tr key={row.batch} className="border-b border-line last:border-0">
                    <td className="py-2 pr-4 text-ink">{row.batch}</td>
                    <td className="py-2 pr-4 text-slate">{row.avgCGPA.toFixed(2)}</td>
                    <td className="py-2 pr-4 text-slate">
                      {row.placementRate > 0 ? `${row.placementRate}%` : "Not yet eligible"}
                    </td>
                    <td className="py-2 text-slate">{row.atRiskPercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
