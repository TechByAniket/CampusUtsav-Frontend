import React, { useState, useEffect } from 'react';
import { Phone, Mail, Search, X, Shield, Star, CheckCircle, UserCircle, IdCard, Briefcase, ChevronDown, Users, School, MapPin, Activity } from 'lucide-react';
import { fetchAvailableRoles, fetchAccountStatuses, fetchStaffMembers, updateStaffRole, updateStaffStatus, updateStaffClubAssignment } from '@/services/staffService';
import { getClubsByCollege} from '@/services/clubService'; 
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

export const StaffInfoList = () => {
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [availableRoles, setAvailableRoles] = useState([]);
  const [availableStatuses, setAvailableStatuses] = useState([]);
  const [clubs, setClubs] = useState([]);

  const [pendingRoleChanges, setPendingRoleChanges] = useState({});
  const [pendingStatusChanges, setPendingStatusChanges] = useState({});
  const [pendingClubChanges, setPendingClubChanges] = useState({});

  const collegeId = useSelector((state) => state.auth.collegeId);

  useEffect(() => {
    const getData = async () => {
      try {
        const [staff, roles, statuses, clubList] = await Promise.all([
          fetchStaffMembers(),
          fetchAvailableRoles(),
          fetchAccountStatuses(),
          getClubsByCollege(collegeId)
        ]);
        setFacultyList(staff);
        setAvailableRoles(roles);
        setAvailableStatuses(statuses);
        setClubs(clubList);
      } catch (err: any) {
        toast.error(err.message);
      }
    };
    getData();
  }, []);

  const handleUpdateStatusDatabase = async (id: number | string) => {
    const newStatus = pendingStatusChanges[id];
    try {
      await updateStaffStatus(id, newStatus);
      setFacultyList(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
      if (selectedFaculty?.id === id) setSelectedFaculty(prev => ({ ...prev, status: newStatus }));
      const updated = { ...pendingStatusChanges }; delete updated[id];
      setPendingStatusChanges(updated);
      toast.success("Status Updated!");
    } catch (err: any) { 
      toast.error(err.message); 
    }
  };

  const handleUpdateRoleDatabase = async (id: number | string) => {
    const newRole = pendingRoleChanges[id];
    try {
      await updateStaffRole(id, newRole);
      setFacultyList(prev => prev.map(f => f.id === id ? { ...f, role: newRole, hod: newRole === 'ROLE_HOD' } : f));
      if (selectedFaculty?.id === id) setSelectedFaculty(prev => ({ ...prev, role: newRole, hod: newRole === 'ROLE_HOD' }));
      const updated = { ...pendingRoleChanges }; delete updated[id];
      setPendingRoleChanges(updated);
      toast.success("Role Updated!");
    } catch (err: any) { 
      toast.error(err.message); 
    }
  };

  const handleUpdateClubDatabase = async (id: number | string) => {
    const clubId = pendingClubChanges[id];
    try {
      await updateStaffClubAssignment(id, clubId === "NONE" ? null : clubId);
      const selectedClub = clubs.find(c => c.id === parseInt(clubId));
      
      setFacultyList(prev => prev.map(f => {
        if (f.id === id) {
          return { 
            ...f, 
            clubCoordinator: clubId !== "NONE",
            managedClubDetails: clubId === "NONE" ? null : selectedClub 
          };
        }
        return f;
      }));

      if (selectedFaculty?.id === id) {
        setSelectedFaculty(prev => ({
          ...prev,
          clubCoordinator: clubId !== "NONE",
          managedClubDetails: clubId === "NONE" ? null : selectedClub 
        }));
      }

      const updated = { ...pendingClubChanges }; delete updated[id];
      setPendingClubChanges(updated);
      toast.success("Club Assignment Updated!");
    } catch (err: any) { 
      toast.error(err.message); 
    }
  };

  const filteredData = facultyList.filter(f =>
    f.status === activeTab &&
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full font-sans">

        {/* --- HEADER --- */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 uppercase tracking-tight">
              Faculty Management <span className="text-indigo-600 ml-2 text-lg">({filteredData.length})</span>
            </h2>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">CampusUtsav Administration</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search faculty..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none w-full md:w-64 font-medium" onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>

        {/* --- STATUS TABS --- */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
          {availableStatuses.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-50'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* --- MOBILE VIEW --- */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredData.map((f) => (
            <div key={f.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm" onClick={() => setSelectedFaculty(f)}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-slate-800 uppercase text-sm">{f.name}</h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{f.employeeId}</p>
                </div>
                {f.hod && <span className="bg-amber-100 text-amber-700 text-[8px] font-black px-2 py-0.5 rounded border border-amber-200 uppercase">HOD</span>}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                 <Briefcase size={12} className="text-indigo-500" /> {f.branchShortForm} • {f.designation.replace('_', ' ')}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                <span className="text-[9px] font-black text-indigo-600 uppercase">Tap for Quick Actions</span>
                <ChevronDown size={14} className="text-slate-300 -rotate-90" />
              </div>
            </div>
          ))}
        </div>

        {/* --- DESKTOP VIEW --- */}
        <div className="hidden md:block bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100 text-left">Faculty Info</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100 text-left">Club Coordinator</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100 text-left">Account Status</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100 text-left">Role Management</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((f) => {
                const currentClubId = f.managedClubDetails?.id || "NONE";
                return (
                  <tr key={f.id} className="hover:bg-indigo-50/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                          <div className="font-bold text-slate-800 uppercase text-sm">{f.name}</div>
                          {f.hod && <span className="bg-amber-100 text-amber-700 text-[9px] font-black px-2 py-0.5 rounded border border-amber-200 uppercase tracking-tighter">HOD</span>}
                      </div>
                      <div className="text-[12px] text-slate-400 font-mono font-bold leading-none mt-1">ID: {f.employeeId}</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                          <div className="relative">
                              <select 
                                  className={`appearance-none border rounded-xl pl-3 pr-8 py-2 text-[11px] font-black cursor-pointer outline-none transition-all ${currentClubId !== "NONE" || pendingClubChanges[f.id] ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                                  value={pendingClubChanges[f.id] !== undefined ? pendingClubChanges[f.id] : currentClubId}
                                  onChange={(e) => setPendingClubChanges({ ...pendingClubChanges, [f.id]: e.target.value })}
                              >
                                  <option value="NONE">NOT ASSIGNED</option>
                                  {clubs.map(c => <option key={c.id} value={c.id}>{c.shortForm}</option>)}
                              </select>
                              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                          {pendingClubChanges[f.id] !== undefined && pendingClubChanges[f.id] !== String(currentClubId) && (
                              <button onClick={() => handleUpdateClubDatabase(f.id)} className="bg-emerald-600 text-white text-[10px] font-black px-3 py-2 rounded-xl animate-pulse shadow-md">SAVE</button>
                          )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         <div className="relative">
                          <select className="appearance-none bg-orange-50 border border-orange-100 rounded-xl pl-3 pr-8 py-2 text-[11px] font-black text-orange-700 cursor-pointer outline-none" value={pendingStatusChanges[f.id] || f.status} onChange={(e) => setPendingStatusChanges({ ...pendingStatusChanges, [f.id]: e.target.value })}>
                            {availableStatuses.map(st => <option key={st} value={st}>{st}</option>)}
                          </select>
                          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
                        </div>
                        {pendingStatusChanges[f.id] && pendingStatusChanges[f.id] !== f.status && (
                          <button onClick={() => handleUpdateStatusDatabase(f.id)} className="bg-orange-600 text-white text-[10px] font-black px-3 py-2 rounded-xl animate-pulse">UPDATE</button>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <select className="appearance-none bg-indigo-50 border border-indigo-100 rounded-xl pl-3 pr-8 py-2 text-[11px] font-black text-indigo-700 cursor-pointer outline-none" value={pendingRoleChanges[f.id] || f.role} onChange={(e) => setPendingRoleChanges({ ...pendingRoleChanges, [f.id]: e.target.value })}>
                            {availableRoles.map(role => <option key={role} value={role}>{role.replace('ROLE_', '')}</option>)}
                          </select>
                          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
                        </div>
                        {pendingRoleChanges[f.id] && pendingRoleChanges[f.id] !== f.role && (
                          <button onClick={() => handleUpdateRoleDatabase(f.id)} className="bg-indigo-600 text-white text-[10px] font-black px-3 py-2 rounded-xl animate-pulse">UPDATE</button>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                       <button onClick={() => setSelectedFaculty(f)} className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all active:scale-95">View Details</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* --- ENHANCED MODAL --- */}
      {selectedFaculty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="w-full max-w-xl bg-white rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-y-auto max-h-[90vh] no-scrollbar">
            <button onClick={() => setSelectedFaculty(null)} className="absolute top-8 right-8 p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 transition-colors"><X size={20} /></button>

            <div className="text-center mb-10">
              <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-5 border border-indigo-100 shadow-inner">
                <UserCircle size={56} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none">{selectedFaculty.name}</h2>
              <div className="flex items-center justify-center gap-2 mt-3">
                 <span className="text-indigo-600 font-bold text-[11px] uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">{selectedFaculty.designation.replace('_', ' ')}</span>
                 {selectedFaculty.hod && <span className="bg-amber-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase">HOD</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
               <InfoTile icon={<IdCard size={16}/>} label="Employee ID" value={selectedFaculty.employeeId} />
               
               {/* CLUB ACTION IN MODAL */}
               <InfoTile icon={<Users size={16}/>} label="Managed Club" 
                  action={
                    <div className="flex items-center gap-2 mt-2">
                      <div className="relative flex-1">
                        <select 
                          className="appearance-none w-full bg-emerald-50 border border-emerald-100 rounded-xl pl-3 pr-8 py-2 text-[11px] font-black text-emerald-700 outline-none"
                          value={pendingClubChanges[selectedFaculty.id] !== undefined ? pendingClubChanges[selectedFaculty.id] : (selectedFaculty.managedClubDetails?.id || "NONE")}
                          onChange={(e) => setPendingClubChanges({ ...pendingClubChanges, [selectedFaculty.id]: e.target.value })}
                        >
                          <option value="NONE">NONE</option>
                          {clubs.map(c => <option key={c.id} value={c.id}>{c.shortForm}</option>)}
                        </select>
                        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none" />
                      </div>
                      {pendingClubChanges[selectedFaculty.id] !== undefined && pendingClubChanges[selectedFaculty.id] !== String(selectedFaculty.managedClubDetails?.id || "NONE") && (
                        <button onClick={() => handleUpdateClubDatabase(selectedFaculty.id)} className="bg-emerald-600 text-white text-[9px] font-black px-3 py-2 rounded-xl">SAVE</button>
                      )}
                    </div>
                  }
                  value={selectedFaculty.managedClubDetails?.name || "No Assignment"} 
               />

               <InfoTile icon={<Briefcase size={16}/>} label="Branch / Dept" value={`${selectedFaculty.branchName} (${selectedFaculty.branchShortForm})`} />
               
               {/* STATUS ACTION IN MODAL */}
               <InfoTile icon={<Activity size={16}/>} label="Account Status" 
                  action={
                    <div className="flex items-center gap-2 mt-2">
                      <div className="relative flex-1">
                        <select 
                          className="appearance-none w-full bg-orange-50 border border-orange-100 rounded-xl pl-3 pr-8 py-2 text-[11px] font-black text-orange-700 outline-none"
                          value={pendingStatusChanges[selectedFaculty.id] || selectedFaculty.status}
                          onChange={(e) => setPendingStatusChanges({ ...pendingStatusChanges, [selectedFaculty.id]: e.target.value })}
                        >
                          {availableStatuses.map(st => <option key={st} value={st}>{st}</option>)}
                        </select>
                        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
                      </div>
                      {pendingStatusChanges[selectedFaculty.id] && pendingStatusChanges[selectedFaculty.id] !== selectedFaculty.status && (
                        <button onClick={() => handleUpdateStatusDatabase(selectedFaculty.id)} className="bg-orange-600 text-white text-[9px] font-black px-3 py-2 rounded-xl">UPDATE</button>
                      )}
                    </div>
                  }
                  value={selectedFaculty.status} 
               />

               {/* ROLE ACTION IN MODAL */}
               <InfoTile icon={<Shield size={16}/>} label="System Role" 
                  action={
                    <div className="flex items-center gap-2 mt-2">
                      <div className="relative flex-1">
                        <select 
                          className="appearance-none w-full bg-indigo-50 border border-indigo-100 rounded-xl pl-3 pr-8 py-2 text-[11px] font-black text-indigo-700 outline-none"
                          value={pendingRoleChanges[selectedFaculty.id] || selectedFaculty.role}
                          onChange={(e) => setPendingRoleChanges({ ...pendingRoleChanges, [selectedFaculty.id]: e.target.value })}
                        >
                          {availableRoles.map(role => <option key={role} value={role}>{role.replace('ROLE_', '')}</option>)}
                        </select>
                        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
                      </div>
                      {pendingRoleChanges[selectedFaculty.id] && pendingRoleChanges[selectedFaculty.id] !== selectedFaculty.role && (
                        <button onClick={() => handleUpdateRoleDatabase(selectedFaculty.id)} className="bg-indigo-600 text-white text-[9px] font-black px-3 py-2 rounded-xl">UPDATE</button>
                      )}
                    </div>
                  }
                  value={selectedFaculty.role.replace('ROLE_', '')} 
               />

               <InfoTile icon={<School size={16}/>} label="College ID" value={`COL-ID: ${selectedFaculty.collegeId}`} />
               <InfoTile icon={<Mail size={16}/>} label="Official Email" value={selectedFaculty.email} />
               <InfoTile icon={<Phone size={16}/>} label="Contact Number" value={selectedFaculty.phone} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <a href={`tel:${selectedFaculty.phone}`} className="flex items-center justify-center py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"><Phone size={16} /> Call</a>
              <a href={`mailto:${selectedFaculty.email}`} className="flex items-center justify-center py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest gap-2 hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-100"><Mail size={16} /> Email</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoTile = ({ icon, label, value, action }) => (
  <div className="p-4 rounded-3xl border flex items-start gap-4 bg-slate-50 border-slate-100/80 transition-hover hover:border-indigo-100">
    <div className="mt-1 text-indigo-500 bg-white p-2 rounded-xl shadow-sm border border-slate-100">{icon}</div>
    <div className="min-w-0 flex-1">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">{label}</p>
      <p className="text-[14px] font-bold truncate leading-tight text-slate-800">{value}</p>
      {action && action}
    </div>
  </div>
);