import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  User,
  BookOpen,
  Fingerprint,
  Calendar,
  CreditCard,
  ChevronRight,
  Github,
  Linkedin,
  Trophy,
  Users,
  Link as LinkIcon,
  Hash,
  Search,
} from "lucide-react";

/* ================= API ================= */

const fetchTeamMembersMetaData = async (
  identificationNumber: string
) => {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/student/${identificationNumber}`,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }
  );
  return response.data;
};

/* ================= COMPONENT ================= */

export const EventRegistrationForm: React.FC<{
  onClose: () => void;
  eventTitle?: string;
  teamSize?: number;
  eventId: number;
}> = ({ onClose, teamSize = 1, eventTitle, eventId }) => {
  const student = useSelector((state: any) => state.auth.user);

  /* ================= FORM STATE ================= */

  const [formData, setFormData] = useState({
    teamName: "",
    teamMembers: [] as string[],
    github: "",
    linkedin: "",
    notes: "",
  });

  /* Preview data per team member index */
  const [teamMembersMeta, setTeamMembersMeta] = useState<
    Record<number, any>
  >({});

  /* ================= VERIFY MEMBER ================= */

  const verifyTeamMember = async (idx: number) => {
    const idNumber = formData.teamMembers[idx];
    if (!idNumber) return;

    try {
      const data = await fetchTeamMembersMetaData(idNumber);

      setTeamMembersMeta((prev) => ({
        ...prev,
        [idx]: data,
      }));
    } catch {
      alert("Student not found");
      setTeamMembersMeta((prev) => {
        const updated = { ...prev };
        delete updated[idx];
        return updated;
      });
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    const isTeam = teamSize > 1;

    const payload = {
      eventId,
      studentId: student.id,
      registrationType: isTeam ? "TEAM" : "INDIVIDUAL",
      teamName: isTeam ? formData.teamName : null,
      teamMemberIds: [], // handled backend side later if needed
      extraInfo: JSON.stringify({
        github: formData.github,
        linkedin: formData.linkedin,
        notes: formData.notes,
      }),
    };

    console.log("Submitting payload:", payload);
    // await axios.post("/api/events/register", payload);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-xl">
      {/* ================= HEADER ================= */}
      <div className="bg-gray-900 px-6 py-5 text-white rounded-t-2xl">
        <div className="flex items-center gap-2 mb-1">
          <Trophy size={14} className="text-indigo-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
            Event Registration
          </span>
        </div>
        <h2 className="text-xl leading-tight">
          {eventTitle || "Technical Symposium 2026"}
        </h2>
        <p className="text-xs text-gray-300 mt-1">
          Mode:{" "}
          <span className="text-white font-bold">
            {teamSize > 1 ? "Team Entry" : "Solo Entry"}
          </span>
        </p>
      </div>

      {/* ================= BODY ================= */}
      <div className="px-6 py-6 space-y-8">
        {/* ===== Identity ===== */}
        <section className="space-y-4">
          <IdentityField label="Full Name" value={student?.name} icon={<User size={14} />} />

          <div className="grid grid-cols-2 gap-3">
            <IdentityField
              label="Student ID"
              value={student?.identification_number}
              icon={<CreditCard size={14} />}
            />
            <IdentityField
              label="Roll No"
              value={student?.rollNo}
              icon={<Fingerprint size={14} />}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <IdentityField
              label="Department"
              value={student?.branch}
              icon={<BookOpen size={14} />}
            />
            <IdentityField
              label="Year"
              value={student?.year}
              icon={<Calendar size={14} />}
            />
          </div>
        </section>

        {/* ===== TEAM SECTION ===== */}
        {teamSize > 1 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-indigo-600" />
              <h3 className="text-sm font-black uppercase tracking-wide">
                Team Details
              </h3>
            </div>

            <FormInput
              label="Team Name"
              icon={<Hash size={16} />}
              placeholder="Enter team name"
              value={formData.teamName}
              onChange={(v) =>
                setFormData({ ...formData, teamName: v })
              }
            />

            {/* Team Members */}
            {Array.from({ length: teamSize - 1 }).map((_, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    placeholder={`Partner ${idx + 2} University ID`}
                    value={formData.teamMembers[idx] || ""}
                    onChange={(e) => {
                      const updated = [...formData.teamMembers];
                      updated[idx] = e.target.value;
                      setFormData({ ...formData, teamMembers: updated });
                    }}
                    className="flex-1 px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl font-bold outline-none focus:bg-white focus:border-indigo-600 transition"
                  />

                  <button
                    type="button"
                    onClick={() => verifyTeamMember(idx)}
                    className="px-4 py-3 rounded-xl bg-gray-900 text-white text-xs font-black uppercase hover:bg-indigo-600 transition flex items-center gap-1"
                  >
                    <Search size={14} /> Search
                  </button>
                </div>

                {/* Preview */}
                {teamMembersMeta[idx] && (
  <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 space-y-2">
    {/* Name */}
    <p className="text-sm font-bold text-gray-900">
      {teamMembersMeta[idx].name}
    </p>

    {/* Capsules */}
    <div className="flex flex-wrap gap-2 text-[10px] font-bold">
      <span className="px-2 py-1 rounded-full bg-white border border-indigo-200 text-indigo-700">
        Year {teamMembersMeta[idx].year}
      </span>
      <span className="px-2 py-1 rounded-full bg-white border border-indigo-200 text-indigo-700">
        {teamMembersMeta[idx].branch}
      </span>
      <span className="px-2 py-1 rounded-full bg-white border border-indigo-200 text-indigo-700">
        Div {teamMembersMeta[idx].division}
      </span>
      <span className="px-2 py-1 rounded-full bg-white border border-indigo-200 text-indigo-700">
        Roll {teamMembersMeta[idx].rollNo}
      </span>
    </div>
  </div>
)}

              </div>
            ))}
          </section>
        )}

        {/* ===== LINKS ===== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <LinkIcon size={18} className="text-indigo-600" />
            <h3 className="text-sm font-black uppercase tracking-wide">
              Project Links
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="GitHub"
              icon={<Github size={16} />}
              placeholder="github.com/username"
              value={formData.github}
              onChange={(v) =>
                setFormData({ ...formData, github: v })
              }
            />
            <FormInput
              label="LinkedIn"
              icon={<Linkedin size={16} />}
              placeholder="linkedin.com/in/username"
              value={formData.linkedin}
              onChange={(v) =>
                setFormData({ ...formData, linkedin: v })
              }
            />
          </div>
        </section>

        {/* ===== NOTES ===== */}
        <section className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
            Additional Notes
          </label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl font-bold outline-none focus:bg-white focus:border-indigo-600 transition"
            placeholder="Any special requirements..."
          />
        </section>

        {/* ===== FOOTER ===== */}
        <div className="pt-4 flex items-center justify-between border-t border-gray-100">
          <button
            onClick={onClose}
            className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-4 bg-indigo-600 text-white text-sm font-black rounded-xl flex items-center gap-3 hover:bg-gray-900 transition"
          >
            Complete Registration <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= HELPERS ================= */

const IdentityField = ({ label, value, icon }: any) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
        {label}
      </p>
      <p className="text-sm font-bold text-gray-900">
        {value || "---"}
      </p>
    </div>
  </div>
);

const FormInput = ({
  label,
  icon,
  placeholder,
  value,
  onChange,
}: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
        {icon}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-3 py-3 bg-gray-50 border-2 border-transparent rounded-xl font-bold outline-none focus:bg-white focus:border-indigo-600 transition"
      />
    </div>
  </div>
);
