import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Sparkles, AlertCircle } from 'lucide-react';

import { getAllEventsByCollege } from '@/services/eventService';
import type { EventSummary } from '@/types/event';
import type { RootState } from '@/store/store';
import { EventListCard } from '../../../events/components/EventListCard';
import { EventFilterBar } from '../../../events/components/EventFilterBar';

export const Events = () => {
  const navigate = useNavigate();
  const collegeId = useSelector((state: RootState) => state.auth.collegeId);
  
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activeStatus, setActiveStatus] = useState("ALL");

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
      
      const matchesCategory = activeCategory === "ALL" || e.eventCategory === activeCategory;
      const matchesStatus = activeStatus === "ALL" || e.status === activeStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [events, searchQuery, activeCategory, activeStatus]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-black text-xs uppercase tracking-[0.3em]">Syncing Campus Events...</p>
      </div>
    );
  }

  return (
    <section className="w-full min-h-screen bg-slate-50/50 py-4 px-2 md:px-6 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
              <Sparkles size={12} /> Institutional Roster
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              Events Dashboard
              <span className="text-slate-200 font-light translate-y-1">/</span>
              <span className="text-indigo-600/20">{filteredEvents.length}</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium">Manage and monitor all club-hosted activities across the campus.</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <EventFilterBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
        />

        {/* Grid Content */}
        <AnimatePresence mode="popLayout">
          {filteredEvents.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredEvents.map((event) => (
                <EventListCard 
                  key={event.id} 
                  event={event} 
                  onClick={() => navigate(`${event.id}`)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-32 flex flex-col items-center text-center space-y-4 bg-white rounded-[3rem] border border-slate-200/60 shadow-sm"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                 <AlertCircle size={40} />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-black text-slate-900">No events matched your criteria</p>
                <p className="text-slate-400 text-sm font-medium">Try adjusting your search or filters to see more results.</p>
              </div>
              <button 
                onClick={() => { setSearchQuery(""); setActiveCategory("ALL"); setActiveStatus("ALL"); }}
                className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-colors shadow-xl shadow-indigo-100"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
