import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  ChevronLeft, Play, Square, RefreshCw,
  QrCode, Users, Clock, ShieldCheck,
  AlertCircle,
  XCircle,
  Loader2,
  Calendar,
  MapPin,
  Sparkles
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

import { Button } from '@/components/ui/button';
import type { RootState } from '@/store/store';
import {
  getEventAttendance,
  getAttendanceToken,
  startAttendance,
  stopAttendance,
  getEventAttendanceStatus
} from '@/services/eventAttendanceService';
import { getEventDetailsByEventId } from '@/services/eventService';
import { getAllBranchesOfCollege } from '@/services/collegeService';
import type { AdminEventDetail } from '@/types/event';
import { AttendanceTable, type Attendee } from '../components/AttendanceTable';

export const AttendancePage: React.FC = () => {
  const { id } = useParams<{ id: string }>() as { id: string };
  const navigate = useNavigate();
  const role = useSelector((state: RootState) => state.auth.role);

  const [attendanceActive, setAttendanceActive] = useState(false);
  const [sessionTimes, setSessionTimes] = useState<{ start: string | null; end: string | null }>({ start: null, end: null });
  const [token, setToken] = useState<string | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [event, setEvent] = useState<AdminEventDetail | null>(null);
  const [branches, setBranches] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingToken, setFetchingToken] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showQrModal, setShowQrModal] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const isClubAdmin = role === 'ROLE_CLUB';

  const fetchToken = useCallback(async () => {
    try {
      setFetchingToken(true);
      const response = await getAttendanceToken(id);
      // The API returns { eventId, token, expiresAt } or a plain string
      const tokenString = typeof response === 'string' ? response : response.token;
      setToken(tokenString);
      setTimeLeft(30);
    } catch (error: any) {
      console.error("Token fetch failed", error);
    } finally {
      setFetchingToken(false);
    }
  }, [id]);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      // First fetch essential event data and attendance list
      const [attData, eventData] = await Promise.all([
        getEventAttendance(id),
        getEventDetailsByEventId(id)
      ]);
      setAttendees(attData.attendees || []);
      setEvent(eventData);

      // Then attempt to fetch status, but don't let it crash the page if it fails
      try {
        const statusData = await getEventAttendanceStatus(id);
        setAttendanceActive(statusData.active);
        setSessionTimes({ start: statusData.startTime, end: statusData.endTime });
        setErrorNotice(null);
      } catch (statusError: any) {
        console.warn("Status fetch failed:", statusError.message);
        setAttendanceActive(false);
        setErrorNotice(statusError.message);
      }

      // Fetch branches for filters
      try {
        const branchesData = await getAllBranchesOfCollege(eventData.collegeId);
        if (typeof branchesData === 'object' && !Array.isArray(branchesData)) {
          setBranches(Object.values(branchesData));
        } else {
          setBranches(branchesData);
        }
      } catch (branchError) {
        console.error("Failed to fetch branches", branchError);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch critical data");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timer: NodeJS.Timeout;

    if (attendanceActive) {
      fetchToken();
      interval = setInterval(fetchToken, 30000);

      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 30));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timer) clearInterval(timer);
    };
  }, [attendanceActive, fetchToken]);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  const handleStart = async () => {
    try {
      await startAttendance(id);
      setAttendanceActive(true);
      setShowQrModal(true);
      fetchData(true); // Refresh status to get times
      toast.success("Attendance session started");
    } catch (error: any) {
      toast.error(error.message || "Failed to start attendance");
    }
  };

  const handleStop = async () => {
    try {
      await stopAttendance(id);
      setAttendanceActive(false);
      setToken(null);
      setShowQrModal(false);
      fetchData(true); // Refresh status
      toast.success("Attendance session stopped");
    } catch (error: any) {
      toast.error(error.message || "Failed to stop attendance");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Synchronizing Intelligence...</p>
      </div>
    );
  }

  if (!event) return null;

  return (
    <section className="w-full min-h-screen bg-slate-50/30 pt-0 pb-10 px-4 md:px-10 lg:px-16 font-sans text-slate-900 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900 -mt-6">
      <div className="max-w-[1550px] mx-auto space-y-12 relative">

        {/* Navigation & Informative Header (Floating) */}
        <div className="relative z-[100]">
          <button
            onClick={() => navigate(-1)}
            className="absolute -top-6 left-0 group flex items-center gap-3 text-slate-500 hover:text-indigo-600 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center group-hover:border-indigo-200 group-hover:bg-indigo-100 transition-all shadow-sm">
              <ChevronLeft size={18} className="text-indigo-600" />
            </div>
            <div className="flex flex-col items-start opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
              <p className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">Return to Console</p>
            </div>
          </button>
        </div>

        {/* Informative Header Card */}
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
          {/* Background Decorative Element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-32 -mt-32" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10 pt-4">
            <div className="flex flex-col md:flex-row md:items-center gap-6 min-w-0 flex-1">
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-4xl font-black text-slate-900 uppercase tracking-tight truncate">
                    {event.title} <span className="text-indigo-600 ml-2">Attendance</span>
                  </h1>
                  <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${attendanceActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}>
                    {attendanceActive ? 'LIVE SESSION' : 'INACTIVE'}
                  </div>
                </div>

                {/* Event Quick Details Bar */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-4">
                  <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 border border-slate-100 rounded-full shadow-sm">
                    <Calendar size={13} className="text-indigo-500" />
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 border border-slate-100 rounded-full shadow-sm">
                    <Clock size={13} className="text-indigo-500" />
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{event.startTime?.slice(0, 5)} - {event.endTime?.slice(0, 5)}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 border border-slate-100 rounded-full shadow-sm">
                    <MapPin size={13} className="text-indigo-500" />
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight truncate max-w-[250px]">{event.venue}</span>
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-slate-50">
                  {errorNotice && (
                    <div className="w-full flex items-center gap-3 px-5 py-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 mb-2">
                      <AlertCircle size={18} />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Administrative Notice</span>
                        <span className="text-xs font-bold">{errorNotice}</span>
                      </div>
                    </div>
                  )}

                  {!attendanceActive ? (
                    <Button
                      onClick={handleStart}
                      disabled={!isClubAdmin}
                      className="h-12 px-8 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-[10px] uppercase tracking-widest gap-2.5 shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Play size={14} fill="currentColor" /> Start Attendance
                    </Button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={handleStop}
                        disabled={!isClubAdmin}
                        variant="outline"
                        className="h-12 px-8 rounded-xl border-rose-200 bg-white hover:bg-rose-50 hover:border-rose-300 text-rose-600 font-black text-[10px] uppercase tracking-widest gap-2.5 shadow-sm transition-all active:scale-95"
                      >
                        <Square size={14} fill="currentColor" /> Stop Attendance
                      </Button>
                      <Button
                        onClick={() => setShowQrModal(true)}
                        className="h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest gap-2.5 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                      >
                        <QrCode size={14} /> Display QR
                      </Button>
                      <div className="hidden sm:flex items-center gap-3 px-4 h-12 bg-slate-50 border border-slate-100 rounded-xl">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Rotate</span>
                          <span className="text-[11px] font-black text-slate-900 tabular-nums">{timeLeft}s</span>
                        </div>
                        <div className="w-10 h-1 bg-slate-200 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-indigo-500"
                            animate={{ width: `${(timeLeft / 30) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => fetchData(true)}
                    disabled={loading}
                    variant="outline"
                    className="h-12 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-[10px] font-black uppercase tracking-widest gap-2.5 px-6 shadow-sm"
                  >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync
                  </Button>
                </div>
              </div>
            </div>

            {/* Event Poster (Desktop Only) */}
            <div className="hidden lg:block shrink-0">
              <div className="w-48 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-xl rotate-2 hover:rotate-0 transition-transform duration-500 group">
                <img
                  src={event.posterUrl}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Interface */}
        <div className="pt-2">
          <AttendanceTable 
            attendees={attendees} 
            loading={loading} 
            availableBranches={branches}
          />
        </div>
      </div>

      {/* --- QR CODE MODAL --- */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQrModal(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-indigo-600 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />

              <button
                onClick={() => setShowQrModal(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-all z-20"
              >
                <XCircle size={18} />
              </button>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-6">
                   <span className="text-[10px] font-black text-sky-300 uppercase tracking-[0.4em]">Smart Attendance</span>
                </div>
                
                <h3 className="text-xl font-black text-amber-200 tracking-tight uppercase mb-1 line-clamp-1">{event.title}</h3>
                <div className="flex items-center gap-2 text-white font-black uppercase tracking-widest mb-6 px-4 py-1.5 bg-white/10 rounded-full border border-white/10 backdrop-blur-sm">
                   <Clock size={14} className="text-sky-300" />
                   <span className="text-sm tabular-nums">
                     {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                   </span>
                </div>
                <p className="text-indigo-100 text-[9px] font-bold uppercase tracking-[0.3em] mb-6 px-4">Scan & Mark Attendance</p>

                <div className="bg-white p-5 rounded-3xl shadow-2xl mb-6 relative">
                  {fetchingToken && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-3xl">
                      <RefreshCw size={24} className="text-indigo-600 animate-spin" />
                    </div>
                  )}
                  {token ? (
                    <div className="space-y-4">
                      <QRCodeSVG value={token} size={180} level="H" includeMargin={true} />
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-6">
                        {sessionTimes.start && (
                          <div className="flex flex-col gap-1">
                             <div className="flex items-center justify-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                <Play size={7} className="text-emerald-500" fill="currentColor" /> Start
                             </div>
                             <p className="text-[10px] font-bold text-slate-600 leading-none">
                               {new Date(sessionTimes.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </p>
                          </div>
                        )}
                        {sessionTimes.end && (
                          <div className="flex flex-col gap-1 border-l border-slate-100 pl-6">
                             <div className="flex items-center justify-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                <Square size={7} className="text-rose-500" fill="currentColor" /> End
                             </div>
                             <p className="text-[10px] font-bold text-slate-600 leading-none">
                               {new Date(sessionTimes.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="w-[180px] h-[180px] bg-slate-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200">
                      <RefreshCw size={24} className="text-slate-300 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="w-full max-w-[240px] space-y-4">
                  <div className="flex items-center justify-between text-white/80 text-[10px] font-black uppercase tracking-widest px-1">
                    <span>Rotate</span>
                    <span className="tabular-nums">{timeLeft}s</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                      initial={{ width: "100%" }}
                      animate={{ width: `${(timeLeft / 30) * 100}%` }}
                      transition={{ duration: 1, ease: "linear" }}
                    />
                  </div>
                  <p className="text-indigo-200 text-[8px] font-bold leading-relaxed uppercase tracking-tight opacity-70 pt-2">
                    Token updates automatically every 30s
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};


