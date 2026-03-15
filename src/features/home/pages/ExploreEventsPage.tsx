import React, { useState, useMemo } from 'react';
import { UpcomingEventCard } from '@/features/college/components/UpcomingEventCard';

import { sampleEvents } from '@/services/eventService';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { FeaturedEvents } from '../components/FeaturedEvents';
import { Link } from 'react-router-dom';

export const ExploreEventsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Cultural', 'Technical', 'Sports', 'Workshop', 'Competition'];

  const { featuredEvents, filteredEvents } = useMemo(() => {
    const featured = sampleEvents.filter(e => e.isFeatured);
    const filtered = sampleEvents.filter(event => {
      const matchesTab = activeTab === 'All' || event.eventCategory === activeTab;
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
    return { featuredEvents: featured, filteredEvents: filtered };
  }, [activeTab, searchQuery]);

  return (
    <>
      <div className="min-h-screen bg-[#FCFCFC] text-[#0F172A] pb-20 font-sans selection:bg-[#EA580C] selection:text-white">
        
        <div className="max-w-7xl mx-auto px-6 pt-12">
          
          {/* --- REFINED HEADER SECTION --- */}
          <header className="mb-14">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-2">
                <h1 className="text-5xl lg:text-6xl font-[1000] tracking-tighter text-[#0F172A] leading-none">
                  The Campus <span className="text-[#EA580C]">Pulse</span>
                </h1>
                <p className="text-[#64748B] text-lg font-medium max-w-md leading-relaxed">
                  Discover, engage, and excel. Your gateway to the most anticipated workshops, fests, and competitions.
                </p>
              </div>

              {/* Wider and Shorter Search Bar */}
              <div className="relative group w-full md:w-[450px]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-[#94A3B8] group-focus-within:text-[#EA580C] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find your next experience..."
                  className="w-full pl-11 pr-4 py-2.5 bg-[#F1F5F9] border border-transparent rounded-xl text-[#0F172A] placeholder-[#94A3B8] focus:bg-white focus:ring-4 focus:ring-[#EA580C]/10 focus:border-[#EA580C] transition-all outline-none font-medium shadow-sm"
                />
              </div>
            </div>
          </header>

          {/* --- DYNAMIC FEATURED SECTION --- */}
          <FeaturedEvents events={featuredEvents} />

          {/* --- TABS & GRID --- */}
          <div className="mb-10 flex items-center gap-6 overflow-x-auto no-scrollbar border-b border-[#F1F5F9]">
            {categories.map((cat) => (
              <button 
                key={cat} 
                onClick={() => setActiveTab(cat)} 
                className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === cat ? 'text-[#EA580C]' : 'text-[#94A3B8] hover:text-[#0F172A]'}`}
              >
                {cat}
                {activeTab === cat && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#EA580C]" />}
              </button>
            ))}
          </div>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredEvents.map((event, index) => (
              <div key={index} className="transition-transform duration-300 hover:-translate-y-2">
                <Link to={`/explore-events/events/${event.id}`} >
                  <UpcomingEventCard {...event} />
                </Link>
              </div>
            ))}
          </section>
        </div>
      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
      </>
    
  );
};