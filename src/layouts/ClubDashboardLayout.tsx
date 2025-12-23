import {
  LayoutDashboard,
  Mail,
  CalendarDays,
  BadgeCheck,
} from "lucide-react";
import { Profile } from "@/components/layout/Profile";
import { Link, Outlet, useLocation } from "react-router-dom";

export const ClubDashboardLayout = () => {
  const location = useLocation();

  const pageTitles: Record<string, string> = {
    "/club-dashboard": "Overview",
    "/club-dashboard/overview": "Overview",
    "/club-dashboard/inbox": "Inbox",
    "/club-dashboard/events": "Events",
    "/club-dashboard/profile": "Club Profile",
  };

  const pageTitle = pageTitles[location.pathname] ?? "";

  const sidebarLinks = [
    {
      label: "Overview",
      path: "/club-dashboard/overview",
      icon: LayoutDashboard,
    },
    {
      label: "Inbox",
      path: "/club-dashboard/inbox",
      icon: Mail,
    },
    {
      label: "Events",
      path: "/club-dashboard/events",
      icon: CalendarDays,
    },
    {
      label: "Club Profile",
      path: "/club-dashboard/profile",
      icon: BadgeCheck,
    },
  ];

  return (
    <div className="flex w-full min-h-screen">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-neutral-900 border-neutral-800 text-slate-100 border-r">

        {/* Logo */}
        <div className="h-20 flex items-center px-8 border-b border-slate-800">
          <h1 className="text-2xl font-extrabold tracking-wide text-white">
            <span className="text-orange-400">Campus</span>Utsav
          </h1>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          {sidebarLinks.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

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
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Top Navbar */}
        <header className="h-14 border-b flex justify-between items-center px-4">
          <h1 className="text-2xl font-semibold">{pageTitle}</h1>
          <Profile />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>

      </div>
    </div>
  );
};
