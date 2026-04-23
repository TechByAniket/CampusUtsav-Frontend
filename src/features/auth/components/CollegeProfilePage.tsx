import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  AtSign, 
  Phone, 
  Calendar, 
  Globe, 
  MapPin, 
  UserCircle, 
  ShieldCheck, 
  Verified,
  Mail,
  School
} from 'lucide-react';
import { getMyCollegeProfileDetails } from '@/services/collegeService';
import { toast } from 'sonner';

const CollegeProfilePage = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getMyCollegeProfileDetails();
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
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No Institutional Data Available</p>
      </div>
    );
  }

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
              {profileData.logoUrl ? (
                <img 
                  src={profileData.logoUrl} 
                  alt={profileData.name} 
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-100"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl font-extrabold border border-indigo-100 uppercase">
                  {profileData.shortForm?.substring(0, 2) || profileData.name?.substring(0, 2)}
                </div>
              )}
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
                  {profileData.shortForm || "COLLEGE"}
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <AtSign size={10} className="text-indigo-400" /> {profileData.username}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-start gap-8 md:pr-4">
             <HeroInfo label="Institutional ID" value={profileData.id} />
             <HeroInfo label="Official Phone" value={profileData.phone} verified={profileData.phoneVerified} />
             <HeroInfo label="Registered" value={new Date(profileData.createdAt).toLocaleDateString()} />
          </div>
        </motion.div>

        {/* ================= HIGH DENSITY GRID ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <Tile 
            span="col-span-2"
            icon={<School size={16} />}
            label="Affiliation"
            value={profileData.affiliation}
            color="indigo"
          />

          <Tile 
            icon={<UserCircle size={16} />}
            label="Admin Head"
            value={profileData.adminName}
            color="blue"
          />

          <Tile 
             icon={<MapPin size={16} />}
             label="Location"
             value={profileData.city}
             sub={`${profileData.district}, ${profileData.state}`}
             color="amber"
          />

          <Tile 
            span="col-span-2"
            icon={<Globe size={16} />}
            label="Official Website"
            value={profileData.websiteUrl}
            color="violet"
          />

          <Tile 
            span="col-span-2"
            icon={<Mail size={16} />}
            label="Institutional Email"
            value={profileData.email}
            verified={profileData.emailVerified}
            color="rose"
          />
          
          <Tile 
            icon={<ShieldCheck size={16} />}
            label="Security Status"
            value={profileData.emailVerified && profileData.phoneVerified ? "Fully Verified" : "Verification Pending"}
            color="emerald"
            span="col-span-2"
          />

          <Tile 
            icon={<Building2 size={16} />}
            label="District"
            value={profileData.district}
            color="cyan"
          />

          <Tile 
            icon={<Calendar size={16} />}
            label="Last Updated"
            value={new Date(profileData.updatedAt).toLocaleDateString()}
            color="orange"
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
    {/* Label Row: Using items-center and a consistent height */}
    <div className="flex items-center gap-1.5 h-3">
      <div className={`w-1.5 h-1.5 rounded-full ${verified ? 'bg-emerald-500' : 'bg-slate-300'} shrink-0`} />
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
        {label}
      </p>
    </div>

    {/* Value: Removed large left margin and tightened top spacing */}
    <p className="text-sm font-black text-slate-900 mt-0.5 pl-3 leading-none">
      {value || "---"}
    </p>
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

export default CollegeProfilePage;
