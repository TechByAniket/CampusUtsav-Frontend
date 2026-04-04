import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { Profile } from './Profile';

export const Navbar: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-0.5 group">
          <span className="text-2xl font-black tracking-tighter text-orange-600 group-hover:scale-105 transition-transform duration-300">
            Campus
          </span>
          <span className="text-2xl font-black tracking-tighter text-slate-900 group-hover:scale-105 transition-transform duration-300">
            Utsav
          </span>
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-widest text-slate-500">
          <li>
            <Link to="/" className="hover:text-orange-600 transition-colors duration-200">Home</Link>
          </li>
          <li>
            <Link to="/explore-events" className="hover:text-orange-600 transition-colors duration-200">Explore Events</Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-orange-600 transition-colors duration-200">About Us</Link>
          </li>
          <li>
            <Link to="/developers" className="hover:text-orange-600 transition-colors duration-200" text-red-500>Developers</Link>
          </li>
        </ul>

        {/* Action Area: Profile if logged in, Login if not */}
        <div className="flex items-center gap-4">
          {token ? (
            <Profile />
          ) : (
            <Link to={'/auth/sign-in'}>
              <Button className="bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-[10px] tracking-widest px-6 py-5 rounded-xl shadow-lg shadow-slate-200 transition-all">
                Login Session
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
