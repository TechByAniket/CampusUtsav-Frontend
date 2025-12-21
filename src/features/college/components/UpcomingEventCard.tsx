import { CalendarDays, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import type { Event } from "@/types/event";


export type UpcomingEventCardProps = Event;

// export const UpcomingEventCard: React.FC<UpcomingEventCardProps> = (event) => {
//   return (
//     <div className='w-full h-full flex flex-col justify-start items-center rounded-[8px] cursor-pointer bg-white shadow-sm'>
      
//       {/* Image */}
//       <div className="relative w-full h-full px-3 py-2"> 
//         <span className='absolute top-4 left-3 px-2 text-xs text-center bg-gray-200 rounded-full'>
//           {event.category}
//         </span>
        
//         <img 
//           src={event.posterUrl}
//           alt={event.title}
//           className='w-full h-full object-contain rounded-[8px]'
//         />
//       </div>

//       {/* Content */}
//       <div className='w-full px-4 py-2 flex flex-col justify-between gap-1'>
//         <div className='flex flex-col'>
//           <span className='text-base font-semibold line-clamp-1'>{event.title}</span>
//           <span className='text-xs text-gray-600 flex gap-1 items-center truncate'>
//             <MapPin size={14}/> {event.venue}
//           </span>
//         </div>    
//         <div>
//           <span className='text-xs font-medium'>{event.organizer.name}</span>
//         </div>
//       </div>

//       {/* Date & Button */}
//       <div className='w-full px-4 py-2 flex flex-col gap-2'>
//         <div className='flex items-center gap-2'> 
//           <CalendarDays className='!size-6 text-gray-700'/>
//           <div className='flex flex-col'>
//             <span className='text-xs font-semibold'>{event.date}</span>
//             <span className='text-[10px] text-gray-600'>{event.time}</span>
//           </div>
//         </div>

//         {/* Dynamic ID */}
//         <Link to={`/college-dashboard/events/${event.id}`}>
//           <Button size="sm" className='rounded-[6px] text-xs w-full'>
//             View
//           </Button>
//         </Link>
//       </div>

//     </div>
//   )
// }

export const UpcomingEventCard: React.FC<UpcomingEventCardProps> = (event) => {
  return (
    <div
      className="
        relative w-full aspect-[4/5]
        rounded-2xl overflow-hidden
        cursor-pointer group shadow-lg hover:shadow-2xl
        transition-transform duration-300 ease-out hover:scale-[1.03]
        bg-black
      "
    >
      {/* Full Poster (NO CROPPING) */}
      <img
        src={event.posterUrl}
        alt={event.title}
        className="absolute inset-0 w-full h-full object-contain object-center"
      />

      {/* FULL Gradient Overlay (top → bottom) */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-t
          from-black/100 via-black/50 to-transparent
        "
      />

      {/* Event Details */}
      <div className="absolute bottom-0 w-full p-4 flex flex-col gap-2 text-white">
        {/* Category */}
        <span className="inline-block px-3 py-1 bg-white/90 text-gray-800 text-xs rounded-full font-medium w-fit">
          {event.category}
        </span>

        {/* Title */}
        <h3 className="font-bold text-white text-lg leading-tight line-clamp-1">
          {event.title}
        </h3>

        {/* Venue + Organizer (merged) */}
        <div className="flex items-center gap-2 text-xs text-white/90 truncate">
          <MapPin size={14} className="shrink-0" />
          <span>{event.venue}</span>
          <span className="opacity-50">•</span>
          <span>{event.organizer.name}</span>
        </div>

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-xs text-white/90">
          <CalendarDays size={12} />
          <div className="flex flex-col">
            <span className="font-semibold">{event.date}</span>
            <span className="text-[10px]">{event.time}</span>
          </div>
        </div>

        {/* CTA */}
        <Link to={`/college-dashboard/events/${event.id}`}>
          <Button
            size="sm"
            className="
              w-full text-xs rounded-[8px]
              border border-orange-400
              text-orange-400
              bg-transparent
              hover:bg-primary hover:text-white
              transition
            "
          >
            View
          </Button>

        </Link>
      </div>
    </div>
  );
};
