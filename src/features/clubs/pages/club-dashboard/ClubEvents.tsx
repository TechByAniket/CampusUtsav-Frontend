import React, { useState, useEffect, useRef } from 'react';
import { 
  Search as SearchIcon, 
  X as XIcon, 
  Calendar as CalendarIcon, 
  Clock as ClockIcon, 
  MapPin as MapPinIcon, 
  CheckCircle2 as CheckCircle2Icon, 
  Eye as EyeIcon, 
  Tag as TagIcon, 
  AlertCircle as AlertCircleIcon, 
  ImageIcon as ImageIconIcon, 
  Edit3 as Edit3Icon, 
  Filter as FilterIcon, 
  ChevronDown as ChevronDownIcon, 
  RotateCcw as RotateCcwIcon, 
  ShieldCheck as ShieldCheckIcon, 
  CheckCircle as CheckCircleIcon 
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useSelector } from 'react-redux';

import { getAllEventsByClub } from '@/services/eventService'; 

export const ClubEvents = () => {
  const [activeTab, setActiveTab] = useState('ALL'); 
  const [eventList, setEventList] = useState<any[]>([]);
  const [statuses, setStatuses] = useState(['ALL']);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileId = useSelector((state) => state.auth.profileId);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowStatusFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => { loadInitialData(); }, [profileId]);

  const fetchEventStatuses = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/events/statuses`);
      return response.data;
    } catch (error) { return []; }
  };

  const loadInitialData = async () => {
    if (!profileId) return;
    setIsLoading(true);
    try {
      const statusData = await fetchEventStatuses();
      setStatuses(['ALL', ...statusData]);
      const events = await getAllEventsByClub(profileId); 
      setEventList(events || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getCount = (status: any) => eventList.filter((e: any) => e.status === status).length;

  const stats = [
    { label: 'Submitted', count: getCount('SUBMITTED'), icon: <Send size={14}/>, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Faculty Appr.', count: getCount('FACULTY1_APPROVED'), icon: <ShieldCheckIcon size={14}/>, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
    { label: 'Reverted', count: getCount('REVERTED'), icon: <RotateCcwIcon size={14}/>, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'HOD Appr.', count: getCount('HOD_APPROVED'), icon: <CheckCircle2Icon size={14}/>, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100' },
    { label: 'Final Approved', count: getCount('APPROVED'), icon: <CheckCircleIcon size={14}/>, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Rejected', count: getCount('REJECTED'), icon: <AlertCircleIcon size={14}/>, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
  ];

  const getStatusStyles = (status) => {
    switch(status) {
      case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'REVERTED': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'REJECTED': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'SUBMITTED': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredEvents = eventList.filter((e: any) => {
    const matchesTab = activeTab === 'ALL' || e.status === activeTab;
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass-header {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .modern-shadow {
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.03), 0 2px 8px -2px rgba(0, 0, 0, 0.02);
        }
        .modern-shadow-lg {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
        }
        .hover-lift {
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.08);
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-grid {
          display: grid;
          grid-template-columns: 3.5fr 1.5fr 1.5fr 1fr;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 py-10 font-jakarta">
        
        {/* --- HEADER --- */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-bold uppercase tracking-wider mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              Club Administration
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Event Dashboard</h1>
            <p className="text-slate-500 font-medium">Manage and track your event submissions from a single place.</p>
          </div>
          
          <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '100ms' }}>
             <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl shadow-slate-200">
               <Edit3Icon size={16} /> Create New Event
             </button>
          </div>
        </header>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12 animate-fade-in" style={{ animationDelay: '200ms' }}>
          {stats.map((s, idx) => (
            <div key={idx} className={`p-5 rounded-3xl border ${s.border} ${s.bg} flex flex-col justify-between min-h-[120px] transition-all hover:scale-[1.03] cursor-default`}>
              <div className={`w-8 h-8 rounded-xl ${s.bg} border-2 border-white flex items-center justify-center ${s.color} shadow-sm`}>
                {s.icon}
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-800 leading-none mb-1">{s.count}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 modern-shadow p-2 md:p-4 mb-10 overflow-hidden animate-fade-in" style={{ animationDelay: '300ms' }}>
          
          {/* TOOLBAR */}
          <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-800">Your Submissions</h2>
              <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold">{filteredEvents.length}</span>
            </div>
            
            <div className="flex items-center gap-3">
              {/* SEARCH */}
              <div className="relative group">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search events..." 
                  className="pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all w-full md:w-64 font-medium" 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                />
              </div>

              {/* FILTER */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setShowStatusFilter(!showStatusFilter)} 
                  className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border ${showStatusFilter ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                >
                  <FilterIcon size={14} /> 
                  <span className="uppercase tracking-widest">{activeTab.replace('_', ' ')}</span>
                  <ChevronDownIcon size={14} className={`transition-transform duration-200 ${showStatusFilter ? 'rotate-180' : ''}`} />
                </button>
                
                {showStatusFilter && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-3xl shadow-2xl z-40 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2 origin-top-right">
                    <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">Filter by Status</div>
                    {statuses.map((tab) => (
                      <button 
                        key={tab} 
                        onClick={() => { setActiveTab(tab); setShowStatusFilter(false); }} 
                        className={`w-full text-left px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors ${activeTab === tab ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        {tab.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TABLE VIEW (DESKTOP) */}
          <div className="hidden md:block overflow-x-auto">
            <div className="px-6 py-4 flex items-center border-b border-slate-50 custom-grid">
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Detail</div>
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Schedule</div>
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</div>
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</div>
            </div>
            
            <div className="divide-y divide-slate-50">
              {isLoading ? (
                <div className="py-20 text-center text-slate-400 font-medium">Loading events...</div>
              ) : filteredEvents.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <CalendarIcon size={24} />
                  </div>
                  <p className="text-slate-500 font-bold">No events found matching your criteria.</p>
                </div>
              ) : (
                filteredEvents.map((event) => (
                  <div key={event.id} className="px-6 py-5 flex items-center hover:bg-slate-50/50 transition-colors group custom-grid">
                    {/* DETAIL */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-sm relative group">
                        {event.posterUrl ? (
                          <img src={event.posterUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIconIcon size={20}/></div>
                        )}
                        <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 text-sm truncate max-w-[240px] mb-1">{event.title}</div>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">#{event.id}</span>
                           <span className="w-1 h-1 rounded-full bg-slate-200" />
                           <span className="text-[10px] font-medium text-slate-400">{event.eventCategory}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* SCHEDULE */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700">
                        <CalendarIcon size={12} className="text-indigo-400" /> {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400">
                        <ClockIcon size={12} className="text-slate-300" /> {event.startTime?.slice(0,5)}
                      </div>
                    </div>
                    
                    {/* STATUS */}
                    <div>
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${getStatusStyles(event.status)}`}>
                        {event.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    {/* ACTIONS */}
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedEvent(event)} 
                        className="p-2.5 bg-white border border-slate-100 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm active:scale-95"
                        title="View Submission"
                      >
                        <EyeIcon size={16} />
                      </button>
                      {(event.status === 'REVERTED' || event.status === 'PENDING') && (
                        <button className="p-2.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95">
                          <Edit3Icon size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* MOBILE CARDS VIEW */}
          <div className="md:hidden p-4 space-y-4">
            {filteredEvents.map((event) => (
              <div 
                key={event.id} 
                className="bg-white p-5 rounded-[2rem] border border-slate-100 modern-shadow-sm active:scale-[0.98] transition-transform" 
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex gap-4">
                  <div className="w-20 h-24 rounded-[1.5rem] overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img src={event.posterUrl} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                       <h3 className="font-bold text-slate-800 text-sm truncate">{event.title}</h3>
                       <div className="flex items-center gap-2 mt-2">
                          <span className={`inline-block text-[8px] font-black px-2 py-1 rounded-lg border ${getStatusStyles(event.status)}`}>
                            {event.status}
                          </span>
                       </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                       <span className="flex items-center gap-1"><CalendarIcon size={12}/> {event.date}</span>
                       <div className="p-2.5 bg-slate-900 text-white rounded-xl"><EyeIcon size={14}/></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- EVENT MODAL --- */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => setSelectedEvent(null)}
          />
          
          <div className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 overflow-y-auto max-h-[90vh] no-scrollbar">
            
            <div className="sticky top-0 right-0 p-8 flex justify-end z-20">
              <button 
                onClick={() => setSelectedEvent(null)} 
                className="p-3 bg-white border border-slate-100 text-slate-400 rounded-full hover:bg-slate-50 transition-all hover:rotate-90 active:scale-90"
              >
                <XIcon size={20} />
              </button>
            </div>

            <div className="px-8 pb-12">
              <div className="flex flex-col lg:flex-row gap-12">
                {/* POSTER SIDE */}
                <div className="w-full lg:w-[380px] shrink-0">
                  <div className="relative group">
                    <img 
                      src={selectedEvent.posterUrl} 
                      className="w-full rounded-[2.5rem] shadow-2xl border border-slate-100 aspect-[3/4] object-cover hover-lift" 
                      alt={selectedEvent.title} 
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-xl ${getStatusStyles(selectedEvent.status)}`}>
                        {selectedEvent.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CONTENT SIDE */}
                <div className="flex-1">
                  <div className="mb-8">
                    <div className="flex items-center gap-2 text-[10px] font-extrabold text-indigo-500 uppercase tracking-[0.2em] mb-3">
                      <TagIcon size={12} /> {selectedEvent.eventCategory}
                    </div>
                    <h2 className="text-4xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-4">
                      {selectedEvent.title}
                    </h2>
                    <p className="text-slate-500 font-medium leading-relaxed">
                      Detailed event submission overview. Track status changes and reviewer remarks below.
                    </p>
                  </div>

                  {/* INFO GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                    <InfoTile icon={<CalendarIcon size={16}/>} label="Event Date" value={selectedEvent.date} />
                    <InfoTile icon={<ClockIcon size={16}/>} label="Timeline" value={`${selectedEvent.startTime?.slice(0,5)} - ${selectedEvent.endTime?.slice(0,5)}`} />
                    <InfoTile icon={<MapPinIcon size={16}/>} label="Location" value={selectedEvent.venue || "To be decided"} />
                    <InfoTile icon={<ImageIconIcon size={16}/>} label="Category" value={selectedEvent.eventCategory} />
                  </div>

                  {/* REMARKS SECTION */}
                  {selectedEvent.remarks && (
                    <div className="mb-10 p-6 bg-rose-50 border border-rose-100 rounded-[2.5rem]">
                      <div className="flex items-center gap-2 text-rose-600 font-black text-[10px] uppercase tracking-widest mb-3">
                        <AlertCircleIcon size={14} /> Reviewer Remarks
                      </div>
                      <p className="text-sm font-semibold text-rose-900/80 italic bg-white/40 p-4 rounded-2xl border border-rose-100/50">
                        "{selectedEvent.remarks}"
                      </p>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 py-5 bg-slate-900 text-white rounded-[1.5rem] font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-xl shadow-slate-200">
                      <Edit3Icon size={18} /> Edit Submission
                    </button>
                    <button className="px-8 py-5 bg-slate-50 text-slate-600 rounded-[1.5rem] font-bold text-sm hover:bg-slate-100 transition-all active:scale-[0.98]">
                      Duplicate Event
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- SUPPORTING COMPONENTS --- */

const InfoTile = ({ icon, label, value }) => (
  <div className="p-4 rounded-3xl border border-slate-100 flex items-center gap-4 bg-slate-50/50 hover:bg-white transition-colors group">
    <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 text-indigo-500 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-800 truncate">{value}</p>
    </div>
  </div>
);

const Send = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);