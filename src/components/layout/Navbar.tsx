import React from 'react'
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

export const Navbar:React.FC = () => {
  return (
    <nav className="bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="text-2xl font-bold">CampusUtsav</div>

        {/* Menu - hidden on mobile, flex on md */}
       <ul className="hidden md:flex items-center gap-12 text-base font-medium">
        <li>
          <Link to="/" className="hover:underline">Home</Link>
        </li>
        <li>
          <Link to="/explore-events" className="hover:underline">Explore Events</Link>
        </li>
        <li>
          <Link to="/about" className="hover:underline">About Us</Link>
        </li>
        <li>
          <Link to="/developers" className="hover:underline">Developers</Link>
        </li>
      </ul>

        {/* Button */}
        <div className="ml-4">
          <Link to={'/auth/sign-in'}>
            <Button className="bg-accent hover:bg-accentLight text-accent-foreground rounded-[8px]">
              Login
            </Button>
          </Link>
          
        </div>
      </div>
    </nav>
  );
};

// export default Navbar;
