import { 
  ShieldCheck, User, 
  Phone, 
  Instagram,
  Linkedin, Globe,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface EventDetailOrganizerProps {
  club: {
    name: string;
    shortForm: string;
    logoUrl: string;
    adminName: string;
    managedBy: string;
  };
  contactDetails: Record<string, { email: string; phone: string }>;
}

export const EventDetailOrganizer = ({
  club,
  contactDetails
}: EventDetailOrganizerProps) => {
  const contacts = Object.entries(contactDetails || {});

  return (
    <div className="flex flex-col gap-8 items-stretch font-sans">
      {/* Club Identity Section */}
      <div className="p-7 bg-white rounded-3xl border border-slate-200 shadow-md space-y-7 group transition-all hover:border-indigo-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
           <div className="flex items-center gap-5">
             <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-xl group-hover:scale-105 transition-transform shrink-0">
               <img src={club.logoUrl} alt={club.name} className="w-full h-full object-cover" />
             </div>
             <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight uppercase mb-1">{club.name}</h3>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">{club.shortForm}</p>
             </div>
           </div>
           
           <div className="flex gap-2.5">
             <button className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center hover:bg-pink-600 hover:text-white border border-pink-100 shadow-sm transition-all group/icon">
                <Instagram size={18} className="group-hover/icon:scale-110 transition-transform" />
             </button>
             <button className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white border border-blue-100 shadow-sm transition-all group/icon">
                <Linkedin size={18} className="group-hover/icon:scale-110 transition-transform" />
             </button>
             <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-900 hover:text-white border border-slate-200 shadow-sm transition-all group/icon">
                <Globe size={18} className="group-hover/icon:scale-110 transition-transform" />
             </button>
           </div>
        </div>

        {/* Responsible Entities Phase: Matched to Hero Stat Tiles EXACTLY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <div className="py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 group/stat hover:bg-white transition-all hover:shadow-md">
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 group-hover/stat:scale-110 transition-transform">
                <User size={12} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Club Head</p>
                <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight truncate">{club.adminName}</p>
              </div>
           </div>

           <div className="py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 group/stat hover:bg-white transition-all hover:shadow-md">
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 group-hover/stat:scale-110 transition-transform">
                <ShieldCheck size={12} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Faculty Member</p>
                <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight truncate">{club.managedBy}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Support Section - Matched to Hero Stat Tile Aesthetic */}
      <div className="p-7 bg-white rounded-3xl border border-slate-200 shadow-md flex-1 space-y-2">
         <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div className="flex items-center gap-4">
               <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
                 <Phone size={20} />
               </div>
               <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1 uppercase">Support Intelligence</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Instant Accessibility Hub</p>
               </div>
            </div>
            <ArrowUpRight size={20} className="text-slate-300" />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {contacts.slice(0, 2).map(([name, info], i) => (
               <motion.div 
                 key={name}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 group/contact hover:bg-white transition-all hover:shadow-md cursor-default h-auto"
               >
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm border border-slate-100 group-hover/contact:scale-110 transition-transform shrink-0">
                     <Phone size={10} />
                  </div>
                  <div className="min-w-0 flex-1">
                     <p className="text-[11px] font-black tracking-widest text-slate-400 leading-none truncate">{name}</p>
                     <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight truncate">{info.phone}</p>
                     <p className="text-[10px] font-bold text-slate-400 mt-0.5 truncate group-hover/contact:text-indigo-500 transition-colors">{info.email}</p>
                  </div>
               </motion.div>
            ))}
         </div>
      </div>
    </div>
  );
};
