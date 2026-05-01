import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { 
  Info, Clock, 
  CreditCard, Users2, 
  UserCircle2, LayoutDashboard,
  ChevronLeft
} from 'lucide-react'

import type { AdminEventDetail } from '@/types/event'
import { getEventDetailsByEventId } from '@/services/eventService'
import { Button } from '@/components/ui/button'
import type { RootState } from '@/store/store'

// Components
import { 
  BentoHeroPoster, BentoHeroDetail 
} from '../components/BentoComponents'
import { EventDetailCriteria } from '../components/EventDetailCriteria'
import { EventDetailAttachments } from '../components/EventDetailAttachments'
import { EventDetailOrganizer } from '../components/EventDetailOrganizer'

export const PublicEventDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [event, setEvent] = useState<AdminEventDetail | null>(null)
  const [loading, setLoading] = useState(true)

  const student = useSelector((state: RootState) => state.auth.studentSummary)

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!id) return
      setLoading(true)
      try {
        const data = await getEventDetailsByEventId(Number(id))
        setEvent(data)
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false)
      }
    }

    fetchEventDetails()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 bg-white font-sans">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-xl shadow-indigo-100" />
        <p className="text-slate-400 font-black text-[11px] uppercase tracking-[0.4em]">Loading...</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 px-4 text-center bg-white font-sans">
        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center text-slate-200 shadow-sm">
           <Info size={40} />
        </div>
        <div className="space-y-2">
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Event Not Found</h2>
           <p className="text-slate-400 font-medium max-w-sm mx-auto text-sm leading-relaxed uppercase tracking-[0.1em]">The requested event could not be found or is no longer available.</p>
        </div>
        <Button onClick={() => navigate(-1)} variant="outline" className="rounded-2xl px-12 h-14 font-black uppercase text-xs tracking-widest border-slate-200 text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
           Go Back
        </Button>
      </div>
    )
  }

  // Eligibility Logic
  const checkEligibility = () => {
    if (!student) return { eligible: true }; // Allow opening modal (form handles login check)
    
    // Map numeric year to string label (1 -> FY, 2 -> SY, etc.)
    const yearMapping: Record<string, string> = {
      "1": "FY",
      "2": "SY",
      "3": "TY",
      "4": "FINAL"
    };
    
    const studentYearLabel = yearMapping[String(student.year)] || String(student.year);
    
    const allowedBranches = Object.values(event.allowedBranches || {});
    const allowedYears = Object.values(event.allowedYears || {});
    
    const branchEligible = allowedBranches.length === 0 || allowedBranches.includes(student.branch);
    const yearEligible = allowedYears.length === 0 || allowedYears.includes(studentYearLabel);
    
    if (!branchEligible) return { eligible: false, reason: `Limited to ${allowedBranches.join(', ')} students.` };
    if (!yearEligible) return { eligible: false, reason: `Limited to ${allowedYears.join(', ')} only.` };
    
    return { eligible: true };
  };

  const { eligible, reason } = checkEligibility();

  const coreStats = [
    { label: "Entry", value: event.fees === 0 ? "FREE" : `₹${event.fees}`, icon: CreditCard, color: "emerald" },
    { label: "Participation", value: `${event.maxParticipants} slots`, icon: Users2, color: "indigo" },
    { label: "Type", value: event.teamEvent ? (event.minTeamSize === event.maxTeamSize ? `TEAM (${event.minTeamSize})` : `TEAM (${event.minTeamSize}-${event.maxTeamSize})`) : "Individual", icon: UserCircle2, color: "amber" },
    { label: "Time", value: `${event.startTime?.slice(0, 5)} - ${event.endTime?.slice(0, 5)}`, icon: Clock, color: "rose" }
  ];

  return (
    <div className="w-full min-h-screen bg-white pt-0 pb-10 px-4 md:px-10 lg:px-16 font-sans text-slate-900 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900 -mt-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation Phase (Floating) */}
        <div className="relative z-[100]">
              <button 
                onClick={() => navigate(-1)}
                className="absolute -top-6 left-0 group flex items-center gap-3 text-slate-500 hover:text-indigo-600 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center group-hover:border-indigo-200 group-hover:bg-indigo-100 transition-all shadow-sm">
                   <ChevronLeft size={18} className="text-indigo-600" />
                </div>
                <div className="flex flex-col items-start opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                   <p className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">Return to Explorer</p>
                </div>
              </button>
        </div>

        {/* --- MAIN HERO PHASE --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-2">
           {/* Visual Identity */}
           <div className="lg:col-span-4 h-full">
              <BentoHeroPoster 
                url={event.posterUrl} 
                title={event.title}
              />
           </div>

           {/* Primary Identity & Internal Intel Summary */}
           <div className="lg:col-span-8 flex flex-col h-full">
              <BentoHeroDetail 
                title={event.title}
                status={event.status}
                category={event.eventCategory}
                venue={event.venue}
                stats={coreStats}
                startDate={event.startDate}
                endDate={event.endDate}
                deadline={event.registrationDeadline}
                eventId={event.id}
                minTeamSize={event.minTeamSize}
                maxTeamSize={event.maxTeamSize}
                isTeamEvent={event.teamEvent}
                isEligible={eligible}
                ineligibilityReason={reason}
                allowedBranches={event.allowedBranches}
                allowedYears={event.allowedYears}
              />
           </div>
        </div>

        {/* --- ROW 4: DETAILED OPERATIONAL MODULES --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-2">
           
           {/* Detailed Information (Left Column) */}
           <div className="lg:col-span-8 space-y-6">
              {/* Mission Briefing / Description */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden"
              >
                 <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/10">
                    <div className="flex items-center gap-4">
                       <div className="w-1.5 h-8 bg-indigo-600 rounded-full shadow-lg shadow-indigo-100" />
                       <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">Event Description</h3>
                    </div>
                    <LayoutDashboard size={22} className="text-slate-400" />
                 </div>
                 <div className="p-6 lg:p-8">
                    <p className="text-slate-600 font-medium leading-[1.85] whitespace-pre-line text-lg tracking-tight">
                       {event.description}
                    </p>
                 </div>
              </motion.div>

              {/* Support & Coordination (Now on Left) */}
              <EventDetailOrganizer 
                club={event.club}
                contactDetails={event.contactDetails}
              />
           </div>

           {/* Sidebar: Logistics & Authority (Right Column) */}
           <div className="lg:col-span-4 space-y-6">
              {/* Eligibility Matrix */}
              <EventDetailCriteria 
                allowedBranches={event.allowedBranches}
                allowedYears={event.allowedYears}
                isBento={false}
              />

              {/* Asset Management (Resources - Now on Right Sidebar) */}
              <EventDetailAttachments 
                 publicAttachments={event.publicAttachments}
                 privateAttachments={event.privateAttachments}
                 isBento={false}
              />
           </div>
        </div>

        {/* Global Branding Footer */}
        <div className="pt-28 pb-16 flex flex-col items-center justify-center space-y-6">
           <div className="w-14 h-14 rounded-3xl bg-white border border-slate-200 flex items-center justify-center text-slate-300 shadow-xl shadow-slate-100/50">
              <Info size={24} />
           </div>
           <div className="text-center space-y-2">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Campus Utsav Event Platform</p>
              <div className="flex items-center justify-center gap-3">
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">© 2026 Campus Utsav Team</span>
                 <span className="w-2 h-2 bg-slate-100 rounded-full" />
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Official Event Platform</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
