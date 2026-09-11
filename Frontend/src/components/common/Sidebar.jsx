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

export default function Sidebar({ open = false, onClose }) {
  const { user } = useAuth();
  const links = NAV_BY_ROLE[user?.role] ?? [];

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-20 bg-ink/40 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 shrink-0 bg-navy text-white/90 min-h-screen flex flex-col
          transform transition-transform duration-200 ease-out
          md:static md:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="px-6 py-7 border-b border-white/10 flex items-start justify-between">
          <div>
            <p className="font-display text-lg leading-tight text-white">
              Unified Education
              <br />
              Interface
            </p>
            <p className="text-xs text-white/50 mt-1">CSE Department</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="md:hidden text-white/60 hover:text-white text-lg leading-none"
          >
            ×
          </button>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-0.5">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onClose}
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
    </>
  );
}
