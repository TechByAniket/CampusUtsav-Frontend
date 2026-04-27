import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search as SearchIcon, 
  Calendar as CalendarIcon, 
  Clock as ClockIcon, 
  MapPin as MapPinIcon, 
  Tag as TagIcon, 
  Edit3 as Edit3Icon, 
  LayoutDashboard,
  ImageIcon,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  X,
  Info,
  CheckCircle,
  History,
  Layers,
  Zap,
  ArrowRight,
  MessageSquare,
  Filter,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllEventsByClub, getEventApprovalHistory, getEventDetailsByEventId, fetchEventStatuses } from '@/services/eventService'; 
import { OnePageCreateEventForm } from '@/features/events/components/CreateEventForm';
import type { RootState } from '@/store/store';

// --- STYLES & ANIMATIONS ---

const radiationEffect = {
  animate: {
    scale: [1, 1.8],
    opacity: [0.5, 0],
  },
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeOut"
  }
};

// --- HELPER COMPONENTS ---

const VerticalApprovalChain = ({ history, isFinalApproved, currentStatus }: { history: any[], isFinalApproved: boolean, currentStatus: string }) => {
  const stages = [
    { key: 'SUBMITTED', label: 'Club Submission', role: 'ROLE_CLUB' },
    { key: 'FACULTY1_APPROVED', label: 'Faculty Review', role: 'ROLE_FACULTY' },
    { key: 'HOD_APPROVED', label: 'HOD Approval', role: 'ROLE_HOD' },
    { key: 'APPROVED', label: 'Final Publication', role: 'ROLE_PRINCIPAL' }
  ];

  // Map history to stages
  const getLogForStage = (stageKey: string) => {
    return history.find(h => h.toStatus === stageKey || h.action === stageKey);
  };

  const isReverted = currentStatus === 'REVERTED';
  const latestLog = history[0];

  // Determine current progress index
  const currentIndex = stages.findIndex(s => s.key === latestLog?.toStatus);
  const currentStep = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="relative py-4">
      {/* Vertical Line */}
      <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-slate-100" />
      <div className="absolute left-[15px] top-4 w-[2px] bg-emerald-500 transition-all duration-700" style={{ height: `${(currentStep / (stages.length - 1)) * 100}%` }} />

      <div className="space-y-12">
        {stages.map((stage, idx) => {
          const log = getLogForStage(stage.key);
          const isReached = idx <= currentStep;
          const isCurrent = idx === currentStep;
          
          // A stage is "active" if it's the current one and not yet approved
          const shouldRadiate = isCurrent && !isFinalApproved;
          
          return (
            <div key={stage.key} className="flex gap-8 group relative">
              {/* Left Side: Circle */}
              <div className="relative shrink-0">
                {shouldRadiate && (
                  <motion.div 
                    {...radiationEffect}
                    className="absolute inset-0 rounded-full bg-emerald-400"
                  />
                )}
                <div className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-colors ${
                  isReached ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-white border-slate-200 text-slate-300'
                }`}>
                  {isReached ? <CheckCircle size={14} /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />}
                </div>
              </div>

              {/* Right Side: Msg & Info */}
              <div className={`flex-1 pt-0.5 ${isReached ? 'opacity-100' : 'opacity-30'}`}>
                <div className="flex items-center justify-between gap-4 mb-1">
                  <h4 className={`text-[11px] font-black uppercase tracking-widest ${isReached ? 'text-slate-900' : 'text-slate-400'}`}>
                    {stage.label}
                  </h4>
                  {log && (
                    <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                
                {log?.remarks ? (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 mt-2">
                     <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic">
                        "{log.remarks}"
                     </p>
                  </div>
                ) : isCurrent && !isFinalApproved && !isReverted ? (
                  <p className="text-[11px] font-bold text-indigo-500 animate-pulse mt-1">Review in progress...</p>
                ) : null}

                {/* SPECIAL CASE: If Reverted at this stage */}
                {isReverted && isCurrent && latestLog?.action === 'REVERTED' && (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-2xl relative"
                    >
                        <p className="text-[12px] font-black text-orange-900 leading-snug">
                           "{latestLog.remarks}"
                        </p>
                        <div className="mt-2 text-[9px] font-bold text-orange-500/70 uppercase tracking-tighter">
                           Sent by {latestLog.actionBy.replace('ROLE_', '')} • {new Date(latestLog.timestamp).toLocaleTimeString()}
                        </div>
                    </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SubmissionModal = ({ event, onClose, onEdit }: { event: any, onClose: () => void, onEdit: () => void }) => {
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedVersion, setSelectedVersion] = useState<number | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getEventApprovalHistory(event.id);
                setHistory(data || []);
                if (data && data.length > 0) {
                    const maxVersion = Math.max(...data.map((h: any) => h.version));
                    setSelectedVersion(maxVersion);
                }
            } catch (err) { console.error(err); }
            finally { setIsLoading(false); }
        };
        fetchHistory();
    }, [event.id]);

    const versions = useMemo(() => {
        const vMap: Record<number, any[]> = {};
        history.forEach(h => {
            if (!vMap[h.version]) vMap[h.version] = [];
            vMap[h.version].push(h);
        });
        return vMap;
    }, [history]);

    const sortedVersions = Object.keys(versions).map(Number).sort((a, b) => b - a);
    const currentHistory = selectedVersion ? versions[selectedVersion] : [];

    const isReverted = event.status === 'REVERTED';
    const isApproved = event.status === 'APPROVED';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-slate-200"
            >
                {/* Header: Poster + Title + ID */}
                <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm shrink-0">
                        <img src={event.posterUrl} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-base font-black text-slate-900 uppercase truncate leading-tight">{event.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black text-indigo-600 bg-white border border-indigo-100 px-2 py-0.5 rounded-lg">ID #{event.id}</span>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${isApproved ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : isReverted ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                {event.status}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="ml-auto p-2 text-slate-300 hover:text-slate-600 transition-colors"><X size={20}/></button>
                </div>

                <div className="p-8 max-h-[500px] overflow-y-auto no-scrollbar">
                    {/* Version Selector (Small Pills) */}
                    {!isLoading && sortedVersions.length > 1 && (
                        <div className="flex items-center gap-2 mb-10 overflow-x-auto no-scrollbar">
                            {sortedVersions.map(v => (
                                <button 
                                    key={v}
                                    onClick={() => setSelectedVersion(v)}
                                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedVersion === v ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}
                                >
                                    v{v}
                                </button>
                            ))}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="py-20 text-center flex flex-col items-center gap-4">
                            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetching Logs...</p>
                        </div>
                    ) : (
                        <VerticalApprovalChain 
                            history={currentHistory} 
                            isFinalApproved={isApproved && selectedVersion === Math.max(...sortedVersions)} 
                            currentStatus={event.status}
                        />
                    )}

                    {/* Compact Footer Actions */}
                    <div className="mt-12 flex items-center gap-4">
                        <button onClick={onClose} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-100 active:scale-95">Dismiss</button>
                        {isReverted && selectedVersion === Math.max(...sortedVersions) && (
                            <button 
                                onClick={onEdit}
                                className="flex-2 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 px-8"
                            >
                                <Edit3Icon size={16} /> Resubmit
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// --- MAIN COMPONENT ---

export const ClubEvents = () => {
  const [eventList, setEventList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  
  // Filtering Logic
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  const profileId = useSelector((state: RootState) => state.auth.profileId);

  useEffect(() => {
    const loadData = async () => {
      if (!profileId) return;
      setIsLoading(true);
      try {
        const [events, statuses] = await Promise.all([
            getAllEventsByClub(profileId),
            fetchEventStatuses()
        ]);
        setEventList(events || []);
        setAvailableStatuses(statuses || []);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [profileId]);

  // Close filter on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
            setIsFilterOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCount = (status: string) => eventList.filter((e: any) => e.status === status).length;

  const stats = [
    { label: 'Live/Appr.', count: getCount('APPROVED'), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Submitted', count: getCount('SUBMITTED'), icon: LayoutDashboard, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Reverted', count: getCount('REVERTED'), icon: RotateCcw, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Rejected', count: getCount('REJECTED'), icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
  ];

  const getStatusStyles = (status: string) => {
    switch(status.toUpperCase()) {
      case 'APPROVED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'REVERTED': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'REJECTED': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'SUBMITTED': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'HOD_APPROVED': return 'bg-cyan-50 text-cyan-600 border-cyan-100';
      case 'FACULTY1_APPROVED': return 'bg-violet-50 text-violet-600 border-violet-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  const filteredEvents = useMemo(() => {
    return eventList.filter((e: any) => {
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            e.eventCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            e.id.toString().includes(searchQuery);
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(e.status);
      return matchesSearch && matchesStatus;
    });
  }, [eventList, searchQuery, selectedStatuses]);

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev => 
        prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  return (
    <div className="w-full min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-[1550px] mx-auto space-y-10">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">Event Console</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                Manage Institutional Operations
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative group">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                <input 
                    type="text" 
                    placeholder="Search events by title or ID..." 
                    className="pl-11 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-indigo-300 w-full md:w-80 font-bold shadow-sm transition-all" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} 
                />
             </div>
             <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-3 shadow-xl shadow-slate-100 active:scale-95">
               <Edit3Icon size={16} /> Create New Event
             </button>
          </div>
        </header>

        {/* --- ANALYTICS SUMMARY --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, idx) => (
            <div key={idx} className={`p-6 rounded-[2rem] border ${s.border} ${s.bg} flex items-center gap-5 transition-all hover:shadow-lg hover:shadow-slate-100 group cursor-default`}>
              <div className={`w-12 h-12 rounded-2xl bg-white border ${s.border} flex items-center justify-center ${s.color} shadow-sm group-hover:scale-110 transition-transform`}>
                <s.icon size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-black text-slate-900 leading-none mb-1">{s.count}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50 min-h-[500px]">
          
          {/* TOOLBAR */}
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Active Submissions</h2>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">{filteredEvents.length} Records</span>
            </div>

            {/* STATUS MULTI-CHECK FILTER */}
            <div className="relative" ref={filterRef}>
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedStatuses.length > 0 ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-400'}`}
                >
                    <Filter size={14} /> {selectedStatuses.length > 0 ? `${selectedStatuses.length} Selected` : 'Filter Status'}
                </button>

                <AnimatePresence>
                    {isFilterOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-3 w-64 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 z-[60] overflow-hidden"
                        >
                            <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Select Statuses</p>
                            </div>
                            <div className="p-2 max-h-64 overflow-y-auto no-scrollbar">
                                {availableStatuses.map(status => (
                                    <button 
                                        key={status}
                                        onClick={() => toggleStatus(status)}
                                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors group"
                                    >
                                        <span className={`text-[11px] font-bold uppercase tracking-tight ${selectedStatuses.includes(status) ? 'text-indigo-600' : 'text-slate-600'}`}>
                                            {status.replace('_', ' ')}
                                        </span>
                                        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${selectedStatuses.includes(status) ? 'bg-indigo-600 border-indigo-600 shadow-md shadow-indigo-100' : 'bg-white border-slate-200'}`}>
                                            {selectedStatuses.includes(status) && <Check size={12} className="text-white" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                            {selectedStatuses.length > 0 && (
                                <div className="p-2 border-t border-slate-50 bg-slate-50/30">
                                    <button 
                                        onClick={() => setSelectedStatuses([])}
                                        className="w-full py-2 text-[9px] font-black uppercase text-indigo-600 hover:bg-white rounded-lg transition-colors"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
          </div>

          {/* TABLE VIEW */}
          <div className="overflow-x-auto no-scrollbar">
            {isLoading ? (
                <div className="py-40 flex flex-col items-center justify-center space-y-6">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Records...</p>
                </div>
            ) : filteredEvents.length === 0 ? (
                <div className="py-40 text-center flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100">
                        <LayoutDashboard size={40} />
                    </div>
                    <p className="text-slate-400 font-black text-sm uppercase tracking-widest">No matching events found</p>
                </div>
            ) : (
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 text-left">
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Event Identity</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Schedule & Logistics</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Submission Status</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredEvents.map((event) => (
                            <tr key={event.id} className="hover:bg-indigo-50/30 transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border-4 border-white shadow-md shrink-0 relative">
                                            {event.posterUrl ? (
                                                <img src={event.posterUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={20}/></div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-black text-slate-800 uppercase text-sm truncate max-w-[280px] group-hover:text-indigo-600 transition-colors leading-tight">{event.title}</div>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100/50">#{event.id}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{event.eventCategory}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-8 py-5">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2.5 text-[11px] font-black text-slate-700 uppercase tracking-tight">
                                            <CalendarIcon size={13} className="text-indigo-500" /> {event.date}
                                        </div>
                                        <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <MapPinIcon size={12} className="text-slate-300" /> {event.venue || "TBD"}
                                        </div>
                                    </div>
                                </td>

                                <td className="px-8 py-5">
                                    <div className="flex flex-col gap-2">
                                        <span className={`inline-flex items-center px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border w-fit shadow-sm ${getStatusStyles(event.status)}`}>
                                            {event.status.replace('_', ' ')}
                                        </span>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                                            <ClockIcon size={11} className="text-slate-300" /> {event.startTime?.slice(0,5)}
                                        </div>
                                    </div>
                                </td>

                                <td className="px-8 py-5">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => setSelectedEvent(event)}
                                            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all active:scale-95 flex items-center gap-2 shadow-sm"
                                        >
                                            Status <Info size={14} />
                                        </button>
                                        <button 
                                            onClick={() => navigate(`/club-dashboard/events/${event.id}`)}
                                            className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:shadow-lg transition-all active:scale-95 group/btn flex items-center gap-2 shadow-xl shadow-slate-100"
                                        >
                                            View Event <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
          </div>
        </div>

        {/* Global Branding Footer */}
        <div className="pt-20 pb-16 flex flex-col items-center justify-center space-y-6">
           <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-300 shadow-xl shadow-slate-100/50">
              <LayoutDashboard size={20} />
           </div>
           <div className="text-center space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Campus Utsav Event Management</p>
              <div className="flex items-center justify-center gap-3">
                 <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Official Club Dashboard</span>
                 <span className="w-1.5 h-1.5 bg-slate-100 rounded-full" />
                 <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">v4.0.26</span>
              </div>
           </div>
        </div>
      </div>

      {/* --- SUBMISSION MODAL --- */}
      <AnimatePresence>
          {selectedEvent && (
              <SubmissionModal 
                event={selectedEvent} 
                onClose={() => setSelectedEvent(null)} 
                onEdit={async () => {
                    try {
                        const fullDetails = await getEventDetailsByEventId(selectedEvent.id);
                        setEditingEvent(fullDetails);
                        setSelectedEvent(null);
                    } catch (err) {
                        toast.error("Failed to load full event details for editing.");
                    }
                }}
              />
          )}
      </AnimatePresence>

      {/* --- EDIT / RESUBMIT MODAL --- */}
      <AnimatePresence>
          {editingEvent && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto no-scrollbar">
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl relative overflow-hidden border border-slate-200 my-auto"
                  >
                      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                          <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 italic">Resubmit Proposal • #{editingEvent.id}</h3>
                          <button onClick={() => setEditingEvent(null)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><X size={20}/></button>
                      </div>
                      <div className="max-h-[85vh] overflow-y-auto no-scrollbar">
                          <OnePageCreateEventForm 
                            initialData={editingEvent} 
                            isModal={true} 
                            onClose={() => {
                                setEditingEvent(null);
                                // Refresh list
                                window.location.reload(); 
                            }} 
                          />
                      </div>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>
    </div>
  );
};