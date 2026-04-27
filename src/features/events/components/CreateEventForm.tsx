import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, Tag, Users, ChevronRight, 
  Upload, Send, Plus, Trash2, Globe, Lock,
  Sparkles, Phone, Mail, User
} from 'lucide-react';
import { toast } from 'sonner';

import { fetchEventMetaData, createEvent, resubmitEvent } from '@/services/eventService';
import { getAllBranchesOfCollege } from '@/services/collegeService';

export const OnePageCreateEventForm = ({ initialData = null, isModal = false, onClose }) => {
  const [step, setStep] = useState(1);
  const [metaData, setMetaData] = useState({}); 
  const [collegeBranches, setCollegeBranches] = useState({}); 
  const todayString = new Date().toISOString().split('T')[0];

  const collegeId = localStorage.getItem("collegeId") ? Number(localStorage.getItem("collegeId")) : null;
  const clubId = localStorage.getItem("profileId") ? Number(localStorage.getItem("profileId")) : null;

  const [formData, setFormData] = useState({
    title: '', description: '', fees: 0, venue: '',
    date: '', startTime: '', endTime: '', registrationDeadline: '',
    eventCategory: '', eventType: '', teamEvent: false, teamSize: 2,
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
        date: initialData.date || '',
        startTime: initialData.startTime || '',
        endTime: initialData.endTime || '',
        registrationDeadline: initialData.registrationDeadline || '',
        eventCategory: initialData.eventCategory || '',
        eventType: initialData.eventType || '',
        teamEvent: initialData.teamEvent || false,
        teamSize: initialData.teamSize || 2,
        maxParticipants: initialData.maxParticipants || 100,
        registrationLink: initialData.registrationLink || '',
        
        allowed_branches: initialData.allowedBranches 
          ? Object.keys(initialData.allowedBranches).map(Number) 
          : [],
        allowed_years: initialData.allowedYears 
          ? Object.keys(initialData.allowedYears).map(Number) 
          : [],

        publicAttachments: initialData.publicAttachments 
          ? Object.entries(initialData.publicAttachments).map(([k, v]) => ({ key: k, value: v }))
          : [{ key: '', value: '' }],
        privateAttachments: initialData.privateAttachments
          ? Object.entries(initialData.privateAttachments).map(([k, v]) => ({ key: k, value: v }))
          : [{ key: '', value: '' }],
        contactDetails: initialData.contactDetails
          ? Object.entries(initialData.contactDetails).map(([name, info]) => ({ 
              name: name, 
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
          getAllBranchesOfCollege(collegeId) 
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

  const handleCategoryChange = (e) => {
    const selectedCat = e.target.value;
    setFormData(prev => ({
      ...prev,
      eventCategory: selectedCat,
      eventType: metaData[selectedCat] ? metaData[selectedCat][0] : ''
    }));
  };

  const toggleSelection = (field, id) => {
    const numericId = parseInt(id);
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(numericId) ? prev[field].filter(i => i !== numericId) : [...prev[field], numericId]
    }));
  };

  const validateStep1 = () => {
    const { title, venue, date, startTime, endTime, registrationDeadline, description, allowed_branches, allowed_years } = formData;
    
    if (!title || !venue || !date || !startTime || !endTime || !registrationDeadline || !description) {
      toast.error("Required fields missing.");
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

    return true;
  };

  const handleSubmit = async (e) => {
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
      
      delete eventJson.poster;
      delete eventJson.publicAttachments;
      delete eventJson.privateAttachments;
      delete eventJson.contactDetails;

      eventData.append("event", new Blob([JSON.stringify(eventJson)], { type: 'application/json' }));
      
      // FIX: Ensure 'file' part is present even if no new poster is selected
      if (formData.poster) {
        eventData.append("file", formData.poster);
      } else {
        // Send an empty blob with the same part name to satisfy backend @RequestPart requirements
        eventData.append("file", new Blob([], { type: 'application/octet-stream' }));
      }

      if (initialData) {
        await resubmitEvent(eventData, initialData.id);
        toast.success("Event Updated & Resubmitted!");
      } else {
        await createEvent(eventData, clubId);
        toast.success("Event Created Successfully!");
      }

      if(isModal) onClose();
    } catch (err) {
      toast.error("Action failed.");
    }
  };

  const currentTypes = formData.eventCategory ? (metaData[formData.eventCategory] || []) : [];

  return (
    <div className={`${isModal ? 'w-full' : 'w-full min-h-screen bg-[#F8FAFC] py-10 px-4'} font-sans`}>
      <div className={`${isModal ? '' : 'max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden'}`}>
        {!isModal && (
          <div className="border-b border-slate-100 p-6 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <Sparkles className="text-indigo-600" size={24} />
              <h2 className="text-sm font-black uppercase tracking-tight italic">Event Console / Stage {step}</h2>
            </div>
            <div className="flex gap-1.5">
              <div className={`h-1.5 w-8 rounded-full ${step === 1 ? 'bg-indigo-600' : 'bg-emerald-500'}`} />
              <div className={`h-1.5 w-8 rounded-full ${step === 2 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
          {step === 1 ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-10">
              <div className="space-y-5">
                <SectionHeader label="1. Core Logistics" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <CompactInput label="Title *" value={formData.title} onChange={v => setFormData({...formData, title: v})} />
                  <CompactInput label="Venue *" value={formData.venue} onChange={v => setFormData({...formData, venue: v})} />
                  <CompactInput label="Fees (₹) *" type="number" value={formData.fees} onChange={v => setFormData({...formData, fees: v})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Category</label>
                        <select value={formData.eventCategory} onChange={handleCategoryChange} className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-500">
                            {Object.keys(metaData).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Type</label>
                        <select value={formData.eventType} onChange={e => setFormData({...formData, eventType: e.target.value})} className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-500">
                            {currentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <CompactInput label="Registration Link" value={formData.registrationLink} onChange={v => setFormData({...formData, registrationLink: v})} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Description *</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="4" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs font-bold resize-none outline-none focus:border-indigo-500 transition-all" />
                </div>
              </div>

              <div className="space-y-5">
                <SectionHeader label="2. Schedule" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <CompactInput label="Date *" type="date" min={todayString} value={formData.date} onChange={v => setFormData({...formData, date: v})} />
                  <CompactInput label="Start *" type="time" value={formData.startTime} onChange={v => setFormData({...formData, startTime: v})} />
                  <CompactInput label="End *" type="time" value={formData.endTime} onChange={v => setFormData({...formData, endTime: v})} />
                  <CompactInput label="Deadline *" type="date" min={todayString} max={formData.date} value={formData.registrationDeadline} onChange={v => setFormData({...formData, registrationDeadline: v})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <SelectionGroup label="Target Branches *" items={Object.entries(collegeBranches).map(([id, name]) => ({ id, name }))} selected={formData.allowed_branches} onToggle={id => toggleSelection('allowed_branches', id)} />
                <SelectionGroup label="Target Years *" items={years} selected={formData.allowed_years} onToggle={id => toggleSelection('allowed_years', id)} />
              </div>

              <div className="flex items-center justify-between p-5 border border-indigo-100 bg-indigo-50/30 rounded-2xl">
                <div className="flex items-center gap-4"><Users size={18} className="text-indigo-600"/><span className="text-[11px] font-black uppercase">Team Configuration</span></div>
                <div className="flex items-center gap-5">
                  <input type="checkbox" checked={formData.teamEvent} onChange={e => setFormData({...formData, teamEvent: e.target.checked})} className="w-5 h-5 accent-indigo-600 cursor-pointer" />
                  {formData.teamEvent && <input type="number" value={formData.teamSize} onChange={e => setFormData({...formData, teamSize: e.target.value})} className="w-16 p-2 bg-white border border-indigo-200 rounded-lg text-center font-bold text-xs" />}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button type="button" onClick={() => validateStep1() && setStep(2)} className="bg-slate-900 text-white px-10 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 transition-all shadow-lg">Continue <ChevronRight size={14}/></button>
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
                  <input type="file" className="hidden" accept="image/*" onChange={e => setFormData({...formData, poster: e.target.files[0]})} />
                </label>
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-400">Back</button>
                <button type="submit" className="flex-[2] py-4 bg-emerald-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-100 flex justify-center items-center gap-2 hover:bg-emerald-700 transition-all">
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

const SectionHeader = ({ label }) => (<h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" /> {label}</h3>);
const CompactInput = ({ label, value, onChange, type="text", min, max }) => (
  <div className="flex flex-col gap-1.5"><label className="text-[10px] font-black uppercase text-slate-400 ml-1">{label}</label>
  <input type={type} value={value} min={min} max={max} onChange={e => onChange(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-500 transition-all" /></div>
);
const SelectionGroup = ({ label, items, selected, onToggle }) => (
  <div className="space-y-4"><SectionHeader label={label} /><div className="flex flex-wrap gap-2">{items.map(i => (
    <button key={i.id} type="button" onClick={() => onToggle(i.id)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${selected.includes(parseInt(i.id)) ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-200'}`}>{i.name}</button>
  ))}</div></div>
);
const AttachmentList = ({ title, icon, rows, onAdd, onRemove, onChange }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center px-2"><div className="flex items-center gap-2"><div className="text-indigo-600">{icon}</div><h4 className="text-[11px] font-black uppercase tracking-widest">{title}</h4></div><button type="button" onClick={onAdd} className="p-2 bg-slate-900 text-white rounded-lg shadow-sm"><Plus size={14}/></button></div>
    {rows.map((row, i) => (
      <div key={i} className="flex gap-3 animate-in slide-in-from-bottom-2 duration-200">
        <input value={row.key} onChange={e => onChange(i, 'key', e.target.value)} placeholder="Doc Name" className="w-1/3 px-4 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-bold outline-none" />
        <input value={row.value} onChange={e => onChange(i, 'value', e.target.value)} placeholder="URL Link" className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none" />
        <button type="button" onClick={() => onRemove(i)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
      </div>
    ))}
  </div>
);