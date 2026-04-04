import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  getClubDetailsByClubId 
} from "@/services/clubService";
// import { sampleEvents } from "@/services/eventService";
import { 
  Globe, Instagram, Linkedin, Mail, Phone, UserCircle, 
  Info, Shield, Calendar, MapPin, ArrowLeft,
  Users, Briefcase, GraduationCap, CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpcomingEvents } from "../components/UpcomingEvents";
import { PastEvents } from "../components/PastEvents";

interface ClubDetail {
  id: number;
  name: string;
  username: string;
  shortForm: string;
  adminName: string;
  facultyCoordinatorName: string | null;
  facultyCoordinatorEmail: string | null;
  adminEmail: string;
  adminPhone: string;
  description: string;
  branchShortForm: string;
  logoUrl: string;
  websiteUrl: string;
  instagramUrl: string;
  linkedInUrl: string;
  createdAt: string;
  updatedAt: string;
  college: {
    id: number;
    name: string;
    shortForm: string;
    city: string;
    district: string;
    state: string;
  };
}

export const ClubDetailsPage = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const collegeId = useSelector((state: any) => state.auth.collegeId);
  
  const [club, setClub] = useState<ClubDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!collegeId || !clubId) return;

    const fetchClub = async () => {
      setLoading(true);
      try {
        const data = await getClubDetailsByClubId(Number(collegeId), Number(clubId));
        setClub(data);
      } catch (err) {
        toast.error("Failed to load club details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [collegeId, clubId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest text-center mt-2">Fetching Club Intelligence...</p>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl text-center max-w-md border border-slate-100">
           <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Info size={40} />
           </div>
           <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Club Not Found</h2>
           <p className="text-slate-500 text-sm mb-8 leading-relaxed">The club you are looking for might have been removed or the ID is incorrect.</p>
           <Link to="/college-dashboard/clubs" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200">
              <ArrowLeft size={16} /> Back to Dashboard
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      
      {/* --- PREMIUM HERO SECTION --- */}
      <div className="relative h-[450px] overflow-hidden mb-[-100px]">
        {/* Background Gradient & Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Back Button */}
        <div className="absolute top-8 left-8 z-20">
           <Link to="/college-dashboard/clubs" className="p-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl hover:bg-white/20 transition-all flex items-center gap-2 group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest mr-1">Dashboard</span>
           </Link>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col items-center justify-center text-center">
            <div className="w-32 h-32 bg-white/5 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-4 flex items-center justify-center mb-8 shadow-2xl relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                {club.logoUrl ? (
                    <img src={club.logoUrl} alt={club.name} className="w-full h-full object-contain drop-shadow-2xl" />
                ) : (
                    <Users size={60} className="text-white/20" />
                )}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
                {club.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-3">
                <span className="px-4 py-1.5 bg-indigo-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-indigo-900/50">
                    {club.shortForm}
                </span>
                <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 text-white/80 text-[11px] font-bold uppercase tracking-widest rounded-full">
                    {club.college.name}
                </span>
            </div>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="max-w-7xl mx-auto px-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About Card */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-200/50">
               <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm"><Info size={24} /></div>
                  <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Mission & Identity</h2>
               </div>
               <p className="text-slate-600 text-lg leading-relaxed font-medium italic opacity-90">
                 "{club.description}"
               </p>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
                  <InfoTile icon={<GraduationCap size={20}/>} label="Academic Branch" value={club.branchShortForm} />
                  <InfoTile icon={<Calendar size={20}/>} label="Member Since" value={new Date(club.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} />
               </div>
            </div>

            {/* Events Tabs Section */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                  <div className="flex items-center gap-3">
                      <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-sm"><Calendar size={24} /></div>
                      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Event Timeline</h2>
                  </div>
              </div>

              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="bg-slate-100 p-1.5 rounded-[1.5rem] mb-8 w-full md:w-fit flex">
                  <TabsTrigger value="upcoming" className="flex-1 md:flex-none px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all">
                    Upcoming Showcase
                  </TabsTrigger>
                  <TabsTrigger value="past" className="flex-1 md:flex-none px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-600 data-[state=active]:shadow-sm transition-all">
                    Historical Archives
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="mt-0 outline-none">
                  <UpcomingEvents events={sampleEvents} />
                </TabsContent>

                <TabsContent value="past" className="mt-0 outline-none">
                  <PastEvents events={sampleEvents} />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* RIGHT COLUMN (1/3) */}
          <div className="space-y-8">
            
            {/* Leadership Card */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-[5rem] -mr-16 -mt-16 z-0" />
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Shield size={20} /></div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Leadership</h3>
                  </div>
                  
                  <div className="space-y-6">
                     <div className="group">
                        <p className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-2">Primary Administrator</p>
                        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:border-indigo-100 transition-colors">
                           <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:shadow-sm transition-all"><UserCircle size={24}/></div>
                           <div>
                              <p className="text-sm font-black text-slate-800 uppercase leading-none mb-1">{club.adminName}</p>
                              <p className="text-[10px] font-bold text-slate-400">{club.adminEmail}</p>
                           </div>
                        </div>
                     </div>

                     {club.facultyCoordinatorName && (
                        <div className="group">
                          <p className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-2">Faculty Mentor</p>
                          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:border-emerald-100 transition-colors">
                            <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:shadow-sm transition-all"><GraduationCap size={24}/></div>
                            <div>
                                <p className="text-sm font-black text-slate-800 uppercase leading-none mb-1">{club.facultyCoordinatorName}</p>
                                <p className="text-[10px] font-bold text-slate-400">{club.facultyCoordinatorEmail}</p>
                            </div>
                          </div>
                        </div>
                     )}
                     
                     <div className="flex flex-col gap-2 pt-4">
                        <a href={`mailto:${club.adminEmail}`} className="flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"><Mail size={16}/> Instant Message</a>
                        <a href={`tel:${club.adminPhone}`} className="flex items-center justify-center gap-3 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"><Phone size={16}/> Direct Contact</a>
                     </div>
                  </div>
               </div>
            </div>

            {/* Institution Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 border border-white/10 shadow-xl shadow-indigo-200/50 text-white">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-white/10 text-white rounded-2xl backdrop-blur-md"><Briefcase size={20} /></div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Parent Institution</h3>
                </div>
                
                <h4 className="text-lg font-black uppercase tracking-tight leading-tight mb-6 opacity-95">
                  {club.college.name}
                </h4>
                
                <div className="space-y-4">
                   <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest opacity-80">
                      <MapPin size={16} /> {club.college.city}, {club.college.state}
                   </div>
                   <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest opacity-80">
                      <Info size={16} /> District: {club.college.district}
                   </div>
                </div>
                
                <button className="w-full mt-8 py-4 bg-white text-indigo-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-lg active:scale-95">View Institute Portfolio</button>
            </div>

            {/* Social Connect Card */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
               <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl"><Globe size={20} /></div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Social Connect</h3>
               </div>
               
               <div className="grid grid-cols-3 gap-3">
                  {club.instagramUrl && (
                    <a href={club.instagramUrl} target="_blank" rel="noopener noreferrer" className="aspect-square flex flex-col items-center justify-center gap-2 bg-rose-50 text-rose-600 rounded-3xl group hover:bg-rose-100 transition-all">
                       <Instagram size={24} className="group-hover:scale-110 transition-transform" />
                       <span className="text-[8px] font-black uppercase tracking-tight">Insta</span>
                    </a>
                  )}
                  {club.linkedInUrl && (
                    <a href={club.linkedInUrl} target="_blank" rel="noopener noreferrer" className="aspect-square flex flex-col items-center justify-center gap-2 bg-blue-50 text-blue-700 rounded-3xl group hover:bg-blue-100 transition-all">
                       <Linkedin size={24} className="group-hover:scale-110 transition-transform" />
                       <span className="text-[8px] font-black uppercase tracking-tight">LinkedIn</span>
                    </a>
                  )}
                  {club.websiteUrl && (
                    <a href={club.websiteUrl} target="_blank" rel="noopener noreferrer" className="aspect-square flex flex-col items-center justify-center gap-2 bg-slate-100 text-slate-700 rounded-3xl group hover:bg-slate-200 transition-all">
                       <Globe size={24} className="group-hover:scale-110 transition-transform" />
                       <span className="text-[8px] font-black uppercase tracking-tight">Web</span>
                    </a>
                  )}
               </div>
               
               <div className="mt-8 p-4 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status Intelligence</p>
                  <p className="text-[12px] font-black text-emerald-600 uppercase flex items-center justify-center gap-1">
                    <CheckCircle size={14} /> ACCOUNT ACTIVE & VERIFIED
                  </p>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

interface InfoTileProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoTile = ({ icon, label, value }: InfoTileProps) => (
  <div className="p-5 rounded-3xl border border-slate-100 bg-slate-50 flex items-center gap-4 transition-all hover:border-indigo-100 hover:bg-indigo-50/20">
    <div className="p-3 bg-white border border-slate-100 text-indigo-600 rounded-2xl shadow-sm">{icon}</div>
    <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-sm font-black text-slate-800 uppercase leading-none">{value}</p>
    </div>
  </div>
);
