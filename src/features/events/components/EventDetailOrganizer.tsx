import { 
  ShieldCheck, User, 
  Phone, Mail,
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
    <div className="flex flex-col gap-6 items-stretch font-sans">
      {/* Club Identity Card */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-md space-y-5 group transition-all hover:border-slate-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-4 border-b border-slate-100">
           <div className="flex items-center gap-4">
             <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-xl group-hover:scale-105 transition-transform shrink-0">
               <img src={club.logoUrl} alt={club.name} className="w-full h-full object-cover" />
             </div>
             <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight mb-1">Organizing Club</h3>
                <p className="text-[15px] font-black text-indigo-600 uppercase tracking-[0.3em]">{club.name}</p>
             </div>
           </div>
           
           <div className="flex gap-2">
             <SocialBtn icon={Instagram} color="pink" />
             <SocialBtn icon={Linkedin} color="blue" />
             <SocialBtn icon={Globe} color="slate" />
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
           <PersonStat icon={User} label="Club Head" name={club.adminName} />
           <PersonStat icon={ShieldCheck} label="Faculty Coordinator" name={club.managedBy} />
        </div>
      </div>

      {/* Separate Contact Details Section */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-md space-y-4">
         <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                 <Phone size={18} />
               </div>
               <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">Contact Details</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Reach out for queries</p>
               </div>
            </div>
            <ArrowUpRight size={18} className="text-slate-300" />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {contacts.map(([name, info], i) => (
               <ContactTile key={name} name={name} info={info} delay={i * 0.1} />
            ))}
         </div>
      </div>
    </div>
  );
};

const SocialBtn = ({ icon: Icon, color }: any) => (
  <button className={`w-9 h-9 rounded-xl bg-${color}-50 text-${color}-600 flex items-center justify-center hover:bg-${color}-600 hover:text-white border border-${color}-100 transition-all`}>
     <Icon size={16} />
  </button>
);

const PersonStat = ({ icon: Icon, label, name }: any) => (
  <div className="py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 group/stat hover:bg-white transition-all hover:shadow-md">
    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 group-hover/stat:scale-110 transition-transform shrink-0">
      <Icon size={12} />
    </div>
    <div className="min-w-0">
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">{label}</p>
      <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight truncate">{name}</p>
    </div>
  </div>
);

const ContactTile = ({ name, info, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="relative p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col gap-3 group hover:bg-white hover:border-emerald-200 hover:shadow-lg transition-all cursor-default"
  >
    <div className="flex items-center justify-between">
       <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
             <User size={16} />
          </div>
          <div>
             <p className="text-xs font-black text-slate-900 leading-none">{name}</p>
             <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Organizer</p>
          </div>
       </div>
       <div className="flex gap-1.5">
          <a href={`tel:${info.phone}`} className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
             <Phone size={14} />
          </a>
          <a href={`mailto:${info.email}`} className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
             <Mail size={14} />
          </a>
       </div>
    </div>
    
    <div className="pt-3 border-t border-slate-100 flex flex-col gap-1.5">
       <div className="flex items-center gap-2 text-slate-500">
          <Phone size={10} />
          <span className="text-[11px] font-bold tracking-tight">{info.phone}</span>
       </div>
       <div className="flex items-center gap-2 text-slate-500">
          <Mail size={10} />
          <span className="text-[11px] font-bold truncate">{info.email}</span>
       </div>
    </div>
  </motion.div>
);
