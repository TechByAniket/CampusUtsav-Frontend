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
          {token && (useSelector((state: RootState) => state.auth.role) === 'ROLE_STUDENT') && (
            <li>
              <Link to="/users/registrations" className="hover:text-orange-600 transition-colors duration-200">My Registrations</Link>
            </li>
          )}
          <li>
            <Link to="/about" className="hover:text-orange-600 transition-colors duration-200">About Us</Link>
          </li>
        </ul>

        {/* Action Area: Profile if logged in, Login if not */}
        <div className="flex items-center gap-3">
          {token ? (
            <Profile />
          ) : (
            <>
              <Link to="/auth/sign-in">
                <Button variant="ghost" className="hidden sm:flex text-slate-600 font-black uppercase text-[10px] tracking-widest px-4 hover:bg-orange-50 hover:text-orange-600 transition-all">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth/sign-up">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white font-black uppercase text-[10px] tracking-widest px-6 py-5 rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
