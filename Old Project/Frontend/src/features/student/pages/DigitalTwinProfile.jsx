import Navbar from "../../../components/common/Navbar";
import Badge from "../../../components/common/Badge";
import Loader from "../../../components/common/Loader";
import ProgressBar from "../../../components/common/ProgressBar";
import DigitalTwinTimeline from "../components/DigitalTwinTimeline";
import { useAuth } from "../../../auth/AuthContext";
import useStudentProfile from "../../../hooks/useStudentProfile";
import { formatCGPA, formatDate } from "../../../utils/formatters";

const SKILL_STATUS_TONE = {
  verified: "rise",
  "in-progress": "gold",
};

export default function DigitalTwinProfile() {
  const { user } = useAuth();
  const { data: student, loading, error } = useStudentProfile(user?.id);

  if (loading) {
    return (
      <div>
        <Navbar title="Digital Twin" subtitle="Unified academic profile" />
        <Loader label="Loading profile" />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div>
        <Navbar title="Digital Twin" subtitle="Unified academic profile" />
        <div className="px-8 py-6">
          <p className="panel p-5 text-sm text-alert">
            Could not load profile data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const topSkills = [...student.skills].sort((a, b) => b.proficiency - a.proficiency).slice(0, 5);

  return (
    <div>
      <Navbar
        title={student.name}
        subtitle={`${student.id} · Batch ${student.batch} · Section ${student.section} · ${student.currentSemester}`}
      />

      <div className="px-8 py-6 space-y-6">
        <DigitalTwinTimeline stages={student.lifecycle} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 panel p-5">
            <p className="stat-label mb-4">Academic history</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate border-b border-line">
                    <th className="py-2 pr-4 font-medium">Semester</th>
                    <th className="py-2 pr-4 font-medium">SGPA</th>
                    <th className="py-2 pr-4 font-medium">CGPA</th>
                    <th className="py-2 pr-4 font-medium">Credits</th>
                    <th className="py-2 font-medium">Backlogs</th>
                  </tr>
                </thead>
                <tbody>
                  {student.academicHistory.map((row) => (
                    <tr key={row.semester} className="border-b border-line last:border-0">
                      <td className="py-2 pr-4 text-ink">{row.semester}</td>
                      <td className="py-2 pr-4 text-ink">{formatCGPA(row.sgpa)}</td>
                      <td className="py-2 pr-4 text-ink">{formatCGPA(row.cgpa)}</td>
                      <td className="py-2 pr-4 text-slate">{row.credits}</td>
                      <td className="py-2">
                        {row.backlogs > 0 ? (
                          <Badge tone="alert">{row.backlogs}</Badge>
                        ) : (
                          <Badge tone="rise">0</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel p-5">
            <p className="stat-label mb-4">Top skills</p>
            <div className="space-y-3">
              {topSkills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-ink">{skill.name}</span>
                    <Badge tone={SKILL_STATUS_TONE[skill.status] ?? "navy"}>
                      {skill.proficiency}%
                    </Badge>
                  </div>
                  <ProgressBar value={skill.proficiency} tone="navy" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="panel p-5">
            <p className="stat-label mb-4">Projects</p>
            <div className="space-y-4">
              {student.projects.map((project) => (
                <div key={project.title}>
                  <p className="text-sm text-ink font-medium">{project.title}</p>
                  <p className="text-sm text-slate mt-1">{project.summary}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {project.techStack.map((tech) => (
                      <Badge key={tech} tone="navy">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-5">
            <p className="stat-label mb-4">Internships</p>
            <div className="space-y-4">
              {student.internships.map((internship) => (
                <div key={internship.company}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-ink font-medium">
                      {internship.role} · {internship.company}
                    </p>
                    <Badge tone={internship.status === "completed" ? "rise" : "gold"}>
                      {internship.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate mt-1">{internship.duration}</p>
                  <p className="text-sm text-slate mt-1">{internship.summary}</p>
                </div>
              ))}
              {student.internships.length === 0 && (
                <p className="text-sm text-slate">No internships recorded yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="panel p-5">
          <p className="stat-label mb-4">Certifications</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {student.certifications.map((cert) => (
              <div key={cert.credentialId} className="border border-line rounded p-3">
                <p className="text-sm text-ink font-medium">{cert.title}</p>
                <p className="text-xs text-slate mt-1">
                  {cert.issuer} · {formatDate(cert.issuedOn)}
                </p>
                <p className="text-xs text-slate mt-1">ID: {cert.credentialId}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
