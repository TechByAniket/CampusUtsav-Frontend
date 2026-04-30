import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { type RootState, type AppDispatch } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { accountMenuItems } from "@/services/userService";
import { LogOut, ChevronDown, ShieldCheck, Sparkles } from "lucide-react";

export const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux Auth Intel
  const { email, role, studentSummary } = useSelector((state: RootState) => state.auth);

  // Identity Mapping
  const displayName = studentSummary?.name || email?.split('@')[0] || "Coordinator";
  const displayRole = role?.replace('ROLE_', '').replace('_', ' ') || "College Admin";

  const handleAction = async (item: any) => {
    if (item.action === "navigate" && item.path) {
      navigate(item.path);
    }

    if (item.action === "logout") {
      try {
        dispatch(logout());
        navigate("/auth/sign-in");
        toast.success("Logged Out Successfully");
      } catch (err) {
        toast.error("Logout failed");
      }
    }
  };

  return (
    <div className="font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="
              h-12 flex items-center gap-2.5 px-3 rounded-2xl
              bg-white border border-slate-200/60 shadow-sm
              hover:bg-slate-50 hover:border-indigo-100 transition-all duration-300
              focus-visible:ring-2 focus-visible:ring-indigo-500/20 active:scale-95 group
            "
          >
            {/* Avatar Pulse Chip */}
            <div className="relative">
              <Avatar className="h-8 w-8 border-2 border-white shadow-sm ring-1 ring-slate-100 group-hover:scale-105 transition-transform">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`} />
                <AvatarFallback className="bg-slate-900 text-white font-black text-[10px]">
                  {displayName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-[1.5px] border-white rounded-full shadow-sm animate-pulse" />
            </div>

            <div className="hidden md:flex flex-col items-start text-left ml-1">
              <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-none truncate max-w-[100px]">
                {displayName}
              </span>
              <span className="text-[8px] font-bold text-indigo-500 uppercase tracking-[0.15em] mt-1 flex items-center gap-1">
                 <ShieldCheck size={8} /> {displayRole}
              </span>
            </div>
            
            <ChevronDown size={14} className="text-slate-300 ml-1 group-hover:text-indigo-400 group-hover:translate-y-0.5 transition-all" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={15}
          className="
            w-72 rounded-[2rem] border border-slate-200/60
            bg-white/95 backdrop-blur-xl p-2.5 shadow-2xl shadow-indigo-100/50
            animate-in fade-in zoom-in-95 duration-200 font-jakarta
          "
        >
          {/* Dashboard Header Capsule */}
          <div className="px-5 py-5 mb-3 bg-slate-50/50 rounded-[1.5rem] border border-slate-100 overflow-hidden relative group">
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-indigo-50/50 rounded-full blur-2xl group-hover:bg-indigo-100/60 transition-colors" />
            
            <div className="relative z-10">            
               <p className="text-sm font-black text-slate-900 truncate leading-tight">
                  {email}
               </p>
               
               {studentSummary?.rollNo && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200/40">
                     <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                        ID: <span className="text-slate-900">{studentSummary.id}</span>
                     </p>
                  </div>
               )}
            </div>
          </div>

          <div className="space-y-1">
            {accountMenuItems.map((item, index) => (
              <div key={item.label}>
                <DropdownMenuItem
                  onClick={() => handleAction(item)}
                  className="
                    flex items-center gap-3 rounded-[1.25rem] px-4 py-3 cursor-pointer
                    text-[10px] font-black uppercase tracking-[0.15em]
                    text-slate-500 transition-all duration-300
                    hover:bg-indigo-600 hover:text-white hover:translate-x-1
                    focus:bg-indigo-600 focus:text-white
                    group/item
                  "
                >
                  <item.icon className="h-3.5 w-3.5 opacity-40 group-hover/item:opacity-100 transition-opacity" />
                  <span>{item.label}</span>
                </DropdownMenuItem>

                {/* Intelligent Separator */}
                {index === accountMenuItems.length - 2 && (
                  <div className="h-px bg-slate-100 my-2 mx-4" />
                )}
              </div>
            ))}

            {/* Student Specific Registrations Tab */}
            {role === 'ROLE_STUDENT' && (
              <DropdownMenuItem
                onClick={() => navigate('/users/registrations')}
                className="
                  flex items-center gap-3 rounded-[1.25rem] px-4 py-3 cursor-pointer
                  text-[10px] font-black uppercase tracking-[0.15em]
                  text-slate-500 transition-all duration-300
                  hover:bg-indigo-600 hover:text-white hover:translate-x-1
                  focus:bg-indigo-600 focus:text-white
                  group/item
                "
              >
                <Sparkles className="h-3.5 w-3.5 opacity-40 group-hover/item:opacity-100 transition-opacity" />
                <span>My Registrations</span>
              </DropdownMenuItem>
            )}

            {/* Logout Protocol */}
            <DropdownMenuItem
              onClick={() => handleAction({ action: "logout" })}
              className="
                mt-2 flex items-center gap-3 rounded-[1.25rem] px-4 py-3.5
                cursor-pointer text-[10px] font-black uppercase tracking-[0.2em]
                text-rose-500 hover:bg-rose-50 hover:text-rose-600
                transition-all duration-300 group/logout
              "
            >
              <LogOut className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
