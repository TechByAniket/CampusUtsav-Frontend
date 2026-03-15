import React, { useState, useEffect } from 'react';
import type { Student } from '@/services/studentService'
import { Phone, Mail, Search, Filter, X, CreditCard, GraduationCap, Hash } from 'lucide-react'
// import { De } from 'zod/v4/locales';

type StudentsInfoListProps = {
  students: Student[]
}

export const StudentsInfoList = ({ students }: StudentsInfoListProps) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // PREVENT BACKGROUND SCROLLING
  useEffect(() => {
    if (selectedStudent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedStudent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose(); 
  };

  return (
    <section className="w-full min-h-screen bg-[#F8FAFC] py-6 px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto">

        {/* --- HEADER --- */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-none">
              Student Directory 
              <span className="text-indigo-600 font-medium ml-2 text-lg">({students.length})</span>
            </h2>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
              CampusUtsav Administration
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search students..."
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none w-64 font-medium"
              />
            </div>
            <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all">
              <Filter size={12} /> Filter
            </button>
          </div>
        </div>

        {/* --- MOBILE VIEW --- */}
        <div className="md:hidden space-y-2">
          {students.map((s) => (
            <div 
              key={s.regId} 
              onClick={() => setSelectedStudent(s)} 
              className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm active:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{s.name}</h3>
                {/* <p className="text-[11px] font-bold text-indigo-600 mt-1 uppercase">
                  {s.year}-{s.branch}-{s.division}-{s.rollNo}
                </p> */}
                <div className='flex gap-4'>
                  <p className="text-[13px] font-bold text-primary">{s.collegeUid}</p>
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full">
                    {s.year}-{s.branch}-{s.division}-{s.rollNo}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-300">#{s.srNo}</span>
            </div>
          ))}
        </div>

        {/* --- DESKTOP VIEW --- */}
        {/* --- DESKTOP VIEW: REFRESHED THEME --- */}
<div className="hidden md:block bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50">
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        {/* Updated Header: Darker gradient for high contrast and depth */}
        <tr className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700">
          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center w-20">Sr.</th>
          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100 text-left">Full Name</th>
          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100 text-left">College UID</th>
          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100 text-left">Year-Branch-Div-Roll</th>
          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100 text-left">Contact Information</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {students.map((s, index) => (
          <tr 
            key={s.regId} 
            // Alternating row colors to make it look active and readable
            className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-indigo-50/40 transition-colors group`}
          >
            <td className="px-8 py-4 text-center text-[11px] font-bold text-slate-300">#{s.srNo}</td>
            <td className="px-8 py-4 uppercase text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
              {s.name}
            </td>
            <td className="px-8 py-4 font-mono text-sm font-bold text-primary">
              <span className="bg-slate-100 px-2 py-1 rounded-lg border border-slate-200/50">{s.collegeUid}</span>
            </td>
            <td className="px-8 py-4">
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-4 py-1.5 rounded-full shadow-sm">
                {s.year}-{s.branch}-{s.division}-{s.rollNo}
              </span>
            </td>
            <td className="px-8 py-4">
              <div className="flex items-center gap-8 text-sm font-bold">
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone size={14} className="text-indigo-400" /> {s.phone}
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-medium">
                  <Mail size={14} className="text-indigo-300 items-center" /> {s.email}
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
      </div>

      {/* --- CENTERED MOBILE MODAL --- */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-[2rem] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-5">
              <div className="flex-1">
                <h2 className="text-2xl font-black text-slate-900 leading-tight uppercase">{selectedStudent.name}</h2>
                <p className="text-indigo-600 font-bold text-[9px] uppercase tracking-widest mt-1">Student Details</p>
                <h4 className="text-xl font-black text-primary leading-tight uppercase">{selectedStudent.collegeUid}</h4>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="p-1.5 bg-slate-50 rounded-full text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2.5">
              {/* <DetailCapsule icon={<CreditCard />} label="College UID" value={selectedStudent.collegeUid} color="slate" /> */}
              <DetailCapsule icon={<GraduationCap />} label="Academic Info" value={`${selectedStudent.year}-${selectedStudent.branch}-${selectedStudent.division}-${selectedStudent.rollNo}`} color="indigo" />
              {/* <DetailCapsule icon={<Hash />} label="Roll Number" value={selectedStudent.rollNo} color="slate" /> */}
              <DetailCapsule icon={<Phone />} label="Phone" value={selectedStudent.phone} color="indigo" />
              <DetailCapsule icon={<Mail />} label="Email" value={selectedStudent.email} color="slate" />
              
              <div className="grid grid-cols-2 gap-2 pt-3">
                <a href={`tel:${selectedStudent.phone}`} className="flex items-center justify-center py-3 bg-orange-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest gap-2">
                  <Phone size={16} /> Call
                </a>
                <a href={`mailto:${selectedStudent.email}`} className="flex items-center justify-center py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest gap-2">
                  <Mail size={16} /> Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

// COMPACT DETAIL CAPSULE
const DetailCapsule = ({ icon, label, value, color }: any) => {
  const isIndigo = color === 'indigo';
  return (
    <div className={`flex items-center gap-3 p-2.5 rounded-2xl border ${isIndigo ? 'bg-indigo-50/50 border-indigo-100' : 'bg-slate-50 border-slate-100'}`}>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isIndigo ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
        {React.cloneElement(icon, { size: 14 })}
      </div>
      <div className="min-w-0">
        {/* <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">{label}</p> */}
        <p className={`text-xs font-bold truncate ${isIndigo ? 'text-indigo-700' : 'text-slate-800'}`}>{value}</p>
      </div>
    </div>
  )
}