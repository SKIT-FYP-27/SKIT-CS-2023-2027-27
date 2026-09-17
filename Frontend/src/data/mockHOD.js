// Mock data shaped like the payload the department analytics endpoint
// (HOD Executive Dashboard, Sprint 5) is expected to return. Swap out
// once that endpoint is live — see src/hooks/useHODAnalytics.js.

export const departmentOverview = {
  totalStudents: 248,
  avgCGPA: 7.86,
  placementRate: 74,
  atRiskCount: 19,
  activeBatches: 4,
};

// Batch 2023-2027 has completed 6 of its 8 semesters as of this dashboard's data.
export const cgpaTrendBySemester = [
  { semester: "Sem 1", avgCGPA: 7.1 },
  { semester: "Sem 2", avgCGPA: 7.3 },
  { semester: "Sem 3", avgCGPA: 7.5 },
  { semester: "Sem 4", avgCGPA: 7.62 },
  { semester: "Sem 5", avgCGPA: 7.74 },
  { semester: "Sem 6", avgCGPA: 7.86 },
];

export const riskDistribution = [
  { level: "Low", count: 167 },
  { level: "Medium", count: 62 },
  { level: "High", count: 19 },
];

export const atRiskStudents = [
  { id: "STU2023CS014", name: "Rohit Verma", cgpa: 5.4, attendance: 61, riskLevel: "HIGH" },
  { id: "STU2023CS027", name: "Meera Iyer", cgpa: 5.9, attendance: 58, riskLevel: "HIGH" },
  { id: "STU2023CS033", name: "Aditya Rao", cgpa: 6.1, attendance: 66, riskLevel: "HIGH" },
  { id: "STU2023CS052", name: "Simran Kaur", cgpa: 6.4, attendance: 70, riskLevel: "MEDIUM" },
  { id: "STU2023CS061", name: "Karan Malhotra", cgpa: 6.6, attendance: 64, riskLevel: "MEDIUM" },
];

export const batchComparison = [
  { batch: "2021-2025", avgCGPA: 7.62, placementRate: 81, atRiskPercent: 6 },
  { batch: "2022-2026", avgCGPA: 7.74, placementRate: 78, atRiskPercent: 7 },
  { batch: "2023-2027", avgCGPA: 7.86, placementRate: 74, atRiskPercent: 8 },
  { batch: "2024-2028", avgCGPA: 7.55, placementRate: 0, atRiskPercent: 11 },
];

export const placementTrend = [
  { year: "2022", placementRate: 76, avgPackageLPA: 5.8 },
  { year: "2023", placementRate: 79, avgPackageLPA: 6.4 },
  { year: "2024", placementRate: 81, avgPackageLPA: 7.1 },
  { year: "2025", placementRate: 78, avgPackageLPA: 7.6 },
  { year: "2026", placementRate: 74, avgPackageLPA: 7.9 },
];

export const topRecruiters = [
  { company: "Nimbus Softworks", offers: 14 },
  { company: "Vertex Analytics", offers: 11 },
  { company: "Clarity Systems", offers: 9 },
  { company: "Orbit Cloud", offers: 7 },
  { company: "BluePeak Tech", offers: 6 },
];
