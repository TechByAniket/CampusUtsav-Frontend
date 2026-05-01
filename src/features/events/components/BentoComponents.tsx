import { useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import type { RootState } from '@/store/store'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, MapPin, 
  ExternalLink, 
  UserPlus, Share2,
  CheckCircle2, AlertCircle,
  LayoutDashboard, X
} from 'lucide-react'
import { EventRegistrationForm } from './RegisterEventForm'

// Status badge styling helper
const getStatusStyles = (status: string) => {
  switch (status.toUpperCase()) {
    case 'UPCOMING':
      return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', label: 'Live Soon', icon: Calendar };
    case 'ONGOING':
      return { bg: 'bg-emerald-50', text: 'text-emerald-500', border: 'border-emerald-100', label: 'In Progress', icon: CheckCircle2 };
    case 'COMPLETED':
      return { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-slate-200', label: 'Finished', icon: AlertCircle };
    default:
      return { bg: 'bg-orange-50', text: 'text-orange-500', border: 'border-orange-100', label: 'Pending', icon: Calendar };
  }
}

export const BentoBadge = ({ label, value, icon: Icon, color = "indigo" }: { label: string, value: string, icon: any, color?: string }) => (
  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md hover:shadow-xl hover:border-indigo-100 transition-all group flex flex-col justify-center h-full">
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-8 h-8 rounded-full bg-${color}-50 flex items-center justify-center text-${color}-500/80 group-hover:scale-110 transition-transform`}>
        <Icon size={14} />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 truncate">{label}</p>
    </div>
    <p className="text-2xl font-black text-slate-900 leading-none">{value}</p>
  </div>
)

export const BentoHeroPoster = ({ url, title }: { url: string, title: string }) => (
  <div className="relative w-full h-full min-h-[280px] lg:min-h-[380px] rounded-3xl overflow-hidden border-[6px] border-white shadow-xl shadow-slate-200/50 group">
    <img src={url} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity" />
  </div>
)

interface HeroStat {
  label: string;
  value: string;
  icon: any;
  color: string;
}

export const BentoHeroDetail = ({ 
  title, status, category, venue, 
  stats, date, deadline, eventId, minTeamSize = 1, maxTeamSize = 1, isTeamEvent = false,
  isEligible = true, ineligibilityReason = "",
  allowedBranches = {}, allowedYears = {}
}: { 
  title: string, status: string, category: string, venue: string,
  stats: HeroStat[], date: string, deadline: string, eventId: number, minTeamSize?: number, maxTeamSize?: number,
  isTeamEvent?: boolean,
  isEligible?: boolean, ineligibilityReason?: string,
  allowedBranches?: Record<string, string>, allowedYears?: Record<string, string>
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const role = useSelector((state: RootState) => state.auth.role);
  const statusConfig = getStatusStyles(status);
  const StatusIcon = statusConfig.icon;


  const handleShare = async () => {
    const shareData = {
      title: title,
      text: `Check out ${title} on CampusUtsav!`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          toast.error("Could not share. Link copied to clipboard instead.");
          navigator.clipboard.writeText(window.location.href);
        }
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard. Share it on WhatsApp or Instagram!");
    }
  };

  return (
    <div className="h-full flex flex-col justify-between p-6 lg:p-7 bg-white rounded-3xl border border-slate-200 shadow-md relative overflow-hidden group">
      <div className="space-y-4">
        {/* Header: Status & Category & Date */}
        <div className="flex items-center justify-between">
           <div className="flex flex-wrap items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 ${statusConfig.bg} ${statusConfig.text} border border-slate-100/50 rounded-full shadow-sm`}>
                <StatusIcon size={12} />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">{statusConfig.label}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100/50 rounded-full shadow-sm">
                 <Calendar size={12} />
                 <span className="text-[9px] font-black uppercase tracking-[0.2em]">{date}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-500 border border-slate-200 rounded-full shadow-sm">
                 <LayoutDashboard size={12} />
                 <span className="text-[9px] font-black uppercase tracking-[0.2em]">{category}</span>
              </div>
           </div>
           <div className="flex gap-2">
              <button 
                onClick={handleShare}
                className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm group/share"
              >
                 <Share2 size={16} className="group-hover/share:scale-110 transition-transform" />
              </button>
           </div>
        </div>


        {/* Major Identity Title */}
        <h1 className="text-2xl md:text-4xl font-black text-slate-900 leading-[1.05] tracking-tight group-hover:text-indigo-600 transition-colors">
          {title}
        </h1>

        {/* 2x2 Stats Intelligence Grid (Scaled UP) */}
        <div className="grid grid-cols-2 gap-3 pt-5 border-t border-slate-50">
           {stats.map((stat, idx) => (
              <div key={idx} className="p-3 bg-slate-50/50 rounded-xl border border-slate-100/40 flex items-center gap-3 group/stat hover:bg-white transition-all hover:shadow-sm">
                 <div className={`w-8 h-8 rounded-full bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-500/80 group-hover/stat:scale-110 transition-transform`}>
                    <stat.icon size={12} />
                 </div>
                 <div className="space-y-0.5">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                    <p className="text-xs font-black text-slate-800 leading-none">{stat.value}</p>
                 </div>
              </div>
           ))}
        </div>
      </div>

      {/* Footer Context & Unified Call to Action */}
      <div className="mt-8 pt-5 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-5">
         <div className="flex items-center gap-5 min-w-0">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 group/venue hover:bg-white transition-all hover:shadow-md w-full sm:w-auto">
               <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500/80 group-hover/venue:scale-110 transition-transform shadow-sm">
                  <MapPin size={12} />
               </div>
               <div className="space-y-0.5 min-w-0">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Venue Location</p>
                  <p className="text-xs font-black text-slate-800 leading-none truncate max-w-[150px]">{venue}</p>
               </div>
            </div>

            <div className="space-y-0.5 min-w-0">
                  <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest leading-none mb-1">Registration Ends</p>
                  <p className="text-xs font-black text-slate-800 leading-none truncate max-w-[150px]">{deadline}</p>
            </div>
         </div>
         
         {(role === 'ROLE_STUDENT') && status !== 'COMPLETED' && (
            <div className="flex flex-col items-center sm:items-end gap-2">
               {!isEligible && (
                  <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest leading-none bg-rose-50 p-1.5 rounded-lg border border-rose-100">
                     {ineligibilityReason}
                  </p>
               )}
               <button 
                  disabled={!isEligible}
                  onClick={() => setIsModalOpen(true)}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl shadow-xl transition-all font-black text-[11px] uppercase tracking-widest shrink-0 active:scale-95 group w-full sm:w-auto justify-center ${
                     isEligible 
                     ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100' 
                     : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none grayscale border border-slate-200'
                  }`}
               >
                  <UserPlus size={16} />
                  <span>Register Now</span>
                  <ExternalLink size={12} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
               </button>
            </div>
         )}
      </div>

      {/* --- REGISTRATION MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 font-sans">
             {/* Backdrop */}
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsModalOpen(false)}
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
             />

             {/* Modal Content */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto font-sans"
             >
                {/* Close Button */}
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-6 right-6 z-10 w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all shadow-lg"
                >
                   <X size={20} />
                </button>

                <EventRegistrationForm 
                  eventId={eventId}
                  eventTitle={title}
                  minTeamSize={minTeamSize}
                  maxTeamSize={maxTeamSize}
                  isTeamEvent={isTeamEvent}
                  onClose={() => setIsModalOpen(false)}
                  allowedBranches={allowedBranches}
                  allowedYears={allowedYears}
                />
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
