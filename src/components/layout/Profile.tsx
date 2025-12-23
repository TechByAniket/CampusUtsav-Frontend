import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { accountMenuItems } from "@/services/userService";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { toast } from "sonner";

export const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleAction = async (item: any) => {
    if (item.action === "navigate" && item.path) {
      navigate(item.path);
    }

    if (item.action === "logout") {
  try {
    // Call backend logout (optional)
    // await logoutApi();

    // Clear global state
    dispatch(logout());

    // Redirect to signin
    navigate("/auth/sign-in");
    
    toast.success("Logged out successfully!");
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Logout failed");
  }
}
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="
            flex items-center gap-3 px-2 py-1.5 rounded-xl
            transition-all
            hover:bg-muted
            focus-visible:ring-2 focus-visible:ring-orange-300
          "
        >
          <Avatar className="h-10 w-10 border border-border shadow-sm">
            <AvatarImage src="https://www.kindpng.com/picc/m/497-4973038_profile-picture-circle-png-transparent-png.png" />
            <AvatarFallback className="bg-muted text-foreground">
              CA
            </AvatarFallback>
          </Avatar>

          <div className="hidden sm:flex flex-col items-start text-sm leading-tight">
            <span className="font-medium text-foreground">
              My Account
            </span>
            <span className="text-xs text-muted-foreground">
              College Admin
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="
          w-56 rounded-xl border border-border
          bg-popover text-popover-foreground
          p-1 shadow-xl
          data-[state=open]:animate-in
          data-[state=closed]:animate-out
          data-[state=open]:fade-in-0
          data-[state=closed]:fade-out-0
          data-[state=open]:zoom-in-95
          data-[state=closed]:zoom-out-95
          data-[side=bottom]:slide-in-from-top-2
          data-[side=top]:slide-in-from-bottom-2
        "
      >
        {/* Header */}
        <div className="px-3 py-2">
          <p className="text-sm font-semibold text-foreground">
            College Admin
          </p>
          <p className="text-xs text-muted-foreground truncate">
            admin@college.edu
          </p>
        </div>

        <DropdownMenuSeparator className="my-1 bg-border" />

        {accountMenuItems.map((item, index) => (
          <div key={item.label}>
            <DropdownMenuItem
              onClick={() => handleAction(item)}
              className="
                group flex items-center gap-3 rounded-lg px-3 py-2 text-sm
                cursor-pointer transition-colors
                text-foreground
                hover:bg-black hover:text-white
                focus:bg-black focus:text-white
              "
            >
              <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-white" />
              <span className="font-medium">{item.label}</span>
            </DropdownMenuItem>

            {index === accountMenuItems.length - 2 && (
              <DropdownMenuSeparator className="my-1 bg-border" />
            )}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
