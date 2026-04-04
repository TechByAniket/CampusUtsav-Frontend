import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Lock, Phone, GraduationCap, 
  School, Sparkles, ArrowRight, ArrowLeft, 
  CheckCircle2, History, Hash, Laptop, 
  Globe, Users, ChevronDown, X, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import { getAllRegisteredColleges, getAllBranchesOfCollege, getAllOfficialDomainsOfCollege } from '@/services/collegeService';
import { getClubsByCollege } from '@/services/clubService';
import { registerStudent } from '@/services/studentService';
import { Button } from '@/components/ui/button';

interface StudentSignUpProps {
    onClose?: () => void;
}

/* --- REFINED MINI COMPONENTS --- */

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
                className="w-full h-[46px] px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition-all appearance-none"
            >
                <option value="">{placeholder}</option>
                {options.map((opt: any) => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
    </div>
);

const ModernInput = ({ label, name, type = "text", value, onChange, icon, placeholder }: any) => (
    <div className="space-y-1.5 group flex-1">
        <label className="text-[9px] font-bold uppercase text-slate-400 ml-1 flex items-center gap-2 group-focus-within:text-orange-500 transition-colors tracking-widest">
            {icon} {label}
        </label>
        <input 
            name={name} type={type} value={value} onChange={onChange} placeholder={placeholder}
            className="w-full h-[46px] px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-slate-300" 
        />
    </div>
);

export const StudentSignUp: React.FC<StudentSignUpProps> = ({ onClose }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [colleges, setColleges] = useState([]);
    const [branches, setBranches] = useState<any>({});
    const [clubs, setClubs] = useState([]);
    const [officialDomains, setOfficialDomains] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    // ... rest of state

    const [formData, setFormData] = useState({
        name: "",
        gender: "Male",
        identificationNumber: "", // College UID
        email: "",
        phone: "",
        password: "",
        rollNo: "",
        year: 1,
        division: "",
        admissionYear: new Date().getFullYear() - 1,
        graduationYear: new Date().getFullYear() + 3,
        skills: "",
        interests: "",
        collegeId: "",
        branchId: "",
        clubId: ""
    });

    // --- FETCH LOGIC ---
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
        setClubs([]);
        setOfficialDomains([]);
        const fetchExtras = async () => {
            try {
                const branchesData = await getAllBranchesOfCollege(formData.collegeId);
                setBranches(branchesData || {});
            } catch (err: any) {
                toast.error(err.message);
            }

            try {
                const clubsData = await getClubsByCollege(formData.collegeId);
                setClubs(clubsData || []);
            } catch (err) {
                setClubs([]);
            }

            try {
                const domainsData = await getAllOfficialDomainsOfCollege(formData.collegeId);
                setOfficialDomains(domainsData || []);
            } catch (err) {
                console.warn("Could not fetch official domains");
            }
        };
        fetchExtras();
    }
}, [formData.collegeId]);

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "collegeId") {
        setFormData(prev => ({ ...prev, [name]: value, branchId: "", clubId: "" }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- EMAIL DOMAIN VALIDATION ---
    if (officialDomains.length > 0) {
        const isOfficialEmail = officialDomains.some(domain => 
            formData.email.toLowerCase().endsWith(domain.toLowerCase())
        );
        if (!isOfficialEmail) {
            return toast.error(`Invalid Domain! Please use your official college email (${officialDomains.join(" or ")})`, {
                duration: 5000
            });
        }
    }

    setIsLoading(true);
    try {
        const payload = {
            ...formData,
            rollNo: parseInt(formData.rollNo),
            year: parseInt(String(formData.year)),
            admissionYear: parseInt(String(formData.admissionYear)),
            graduationYear: parseInt(String(formData.graduationYear)),
            collegeId: parseInt(formData.collegeId),
            branchId: parseInt(formData.branchId),
            clubId: formData.clubId ? parseInt(formData.clubId) : null
        };
        await registerStudent(payload);
        toast.success("Student Registration Successful");
        setTimeout(() => { if (onClose) onClose(); navigate('/auth/sign-in'); }, 2000);
    } catch (err: any) {
        toast.error(err.message);
    } finally { setIsLoading(false); }
};

    const steps = [
        { id: 1, label: "Campus", icon: <School size={14}/> },
        { id: 2, label: "Academy", icon: <GraduationCap size={14}/> },
        { id: 3, label: "Identity", icon: <User size={14}/> }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-all duration-500 overflow-y-auto no-scrollbar selection:bg-orange-100 selection:text-orange-900 text-slate-900">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
                .modern-shadow { box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.1); }
                .input-focus:focus-within { border-color: #f97316; box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.05); }
                .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>

            <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="font-jakarta w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col min-h-[500px] border border-slate-100"
            >
                {/* Close Button */}
                <button 
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all z-50 active:scale-95"
                >
                  <X size={20} />
                </button>

                {/* Progress Header */}
                <div className="px-8 pt-10 pb-6 border-b border-slate-50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
                            <Sparkles className="text-white" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Student Registration</h2>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Journey to Campus Excellence</p>
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
                            
                            {/* --- STEP 1: Institutional Selection --- */}
                            {step === 1 && (
                                <motion.div 
                                    key="step1" 
                                    initial={{ opacity: 0, x: 10 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    exit={{ opacity: 0, x: -10 }} 
                                    className="space-y-5"
                                >
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-extrabold text-slate-900">Institutional Onboarding</h3>
                                        <p className="text-sm font-medium text-slate-500">Pick your campus nodes to begin your academic legacy.</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-4">
                                        <ModernSelect 
                                            label="Select Institution" 
                                            icon={<School size={16}/>}
                                            name="collegeId"
                                            value={formData.collegeId}
                                            onChange={handleInputChange}
                                            options={colleges.map((c: any) => ({ id: c.id, name: c.name }))}
                                            placeholder="Find your college..."
                                        />

                                        {formData.collegeId && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                                <ModernSelect 
                                                    label="Engineering Branch" 
                                                    icon={<GraduationCap size={16}/>}
                                                    name="branchId"
                                                    value={formData.branchId}
                                                    onChange={handleInputChange}
                                                    options={Object.entries(branches).map(([id, name]: [string, any]) => ({ id, name }))}
                                                    placeholder="Specify branch..."
                                                />

                                                <ModernSelect 
                                                    label="Club Membership Nodes" 
                                                    icon={<Users size={16}/>}
                                                    name="clubId"
                                                    value={formData.clubId}
                                                    onChange={handleInputChange}
                                                    options={clubs.map((cl: any) => ({ id: cl.id, name: cl.name }))}
                                                    placeholder="Independent student (No Club)"
                                                    isOptional
                                                />
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* --- STEP 2: Academic Intel --- */}
                            {step === 2 && (
                                <motion.div 
                                    key="step2" 
                                    initial={{ opacity: 0, x: 10 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    exit={{ opacity: 0, x: -10 }} 
                                    className="space-y-6"
                                >
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-extrabold text-slate-900">Academic Standing</h3>
                                        <p className="text-sm font-medium text-slate-500">Define your current position within the campus timeline.</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <ModernInput label="Roll Number" name="rollNo" type="number" value={formData.rollNo} onChange={handleInputChange} icon={<Hash size={16}/>} placeholder="Ex: 42" />
                                        
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-[9px] font-bold uppercase text-slate-400 ml-1 tracking-widest leading-none">Current Year</span>
                                            <div className="relative">
                                                <select name="year" value={formData.year} onChange={handleInputChange} className="w-full h-[46px] px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-orange-500 focus:bg-white transition-all appearance-none">
                                                    {[1,2,3,4].map(y => <option key={y} value={y}>{y}{y===1?'st':y===2?'nd':y===3?'rd':'th'} Year</option>)}
                                                </select>
                                                <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                            </div>
                                        </div>

                                        <div className="col-span-2">
                                            <ModernInput label="Division / Section" name="division" value={formData.division} onChange={handleInputChange} icon={<Layers size={16}/>} placeholder="Ex: A or B" />
                                        </div>

                                        <div className="col-span-2 grid grid-cols-2 gap-4 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                                            <ModernInput label="Admission Year" name="admissionYear" type="number" value={String(formData.admissionYear)} onChange={handleInputChange} icon={<History size={16}/>} placeholder="2023" />
                                            <ModernInput label="Graduation Year" name="graduationYear" type="number" value={String(formData.graduationYear)} onChange={handleInputChange} icon={<CheckCircle2 size={16}/>} placeholder="2027" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* --- STEP 3: Identity Setup --- */}
                            {step === 3 && (
                                <motion.div 
                                    key="step3" 
                                    initial={{ opacity: 0, x: 10 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    exit={{ opacity: 0, x: -10 }} 
                                    className="space-y-5 overflow-y-auto no-scrollbar max-h-[480px] pr-2"
                                >
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-extrabold text-slate-900">Personal Identity</h3>
                                        <p className="text-sm font-medium text-slate-500">The final step to synchronize your student credentials.</p>
                                    </div>
                                    
                                    <div className="space-y-5">
                                        <ModernInput label="Full Name" name="name" value={formData.name} onChange={handleInputChange} icon={<User size={16}/>} placeholder="Ex: John Doe" />
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] font-bold uppercase text-slate-400 ml-1 tracking-widest">Gender</label>
                                                <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-100">
                                                    {["Male", "Female", "Other"].map(g => (
                                                        <button 
                                                            key={g} type="button" 
                                                            onClick={() => setFormData({...formData, gender: g})}
                                                            className={`flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase transition-all ${formData.gender === g ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                                        >
                                                            {g}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <ModernInput label="College Identifier (UID)" name="identificationNumber" value={formData.identificationNumber} onChange={handleInputChange} icon={<Hash size={16}/>} placeholder="Unique ID" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <ModernInput label="Official Email" name="email" type="email" value={formData.email} onChange={handleInputChange} icon={<Mail size={16}/>} placeholder="name@college.edu" />
                                                {officialDomains.length > 0 && (
                                                    <p className="text-[9px] font-bold text-orange-500 px-3 py-1 bg-orange-50 rounded-full w-fit mt-1">
                                                        Requires: {officialDomains.join(", ")}
                                                    </p>
                                                )}
                                            </div>
                                            <ModernInput label="Contact Number" name="phone" value={formData.phone} onChange={handleInputChange} icon={<Phone size={16}/>} placeholder="+91..." />
                                        </div>

                                        <div className="p-5 bg-orange-50/40 rounded-[1.5rem] border border-orange-100/50 space-y-4">
                                            <ModernInput label="Technical Skills" name="skills" value={formData.skills} onChange={handleInputChange} icon={<Laptop size={16}/>} placeholder="Java, Python, UI/UX..." />
                                            <ModernInput label="Active Interests" name="interests" value={formData.interests} onChange={handleInputChange} icon={<Globe size={16}/>} placeholder="Coding, Sports, Music..." />
                                        </div>

                                        <ModernInput label="Master Session Secret (Password)" name="password" type="password" value={formData.password} onChange={handleInputChange} icon={<Lock size={16}/>} placeholder="••••••••" />
                                    </div>
                                </motion.div>
                            )}

                            {/* --- ACTIONS --- */}
                            <div className="mt-auto pt-8 flex items-center justify-between border-t border-slate-50">
                                {step > 1 ? (
                                        <button 
                                            type="button" 
                                            onClick={() => setStep(prev => prev - 1)} 
                                            className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-all py-1.5 px-3"
                                        >
                                            <ArrowLeft size={16}/> Previous Phase
                                        </button>
                                ) : (
                                    <div />
                                )}

                                {step < 3 ? (
                                    <Button 
                                        type="button" 
                                        onClick={() => {
                                            if (step === 1 && (!formData.collegeId || !formData.branchId)) return toast.error("Choose campus first.");
                                            if (step === 2 && (!formData.rollNo || !formData.division)) return toast.error("Credentials missing.");
                                            setStep(prev => prev + 1);
                                        }}
                                        className="bg-slate-900 hover:bg-black text-white px-8 h-[46px] rounded-xl font-bold transition-all hover:translate-y-[-2px] active:scale-95 flex items-center gap-3 shadow-lg shadow-slate-100"
                                    >
                                        Continue <ArrowRight size={18} />
                                    </Button>
                                ) : (
                                    <Button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="bg-orange-500 hover:bg-orange-600 text-white px-10 h-[46px] rounded-xl font-bold transition-all hover:translate-y-[-2px] active:scale-95 flex items-center gap-3 shadow-lg shadow-orange-100 group"
                                    >
                                        {isLoading ? "Syncing..." : "Finalize Identity"} 
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

