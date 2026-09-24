import { useEffect, useState } from "react";
import Navbar from "../../../components/common/Navbar";
import Loader from "../../../components/common/Loader";
import DigitalTwinTimeline from "../components/DigitalTwinTimeline";
import { getAcademicHistory, getLifecycleStages } from "../../../api/studentApi";
import { formatPercent } from "../../../utils/formatters";

export default function Academics() {
  const [academic, setAcademic] = useState(null);
  const [stages, setStages] = useState(null);

  useEffect(() => {
    getAcademicHistory().then(setAcademic);
    getLifecycleStages().then(setStages);
  }, []);

  if (!academic || !stages) {
    return (
      <div>
        <Navbar title="Academics" subtitle="Your academic and lifecycle profile" />
        <Loader label="Loading profile" />
      </div>
    );
  }

  return (
    <div>
      <Navbar title="Academics" subtitle="Your academic and lifecycle profile" />

      <div className="px-6 py-5 space-y-4">
        <DigitalTwinTimeline stages={stages} />

        <div className="panel p-4">
          <p className="stat-label mb-4">Semester-wise subjects</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate border-b border-line">
                <th className="pb-2 font-normal">Code</th>
                <th className="pb-2 font-normal">Subject</th>
                <th className="pb-2 font-normal">Grade</th>
                <th className="pb-2 font-normal">Credits</th>
              </tr>
            </thead>
            <tbody>
              {academic.subjects.map((subject) => (
                <tr key={subject.code} className="border-b border-line last:border-0">
                  <td className="py-2 text-slate">{subject.code}</td>
                  <td className="py-2">{subject.name}</td>
                  <td className="py-2 font-medium text-navy">{subject.grade}</td>
                  <td className="py-2 text-slate">{subject.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="panel px-5 py-4">
            <p className="stat-label">Attendance</p>
            <p className="font-display font-semibold text-2xl text-navy mt-1">
              {formatPercent(academic.attendance)}
            </p>
          </div>
          <div className="panel px-5 py-4">
            <p className="stat-label">Backlogs</p>
            <p className="font-display font-semibold text-2xl text-navy mt-1">{academic.backlogs}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
