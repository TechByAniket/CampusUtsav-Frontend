import React, { useEffect, useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { getStudentRegistrations } from '@/services/studentService';
import { MyRegistrationsList } from '../components/MyRegistrationsList';

export interface StudentRegistration {
  eventId: number;
  eventTitle: string;
  eventDate: string;
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

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Retrieving Your History...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 px-4 sm:px-6 lg:px-12 py-10 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white p-6 md:p-8 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/50 rounded-full blur-3xl -mr-40 -mt-40" />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
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
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-2">
          <MyRegistrationsList registrations={registrations} onRefresh={fetchRegistrations} />
        </div>
      </div>
    </div>
  );
};

export default MyRegistrationsPage;
