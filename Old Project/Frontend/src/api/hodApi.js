// Mock data layer for the HOD module.
// Swap the body of this function with a real axiosClient.get(...)
// once the department-analytics endpoint is live.

const MOCK_DELAY = 300;

const delay = (data) =>
  new Promise((resolve) => setTimeout(() => resolve(data), MOCK_DELAY));

export function getDepartmentAnalytics() {
  return delay({
    academicYear: "AY 2025-26",
    totalStudents: 320,
    avgCGPA: 8.12,
    avgCGPADelta: "+0.21 vs last sem",
    placementRate: 78,
    placementRateDelta: "+6% vs last year",
    atRiskStudents: 24,
    cgpaDistribution: [
      { range: "< 6", students: 8 },
      { range: "6 - 7", students: 34 },
      { range: "7 - 8", students: 96 },
      { range: "8 - 9", students: 142 },
      { range: "9 - 10", students: 40 },
    ],
    placementBreakdown: [
      { label: "Placed", value: 78, tone: "rise" },
      { label: "Not placed", value: 18, tone: "alert" },
      { label: "In process", value: 4, tone: "warn" },
    ],
  });
}
