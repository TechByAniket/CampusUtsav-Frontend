import { Link, Outlet, useLocation } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const CollegeDashboardLayout = () => {
    const location = useLocation();

      const pageTitles: Record<string, string> = {
    "/college-dashboard": "Overview",
    "/college-dashboard/overview": "Overview",
    "/college-dashboard/events": "Events",
    "/college-dashboard/students": "Students",
    "/college-dashboard/settings": "Settings",
  };

  const pageTitle: string = pageTitles[location.pathname] ?? "";

  return (
    <div className="flex w-full min-h-screen">
      
      {/* Sidebar (hidden on small screens) */}
      <aside className="hidden lg:flex flex-col w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">College Panel</h2>

        <nav className="space-y-3">
          <Link to="/college-dashboard/overview" className="block p-2 rounded hover:bg-gray-800">
            Overview
          </Link>
          <Link to="/college-dashboard/events" className="block p-2 rounded hover:bg-gray-800">
            Events
          </Link>
          <Link to="/college-dashboard/students" className="block p-2 rounded hover:bg-gray-800">
            Students
          </Link>
          <Link to="/college-dashboard/settings" className="block p-2 rounded hover:bg-gray-800">
            Settings
          </Link>
        </nav>
      </aside>

      {/* Right side main content */}
      <div className="flex-1 flex flex-col">

        {/* Top Navbar */}
         <header className="h-14 border-b flex justify-between items-center px-4">

          {/* LEFT: Page title */}
          <h1 className="text-2xl font-semibold">{pageTitle}</h1>

          {/* RIGHT: Profile */}
          <Button variant="ghost" className="flex items-center gap-2">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src="https://www.kindpng.com/picc/m/497-4973038_profile-picture-circle-png-transparent-png.png" />
            </Avatar>
            <div className="flex flex-col">
                <span className="hidden left-0 sm:block">My Account</span>
                <span className="hidden left-0 sm:block">College Admin</span>
            </div>
          </Button>

        </header>

        {/* Content that changes per tab */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

