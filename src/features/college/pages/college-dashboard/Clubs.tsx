import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, X, ChevronDown, Users, Activity, ExternalLink, 
  UserCircle, Info, Shield
} from 'lucide-react';
import { getAllClubsForPrincipal, updateClubAccountStatus } from '@/services/clubService';
import { fetchAccountStatuses } from '@/services/staffService';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface Club {
  id: number;
  name: string;
  shortForm: string;
  adminName: string;
  managedBy: string;
  status: string;
  logoUrl: string;
}

export const Clubs = () => {
  const [activeTab, setActiveTab] = useState('PENDING');
  const [clubs, setClubs] = useState<Club[]>([]);
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [pendingStatusChanges, setPendingStatusChanges] = useState<Record<number, string>>({});

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const [clubList, statuses] = await Promise.all([
          getAllClubsForPrincipal(),
          fetchAccountStatuses()
        ]);
        setClubs(clubList);
        setAvailableStatuses(statuses);
        
        // If there are clubs, set the active tab to the first one available if PENDING is empty
        const pendingCount = clubList.filter((c: Club) => c.status === 'PENDING').length;
        if (pendingCount === 0 && clubList.length > 0) {
           const firstStatus = statuses.find((s: string) => clubList.some((c: Club) => c.status === s)) || statuses[0];
           if (firstStatus) setActiveTab(firstStatus);
        }
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const handleUpdateStatusDatabase = async (id: number) => {
    const newStatus = pendingStatusChanges[id];
    try {
      await updateClubAccountStatus(id, newStatus);
      setClubs(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      
      if (selectedClub?.id === id) {
          setSelectedClub(prev => prev ? { ...prev, status: newStatus } : null);
      }
      
      setPendingStatusChanges(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      toast.success(`Status updated to ${newStatus}`);
    } catch (err: any) { 
      toast.error(err.message); 
    }
  };

  const filteredData = useMemo(() => {
    return clubs.filter(c =>
      c.status === activeTab &&
      (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       c.shortForm.toLowerCase().includes(searchQuery.toLowerCase()) ||
       c.adminName?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [clubs, activeTab, searchQuery]);

  if (loading) {
     return (
        <section className="mx-auto p-4 min-h-screen w-full bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Loading Clubs...</p>
            </div>
        </section>
     );
  }

  return (
    <div className="w-full font-sans">

        {/* --- HEADER --- */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 uppercase tracking-tight">
              Club Management <span className="text-indigo-600 ml-2 text-lg">({clubs.length})</span>
            </h2>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">CampusUtsav Administration</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
                type="text" 
                placeholder="Search name, short form, or admin..." 
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none w-full md:w-80 font-medium" 
                onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>
        </div>

        {/* --- STATUS TABS --- */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
          {availableStatuses.map((tab) => (
            <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-50'}`}
            >
              {tab} ({clubs.filter(c => c.status === tab).length})
            </button>
          ))}
        </div>

        {/* --- CONTENT AREA --- */}
        {filteredData.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-slate-200 p-20 text-center shadow-sm">
             <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Users size={32} />
             </div>
             <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No clubs found in {activeTab}</p>
          </div>
        ) : (
          <>
            {/* --- MOBILE VIEW --- */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredData.map((c) => (
                <div key={c.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                       <div className="w-12 h-12 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center">
                            {c.logoUrl ? (
                                <img src={c.logoUrl} alt={c.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xs font-black text-slate-400">{c.shortForm}</span>
                            )}
                       </div>
                       <div>
                          <h3 className="font-bold text-slate-800 uppercase text-sm leading-tight">{c.name}</h3>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{c.shortForm}</p>
                       </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                        <UserCircle size={12} className="text-indigo-500" /> Admin: {c.adminName}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                        <Shield size={12} className="text-indigo-500" /> Managed By: {c.managedBy}
                      </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-50 flex flex-col gap-3">
                    <div className="flex gap-2">
                        <Link 
                            to={`/college-dashboard/clubs/${c.id}`} 
                            className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-slate-200 transition-all"
                        >
                            View Club
                        </Link>
                        <button 
                            onClick={() => setSelectedClub(c)} 
                            className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest text-center shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                        >
                            View Details
                        </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* --- DESKTOP VIEW --- */}
            <div className="hidden md:block bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 text-left">
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Club Information</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Admin Name</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Managed By</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100">Account Status</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.map((c) => (
                    <tr key={c.id} className="hover:bg-indigo-50/40 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0 flex items-center justify-center">
                                {c.logoUrl ? (
                                    <img src={c.logoUrl} alt={c.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-[10px] font-black text-slate-400">{c.shortForm}</span>
                                )}
                            </div>
                            <div>
                                 <div className="font-bold text-slate-800 uppercase text-sm leading-tight">{c.name}</div>
                                 <div className="text-[12px] text-slate-400 font-mono font-bold mt-0.5">{c.shortForm}</div>
                            </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                          <div className="text-[12px] font-bold text-slate-700 uppercase">{c.adminName}</div>
                      </td>

                      <td className="px-6 py-4">
                          <div className="text-[12px] font-bold text-slate-500 uppercase">{c.managedBy}</div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <div className="relative">
                            <select 
                                className="appearance-none bg-orange-50 border border-orange-100 rounded-xl pl-3 pr-8 py-2 text-[11px] font-black text-orange-700 cursor-pointer outline-none transition-all focus:ring-2 focus:ring-orange-200" 
                                value={pendingStatusChanges[c.id] || c.status} 
                                onChange={(e) => setPendingStatusChanges({ ...pendingStatusChanges, [c.id]: e.target.value })}
                            >
                              {availableStatuses.map(st => <option key={st} value={st}>{st}</option>)}
                            </select>
                            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
                          </div>
                          {pendingStatusChanges[c.id] && pendingStatusChanges[c.id] !== c.status && (
                            <button 
                                onClick={() => handleUpdateStatusDatabase(c.id)} 
                                className="bg-orange-600 text-white text-[10px] font-black px-3 py-2 rounded-xl animate-pulse shadow-md hover:bg-orange-700 transition-all"
                            >
                                UPDATE
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                              <Link 
                                to={`/college-dashboard/clubs/${c.id}`} 
                                className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all active:scale-95"
                              >
                                View Club
                              </Link>
                          </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

      {/* --- ENHANCED MODAL (Mobile Only) --- */}
      {selectedClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="w-full max-w-xl bg-white rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-y-auto max-h-[90vh] no-scrollbar">
            <button onClick={() => setSelectedClub(null)} className="absolute top-8 right-8 p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 transition-colors"><X size={20} /></button>

            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-5 border border-slate-100 shadow-inner overflow-hidden">
                {selectedClub.logoUrl ? (
                    <img src={selectedClub.logoUrl} alt={selectedClub.name} className="w-full h-full object-cover" />
                ) : (
                    <Users size={40} className="text-slate-300" />
                )}
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none px-4">{selectedClub.name}</h2>
              <div className="flex items-center justify-center gap-2 mt-3">
                 <span className="text-indigo-600 font-bold text-[11px] uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">{selectedClub.shortForm}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
               <InfoTile icon={<Info size={16}/>} label="Club ID" value={`#${selectedClub.id}`} />
               <InfoTile icon={<UserCircle size={16}/>} label="Club Admin" value={selectedClub.adminName} />
               <InfoTile icon={<Shield size={16}/>} label="Managed By" value={selectedClub.managedBy} />
               
               <InfoTile 
                  icon={<Activity size={16}/>} 
                  label="Account Status" 
                  action={
                    <div className="flex items-center gap-2 mt-2">
                        <div className="relative flex-1">
                            <select 
                                className="appearance-none w-full bg-orange-50 border border-orange-100 rounded-xl pl-3 pr-8 py-2 text-[11px] font-black text-orange-700 outline-none"
                                value={pendingStatusChanges[selectedClub.id] || selectedClub.status}
                                onChange={(e) => setPendingStatusChanges({ ...pendingStatusChanges, [selectedClub.id]: e.target.value })}
                            >
                                {availableStatuses.map(st => <option key={st} value={st}>{st}</option>)}
                            </select>
                            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
                        </div>
                        {pendingStatusChanges[selectedClub.id] && pendingStatusChanges[selectedClub.id] !== selectedClub.status && (
                            <button onClick={() => handleUpdateStatusDatabase(selectedClub.id)} className="bg-orange-600 text-white text-[9px] font-black px-3 py-2 rounded-xl shadow-md">UPDATE</button>
                        )}
                    </div>
                  }
                  value={selectedClub.status} 
               />
            </div>
            
            <div className="flex flex-col gap-3">
                <Link 
                    to={`/college-dashboard/clubs/${selectedClub.id}`} 
                    className="flex items-center justify-center py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
                >
                    <ExternalLink size={16} /> View Full Dashboard
                </Link>
                <button 
                   onClick={() => setSelectedClub(null)}
                   className="flex items-center justify-center py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl font-black text-[11px] uppercase tracking-widest gap-2 hover:bg-slate-50 transition-all"
                >
                    Close
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface InfoTileProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  action?: React.ReactNode;
}

const InfoTile = ({ icon, label, value, action }: InfoTileProps) => (
  <div className="p-4 rounded-3xl border flex items-start gap-4 bg-slate-50 border-slate-100/80 transition-hover hover:border-indigo-100">
    <div className="mt-1 text-indigo-500 bg-white p-2 rounded-xl shadow-sm border border-slate-100">{icon}</div>
    <div className="min-w-0 flex-1">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">{label}</p>
      <p className="text-[13px] font-bold truncate leading-tight text-slate-800">{value}</p>
      {action && action}
    </div>
  </div>
);
