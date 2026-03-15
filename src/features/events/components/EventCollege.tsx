import React, { useState } from 'react';
import { School, MapPin, Copy, Check } from 'lucide-react';
import { FaInstagram, FaGlobe, FaLinkedin } from 'react-icons/fa';

interface CollegeProps {
  college: {
    name: string;
    shortForm: string;
    logoUrl?: string;
    address: string;
    instagramUrl?: string;
    linkedinUrl?: string;
    websiteUrl?: string;
  };
}

export const EventCollege: React.FC<CollegeProps> = ({ college }) => {
  const [copied, setCopied] = useState(false);
  const hasSocials = !!(college.instagramUrl || college.websiteUrl || college.linkedinUrl);

  const copyAddress = () => {
    navigator.clipboard.writeText(college.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="px-5 py-3 border-b border-gray-50 bg-white flex items-center gap-3">
        <div className="text-indigo-600 bg-indigo-50 p-1.5 rounded-lg border border-indigo-100 shadow-sm">
          <School size={18} strokeWidth={2.5} />
        </div>
        <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest leading-none">
          Venue Institution
        </h2>
      </div>

      {/* Content Area */}
      <div className="p-4 bg-white">
        <div className="flex items-center gap-5 p-5 bg-gray-50/50 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:border-indigo-100 group">
          
          {/* College Logo */}
          {college.logoUrl && (
            <div className="shrink-0 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 group-hover:scale-105 transition-transform">
              <img
                src={college.logoUrl}
                alt={college.name}
                className="w-16 h-16 rounded-xl object-contain"
              />
            </div>
          )}

          {/* Text Group */}
          <div className="flex-1 flex flex-col justify-center min-w-0">
            {/* Shortform Label */}
            <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 leading-none mb-1.5">
              {college.shortForm}
            </span>
            
            {/* College Name */}
            <h3 className="text-lg font-black text-gray-900 leading-none tracking-tight mb-2">
              {college.name}
            </h3>

            {/* 🛠️ ADDRESS ROW - FIXED ALIGNMENT */}
            <div className="flex items-center justify-between group/address">
              <div className="flex items-center gap-1.5 min-w-0 h-4"> 
                {/* h-4 and leading-none forces the icon and text into a tight shared line */}
                <MapPin size={14} className="text-gray-400 shrink-0 mb-[0.5px]" />
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-tight leading-none truncate py-0.5">
                  {college.address}
                </p>
              </div>
              
              <button 
                onClick={copyAddress}
                className="ml-2 p-1 text-gray-400 hover:text-indigo-600 transition-colors opacity-0 group-hover/address:opacity-100 shrink-0"
                title="Copy Address"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>

            {/* Social Icons Row */}
            {hasSocials && (
              <div className="flex items-center gap-5 mt-4 pt-3 border-t border-gray-200/60 w-full">
                {college.instagramUrl && (
                  <a 
                    href={college.instagramUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[#E4405F]/80 hover:text-[#E4405F] transition-all hover:scale-110"
                  >
                    <FaInstagram size={20} />
                  </a>
                )}
                {college.linkedinUrl && (
                  <a 
                    href={college.linkedinUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[#0A66C2]/80 hover:text-[#0A66C2] transition-all hover:scale-110"
                  >
                    <FaLinkedin size={20} />
                  </a>
                )}
                {college.websiteUrl && (
                  <a 
                    href={college.websiteUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-indigo-500/80 hover:text-indigo-600 transition-all hover:scale-110"
                  >
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