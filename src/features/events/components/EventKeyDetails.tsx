import React from "react";
import { Calendar, Clock, MapPin, Users, Tag } from "lucide-react";
import type { Event } from "@/types/event";

type EventKeyDetailsProps = Event;

export const EventKeyDetails: React.FC<EventKeyDetailsProps> = (event) => {

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md border overflow-hidden">
      <div className="flex flex-col md:flex-row items-stretch">

        {/* Poster Section — vertical padding matches horizontal */}
        <div className="md:w-[26%] p-2 flex items-start bg-gray-50">
          <img
            src={event.posterUrl}
            alt={event.title}
            className="w-full h-auto object-contain rounded-xl shadow-sm block"
          />
        </div>

        {/* Content Section */}
        <div className="md:w-[74%] p-2 flex flex-col">
          <div className="bg-white rounded-xl p-2 flex-1 flex flex-col justify-between border border-gray-100">

            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <img
                  src={event.clubLogoUrl}
                  alt={event.organizer.name}
                  className="w-14 h-14 rounded-full object-cover border"
                />

                <div className="leading-tight">
                  <p className="text-sm font-bold text-gray-900">
                    {event.organizer.name}
                  </p>
                  {/* <p className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">
                    Organized By
                  </p> */}
                </div>

                <div className="ml-auto flex gap-2">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-bold shadow-sm ${
                      event.status === "Upcoming"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {event.status}
                  </span>

                  <span
                    className={`px-3 py-1 text-xs rounded-full font-bold shadow-sm ${
                      event.isPaid
                        ? "bg-orange-100 text-orange-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {event.isPaid ? "Paid" : "Free"}
                  </span>
                </div>
              </div>

              {/* Event Title */}
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
                {event.title}
              </h1>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <InfoItem icon={<MapPin className="w-5 h-5" />} label="Venue" value={event.venue} />
              <InfoItem icon={<Calendar className="w-5 h-5" />} label="Date" value={event.date} />
              <InfoItem icon={<Clock className="w-5 h-5" />} label="Time" value={event.time} />
              <InfoItem icon={<Tag className="w-5 h-5" />} label="Category" value={event.category} />
            </div>

            {/* Footer Meta */}
            <div className="flex flex-wrap gap-6 pt-3 mt-4 border-t border-gray-100 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                {event.teamSize || "Individual"}
              </div>

              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                {event.type}
              </div>
            </div>
          </div>

          {/* Registration Deadline */}
          <div className="mt-3 bg-red-50 text-red-600 text-center py-3 text-xs md:text-sm font-bold border border-red-100 rounded-lg">
            Registration closes on{" "}
            <span className="underline">
              {event.registrationDeadline}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Reusable InfoItem */
const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-2.5">
    {/* Icon Container: reduced padding to p-1.5 */}
    <div className="text-indigo-500 bg-indigo-50 p-1.5 rounded-lg shrink-0">
      {icon}
    </div>
    
    <div className="flex flex-col">
      {/* 1. leading-none: removes the font's internal top/bottom air
         2. mb-0: removes the bottom margin 
      */}
      <p className="text-[10px] uppercase tracking-tight text-gray-400 leading-none mb-0">
        {label}
      </p>
      
      {/* -mt-0.5: A tiny negative margin pulls the value text 
         upwards to sit right under the label 
      */}
      <p className="text-sm font-semibold text-gray-800 leading-tight -mt-0.5">
        {value}
      </p>
    </div>
  </div>
);