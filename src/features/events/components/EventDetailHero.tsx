import { 
  ChevronLeft, Calendar, 
  MapPin, CheckCircle2, 
  Clock3, RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const getStatusStyles = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'APPROVED':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        border: 'border-emerald-100',
        icon: CheckCircle2,
        label: 'Approved'
      };
    case 'REVERTED':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-600',
        border: 'border-rose-100',
        icon: RotateCcw,
        label: 'Reverted'
      };
    case 'SUBMITTED':
    case 'HOD_APPROVED':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        border: 'border-amber-100',
        icon: Clock3,
        label: status === 'HOD_APPROVED' ? 'HOD Approved' : 'Submitted'
      };
    default:
      return {
        bg: 'bg-slate-50',
        text: 'text-slate-600',
        border: 'border-slate-100',
        icon: Clock3,
        label: status || 'Pending'
      };
  }
};

interface EventDetailHeroProps {
  title: string;
  posterUrl: string;
  status: string;
  eventCategory: string;
  eventType: string;
  date: string;
  venue: string;
}

export const EventDetailHero = ({
  title,
  posterUrl,
  status,
  eventCategory,
  eventType,
  date,
  venue
}: EventDetailHeroProps) => {
  const navigate = useNavigate();
  const statusConfig = getStatusStyles(status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="relative w-full space-y-4">
      {/* Back Button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors"
        >
          <div className="p-1.5 rounded-lg bg-white border border-slate-200/60 shadow-sm group-hover:border-slate-300 group-hover:shadow-md transition-all">
            <ChevronLeft size={14} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">Back to Roster</span>
        </button>
      </div>

      {/* Hero Content - More Compact but Larger Scale */}
      <div className="relative flex flex-col md:flex-row gap-8 items-start bg-white p-8 rounded-[3rem] border border-slate-200/60 shadow-sm">
        {/* Left: Poster - Scaled Up */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full md:w-72 shrink-0 relative group"
        >
          <div className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-xl shadow-indigo-100/50 border-[3px] border-white ring-1 ring-slate-200/60 bg-slate-50">
            <img 
              src={posterUrl} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900/60 to-transparent" />
          </div>
          
          {/* Categories on Image */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/20">
              {eventCategory}
            </span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/20">
              {eventType}
            </span>
          </div>
        </motion.div>

        {/* Right: Primary Info - Larger Typography */}
        <motion.div 
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 space-y-6 pt-2"
        >
          <div className="space-y-4">
            <div className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border rounded-full shadow-sm`}>
               <StatusIcon size={12} />
               <span className="text-[10px] font-black uppercase tracking-[0.25em]">{statusConfig.label}</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight max-w-3xl">
              {title}
            </h1>

            <div className="flex flex-wrap gap-8 pt-2">
               <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-indigo-500 shadow-sm">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1.5">Scheduled Date</p>
                    <p className="text-sm font-bold text-slate-700">{date}</p>
                  </div>
               </div>

               <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-indigo-500 shadow-sm">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1.5">Primary Venue</p>
                    <p className="text-sm font-bold text-slate-700 truncate max-w-[250px]">{venue}</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-100">
             <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Category</p>
                <p className="text-xs font-bold text-slate-700">{eventCategory}</p>
             </div>
             <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Event Type</p>
                <p className="text-xs font-bold text-slate-700">{eventType}</p>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
