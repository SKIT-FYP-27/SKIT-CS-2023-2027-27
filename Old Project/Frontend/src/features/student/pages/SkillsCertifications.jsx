import Navbar from "../../../components/common/Navbar";
import Badge from "../../../components/common/Badge";
import Loader from "../../../components/common/Loader";
import ProgressBar from "../../../components/common/ProgressBar";
import { useAuth } from "../../../auth/AuthContext";
import useStudentProfile from "../../../hooks/useStudentProfile";
import { formatDate } from "../../../utils/formatters";

const SKILL_STATUS_TONE = {
  verified: "rise",
  "in-progress": "gold",
};

function groupByCategory(skills) {
  return skills.reduce((groups, skill) => {
    const bucket = groups.get(skill.category) ?? [];
    bucket.push(skill);
    groups.set(skill.category, bucket);
    return groups;
  }, new Map());
}

export default function SkillsCertifications() {
  const { user } = useAuth();
  const { data: student, loading, error } = useStudentProfile(user?.id);

  if (loading) {
    return (
      <div>
        <Navbar title="Skills & Certifications" />
        <Loader label="Loading skills" />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div>
        <Navbar title="Skills & Certifications" />
        <div className="px-8 py-6">
          <p className="panel p-5 text-sm text-alert">
            Could not load skills data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const grouped = groupByCategory(student.skills);

  return (
    <div>
      <Navbar
        title="Skills & Certifications"
        subtitle={`${student.skills.length} skills tracked · ${student.certifications.length} certifications`}
      />

      <div className="px-8 py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...grouped.entries()].map(([category, skills]) => (
            <div key={category} className="panel p-5">
              <p className="stat-label mb-4">{category}</p>
              <div className="space-y-3">
                {skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-ink">{skill.name}</span>
                      <Badge tone={SKILL_STATUS_TONE[skill.status] ?? "navy"}>
                        {skill.status === "verified" ? "Verified" : "In progress"}
                      </Badge>
                    </div>
                    <ProgressBar value={skill.proficiency} tone="navy" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="panel p-5">
          <p className="stat-label mb-4">Certifications</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {student.certifications.map((cert) => (
              <div key={cert.credentialId} className="border border-line rounded p-4">
                <p className="text-sm text-ink font-medium">{cert.title}</p>
                <p className="text-xs text-slate mt-1">
                  {cert.issuer} · {formatDate(cert.issuedOn)}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-slate">ID: {cert.credentialId}</span>
                  <Badge tone="navy">{cert.skillTag}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
