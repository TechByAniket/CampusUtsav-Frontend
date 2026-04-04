import React, { useState, useEffect } from 'react';
import { 
  Search, X, Calendar, Clock, MapPin, 
  CheckCircle2, RotateCcw, Tag, Layers, 
  AlertCircle, Image as ImageIcon, Send, Edit3, Globe, Lock, Phone,
  ArrowRight, Filter, MessageSquare, History
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

import { 
  getAllPendingApprovalsByRole, 
  approveEventByRole, 
  revertEventByRole,
  getRevertedEventsByClub,
  getEventDetailsByEventId 
} from '@/services/eventService';
import { OnePageCreateEventForm } from '@/forms/events/OnePageCreateEventForm';
import { Button } from '@/components/ui/button';

interface Event {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  eventCategory: string;
  eventType: string;
  venue: string;
  remarks: string | null;
  status: string;
  posterUrl: string;
  clubId: number;
  clubNameShortForm: string;
  description?: string;
  fees?: number;
}

export const InboxList = ({ mode = 'COLLEGE' }) => {
  const [eventList, setEventList] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [actionRemark, setActionRemark] = useState(""); 

  useEffect(() => { loadEvents(); }, [mode]);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const data = mode === 'CLUB' ? await getRevertedEventsByClub() : await getAllPendingApprovalsByRole();
      setEventList(data || []);
    } catch (err: any) { toast.error(err.message); }
    finally { setIsLoading(false); }
  };

  const openResubmitForm = async (eventId: number) => {
    try {
      if (!eventId) return toast.error("Invalid Event ID");
      const details = await getEventDetailsByEventId(eventId);
      setSelectedEvent({ ...details, id: eventId });
      setIsResubmitting(true);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleAction = async (id: number, actionType: 'APPROVED' | 'REVERT', remarkContent = "") => {
    try {
      if (actionType === 'APPROVED') {
        await approveEventByRole(id, remarkContent || "Approved");
        toast.success("Event Approved Successfully!");
      } else if (actionType === 'REVERT') {
        if (!remarkContent) return toast.error("Remark is required for Revert.");
        await revertEventByRole(id, remarkContent);
        toast.success("Event Reverted to Club!");
      }
      setEventList(prev => prev.filter(e => e.id !== id));
      setSelectedEvent(null);
      setActionRemark(""); 
    } catch (err: any) { toast.error(err.message); }
  };

  const filteredEvents = eventList.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="w-full min-h-screen bg-slate-50/50 py-4 px-2 md:px-6 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header and Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              {mode === 'CLUB' ? 'Actions Required' : 'Event Approvals'}
              <span className="px-2.5 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-lg border border-orange-100 flex items-center justify-center min-w-[28px]">
                {filteredEvents.length}
              </span>
            </h2>
            <p className="text-xs font-medium text-slate-400">
                {mode === 'CLUB' ? 'Events that need your attention for resubmission' : 'Pending club events awaiting your review'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative group flex-1 md:flex-none">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Find an event..." 
                className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none w-full md:w-72 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all font-medium" 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
            </div>
            <Button variant="outline" size="icon" className="rounded-xl border-slate-200 text-slate-500 hover:text-orange-500 hover:bg-orange-50">
                <Filter size={18} />
            </Button>
          </div>
        </div>

        {/* List Content */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="py-20 text-center space-y-4">
                 <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mx-auto" />
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Inbox...</p>
            </div>
          ) : (
            <>
              <AnimatePresence initial={false}>
                {filteredEvents.map((event, index) => (
                  <motion.div 
                    layout
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white p-4 rounded-3xl border border-slate-200/60 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/5 transition-all cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-5">
                      <div className="relative w-full md:w-24 h-48 md:h-32 shrink-0 overflow-hidden rounded-2xl">
                          <img src={event.posterUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="poster" />
                          <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg shadow-sm">
                             <p className="text-[10px] font-black text-slate-900">{event.clubNameShortForm || "CLUB"}</p>
                          </div>
                      </div>

                      <div className="flex-1 space-y-3">
                         <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-wider rounded border border-orange-100">
                                {event.eventCategory}
                            </span>
                            <span className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-wider rounded border border-slate-100">
                                {event.eventType}
                            </span>
                         </div>

                         <div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-tight group-hover:text-orange-600 transition-colors">
                                {event.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[11px] font-bold text-slate-400">
                                <span className="flex items-center gap-1.5"><Calendar size={12}/> {event.date}</span>
                                <span className="flex items-center gap-1.5"><Clock size={12}/> {event.startTime?.slice(0,5)}</span>
                                <span className="flex items-center gap-1.5"><MapPin size={12}/> {event.venue?.slice(0, 30)}...</span>
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center gap-2 md:pl-6 md:border-l border-slate-100 shrink-0">
                         <Button 
                            variant="secondary" 
                            className="rounded-2xl bg-slate-50 text-slate-900 font-black uppercase text-[10px] tracking-widest hover:bg-orange-500 hover:text-white transition-all px-6 border border-slate-100"
                            onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                         >
                            Review Details <ArrowRight size={14} className="ml-2" />
                         </Button>
                         {mode === 'CLUB' && (
                           <Button 
                              onClick={(e) => { e.stopPropagation(); openResubmitForm(event.id); }} 
                              className="rounded-2xl bg-indigo-600 text-white font-black uppercase text-[10px] tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                            >
                                <Edit3 size={14} />
                            </Button>
                         )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredEvents.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="py-24 text-center space-y-3"
                >
                    <div className="w-16 h-16 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} />
                    </div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">No pending approvals</p>
                    <p className="text-[10px] font-bold text-slate-300">You're all caught up for today!</p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => { setSelectedEvent(null); setIsResubmitting(false); setActionRemark(""); }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => { setSelectedEvent(null); setIsResubmitting(false); setActionRemark(""); }} 
                className="absolute top-5 right-5 p-2 bg-white/80 backdrop-blur-md text-slate-400 rounded-full hover:bg-white hover:text-orange-500 z-50 shadow-sm transition-all"
              >
                <X size={20} />
              </button>

              {isResubmitting ? (
                <div className="w-full overflow-y-auto no-scrollbar p-8">
                    <OnePageCreateEventForm
                        initialData={selectedEvent as any} 
                        isModal={true} 
                        onClose={() => { setSelectedEvent(null); setIsResubmitting(false); loadEvents(); }} 
                    />
                </div>
              ) : (
                <>
                  <div className="w-full md:w-[380px] shrink-0 bg-slate-50 border-r border-slate-100 flex flex-col p-6 overflow-y-auto">
                      <div className="relative group rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 aspect-[3/4.5] mb-6">
                          <img src={selectedEvent.posterUrl} className="w-full h-full object-cover" alt="Event" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-bottom justify-start p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-[10px] font-black text-white uppercase tracking-widest mt-auto">Poster Preview</p>
                          </div>
                      </div>

                      <div className="mt-auto space-y-4">
                          <div className="p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><History size={10}/> Club Status</p>
                              <div className="flex items-center justify-between">
                                 <p className="text-xs font-black text-slate-900 uppercase">{selectedEvent.clubNameShortForm || "PRIVATE CLUB"}</p>
                                 <span className="bg-orange-50 text-orange-600 border border-orange-100 text-[10px] py-1 px-3 font-black uppercase tracking-widest rounded-full">OWNER</span>
                              </div>
                          </div>
                          <div className="p-4 bg-orange-600 rounded-2xl shadow-xl shadow-orange-100 text-white group cursor-pointer hover:bg-orange-700 transition-colors">
                              <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">Verify Event ID</p>
                              <p className="text-sm font-black uppercase tracking-tight">#{selectedEvent.id.toString().padStart(6, '0')}</p>
                          </div>
                      </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col p-8 overflow-y-auto no-scrollbar">
                    <div className="space-y-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100">{selectedEvent.eventCategory}</span>
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100">{selectedEvent.eventType}</span>
                      </div>
                      
                      <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight leading-none mb-4">{selectedEvent.title}</h2>
                      
                      {selectedEvent.remarks && (
                        <div className="p-5 bg-orange-50/50 border-l-4 border-orange-400 rounded-r-2xl text-[11px] font-bold text-slate-700 flex gap-4">
                            <AlertCircle size={18} className="shrink-0 text-orange-500" />
                            <div>
                                <p className="text-[9px] font-black uppercase text-orange-600 mb-1 tracking-widest">Review History</p>
                                "{selectedEvent.remarks}"
                            </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                              <label className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-1.5"><Calendar size={12}/> Date</label>
                              <div className="text-xs font-black text-slate-800 uppercase">{selectedEvent.date}</div>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                              <label className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-1.5"><Clock size={12}/> Timing</label>
                              <div className="text-xs font-black text-slate-800 uppercase">{selectedEvent.startTime?.slice(0,5)} - {selectedEvent.endTime?.slice(0,5)}</div>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 overflow-hidden">
                              <label className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-1.5"><MapPin size={12}/> Venue</label>
                              <div className="text-xs font-black text-slate-800 uppercase truncate">{selectedEvent.venue}</div>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                              <label className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-1.5"><Tag size={12}/> Entry Fee</label>
                              <div className="text-xs font-black text-slate-800 uppercase">₹{selectedEvent.fees}</div>
                          </div>
                      </div>

                      <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5"><MessageSquare size={12}/> Full Description</label>
                           <p className="text-xs font-medium text-slate-500 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100">{selectedEvent.description}</p>
                      </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-slate-100">
                      {mode === 'CLUB' ? (
                        <Button 
                            onClick={() => openResubmitForm(selectedEvent.id)} 
                            className="w-full py-7 bg-orange-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 animate-pulse"
                        >
                            <Edit3 size={18} /> Edit & Resubmit Proposal
                        </Button>
                      ) : (
                        <div className="space-y-6">
                          <div className="space-y-2">
                               <label className="text-[9px] font-black uppercase text-slate-400 ml-2 tracking-widest">Review Remarks</label>
                               <div className="relative group">
                                    <MessageSquare className="absolute left-4 top-4 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                                    <textarea 
                                        rows={2}
                                        value={actionRemark}
                                        onChange={(e) => setActionRemark(e.target.value)}
                                        placeholder="Add notes for the club admin..." 
                                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold uppercase outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all text-slate-900"
                                    />
                               </div>
                          </div>
                          <div className="flex flex-col md:flex-row gap-4">
                            <Button 
                               variant="outline"
                               onClick={() => handleAction(selectedEvent.id, 'REVERT', actionRemark)} 
                               className="flex-1 py-7 bg-white border-2 border-orange-500 text-orange-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
                            >
                                <RotateCcw size={16} /> Revert to Club
                            </Button>
                            <Button 
                              onClick={() => handleAction(selectedEvent.id, 'APPROVED', actionRemark)} 
                              className="flex-[2] py-7 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                            >
                                Approve Event Listing <CheckCircle2 size={16}/>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};