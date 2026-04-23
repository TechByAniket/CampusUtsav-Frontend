import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  AtSign, 
  Phone, 
  Calendar, 
  Award, 
  BookOpen, 
  Hash, 
  Layers,
  Sparkles,
  Verified,
  Mail,
  IdCard
} from 'lucide-react';
import { getMyStudentProfileDetails } from '@/services/studentService';
import { toast } from 'sonner';

const YEAR_MAPPING: Record<string, string> = {
  "1": "FY",
  "2": "SY",
  "3": "TY",
  "4": "FINAL"
};

const StudentProfilePage = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getMyStudentProfileDetails();
        setProfileData(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to sync identity");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-white font-sans text-slate-800">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Syncing Identity...</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No Profile Data Available</p>
      </div>
    );
  }

  const academicYear = YEAR_MAPPING[String(profileData.year)] || String(profileData.year);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 lg:p-10 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
        .visible-border { border: 1.5px solid #e2e8f0; }
        .tile-compact { 
          background: white;
          padding: 1rem 1.25rem;
          border-radius: 1.25rem;
          transition: all 0.2s ease;
        }
        .tile-compact:hover {
          border-color: #6366f1;
          box-shadow: 0 4px 12px -2px rgba(63, 102, 241, 0.08);
        }
      `}</style>

      <main className="max-w-5xl mx-auto space-y-4 font-jakarta">

        {/* ================= LIGHT THEMED HERO ================= */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="visible-border tile-compact flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl font-extrabold border border-indigo-100 uppercase">
                {profileData.name?.substring(0, 2)}
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-lg border-2 border-white shadow-sm">
                <Verified size={10} color="white" />
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                  {profileData.name}
                </h1>
                <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md text-[8px] font-black uppercase tracking-widest">
                  {profileData.status || "Active"}
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <AtSign size={10} className="text-indigo-400" /> {profileData.username}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-start gap-8 md:pr-4">
             <HeroInfo label="UID" value={profileData.identificationNumber} />
             <HeroInfo label="Phone" value={profileData.phone} verified={profileData.phoneVerified} />
             <HeroInfo label="Joined" value={new Date(profileData.createdAt).toLocaleDateString()} />
          </div>
        </motion.div>

        {/* ================= HIGH DENSITY GRID ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <Tile 
            span="col-span-2"
            icon={<Building2 size={16} />}
            label="College"
            value={profileData.collegeName}
            color="indigo"
          />

          <Tile 
            icon={<BookOpen size={16} />}
            label="Branch"
            value={profileData.branch}
            color="blue"
          />

          <Tile 
             icon={<Hash size={16} />}
             label="Roll No"
             value={profileData.rollNo}
             sub={`Division ${profileData.division}`}
             color="amber"
          />

          <Tile 
            icon={<Layers size={16} />}
            label="Year"
            value={`${academicYear} Year`}
            color="violet"
          />

          <Tile 
            icon={<IdCard size={16} />}
            label="College ID"
            value={profileData.collegeId}
            color="slate"
          />

          <Tile 
            span="col-span-2"
            icon={<Sparkles size={16} />}
            label="Interests"
            value={profileData.interests || "General Interests"}
            color="emerald"
          />
          
          <Tile 
            icon={<Mail size={16} />}
            label="Official Identity"
            value={profileData.email}
            verified={profileData.emailVerified}
            color="rose"
            span="col-span-2"
          />
          
          <Tile 
            icon={<Phone size={16} />}
            label="Direct Contact"
            value={profileData.phone}
            color="cyan"
            span="col-span-2"
          />

          <Tile 
            icon={<Calendar size={16} />}
            label="Admission"
            value={profileData.admissionYear}
            color="orange"
          />

          <Tile 
            icon={<Award size={16} />}
            label="Graduation"
            value={profileData.graduationYear}
            color="teal"
          />
        </div>
      </main>

      <footer className="mt-10 py-6 border-t border-slate-200">
         <div className="max-w-5xl mx-auto flex items-center justify-between opacity-30">
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">CampusUtsav</p>
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">© 2026 Campus Utsav Network</p>
         </div>
      </footer>
    </div>
  );
};

/* ================= HELPERS ================= */

const HeroInfo = ({ label, value, verified = true }: any) => (
  <div className="flex flex-col">
    <div className="flex items-center gap-1.5 mb-1">
       <div className={`w-1 h-1 rounded-full ${verified ? 'bg-emerald-500' : 'bg-slate-300'} shrink-0`} />
       <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</p>
    </div>
    <p className="text-xs font-black text-slate-800 ml-2.5 leading-tight">{value || "---"}</p>
  </div>
);

const Tile = ({ icon, label, value, sub, color, span, verified }: any) => (
  <div className={`visible-border tile-compact flex flex-col gap-3 ${span}`}>
     <div className="flex items-center justify-between">
        <div className={`w-8 h-8 rounded-xl bg-${color}-50 text-${color}-600 flex items-center justify-center border border-${color}-100/50 shadow-sm shrink-0`}>
           {icon}
        </div>
        {verified !== undefined && (
           <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full border ${verified ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
              {verified ? "Verified" : "Pending"}
           </span>
        )}
     </div>
     <div className="min-w-0">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
        <p className="text-sm font-extrabold text-slate-800 truncate leading-tight uppercase font-jakarta">{value || "---"}</p>
        {sub && <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase leading-none">{sub}</p>}
     </div>
  </div>
);

export default StudentProfilePage;
