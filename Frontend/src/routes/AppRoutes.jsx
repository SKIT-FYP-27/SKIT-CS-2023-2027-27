import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import StudentDashboard from "../features/student/pages/StudentDashboard";
import HODDashboard from "../features/hod/pages/HODDashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Navigate to="/student" replace />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/hod" element={<HODDashboard />} />
        {/* Faculty and Admin routes to be added as those pages are built */}
      </Route>
    </Routes>
  );
}
