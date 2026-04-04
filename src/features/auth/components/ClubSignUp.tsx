import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Lock, Phone, GraduationCap, 
  School, Sparkles, ArrowRight, ArrowLeft, 
  CheckCircle2, Globe, Users, ChevronDown, 
  X, Layers, Info, Instagram, Linkedin, Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import { getAllRegisteredColleges, getAllBranchesOfCollege, getAllOfficialDomainsOfCollege } from '@/services/collegeService';
import { registerClub } from '@/services/clubService';
import { Button } from '@/components/ui/button';

interface ClubSignUpProps {
    onClose?: () => void;
}

/* --- REFINED MINI COMPONENTS (Consistent with StudentSignUp) --- */

const ModernSelect = ({ label, icon, name, value, onChange, options, placeholder, isOptional = false }: any) => (
    <div className="space-y-1.5 group">
        <label className="text-[9px] font-bold uppercase text-slate-400 ml-1 flex items-center gap-2 group-focus-within:text-orange-500 transition-colors tracking-widest">
            {icon} {label} {isOptional && <span className="lowercase text-[8px] font-medium opacity-60">(Optional)</span>}
        </label>
        <div className="relative">
            <select 
                name={name} 
                value={value} 
                onChange={onChange}
                className="w-full h-[46px] px-4 bg-slate-100/50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition-all appearance-none"
            >
                <option value="">{placeholder}</option>
                {options.map((opt: any) => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
    </div>
);

const ModernInput = ({ label, name, type = "text", value, onChange, icon, placeholder, isOptional = false }: any) => (
    <div className="space-y-1.5 group flex-1">
        <label className="text-[9px] font-bold uppercase text-slate-400 ml-1 flex items-center gap-2 group-focus-within:text-orange-500 transition-colors tracking-widest">
            {icon} {label} {isOptional && <span className="lowercase text-[8px] font-medium opacity-60">(Optional)</span>}
        </label>
        <input 
            name={name} type={type} value={value} onChange={onChange} placeholder={placeholder}
            className="w-full h-[46px] px-4 bg-slate-100/50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-slate-300" 
        />
    </div>
);

const ModernTextArea = ({ label, name, value, onChange, icon, placeholder }: any) => (
    <div className="space-y-1.5 group flex-1">
        <label className="text-[9px] font-bold uppercase text-slate-400 ml-1 flex items-center gap-2 group-focus-within:text-orange-500 transition-colors tracking-widest">
            {icon} {label}
        </label>
        <textarea 
            name={name} value={value} onChange={onChange} placeholder={placeholder} rows={3}
            className="w-full px-4 py-3 bg-slate-100/50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-slate-300 no-scrollbar" 
        />
    </div>
);

const ModernFileInput = ({ label, icon, onChange, preview }: any) => (
    <div className="space-y-1.5 group">
        <label className="text-[9px] font-bold uppercase text-slate-400 ml-1 flex items-center gap-2 group-focus-within:text-orange-500 transition-colors tracking-widest">
            {icon} {label}
        </label>
        <div className="relative group/file">
            <input 
                type="file" 
                accept="image/*"
                onChange={onChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className={`w-full h-[80px] border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-4 transition-all group-hover/file:border-orange-400/50 group-hover/file:bg-orange-50/30 ${preview ? 'bg-orange-50/20' : 'bg-slate-50'}`}>
                {preview ? (
                    <div className="flex items-center gap-4 px-4 w-full">
                        <img src={preview} alt="Logo Preview" className="w-12 h-12 rounded-lg object-cover shadow-sm border border-white" />
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-bold text-slate-900 truncate uppercase tracking-tight">Logo Selected</p>
                            <p className="text-[10px] text-slate-400 font-medium">Click to replace image</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <Camera size={20} className="text-slate-300 group-hover/file:text-orange-400 transition-colors mb-1" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Upload Club Logo</p>
                    </div>
                )}
            </div>
        </div>
    </div>
);

export const ClubSignUp: React.FC<ClubSignUpProps> = ({ onClose }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [colleges, setColleges] = useState([]);
    const [branches, setBranches] = useState<any>({});
    const [officialDomains, setOfficialDomains] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        adminName: "",
        shortForm: "",
        adminEmail: "",
        adminPhone: "",
        password: "",
        description: "",
        branchId: "",
        websiteUrl: "",
        instagramUrl: "",
        linkedInUrl: "",
        collegeId: ""
    });

    useEffect(() => {
        const fetchColleges = async () => {
            try {
                const data = await getAllRegisteredColleges();
                setColleges(data || []);
        } catch (err: any) {
            toast.error(err.message);
        }
    };
    fetchColleges();
}, []);

useEffect(() => {
    if (formData.collegeId) {
        setBranches({});
        setOfficialDomains([]);
        const fetchExtras = async () => {
            try {
                const branchesData = await getAllBranchesOfCollege(formData.collegeId);
                setBranches(branchesData || {});
            } catch (err: any) {
                toast.error(err.message);
            }

            try {
                const domainsData = await getAllOfficialDomainsOfCollege(formData.collegeId);
                setOfficialDomains(domainsData || []);
            } catch (err) {
                console.warn("Domain validation offline");
            }
        };
        fetchExtras();
    }
}, [formData.collegeId]);

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "collegeId") {
        setFormData(prev => ({ ...prev, [name]: value, branchId: "" }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
};

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) {
            return toast.error("Image too heavy (> 2MB)");
        }
        setLogoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setLogoPreview(reader.result as string);
        reader.readAsDataURL(file);
    }
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (officialDomains.length > 0) {
        const isOfficialEmail = officialDomains.some(domain => 
            formData.adminEmail.toLowerCase().endsWith(domain.toLowerCase())
        );
        if (!isOfficialEmail) {
            return toast.error(`Access Denied! Use official college email (${officialDomains.join(" or ")})`);
        }
    }

    if (!logoFile) return toast.error("Club identity (Logo) required.");

    setIsLoading(true);
    try {
        const clubPayload = {
            ...formData,
            branchId: formData.branchId ? parseInt(formData.branchId) : null,
            collegeId: parseInt(formData.collegeId)
        };

        const data = new FormData();
        data.append("club", JSON.stringify(clubPayload));
        data.append("file", logoFile);

        await registerClub(data, formData.collegeId);
        toast.success("Club Registered Successfully!");
        setTimeout(() => { if (onClose) onClose(); navigate('/auth/sign-in'); }, 2000);
    } catch (err: any) {
        toast.error(err.message);
    } finally { setIsLoading(false); }
};

    const steps = [
        { id: 1, label: "Campus", icon: <School size={14}/> },
        { id: 2, label: "Identity", icon: <Users size={14}/> },
        { id: 3, label: "Admin", icon: <User size={14}/> }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-all duration-500 overflow-y-auto no-scrollbar text-slate-900 selection:bg-orange-100 selection:text-orange-900">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>

            <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="font-jakarta w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col min-h-[500px] border border-slate-100"
            >
                {/* Close */}
                <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all z-50">
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="px-8 pt-10 pb-6 border-b border-slate-50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
                            <Sparkles className="text-white" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Club Registration</h2>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Expanding Campus Culture</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {steps.map((s) => (
                            <div key={s.id} className="flex-1">
                                <div className={`h-1.5 rounded-full transition-all duration-500 ${step >= s.id ? 'bg-orange-500' : 'bg-slate-100'}`} />
                                <div className="mt-2 flex items-center gap-1.5">
                                    <span className={`text-[9px] font-extrabold uppercase tracking-tighter transition-colors ${step >= s.id ? 'text-slate-900' : 'text-slate-300'}`}>
                                        {s.label}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 p-6 md:p-8 bg-white relative">
                    <AnimatePresence mode="wait">
                        <form onSubmit={handleSubmit} className="h-full flex flex-col">
                            
                            {/* --- STEP 1: Campus --- */}
                            {step === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-5">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Campus Link</h3>
                                        <p className="text-sm font-medium text-slate-500">Attach your club to an official campus node.</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-4">
                                        <ModernSelect 
                                            label="Host Institution" 
                                            icon={<School size={16}/>}
                                            name="collegeId"
                                            value={formData.collegeId}
                                            onChange={handleInputChange}
                                            options={colleges.map((c: any) => ({ id: c.id, name: c.name }))}
                                            placeholder="Find your college..."
                                        />

                                        {formData.collegeId && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                                <ModernSelect 
                                                    label="Departmental Hub" 
                                                    icon={<Layers size={16}/>}
                                                    name="branchId"
                                                    value={formData.branchId}
                                                    onChange={handleInputChange}
                                                    options={Object.entries(branches).map(([id, name]: [string, any]) => ({ id, name }))}
                                                    placeholder="Specify branch (if applicable)"
                                                    isOptional
                                                />
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* --- STEP 2: Club Details --- */}
                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-5 overflow-y-auto no-scrollbar max-h-[480px] pr-2">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Club Profile</h3>
                                        <p className="text-sm font-medium text-slate-500">Define your club's identity and online presence.</p>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <ModernInput label="Organization Name" name="name" value={formData.name} onChange={handleInputChange} icon={<Users size={16}/>} placeholder="Ex: Google Developer Group" />
                                            <ModernInput label="Short Form" name="shortForm" value={formData.shortForm} onChange={handleInputChange} icon={<Layers size={16}/>} placeholder="Ex: GDG" />
                                        </div>

                                        <ModernTextArea label="Mission & Description" name="description" value={formData.description} onChange={handleInputChange} icon={<Info size={16}/>} placeholder="Describe your club's purpose and activities..." />

                                        <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 space-y-4">
                                            <ModernInput label="Website URL" name="websiteUrl" value={formData.websiteUrl} onChange={handleInputChange} icon={<Globe size={16}/>} placeholder="https://..." isOptional />
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <ModernInput label="Instagram" name="instagramUrl" value={formData.instagramUrl} onChange={handleInputChange} icon={<Instagram size={16}/>} placeholder="@handle" />
                                                <ModernInput label="LinkedIn" name="linkedInUrl" value={formData.linkedInUrl} onChange={handleInputChange} icon={<Linkedin size={16}/>} placeholder="In/name" isOptional />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* --- STEP 3: Admin --- */}
                            {step === 3 && (
                                <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-5 overflow-y-auto no-scrollbar max-h-[480px] pr-2">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Administrative Access</h3>
                                        <p className="text-sm font-medium text-slate-500">Establish the primary access point for your club node.</p>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <ModernInput label="Admin Full Name" name="adminName" value={formData.adminName} onChange={handleInputChange} icon={<User size={16}/>} placeholder="Person in-charge" />
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <ModernInput label="Admin Email" name="adminEmail" type="email" value={formData.adminEmail} onChange={handleInputChange} icon={<Mail size={16}/>} placeholder="official@college.edu" />
                                                {officialDomains.length > 0 && <p className="text-[9px] font-bold text-orange-500 px-3 py-1 bg-orange-50 rounded-full w-fit mt-1">Domain: {officialDomains.join(", ")}</p>}
                                            </div>
                                            <ModernInput label="Admin Contact" name="adminPhone" value={formData.adminPhone} onChange={handleInputChange} icon={<Phone size={16}/>} placeholder="10 Digits" />
                                        </div>

                                        <ModernInput label="Secure Access Secret" name="password" type="password" value={formData.password} onChange={handleInputChange} icon={<Lock size={16}/>} placeholder="••••••••" />

                                        <ModernFileInput label="Club Emblem / Logo" icon={<Camera size={16} />} onChange={handleFileChange} preview={logoPreview} />
                                    </div>
                                </motion.div>
                            )}

                            {/* --- ACTIONS --- */}
                            <div className="mt-auto pt-8 flex items-center justify-between border-t border-slate-50">
                                {step > 1 ? (
                                    <button type="button" onClick={() => setStep(prev => prev - 1)} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-all py-1.5 px-3">
                                        <ArrowLeft size={16}/> Previous Phase
                                    </button>
                                ) : <div />}

                                {step < 3 ? (
                                    <Button 
                                        type="button" 
                                        onClick={() => {
                                            if (step === 1 && !formData.collegeId) return toast.error("Institution link required.");
                                            if (step === 2 && (!formData.name || !formData.description || !formData.shortForm)) return toast.error("Club profile incomplete.");
                                            setStep(prev => prev + 1);
                                        }}
                                        className="bg-slate-900 hover:bg-black text-white px-8 h-[46px] rounded-xl font-bold transition-all hover:translate-y-[-2px] active:scale-95 flex items-center gap-3 shadow-lg shadow-slate-100"
                                    >
                                        Next Phase <ArrowRight size={18} />
                                    </Button>
                                ) : (
                                    <Button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="bg-orange-500 hover:bg-orange-600 text-white px-10 h-[46px] rounded-xl font-bold transition-all hover:translate-y-[-2px] active:scale-95 flex items-center gap-3 shadow-lg shadow-orange-100 group"
                                    >
                                        {isLoading ? "Syncing..." : "Finalize Protocol"} 
                                        <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
                                    </Button>
                                )}
                            </div>
                        </form>
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};