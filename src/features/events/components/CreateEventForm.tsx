import React, { useState, useEffect } from 'react';
import { 
  Users, ChevronRight, 
  Upload, Send, Plus, Trash2, Globe, Lock,
  Sparkles, Phone, Mail, User
} from 'lucide-react';
import { toast } from 'sonner';

import { fetchEventMetaData, createEvent, resubmitEvent } from '@/services/eventService';
import { getAllBranchesOfCollege } from '@/services/collegeService';
import type { AdminEventDetail } from '@/types/event';

interface OnePageCreateEventFormProps {
  initialData?: AdminEventDetail | null;
  isModal?: boolean;
  onClose: () => void;
}

interface Attachment {
  key: string;
  value: string;
}

interface Contact {
  name: string;
  phone: string;
  email: string;
}

interface FormDataState {
  title: string;
  description: string;
  fees: number;
  venue: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  registrationDeadline: string;
  eventCategory: string;
  eventType: string;
  teamEvent: boolean;
  minTeamSize: any;
  maxTeamSize: any;
  maxParticipants: number;
  registrationLink: string;
  allowed_branches: number[];
  allowed_years: number[];
  publicAttachments: Attachment[];
  privateAttachments: Attachment[];
  contactDetails: Contact[];
  poster: File | null;
}

