import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { type RootState, type AppDispatch } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { accountMenuItems } from "@/services/userService";
import { LogOut, ChevronDown } from "lucide-react";

export const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  // Pulling values from Redux authSlice
  const { email, role, studentSummary } = useSelector((state: RootState) => state.auth);

  // Logic for display name: If student, use summary name, else fallback to email prefix
  const displayName = studentSummary?.name || email?.split('@')[0] || "Admin";
  const displayRole = role?.replace('ROLE_', '').replace('_', ' ') || "College Admin";

  const handleAction = async (item: any) => {
    if (item.action === "navigate" && item.path) {
      navigate(item.path);
    }

    if (item.action === "logout") {
      try {
        dispatch(logout());
        navigate("/auth/sign-in");
        toast.success("Logged out successfully");
      } catch (err) {
        toast.error("Logout failed");
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="
            flex items-center gap-3 px-3 py-6 rounded-2xl
            hover:bg-slate-100 transition-all duration-300
            focus-visible:ring-2 focus-visible:ring-indigo-500/20
          "
        >
          {/* Avatar with System Shadow */}
          <Avatar className="h-9 w-9 border-2 border-white shadow-md ring-1 ring-slate-200">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`} />
            <AvatarFallback className="bg-slate-900 text-white font-black text-xs">
              {displayName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="hidden md:flex flex-col items-start text-left">
            <span className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none">
              {displayName}
            </span>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">
              {displayRole}
            </span>
          </div>
          
          <ChevronDown size={14} className="text-slate-400 ml-1 hidden md:block" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className="
          w-64 rounded-[1.5rem] border border-slate-200
          bg-white p-2 shadow-2xl shadow-slate-200/60
          animate-in fade-in zoom-in-95 duration-200
        "
      >
        {/* Header - Styled like a System Capsule */}
        <div className="px-4 py-4 mb-2 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
            Verified Account
          </p>
          <p className="text-sm font-black text-slate-900 truncate">
            {email}
          </p>
          {studentSummary?.rollNo && (
            <p className="text-[10px] font-bold text-indigo-500 mt-1 uppercase">
              Roll: {studentSummary.rollNo}
            </p>
          )}
        </div>

        <div className="space-y-1">
          {accountMenuItems.map((item, index) => (
            <div key={item.label}>
              <DropdownMenuItem
                onClick={() => handleAction(item)}
                className="
                  flex items-center gap-3 rounded-xl px-4 py-3 text-xs
                  cursor-pointer font-black uppercase tracking-widest
                  text-slate-600 transition-all duration-200
                  hover:bg-slate-900 hover:text-white
                  focus:bg-slate-900 focus:text-white
                "
              >
                <item.icon className="h-4 w-4 opacity-50" />
                <span>{item.label}</span>
              </DropdownMenuItem>

              {/* Separator logic for Logout section */}
              {index === accountMenuItems.length - 2 && (
                <div className="h-px bg-slate-100 my-2 mx-2" />
              )}
            </div>
          ))}

          {/* Hardcoded Logout for System Safety */}
          <DropdownMenuItem
            onClick={() => handleAction({ action: "logout" })}
            className="
              flex items-center gap-3 rounded-xl px-4 py-3 text-xs
              cursor-pointer font-black uppercase tracking-widest
              text-red-500 hover:bg-red-50 hover:text-red-600
              transition-all duration-200
            "
          >
            <LogOut className="h-4 w-4" />
            <span>Logout Session</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};