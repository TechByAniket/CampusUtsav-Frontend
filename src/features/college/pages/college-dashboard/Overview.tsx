import { EventsByClubs } from '@/features/analytics/components/EventsByClubs';
import { EventsByCategory } from '@/features/analytics/components/EventsByCategory';
import { RegistrationsByBranch } from '@/features/analytics/components/RegistrationsByBranch';
import { CalendarComponent } from '../../components/CalendarComponent';
import { DashboardHero } from '../../components/DashboardHero';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar as CalendarIcon, 
  Plus, 
  ArrowRight, 
  BarChart3, 
  PieChart as PieIcon,
  Bell,
  Search,
  Layout,
  Clock,
  Shapes
} from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

export const Overview: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-indigo-100">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .refine-card {
          background: white;
          border-radius: 1.25rem;
          padding: 1.5rem;
          border: 1px solid #F1F5F9;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.02);
          transition: all 0.2s ease;
        }

        .refine-card:hover {
          border-color: #E2E8F0;
          box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.05);
        }

        .kpi-compact {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1;
        }
      `}</style>

      <main className="max-w-7xl mx-auto space-y-16 font-jakarta relative z-10">
        
        {/* ================= NEW HERO SECTION ================= */}
        <DashboardHero />

        <div className="px-4 sm:px-6 lg:px-8 space-y-16">
            {/* ================= KPI SECTION ================= */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard label="Students" value="2,482" trend="+12%" color="indigo" />
                <KPICard label="Registrations" value="18.4k" trend="+5%" color="violet" />
                <KPICard label="Live Events" value="12" trend="Active" color="emerald" />
                <KPICard label="Engagement" value="94%" trend="+2%" color="amber" />
            </div>

            {/* ================= ANALYTICS HUB ================= */}
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-8 refine-card">
                    <SectionHeader title="Activity by Clubs" subtitle="Most active student chapters" icon={<Shapes size={16} className="text-indigo-600" />} />
                    <div className="mt-8">
                        <EventsByClubs />
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-4 refine-card">
                    <SectionHeader title="Activity by Category" subtitle="Distribution of events" icon={<BarChart3 size={16} className="text-violet-600" />} />
                    <div className="mt-8">
                        <EventsByCategory />
                    </div>
                </div>
            </div>

            {/* ================= MIDDLE GRID ================= */}
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-7 refine-card">
                    <SectionHeader title="Registrations by Department" subtitle="Branch-level pool share" icon={<Users size={16} className="text-emerald-600" />} />
                    <div className="mt-8">
                        <RegistrationsByBranch />
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-5 space-y-8">
                    <div className="refine-card bg-indigo-600 text-white border-none flex flex-col justify-between h-52 group cursor-pointer overflow-hidden relative">
                        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
                        <div className="space-y-4 relative z-10">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <Plus size={20} />
                            </div>
                            <h3 className="text-2xl font-black tracking-tight leading-none uppercase">Create New <br/> Campus Initiative</h3>
                        </div>
                        <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] relative z-10">
                            Get Started <ArrowRight size={12} />
                        </div>
                    </div>
                    
                    <div className="refine-card flex items-center justify-between py-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Next Deadline</p>
                                <h4 className="font-bold text-slate-900 text-sm uppercase mt-0.5">TechFest 2024</h4>
                            </div>
                        </div>
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-lg">2H Left</span>
                    </div>
                </div>
            </div>

            {/* ================= OPERATIONS ================= */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <SectionHeader title="Operations Planner" subtitle="Daily campus activities" icon={<CalendarIcon size={16} className="text-amber-600" />} />
                    <button className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View All Events</button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    <div className="xl:col-span-3 refine-card p-0 overflow-hidden min-h-[500px]">
                        <CalendarComponent />
                    </div>
                    <div className="xl:col-span-1 refine-card flex flex-col justify-center items-center text-center p-8 bg-slate-50/30 border-dashed border-slate-200">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-sm mb-4">
                            <Plus size={24} />
                        </div>
                        <h5 className="font-black text-slate-900 text-xs uppercase tracking-tight">Add Spotlight</h5>
                        <p className="text-[10px] text-slate-400 mt-2 font-medium uppercase leading-relaxed">Promote high-impact events to the student feed.</p>
                    </div>
                </div>
            </div>
        </div>

      </main>

      <footer className="mt-24 py-12 border-t border-slate-100 flex items-center justify-center opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.4em]">CampusUtsav Intelligence v2.5</p>
      </footer>
    </div>
  );
};

const SectionHeader = ({ title, subtitle, icon }: any) => (
    <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100/50">
            {icon}
        </div>
        <div>
            <h2 className="text-xs font-black text-slate-900 tracking-[0.05em] uppercase leading-none">{title}</h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{subtitle}</p>
        </div>
    </div>
);

const KPICard = ({ label, value, trend, color }: any) => (
    <div className="refine-card group">
        <div className="flex items-center justify-between mb-4">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em]">{label}</p>
            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-${color}-50 text-${color}-600`}>
                {trend}
            </span>
        </div>
        <h3 className="kpi-compact text-slate-900">{value}</h3>
    </div>
);

const IconButton = ({ icon }: any) => (
    <button className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all">
        {icon}
    </button>
);
