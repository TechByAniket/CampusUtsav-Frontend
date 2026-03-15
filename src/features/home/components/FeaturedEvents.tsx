import React from 'react';

interface Event {
  title: string;
  posterUrl: string;
  eventCategory: string;
  venue?: string;
  date?: string;
  isFeatured?: boolean;
}

interface FeaturedEventsProps {
  events: Event[];
}

export const FeaturedEvents: React.FC<FeaturedEventsProps> = ({ events }) => {
  if (events.length === 0) return null;

  return (
    <section className="mb-20">
      {/* Spotlight Header */}
      <div className="flex items-center gap-4 mb-8">
        <span className="h-px w-8 bg-[#EA580C]"></span>
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#EA580C]">
          Spotlight
        </h2>
      </div>

      {/* CASE 1: Single Featured Event (Showcase Layout) */}
      {events.length === 1 && (
        <div className="flex flex-col md:flex-row items-center gap-12 bg-white p-8 rounded-[48px] border border-[#F1F5F9] shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-500">
          <div className="w-full md:w-[400px] aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl shrink-0">
            <img src={events[0].posterUrl} className="w-full h-full object-cover" alt={events[0].title} />
          </div>
          <div className="space-y-6">
            <span className="text-[#EA580C] font-bold uppercase text-xs tracking-widest">
              {events[0].eventCategory}
            </span>
            <h3 className="text-5xl lg:text-7xl font-[1000] tracking-tighter leading-none text-[#0F172A]">
              {events[0].title}
            </h3>
            <p className="text-[#64748B] text-lg max-w-xl italic leading-relaxed">
              Don't miss the biggest highlight of the week.
            </p>
            <button className="px-10 py-4 bg-[#0F172A] text-white font-black rounded-2xl hover:bg-[#EA580C] transition-all shadow-lg active:scale-95 uppercase text-sm tracking-widest">
              REGISTER NOW
            </button>
          </div>
        </div>
      )}

      {/* CASE 2: Two Featured Events (Duo Layout) */}
      {events.length === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event, idx) => (
            <div key={idx} className="group relative bg-white p-6 rounded-[40px] border border-[#F1F5F9] shadow-md hover:shadow-xl transition-all duration-500 flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-full sm:w-44 aspect-[4/5] rounded-[24px] overflow-hidden shadow-lg shrink-0 text-white">
                <img src={event.posterUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={event.title} />
              </div>
              <div className="space-y-3">
                <span className="text-[#EA580C] font-black text-[10px] uppercase tracking-widest">
                  {event.eventCategory}
                </span>
                <h3 className="text-2xl font-[1000] leading-tight text-[#0F172A] group-hover:text-[#EA580C] transition-colors">
                  {event.title}
                </h3>
                <div className="text-xs font-bold text-[#94A3B8]">📍 {event.venue}</div>
                <button className="pt-2 text-sm font-black border-b-2 border-[#EA580C] text-[#EA580C] uppercase tracking-tighter">
                  VIEW DETAILS
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CASE 3: Three+ Featured Events (Carousel Layout) */}
      {events.length >= 3 && (
        <div className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar">
          {events.map((event, idx) => (
            <div key={idx} className="relative min-w-[280px] md:min-w-[320px] aspect-[4/5] snap-start group rounded-[40px] overflow-hidden shadow-xl border border-white">
              <img src={event.posterUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform" alt={event.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 p-8">
                <span className="text-[#EA580C] font-black text-[10px] uppercase tracking-widest mb-1 block">
                  {event.eventCategory}
                </span>
                <h3 className="text-xl font-black text-white">{event.title}</h3>
                <button className="mt-4 px-6 py-2 bg-white text-[#0F172A] text-[10px] font-black rounded-lg uppercase tracking-wider">
                  EXPLORE
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};