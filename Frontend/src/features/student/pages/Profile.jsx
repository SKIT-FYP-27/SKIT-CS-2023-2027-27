import { useEffect, useState } from "react";
import { Mail, Phone, Calendar, MapPin, GraduationCap, Hash } from "lucide-react";
import Navbar from "../../../components/common/Navbar";
import Loader from "../../../components/common/Loader";
import { getProfile } from "../../../api/studentApi";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  if (!profile) {
    return (
      <div>
        <Navbar title="Profile" subtitle="Your personal and academic details" />
        <Loader label="Loading profile" />
      </div>
    );
  }

  const initials = profile.name.split(" ").map((n) => n[0]).join("");

  const fields = [
    { icon: Hash, label: "Student ID", value: profile.studentId },
    { icon: Hash, label: "Roll Number", value: profile.rollNumber },
    { icon: GraduationCap, label: "Branch", value: profile.branch },
    { icon: Calendar, label: "Batch", value: profile.batch },
    { icon: Mail, label: "Email", value: profile.email },
    { icon: Phone, label: "Phone", value: profile.phone },
    { icon: Calendar, label: "Date of Birth", value: profile.dob },
    { icon: MapPin, label: "Address", value: profile.address },
  ];

  return (
    <div>
      <Navbar title="Profile" subtitle="Your personal and academic details" />

      <div className="px-6 py-5">
        <div className="panel max-w-xl overflow-hidden">
          <div className="bg-navy px-6 py-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent-light/40 flex items-center justify-center text-white text-lg font-display font-semibold">
              {initials}
            </div>
            <p className="text-white mt-3 font-display font-semibold text-lg">{profile.name}</p>
            <p className="text-white/60 text-xs mt-0.5">{profile.branch}</p>
          </div>
          <div>
            {fields.map(({ icon: Icon, label, value }, i) => (
              <div
                key={label}
                className={`flex items-center gap-3 px-5 py-3 text-sm ${
                  i !== fields.length - 1 ? "border-b border-line" : ""
                }`}
              >
                <Icon size={16} className="text-accent shrink-0" strokeWidth={1.75} />
                <span className="stat-label w-28 shrink-0">{label}</span>
                <span className="text-ink">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
