import { Search, Filter, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { fetchEventMetaData, fetchEventStatuses } from '@/services/eventService';

interface EventFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  activeStatus: string;
  onStatusChange: (status: string) => void;
}

export const EventFilterBar = ({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  activeStatus,
  onStatusChange,
}: EventFilterBarProps) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meta = await fetchEventMetaData();
        const categories = Object.keys(meta) || [];
        setCategories(categories);
        console.log(categories);
        
        const stats = await fetchEventStatuses();
        setStatuses(stats || []);
      } catch (err) {
        console.error("Filter sync failed.", err);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm mb-10">
      {/* Left: Search */}
      <div className="flex-1 max-w-md relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 p-0.5 group-focus-within:text-indigo-500 transition-colors" size={18} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search for events by title, venue or club..." 
          className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200/60 rounded-[1.5rem] text-sm font-bold placeholder:text-slate-400 placeholder:font-black placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-900" 
        />
        {searchQuery && (
          <button 
            onClick={() => onSearchChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-slate-600 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Right: Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category Filter */}
        <div className="relative inline-block">
          <select 
            value={activeCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="appearance-none pl-6 pr-12 py-3.5 bg-slate-50 border border-slate-200/60 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none hover:border-slate-300 focus:border-indigo-500/50 transition-all cursor-pointer text-slate-700"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat: string) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Status Filter */}
        {/* <div className="relative inline-block">
          <select 
            value={activeStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="appearance-none pl-6 pr-12 py-3.5 bg-slate-50 border border-slate-200/60 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none hover:border-slate-300 focus:border-indigo-500/50 transition-all cursor-pointer text-slate-700"
          >
            <option value="ALL">All Status</option>
            {statuses.map((stat: string) => (
              <option key={stat} value={stat}>{stat}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div> */}

        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-2xl border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-slate-50"
          onClick={() => { onSearchChange(""); onCategoryChange("ALL"); onStatusChange("ALL"); }}
        >
          <Filter size={18} />
        </Button>
      </div>
    </div>
  );
};
