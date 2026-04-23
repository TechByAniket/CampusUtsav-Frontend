import React, { useState } from "react";
import { Calendar, Clock, MapPin, Users, Tag, AlertCircle, ArrowRight, Share2, X } from "lucide-react";
import type { Event } from "@/types/event";
import { Link } from "react-router-dom";
import { EventRegistrationForm } from "@/forms/new-events/EventRegistrationForm";

type EventKeyDetailsProps = Event;

export const EventKeyDetails: React.FC<EventKeyDetailsProps> = ({
  id,
  title,
  posterUrl,
  venue,
  date,
  startTime,
  endTime,
  eventCategory,
  eventType,
  status,
  fees,
  teamEvent,
  teamSize,
  club,
  registrationDeadline,
}) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const isPaid = fees > 0;
  

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.log("Error sharing", err);
    }
  };

  const openEventRegistrationModal = () => {
    setIsModalOpen(true);
  }

  const closeEventRegistrationModal = () => {
    setIsModalOpen(false);
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="flex flex-col md:flex-row items-stretch">
        
        {/* Poster */}
        <div className="md:w-[26%] p-3 flex items-center justify-center bg-gray-50/50">
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-auto object-contain rounded-2xl shadow-md block transition-transform hover:scale-[1.02] duration-300"
          />
        </div>

        {/* Content */}
        <div className="md:w-[74%] p-5 flex flex-col gap-5">
          
          {/* Header Section */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 p-1.5 pr-4 bg-gray-50/80 rounded-2xl border border-gray-100 transition-colors hover:border-indigo-200 group">
              <div className="relative shrink-0">
                <img
                  src={club.logoUrl}
                  alt={club.name}
                  className="w-10 h-10 rounded-xl object-cover border border-white shadow-sm"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 leading-none mb-1">
                  Hosted by
                </span>
                <span className="text-sm font-extrabold text-gray-800 leading-none py-0.5">
                  {club.name}
                </span>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <span className={`px-3 py-1 text-[10px] uppercase tracking-widest rounded-full font-black border ${
                status === "UPCOMING" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-gray-50 text-gray-500 border-gray-100"
              }`}>
                {status}
              </span>
              {/* Only show 'Free' tag here, Hide price from here if it's paid to avoid double info */}
              {!isPaid && (
                <span className="px-3 py-1 text-[10px] uppercase tracking-widest rounded-full font-black border bg-indigo-50 text-indigo-700 border-indigo-100">
                  Free Entry
                </span>
              )}
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight -mt-1">
            {title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoItem icon={<MapPin className="w-4 h-4" />} label="Location" value={venue} />
            <InfoItem icon={<Calendar className="w-4 h-4" />} label="Date" value={date} />
            <InfoItem icon={<Clock className="w-4 h-4" />} label="Schedule" value={`${startTime} – ${endTime}`} />
            <InfoItem icon={<Tag className="w-4 h-4" />} label="Format" value={`${eventCategory} • ${eventType}`} />
          </div>

          {/* Bottom Bar */}
          <div className="mt-auto pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <div className="flex items-center gap-2 px-3.5 py-2 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                <Users className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold text-gray-700">
                   {teamEvent ? `Team of ${teamSize}` : "Solo Entry"}
                </span>
              </div>
              
              <div className="flex items-center gap-2 px-3.5 py-2 bg-red-50 rounded-2xl border border-red-100 shadow-sm">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <div className="flex flex-col sm:flex-row sm:gap-1.5 items-start sm:items-center leading-none">
                  <span className="text-[10px] font-black uppercase tracking-tight text-red-400">Deadline</span>
                  <span className="text-xs font-black text-red-700">{registrationDeadline}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons Group */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              
              {/* 💸 BIG PRICE TAG - Only shows if Paid */}
              {isPaid && (
                <div className="flex flex-col items-end px-2">
                  <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400 leading-none mb-1">Entry Fee</span>
                  <span className="text-xl font-black text-gray-900 leading-none">
                    ₹{fees}
                  </span>
                </div>
              )}

              <button 
                onClick={handleShare}
                className="flex items-center justify-center p-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl border border-gray-200 transition-all active:scale-95 group"
                title="Share Event"
              >
                <Share2 className="w-5 h-5 group-hover:text-indigo-600" />
              </button>
              
              <button onClick={openEventRegistrationModal} className="flex-1 sm:flex-none px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 group">
                Register Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* --- REGISTRATION MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)} // Close on backdrop click
          />
          
          {/* Modal Content Container */}
          <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header with Close Button */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50">
              <div>
                <h2 className="text-2xl font-black text-gray-900 leading-none">Complete Registration</h2>
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-2">
                  {title}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form Body - Scrollable if content is long */}
            <div className="max-h-[80vh] overflow-y-auto p-8">
               <EventRegistrationForm 
                  // eventData={props} 
                  onClose={() => setIsModalOpen(false)} 
                  teamSize={teamSize}
                  isTeamEvent={teamEvent}
                  eventTitle={title}
                  eventId={id}
               />
            </div>
          </div>
        </div>
      )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
/* Reusable InfoItem with Capsule Styling */
const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-2xl border border-gray-100 transition-colors hover:bg-white hover:border-indigo-100">
    <div className="text-indigo-600 bg-white p-2 rounded-xl shadow-sm border border-gray-50">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">
        {label}
      </span>
      <span className="text-sm font-bold text-gray-800 leading-tight">
        {value}
      </span>
    </div>
  </div>
);