// Mock data shaped like the payload Harsh's /students/:id endpoint is
// expected to return (see Form-2 Sprint 1 API contracts). Swap out once
// that endpoint is live — see src/hooks/useStudentProfile.js.

export const studentProfile = {
  id: "STU2023CS041",
  name: "Janvi Gupta",
  batch: "2023-2027",
  section: "B",
  currentSemester: "Semester 7",
  attendance: 86,

  // Batch 2023-2027 is a 4-year, 8-semester program. Sem 1-6 are complete;
  // the student is currently in Sem 7 (as of Sep 2026).
  academicHistory: [
    { semester: "Semester 1", sgpa: 7.6, cgpa: 7.6, credits: 24, backlogs: 0 },
    { semester: "Semester 2", sgpa: 8.2, cgpa: 7.9, credits: 24, backlogs: 0 },
    { semester: "Semester 3", sgpa: 8.3, cgpa: 8.1, credits: 26, backlogs: 0 },
    { semester: "Semester 4", sgpa: 9.0, cgpa: 8.4, credits: 26, backlogs: 0 },
    { semester: "Semester 5", sgpa: 8.6, cgpa: 8.5, credits: 24, backlogs: 0 },
    { semester: "Semester 6", sgpa: 8.9, cgpa: 8.6, credits: 24, backlogs: 0 },
  ],

  skills: [
    { name: "React.js", category: "Frontend", proficiency: 85, status: "verified" },
    { name: "Tailwind CSS", category: "Frontend", proficiency: 80, status: "verified" },
    { name: "JavaScript (ES6+)", category: "Frontend", proficiency: 82, status: "verified" },
    { name: "Node.js", category: "Backend", proficiency: 55, status: "in-progress" },
    { name: "PostgreSQL", category: "Database", proficiency: 60, status: "in-progress" },
    { name: "Python", category: "Programming", proficiency: 70, status: "verified" },
    { name: "SQL", category: "Database", proficiency: 45, status: "in-progress" },
    { name: "Git & GitHub", category: "Tools", proficiency: 78, status: "verified" },
  ],

  certifications: [
    {
      title: "React - The Complete Guide",
      issuer: "Udemy",
      issuedOn: "2025-11-02",
      credentialId: "UC-8841-JG",
      skillTag: "React.js",
    },
    {
      title: "Responsive Web Design",
      issuer: "freeCodeCamp",
      issuedOn: "2025-06-18",
      credentialId: "FCC-RWD-2211",
      skillTag: "Tailwind CSS",
    },
    {
      title: "Database Design & PostgreSQL",
      issuer: "Coursera",
      issuedOn: "2026-02-10",
      credentialId: "COURSERA-PG-5523",
      skillTag: "PostgreSQL",
    },
  ],

  internships: [
    {
      company: "Nimbus Softworks",
      role: "Frontend Intern",
      duration: "Jun 2026 – Jul 2026 (8 weeks)",
      status: "completed",
      summary:
        "Built 3 responsive dashboard views in React + Tailwind for an internal analytics tool.",
    },
  ],

  projects: [
    {
      title: "Unified Education Interface",
      techStack: ["React.js", "Tailwind CSS", "Recharts"],
      summary:
        "Lead frontend engineer for the CSE department's unified student/faculty analytics platform.",
    },
  ],

  placement: {
    status: "In Progress",
    readinessScore: 72,
    appliedCompanies: [
      {
        company: "Nimbus Softworks",
        role: "SDE Intern",
        package: "6 LPA (stipend equiv.)",
        stage: "Offer extended",
        status: "offer",
      },
      {
        company: "Vertex Analytics",
        role: "Frontend Developer",
        package: "7.2 LPA",
        stage: "Technical interview",
        status: "in-progress",
      },
      {
        company: "Clarity Systems",
        role: "Software Engineer",
        package: "8 LPA",
        stage: "Applied",
        status: "applied",
      },
    ],
    offers: [
      { company: "Nimbus Softworks", package: "6 LPA", role: "SDE Intern", date: "2026-08-20" },
    ],
  },

  lifecycle: [
    { label: "Admission", status: "complete" },
    { label: "Sem 1", status: "complete" },
    { label: "Sem 2", status: "complete" },
    { label: "Sem 3", status: "complete" },
    { label: "Sem 4", status: "complete" },
    { label: "Sem 5", status: "complete" },
    { label: "Sem 6", status: "complete" },
    { label: "Sem 7", status: "current" },
    { label: "Sem 8", status: "upcoming" },
    { label: "Projects", status: "upcoming" },
    { label: "Skills", status: "upcoming" },
    { label: "Internships", status: "upcoming" },
    { label: "Placement", status: "upcoming" },
  ],
};
