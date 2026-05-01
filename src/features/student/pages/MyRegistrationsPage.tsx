import React, { useEffect, useState, useMemo } from 'react';
import { Loader2, Sparkles, Filter, Check, X, ChevronDown, Users, User, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getStudentRegistrations } from '@/services/studentService';
import { MyRegistrationsList } from '../components/MyRegistrationsList';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export interface StudentRegistration {
  eventId: number;
  eventTitle: string;
  eventStartDate: string;
  eventEndDate: string;
  startTime: string;
  endTime: string;
  attendanceActive: boolean;
  venue: string;
  clubName: string;
  clubShortForm: string;
  attendanceMarked: boolean;
  markedAt: string | null;
  registrationType: 'INDIVIDUAL' | 'TEAM';
  teamName: string | null;
}

const MyRegistrationsPage: React.FC = () => {
  const [registrations, setRegistrations] = useState<StudentRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [selectedAttendance, setSelectedAttendance] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const data = await getStudentRegistrations();
      setRegistrations(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const filteredRegistrations = useMemo(() => {
    return registrations.filter(reg => {
      const attendanceMatch = selectedAttendance.length === 0 || 
        (selectedAttendance.includes('present') && reg.attendanceMarked) ||
        (selectedAttendance.includes('absent') && !reg.attendanceMarked);
      
      const typeMatch = selectedType.length === 0 || selectedType.includes(reg.registrationType);
      
      return attendanceMatch && typeMatch;
    });
  }, [registrations, selectedAttendance, selectedType]);

  const toggleFilter = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    if (list.includes(value)) {
      setList(list.filter(v => v !== value));
    } else {
      setList([...list, value]);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Retrieving Your History...</p>
      </div>
    );
  }

  const activeFilterCount = selectedAttendance.length + selectedType.length;

  return (
    <div className="min-h-screen bg-slate-50/50 px-4 sm:px-6 lg:px-12 py-10 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white p-6 md:p-8 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/50 rounded-full blur-3xl -mr-40 -mt-40" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Sparkles className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
                  My <span className="text-indigo-600">Registrations</span>
                </h1>
                <p className="text-slate-400 font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] mt-1">Your Journey Across Campus Events</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
               {/* --- FILTER DROPDOWN --- */}
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={`
                        h-12 px-6 rounded-2xl border-slate-200 font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all
                        ${activeFilterCount > 0 ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-slate-600 hover:bg-slate-50'}
                      `}
                    >
                       <Filter size={14} className={activeFilterCount > 0 ? 'text-white' : 'text-slate-400'} />
                       <span>Filters</span>
                       {activeFilterCount > 0 && (
                         <span className="w-5 h-5 bg-white text-indigo-600 rounded-full flex items-center justify-center text-[9px] font-black">
                            {activeFilterCount}
                         </span>
                       )}
                       <ChevronDown size={14} className={activeFilterCount > 0 ? 'text-white/60' : 'text-slate-300'} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 rounded-3xl p-2 shadow-2xl border-slate-100 font-jakarta">
                    <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-3 py-2">Attendance Status</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem
                      checked={selectedAttendance.includes('present')}
                      onCheckedChange={() => toggleFilter(selectedAttendance, setSelectedAttendance, 'present')}
                      className="rounded-xl text-[11px] font-bold text-slate-700 uppercase tracking-tight py-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500" /> Present
                      </div>
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={selectedAttendance.includes('absent')}
                      onCheckedChange={() => toggleFilter(selectedAttendance, setSelectedAttendance, 'absent')}
                      className="rounded-xl text-[11px] font-bold text-slate-700 uppercase tracking-tight py-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <XCircle size={14} className="text-rose-500" /> Absent
                      </div>
                    </DropdownMenuCheckboxItem>
                    
                    <DropdownMenuSeparator className="my-2 bg-slate-50" />
                    
                    <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-3 py-2">Registration Type</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem
                      checked={selectedType.includes('INDIVIDUAL')}
                      onCheckedChange={() => toggleFilter(selectedType, setSelectedType, 'INDIVIDUAL')}
                      className="rounded-xl text-[11px] font-bold text-slate-700 uppercase tracking-tight py-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-sky-500" /> Individual
                      </div>
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={selectedType.includes('TEAM')}
                      onCheckedChange={() => toggleFilter(selectedType, setSelectedType, 'TEAM')}
                      className="rounded-xl text-[11px] font-bold text-slate-700 uppercase tracking-tight py-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-indigo-500" /> Team
                      </div>
                    </DropdownMenuCheckboxItem>

                    {activeFilterCount > 0 && (
                      <>
                        <DropdownMenuSeparator className="my-2 bg-slate-50" />
                        <button 
                          onClick={() => { setSelectedAttendance([]); setSelectedType([]); }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 text-[9px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          <X size={12} /> Clear All
                        </button>
                      </>
                    )}
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-2">
          {filteredRegistrations.length > 0 ? (
            <MyRegistrationsList registrations={filteredRegistrations} onRefresh={fetchRegistrations} />
          ) : (
            <div className="bg-white py-20 rounded-[3rem] border border-slate-200 border-dashed flex flex-col items-center justify-center text-center">
               <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-4">
                  <Filter size={32} />
               </div>
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">No matching events</h3>
               <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">Try adjusting your filters to find what you're looking for</p>
               <button 
                  onClick={() => { setSelectedAttendance([]); setSelectedType([]); }}
                  className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
               >
                  Clear all filters
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRegistrationsPage;
