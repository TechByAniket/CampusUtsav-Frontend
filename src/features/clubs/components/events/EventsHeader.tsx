import React from 'react';
import { Search as SearchIcon, Edit3 as Edit3Icon } from 'lucide-react';

interface EventsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
}

export const EventsHeader: React.FC<EventsHeaderProps> = ({ 
  searchQuery, 
  onSearchChange, 
  onCreateClick 
}) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">Event Console</h1>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
          Manage Institutional Operations
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group flex-1 md:flex-none">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search events by title or ID..."
            className="pl-11 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-indigo-300 w-full md:w-80 font-bold shadow-sm transition-all"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <button 
          onClick={onCreateClick}
          className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-3 shadow-xl shadow-slate-100 active:scale-95 whitespace-nowrap"
        >
          <Edit3Icon size={16} /> Create New Event
        </button>
      </div>
    </header>
  );
};
