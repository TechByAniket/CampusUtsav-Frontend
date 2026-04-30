import { useState, useEffect, useMemo } from 'react';
import { LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';

// Services
import { 
  getAllEventsByClub, 
  getEventDetailsByEventId, 
  fetchEventStatuses 
} from '@/services/eventService';

// Redux
import type { RootState } from '@/store/store';

// Modular Components
import { EventsHeader } from '../../components/events/EventsHeader';
import { EventsStats } from '../../components/events/EventsStats';
import { EventsTable } from '../../components/events/EventsTable';
import { SubmissionModal } from '../../components/events/SubmissionModal';
import { ResubmitModal } from '../../components/events/ResubmitModal';

import type { EventSummary, Event } from '@/types/event';

export const ClubEvents = () => {
  const [eventList, setEventList] = useState<EventSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventSummary | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Filtering Logic
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

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

  const filteredEvents = useMemo(() => {
    return eventList.filter((e: EventSummary) => {
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

        {/* Header Section */}
        <EventsHeader 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreateClick={() => navigate('/club-dashboard/events/create')}
        />

        {/* KPI Summary Section */}
        <EventsStats eventList={eventList} />

        {/* Main Table Section */}
        <EventsTable 
          events={filteredEvents}
          isLoading={isLoading}
          availableStatuses={availableStatuses}
          selectedStatuses={selectedStatuses}
          onStatusToggle={toggleStatus}
          onClearFilters={() => setSelectedStatuses([])}
          onViewStatus={setSelectedEvent}
          onNavigateToEvent={(id) => navigate(`/club-dashboard/events/${id}`)}
        />

        {/* Branding Footer */}
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

      {/* Modals */}
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

      <AnimatePresence>
        {editingEvent && (
          <ResubmitModal 
            event={editingEvent}
            onClose={() => setEditingEvent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};