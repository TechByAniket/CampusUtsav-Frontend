import { Link, Outlet, useLocation } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Mail,
  CalendarDays,
  Users,
  GraduationCap,
} from "lucide-react"
import { Profile } from "@/components/layout/Profile";


export const CollegeDashboardLayout = () => {
    const location = useLocation();

      const pageTitles: Record<string, string> = {
    "/college-dashboard": "Overview",
    "/college-dashboard/overview": "Overview",
    "/college-dashboard/inbox": "Inbox",
    "/college-dashboard/events": "Events",
    "/college-dashboard/students": "Students",
    "/college-dashboard/clubs": "Clubs",
  };

  const pageTitle: string = pageTitles[location.pathname] ?? "";

  const sidebarLinks = [
  {
    label: "Overview",
    path: "/college-dashboard/overview",
    icon: LayoutDashboard,
  },
  {
    label: "Inbox",
    path: "/college-dashboard/inbox",
    icon: Mail,
  },
  {
    label: "Events",
    path: "/college-dashboard/events",
    icon: CalendarDays,
  },
  {
    label: "Clubs",
    path: "/college-dashboard/clubs",
    icon: Users,
  },
  {
    label: "Students",
    path: "/college-dashboard/students",
    icon: GraduationCap,
  },
]


  return (
    <div className="flex w-full min-h-screen">
      
      {/* Sidebar (hidden on small screens) */}
      <aside className="hidden lg:flex flex-col w-72 bg-neutral-900 border-neutral-800
 text-slate-100 border-r ">
      
      {/* Logo */}
      <div className="h-20 flex items-center px-8 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold tracking-wide text-white">
          <span className="text-orange-400">Campus</span>Utsav
        </h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-8 space-y-2">
        {sidebarLinks.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                group flex items-center gap-4 px-5 py-3 rounded-xl
                text-base font-medium transition-all
                ${
                  isActive
                    ? "bg-slate-800 text-white shadow-md"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }
              `}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive
                    ? "text-orange-400"
                    : "text-slate-400 group-hover:text-orange-400"
                }`}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>

      {/* Right side main content */}
      <div className="flex-1 flex flex-col">

        {/* Top Navbar */}
         <header className="h-14 border-b flex justify-between items-center px-4">

          {/* LEFT: Page title */}
          <h1 className="text-2xl font-semibold">{pageTitle}</h1>

          {/* RIGHT: Profile */}
          <Profile />

        </header>

        {/* Content that changes per tab */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

