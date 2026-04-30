import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Sparkles, AlertCircle, Info } from 'lucide-react';

import { getAllEventsByCollege } from '@/services/eventService';
import type { EventSummary } from '@/types/event';
import type { RootState } from '@/store/store';
import { EventListCard } from '@/features/events/components/EventListCard';
import { EventFilterBar } from '@/features/events/components/EventFilterBar';

export const ExploreEventsPage = () => {
  const navigate = useNavigate();
  const collegeId = useSelector((state: RootState) => state.auth.collegeId);
  
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedClubs, setSelectedClubs] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!collegeId) return;
      setLoading(true);
      try {
        const data = await getAllEventsByCollege(collegeId);
        setEvents(data || []);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [collegeId]);

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           e.clubNameShortForm.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           e.venue.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(e.eventCategory);
      const matchesClub = selectedClubs.length === 0 || selectedClubs.includes(e.clubNameShortForm);
      const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(e.status);

      return matchesSearch && matchesCategory && matchesClub && matchesStatus;
    });
  }, [events, searchQuery, selectedCategories, selectedClubs, selectedStatus]);

  if (!collegeId) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 px-4 text-center bg-white font-sans">
        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-200 shadow-sm shadow-slate-100">
           <Info size={40} />
        </div>
        <div className="space-y-3">
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Access Restricted</h2>
           <p className="text-slate-400 font-medium max-w-sm mx-auto text-sm leading-relaxed uppercase tracking-[0.1em]">
             There are no public events available at this time. <br />
             <span className="text-indigo-600 font-bold">Please log in</span> to explore your campus activity.
           </p>
        </div>
        <button 
          onClick={() => navigate('/auth/sign-in')}
          className="px-12 h-14 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
           Log In Here
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 bg-white font-sans">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-xl shadow-indigo-100" />
        <p className="text-slate-400 font-black text-[11px] uppercase tracking-[0.4em]">Propagating intelligence...</p>
      </div>
    );
  }

  return (
    <section className="w-full min-h-screen bg-white py-12 px-4 md:px-10 lg:px-16 font-sans text-slate-900 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Phase */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-slate-50">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-100/50 shadow-sm animate-pulse">
                <Sparkles size={14} /> Campus Event Portal
             </div>
             <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                Explore <br />
                <span className="text-indigo-600/30">Events</span>
             </h1>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
             <p className="text-[11px] font-black uppercase tracking-widest leading-none">
               {filteredEvents.length} Events Found
             </p>
          </div>
        </header>

        {/* Global Filter Array */}
        <EventFilterBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategories={selectedCategories}
          onCategoriesChange={setSelectedCategories}
          selectedClubs={selectedClubs}
          onClubsChange={setSelectedClubs}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          collegeId={collegeId}
        />

        {/* Discovery Grid */}
        <AnimatePresence mode="popLayout">
          {filteredEvents.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredEvents.map((event) => (
                <EventListCard 
                  key={event.id} 
                  event={event} 
                  onClick={() => navigate(`events/${event.id}`)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-32 flex flex-col items-center text-center space-y-8 bg-slate-50/10 rounded-[4rem] border border-slate-100"
            >
              <div className="w-24 h-24 bg-white border border-slate-100 rounded-[3rem] flex items-center justify-center text-slate-200 shadow-sm">
                 <AlertCircle size={48} />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">No Events Found</h3>
                <p className="text-slate-400 font-medium max-w-sm mx-auto text-sm uppercase tracking-widest leading-relaxed">No events match your current search or filter criteria. <br />Try adjusting your settings.</p>
              </div>
              <button 
                onClick={() => { 
                  setSearchQuery(""); 
                  setSelectedCategories([]); 
                  setSelectedClubs([]); 
                  setSelectedStatus([]); 
                }}
                className="px-10 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-xl shadow-slate-100"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Footer Summary */}
        <footer className="pt-32 pb-16 flex flex-col items-center justify-center space-y-6">
           <div className="text-center space-y-2">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Campus Utsav Event Management System</p>
              <div className="flex items-center justify-center gap-3">
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">© 2026 Campus Utsav Team</span>
                 <span className="w-2 h-2 bg-slate-100 rounded-full" />
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Official Institutional Portal</span>
              </div>
           </div>
        </footer>
      </div>
    </section>
  );
};
;