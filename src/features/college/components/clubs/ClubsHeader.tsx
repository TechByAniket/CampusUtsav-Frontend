import React from 'react';
import { Search } from 'lucide-react';

interface ClubsHeaderProps {
  totalClubs: number;
  onSearch: (query: string) => void;
}

export const ClubsHeader: React.FC<ClubsHeaderProps> = ({ totalClubs, onSearch }) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">
          Club Management <span className="text-indigo-600 ml-2 text-lg">({totalClubs})</span>
        </h2>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
          CampusUtsav Administration
        </p>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text" 
          placeholder="Search name, short form, or admin..." 
          className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 w-full md:w-80 font-medium transition-all" 
          onChange={(e) => onSearch(e.target.value)} 
        />
      </div>
    </div>
  );
};
