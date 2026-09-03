import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { ROLES } from "../../utils/constants";

const NAV_BY_ROLE = {
  [ROLES.STUDENT]: [
    { to: "/student", label: "Overview", end: true },
    { to: "/student/profile", label: "Digital Twin" },
    { to: "/student/skills", label: "Skills & Certifications" },
    { to: "/student/placement", label: "Placement Status" },
  ],
  [ROLES.FACULTY]: [
    { to: "/faculty", label: "Overview", end: true },
    { to: "/faculty/students", label: "Assigned Students" },
    { to: "/faculty/radar", label: "Weak Student Radar" },
  ],
  [ROLES.HOD]: [
    { to: "/hod", label: "Department Health", end: true },
    { to: "/hod/batches", label: "Batch Comparison" },
    { to: "/hod/placement", label: "Placement Statistics" },
  ],
  [ROLES.ADMIN]: [
    { to: "/admin", label: "Users", end: true },
    { to: "/admin/roles", label: "Role Management" },
  ],
};

export default function Sidebar() {
  const { user } = useAuth();
  const links = NAV_BY_ROLE[user?.role] ?? [];

  return (
    <aside className="w-64 shrink-0 bg-navy text-white/90 min-h-screen flex flex-col">
      <div className="px-6 py-7 border-b border-white/10">
        <p className="font-display text-lg leading-tight text-white">
          Unified Education
          <br />
          Interface
        </p>
        <p className="text-xs text-white/50 mt-1">CSE Department</p>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-0.5">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `block px-3 py-2 text-sm rounded transition-colors ${
                isActive
                  ? "bg-white/10 text-white border-l-2 border-gold pl-[10px]"
                  : "text-white/65 hover:text-white hover:bg-white/5"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-5 border-t border-white/10">
        <p className="text-sm text-white">{user?.name}</p>
        <p className="text-xs text-white/50 capitalize">{user?.role}</p>
      </div>
    </aside>
  );
}
