import { 
  GraduationCap, Shapes, 
  CheckCircle2, AlertCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface EventDetailCriteriaProps {
  allowedBranches: Record<string, string>;
  allowedYears: Record<string, string>;
  isBento?: boolean;
}

export const EventDetailCriteria = ({
  allowedBranches,
  allowedYears,
  isBento = false
}: EventDetailCriteriaProps) => {
  const branches = Object.values(allowedBranches || {});
  const years = Object.values(allowedYears || {});

  const Section = ({ title, items, icon: Icon, color = "indigo" }: { title: string, items: string[], icon: any, color?: string }) => (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md space-y-4 h-full relative group transition-all hover:border-slate-300">
      <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
        <div className={`w-10 h-10 rounded-xl bg-${color}-50 flex items-center justify-center text-${color}-600 shadow-sm border border-${color}-100/50`}>
          <Icon size={20} />
        </div>
        <div>
           <h3 className="text-md font-black text-slate-900 tracking-tight leading-none mb-1.5 uppercase">{title}</h3>
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-sm shadow-emerald-100" />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Qualified Feed</p>
           </div>
        </div>
      </div>
      
      <div className="space-y-2">
        {items.length > 0 ? items.map((item, i) => (
          <motion.div 
            key={item}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl group/item hover:bg-white transition-all hover:shadow-sm"
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center bg-white border border-slate-200 text-${color}-600 group-hover/item:border-${color}-300 shadow-sm transition-colors`}>
               <CheckCircle2 size={12} />
            </div>
            <span className="text-xs font-black text-slate-700 uppercase tracking-wide truncate">{item}</span>
          </motion.div>
        )) : (
          <div className="flex items-center gap-3 p-5 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl text-slate-400 font-bold text-xs uppercase tracking-widest justify-center">
            <AlertCircle size={16} />
            Universal Base
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`grid grid-cols-1 ${isBento ? 'sm:grid-cols-2 gap-6' : 'grid-cols-1 gap-6'}`}>
      <Section title="Allowed Branches" items={branches} icon={Shapes} color="indigo" />
      <Section title="Allowed Classes" items={years} icon={GraduationCap} color="emerald" />
    </div>
  );
};