export const OnePageCreateEventForm: React.FC<OnePageCreateEventFormProps> = ({ initialData = null, isModal = false, onClose }) => {
  const [step, setStep] = useState(1);
  const [metaData, setMetaData] = useState<Record<string, string[]>>({}); 
  const [collegeBranches, setCollegeBranches] = useState<Record<string, string>>({}); 
  const todayString = new Date().toISOString().split('T')[0];

  const collegeId = localStorage.getItem("collegeId") ? Number(localStorage.getItem("collegeId")) : null;
  const clubId = localStorage.getItem("profileId") ? Number(localStorage.getItem("profileId")) : null;

  const [formData, setFormData] = useState<FormDataState>({
    title: '', description: '', fees: 0, venue: '',
    startDate: '', endDate: '', startTime: '', endTime: '', registrationDeadline: '',
    eventCategory: '', eventType: '', teamEvent: false, 
    minTeamSize: 1, maxTeamSize: 1,
    maxParticipants: 100, registrationLink: '',
    allowed_branches: [], 
    allowed_years: [],    
    publicAttachments: [{ key: '', value: '' }],
    privateAttachments: [{ key: '', value: '' }],
    contactDetails: [{ name: '', phone: '', email: '' }],
    poster: null 
  });

  const years = [
    { id: 1, name: "FY" }, { id: 2, name: "SY" }, 
    { id: 3, name: "TY" }, { id: 4, name: "FINAL" }
  ];

  // --- AUTOFILL LOGIC ---
  useEffect(() => {
    if (initialData) {
      console.log("Initial Data:", initialData); 
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        fees: initialData.fees || 0,
        venue: initialData.venue || '',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        startTime: initialData.startTime || '',
        endTime: initialData.endTime || '',
        registrationDeadline: initialData.registrationDeadline || '',
        eventCategory: initialData.eventCategory || '',
        eventType: initialData.eventType || '',
        teamEvent: initialData.teamEvent || false,
        minTeamSize: initialData.minTeamSize || 1,
        maxTeamSize: initialData.maxTeamSize || 1,
        maxParticipants: initialData.maxParticipants || 100,
        registrationLink: initialData.registrationLink || '',
        
        allowed_branches: initialData.allowedBranches 
          ? Object.keys(initialData.allowedBranches).map(Number) 
          : [],
        allowed_years: initialData.allowedYears 
          ? Object.keys(initialData.allowedYears).map(Number) 
          : [],

        publicAttachments: initialData.publicAttachments 
          ? Object.entries(initialData.publicAttachments).map(([key, value]) => ({ key, value }))
          : [{ key: '', value: '' }],
        privateAttachments: initialData.privateAttachments 
          ? Object.entries(initialData.privateAttachments).map(([key, value]) => ({ key, value }))
          : [{ key: '', value: '' }],

        contactDetails: initialData.contactDetails 
          ? Object.entries(initialData.contactDetails).map(([name, info]: any) => ({ 
              name, 
              phone: info.phone || '', 
              email: info.email || '' 
            }))
          : [{ name: '', phone: '', email: '' }],
        poster: null
      });
    }
  }, [initialData]);

  // --- METADATA FETCH ---
  useEffect(() => {
    const initData = async () => {
      try {
        const [meta, branches] = await Promise.all([
          fetchEventMetaData(),
          getAllBranchesOfCollege(collegeId || 0) 
        ]);
        setMetaData(meta);
        setCollegeBranches(branches);

        if (!initialData) {
          const categories = Object.keys(meta);
          if (categories.length > 0) {
            setFormData(prev => ({
              ...prev,
              eventCategory: categories[0],
              eventType: meta[categories[0]][0] || ''
            }));
          }
        }
      } catch (err) {
        toast.error("Sync failed.");
      }
    };
    initData();
  }, [collegeId, initialData]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCat = e.target.value;
    setFormData(prev => ({
      ...prev,
      eventCategory: selectedCat,
      eventType: metaData[selectedCat] ? metaData[selectedCat][0] : ''
    }));
  };

  const toggleSelection = (field: 'allowed_branches' | 'allowed_years', id: string | number) => {
    const numericId = parseInt(id.toString());
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(numericId) ? prev[field].filter(i => i !== numericId) : [...prev[field], numericId]
    }));
  };

  const validateStep1 = () => {
    const { title, venue, startDate, endDate, startTime, endTime, registrationDeadline, description, allowed_branches, allowed_years } = formData;
    
    if (!title || !venue || !startDate || !endDate || !startTime || !endTime || !registrationDeadline || !description) {
      toast.error("Required fields missing.");
      return false;
    }

    if (startDate > endDate) {
      toast.error("End date cannot be before start date");
      return false;
    }

    if (allowed_branches.length === 0) {
      toast.error("Please select at least one branch.");
      return false;
    }

    if (allowed_years.length === 0) {
      toast.error("Please select at least one target year.");
      return false;
    }

    if (formData.teamEvent) {
      if (formData.minTeamSize < 1 || formData.maxTeamSize < 1) {
        toast.error("Team sizes must be at least 1.");
        return false;
      }
      if (formData.minTeamSize > formData.maxTeamSize) {
        toast.error("Minimum team size cannot be greater than maximum team size");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.poster && !initialData) return toast.error("Poster is required.");

    try {
      const eventData = new FormData();
      const eventJson = {
        ...formData,
        id: initialData?.id || null, 
        public_attachments: formData.publicAttachments
          .filter(a => a.key && a.value)
          .reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {}),
        private_attachments: formData.privateAttachments
          .filter(a => a.key && a.value)
          .reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {}),
        contact_details: formData.contactDetails
          .filter(c => c.name)
          .reduce((acc, curr) => ({ 
            ...acc, 
            [curr.name]: { phone: curr.phone, email: curr.email } 
          }), {})
      };
      
      const payload: any = { ...eventJson };
      delete payload.poster;
      delete payload.publicAttachments;
      delete payload.privateAttachments;
      delete payload.contactDetails;
      delete payload.teamSize;

      eventData.append("event", new Blob([JSON.stringify(payload)], { type: 'application/json' }));
      
      if (formData.poster) {
        eventData.append("file", formData.poster);
      } else {
        eventData.append("file", new Blob([], { type: 'application/octet-stream' }));
      }

      if (initialData) {
        await resubmitEvent(eventData, initialData.id);
        toast.success("Event Updated & Resubmitted!");
      } else {
        await createEvent(eventData, clubId || 0);
        toast.success("Event Created Successfully!");
      }

      onClose();
    } catch (err: any) {
      toast.error(err.message || "Operation failed.");
    }
  };

  return (
    <div className={`${isModal ? 'p-8' : 'w-full max-w-5xl mx-auto py-12'} bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-indigo-100`}>
      <div className="space-y-10">
        
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                 <Sparkles size={20} className="text-indigo-600" />
              </div>
              <div>
                 <h2 className="text-xl md:text-3xl font-black tracking-tight uppercase leading-none">
                   {initialData ? 'Update Intel' : 'Propose Event'}
                 </h2>
                 <p className="text-[10px] font-black text-indigo-600/60 uppercase tracking-widest mt-1">Creation & Proposal Engine v2</p>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${step === 1 ? 'bg-indigo-600 border-indigo-700 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>1. Logistics</div>
              <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${step === 2 ? 'bg-indigo-600 border-indigo-700 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>2. Supporting Details</div>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {step === 1 ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-12">
              
              <div className="space-y-6">
                <SectionHeader label="1. Basic Details" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CompactInput label="Title *" value={formData.title} onChange={v => setFormData({...formData, title: v})} />
                  <CompactInput label="Venue *" value={formData.venue} onChange={v => setFormData({...formData, venue: v})} />
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Event Category *</label>
                    <select value={formData.eventCategory} onChange={handleCategoryChange} className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl text-xs font-bold uppercase outline-none focus:border-indigo-400 transition-all select-none">
                      {Object.keys(metaData).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Event Sub-Type *</label>
                    <select value={formData.eventType} onChange={e => setFormData({...formData, eventType: e.target.value})} className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl text-xs font-bold uppercase outline-none focus:border-indigo-400 transition-all select-none">
                      {(metaData[formData.eventCategory] || []).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <CompactInput label="Registration Fees (₹) *" type="number" value={formData.fees} onChange={v => setFormData({...formData, fees: Number(v)})} />
                  <CompactInput label="Registration Link" value={formData.registrationLink} onChange={v => setFormData({...formData, registrationLink: v})} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Description *</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs font-bold resize-none outline-none focus:border-indigo-500 transition-all" />
                </div>
              </div>

              <div className="space-y-5">
                <SectionHeader label="2. Schedule" />
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <CompactInput label="Start Date *" type="date" min={todayString} value={formData.startDate} onChange={v => setFormData({...formData, startDate: v})} />
                  <CompactInput label="End Date *" type="date" min={formData.startDate || todayString} value={formData.endDate} onChange={v => setFormData({...formData, endDate: v})} />
                  <CompactInput label="Start Time *" type="time" value={formData.startTime} onChange={v => setFormData({...formData, startTime: v})} />
                  <CompactInput label="End Time *" type="time" value={formData.endTime} onChange={v => setFormData({...formData, endTime: v})} />
                  <CompactInput label="Deadline *" type="date" min={todayString} max={formData.startDate || ''} value={formData.registrationDeadline} onChange={v => setFormData({...formData, registrationDeadline: v})} />
                </div>
                {formData.startDate && formData.endDate && formData.startDate > formData.endDate && (
                  <p className="text-red-500 text-[10px] font-black uppercase mt-1">
                    End date cannot be before start date
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <SelectionGroup label="Target Branches *" items={Object.entries(collegeBranches).map(([id, name]) => ({ id, name }))} selected={formData.allowed_branches} onToggle={id => toggleSelection('allowed_branches', id)} />
                <SelectionGroup label="Target Years *" items={years} selected={formData.allowed_years} onToggle={id => toggleSelection('allowed_years', id)} />
              </div>

              <div className="flex flex-col gap-4 p-5 border border-indigo-100 bg-indigo-50/30 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500"><Users size={14}/></div>
                     <div>
                        <h4 className="text-[11px] font-black uppercase tracking-wider">Team Event Activation</h4>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Toggle to define participant grouping rules</p>
                     </div>
                  </div>
                  <label className="relative flex items-center cursor-pointer select-none">
                    <input type="checkbox" checked={formData.teamEvent} onChange={e => setFormData({ ...formData, teamEvent: e.target.checked })} className="sr-only peer" />
                    <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {formData.teamEvent && (
                  <div className="pt-4 border-t border-indigo-100/40 animate-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Min Team Size *</label>
                        <input 
                          type="number" 
                          min={1} 
                          value={formData.minTeamSize} 
                          onChange={e => setFormData({ ...formData, minTeamSize: Number(e.target.value) })} 
                          className="w-full p-2.5 bg-white border border-indigo-200 rounded-xl text-center font-bold text-xs" 
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Max Team Size *</label>
                        <input 
                          type="number" 
                          min={1} 
                          value={formData.maxTeamSize} 
                          onChange={e => setFormData({ ...formData, maxTeamSize: Number(e.target.value) })} 
                          className="w-full p-2.5 bg-white border border-indigo-200 rounded-xl text-center font-bold text-xs" 
                        />
                      </div>
                    </div>
                    {formData.minTeamSize > formData.maxTeamSize && (
                      <p className="text-red-500 text-[10px] font-bold uppercase mt-1">
                        Minimum team size cannot be greater than maximum team size
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  type="button" 
                  disabled={(formData.teamEvent && formData.minTeamSize > formData.maxTeamSize) || (formData.startDate && formData.endDate && formData.startDate > formData.endDate)}
                  onClick={() => validateStep1() && setStep(2)} 
                  className="bg-slate-900 text-white px-10 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 transition-all shadow-lg disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  Continue <ChevronRight size={14}/>
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300 space-y-12">
              <div className="space-y-12">
                <AttachmentList title="Public Documentation" icon={<Globe size={16}/>} rows={formData.publicAttachments} onAdd={() => setFormData(p=>({...p, publicAttachments:[...p.publicAttachments, {key:'', value:''}]}))} onRemove={i => setFormData(p=>({...p, publicAttachments: p.publicAttachments.filter((_,idx)=>idx!==i)}))} onChange={(i,f,v) => {
                  const updated = [...formData.publicAttachments]; updated[i][f] = v; setFormData({...formData, publicAttachments: updated});
                }} />
                <AttachmentList title="Private Attachments" icon={<Lock size={16}/>} rows={formData.privateAttachments} onAdd={() => setFormData(p=>({...p, privateAttachments:[...p.privateAttachments, {key:'', value:''}]}))} onRemove={i => setFormData(p=>({...p, privateAttachments: p.privateAttachments.filter((_,idx)=>idx!==i)}))} onChange={(i,f,v) => {
                  const updated = [...formData.privateAttachments]; updated[i][f] = v; setFormData({...formData, privateAttachments: updated});
                }} />

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-2"><Phone className="text-indigo-600" size={16}/><h4 className="text-[11px] font-black uppercase tracking-widest">Contact Details</h4></div>
                    <button type="button" onClick={() => setFormData(p=>({...p, contactDetails:[...p.contactDetails, {name:'', phone:'', email:''}]}))} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-indigo-600 transition-all"><Plus size={14}/></button>
                  </div>
                  {formData.contactDetails.map((contact, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-in slide-in-from-bottom-2 duration-200">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14}/><input value={contact.name} onChange={e => { const updated = [...formData.contactDetails]; updated[i].name = e.target.value; setFormData({...formData, contactDetails: updated})}} placeholder="Full Name" className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase outline-none focus:border-indigo-400" />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14}/><input value={contact.phone} onChange={e => { const updated = [...formData.contactDetails]; updated[i].phone = e.target.value; setFormData({...formData, contactDetails: updated})}} placeholder="Phone" className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-bold outline-none focus:border-indigo-400" />
                      </div>
                      <div className="relative flex gap-2">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14}/><input value={contact.email} onChange={e => { const updated = [...formData.contactDetails]; updated[i].email = e.target.value; setFormData({...formData, contactDetails: updated})}} placeholder="Email" className="flex-1 pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-bold outline-none focus:border-indigo-400" />
                        {formData.contactDetails.length > 1 && <button type="button" onClick={() => setFormData(p=>({...p, contactDetails: p.contactDetails.filter((_,idx)=>idx!==i)}))} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50 p-8 rounded-3xl border border-slate-100">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-slate-400">Event Poster</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase italic">Max size: 5MB.</p>
                  {initialData && !formData.poster && <p className="text-[8px] text-indigo-600 font-bold">Using Existing Poster</p>}
                </div>
                <label className="relative h-48 bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 transition-all overflow-hidden group">
                  {formData.poster ? <img src={URL.createObjectURL(formData.poster)} className="w-full h-full object-cover" /> : initialData ? <img src={initialData.posterUrl} className="w-full h-full object-cover opacity-50" /> : <Upload size={24} className="text-slate-300" />}
                  <input type="file" className="hidden" accept="image/*" onChange={e => setFormData({...formData, poster: e.target.files ? e.target.files[0] : null})} />
                </label>
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-400">Back</button>
                <button type="submit" disabled={(formData.teamEvent && formData.minTeamSize > formData.maxTeamSize) || (formData.startDate && formData.endDate && formData.startDate > formData.endDate)} className="flex-[2] py-4 bg-emerald-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-100 flex justify-center items-center gap-2 hover:bg-emerald-700 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed">
                  {initialData ? 'Update & Resubmit' : 'Finalize & Submit'} <Send size={14}/>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const SectionHeader = ({ label }: { label: string }) => (
  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" /> {label}
  </h3>
);

const CompactInput = ({ label, value, onChange, type = "text", min, max }: { label: string, value: any, onChange: (v: string) => void, type?: string, min?: any, max?: any }) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
    <input type={type} min={min} max={max} value={value} onChange={e => onChange(e.target.value)} className="px-4 py-3 border border-slate-200 bg-white rounded-xl text-[11px] font-bold outline-none focus:border-indigo-500 transition-all" />
  </div>
);

const SelectionGroup = ({ label, items, selected, onToggle }: { label: string, items: { id: any, name: string }[], selected: any[], onToggle: (id: any) => void }) => (
  <div className="space-y-4">
    <SectionHeader label={label} />
    <div className="grid grid-cols-2 gap-2 p-5 bg-slate-50 border border-slate-100 rounded-2xl max-h-52 overflow-y-auto no-scrollbar">
      {items.map(item => (
        <button type="button" key={item.id} onClick={() => onToggle(item.id)} className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition-all group ${selected.includes(Number(item.id)) ? 'bg-indigo-600 border-indigo-700 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
          <span className={`text-[10px] font-black uppercase tracking-wide truncate ${selected.includes(Number(item.id)) ? 'text-white' : 'text-slate-700 group-hover:text-slate-900'}`}>{item.name}</span>
          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${selected.includes(Number(item.id)) ? 'bg-indigo-500 border-indigo-400' : 'bg-white border-slate-200'}`}>
            {selected.includes(Number(item.id)) && <div className="w-1.5 h-1.5 rounded-full bg-white animate-in zoom-in duration-200" />}
          </div>
        </button>
      ))}
    </div>
  </div>
);

const AttachmentList = ({ title, icon, rows, onAdd, onRemove, onChange }: { title: string, icon: any, rows: Attachment[], onAdd: () => void, onRemove: (i: number) => void, onChange: (i: number, field: 'key'|'value', v: string) => void }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center px-2">
      <div className="flex items-center gap-2"><div className="text-indigo-600">{icon}</div><h4 className="text-[11px] font-black uppercase tracking-widest">{title}</h4></div>
      <button type="button" onClick={onAdd} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-indigo-600 transition-all"><Plus size={14}/></button>
    </div>
    {rows.map((row, i) => (
      <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in slide-in-from-bottom-2 duration-200">
        <input value={row.key} onChange={e => onChange(i, 'key', e.target.value)} placeholder="Title / Label" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase outline-none focus:border-indigo-400" />
        <div className="flex gap-2">
          <input value={row.value} onChange={e => onChange(i, 'value', e.target.value)} placeholder="URL / Content Link" className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-bold outline-none focus:border-indigo-400" />
          {rows.length > 1 && <button type="button" onClick={() => onRemove(i)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>}
        </div>
      </div>
    ))}
  </div>
);