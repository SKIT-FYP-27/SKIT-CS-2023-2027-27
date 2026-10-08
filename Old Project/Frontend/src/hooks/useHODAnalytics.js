import { useEffect, useState } from "react";
import apiClient from "../api/client";
import {
  atRiskStudents,
  batchComparison,
  cgpaTrendBySemester,
  departmentOverview,
  placementTrend,
  riskDistribution,
  topRecruiters,
} from "../data/mockHOD";

// Set VITE_USE_MOCKS=false once the department analytics endpoint is live.
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";

const MOCK_PAYLOAD = {
  overview: departmentOverview,
  cgpaTrend: cgpaTrendBySemester,
  riskDistribution,
  atRiskStudents,
  batchComparison,
  placementTrend,
  topRecruiters,
};

export default function useHODAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (USE_MOCKS) {
          await new Promise((resolve) => setTimeout(resolve, 250));
          if (!cancelled) setData(MOCK_PAYLOAD);
        } else {
          const response = await apiClient.get("/analytics/department");
          if (!cancelled) setData(response.data);
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
