import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { FaInstagram, FaLinkedin, FaGlobe } from 'react-icons/fa';
import type { Event } from "@/types/event";

interface Props {
  organizer: Event;
}

export const EventOrganizer: React.FC<Props> = ({ organizer }) => {
  const hasSocials = !!(organizer.instagramUrl || organizer.linkedinUrl || organizer.websiteUrl);

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="px-5 py-3 border-b border-gray-50 bg-white flex items-center gap-3">
        <div className="text-indigo-600 bg-indigo-50 p-1.5 rounded-lg border border-indigo-100 shadow-sm">
          <ShieldCheck size={18} strokeWidth={2.5} />
        </div>
        <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">
          Event Governance
        </h2>
      </div>

      {/* Content Area */}
      <div className="p-4 bg-white">
        <div className="flex items-center gap-5 p-5 bg-gray-50/50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:border-indigo-100 group">
          
          {/* Logo Section */}
          {organizer.club?.logoUrl && (
            <div className="shrink-0 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 group-hover:scale-105 transition-transform">
              <img
                src={organizer.club.logoUrl}
                alt={organizer.club.name}
                className="w-16 h-16 rounded-xl object-contain" // Slightly larger logo for balance
              />
            </div>
          )}

          {/* 🛠️ FIXED TEXT GROUP - No more gap */}
          <div className="flex-1 flex flex-col justify-center min-w-0 h-full">
            <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 leading-none mb-1">
              Official Organizer
            </span>
            
            <h3 className="text-lg font-black text-gray-900 leading-tight tracking-tight">
              {organizer.club?.name || "Independent Organizer"}
            </h3>

            {/* 🔗 Social Icons - Colored & Slightly Bigger */}
            {hasSocials && (
              <div className="flex items-center gap-5 mt-3 pt-3 border-t border-gray-200/60 w-full">
                {organizer.instagramUrl && (
                  <a href={organizer.instagramUrl} target="_blank" rel="noreferrer" 
                     className="text-[#E4405F]/80 hover:text-[#E4405F] transition-all hover:scale-110">
                    <FaInstagram size={20} />
                  </a>
                )}
                {organizer.linkedinUrl && (
                  <a href={organizer.linkedinUrl} target="_blank" rel="noreferrer" 
                     className="text-[#0A66C2]/80 hover:text-[#0A66C2] transition-all hover:scale-110">
                    <FaLinkedin size={20} />
                  </a>
                )}
                {organizer.websiteUrl && (
                  <a href={organizer.websiteUrl} target="_blank" rel="noreferrer" 
                     className="text-indigo-500/80 hover:text-indigo-600 transition-all hover:scale-110">
                    <FaGlobe size={20} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="px-6 py-2 bg-gray-50/30 flex justify-center">
        <div className="h-1 w-12 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
};