import { Button } from '@/components/ui/button'
import { CalendarDays } from 'lucide-react'
import React from 'react'

export const UpcomingPublicEventCard = () => {
  return (
    // CRITICAL FIX: Changed the outer div to a grid container with 3 columns.
    <div className='w-full h-full grid grid-cols-1 md:grid-cols-3 gap-4 p-4 
                bg-gradient-to-r from-amber-200 via-orange-200 to-pink-300
                rounded-[8px] border'>

  
  {/* 1. Image Column */}
  <div className='w-full h-full md:h-full col-span-1'>
    <img 
      src='/event/CodeClashEvent.jpg'
      alt="Upcoming Event Banner" 
      className='w-full h-full object-cover rounded-[8px]'
    />
  </div>

  {/* 2. Content Column */}
  <div className='col-span-1 md:col-span-2 flex flex-col justify-between'>
    
    {/* Top Content: Title, Location, Organizer, Description */}
    <div className='flex flex-col gap-2'>

      <div className='w-fit h-6 px-2 text-sm text-center bg-green-400 rounded-full'>
        Public Event
      </div>
      
      {/* Title & Organizer Row */}
      <div className='flex w-full items-start justify-between'>
        <div className='flex flex-col'>
          <span className='text-xl font-bold'>Spring Fest 2024</span>
          <span className='text-sm text-gray-600'>Location: College Auditorium</span>
        </div>    
        <div>
          <span className='text-base font-semibold text-primary'>CSI</span>
        </div>
      </div>
      
      {/* Description */}
      <div className='text-sm text-gray-700 mt-1'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit officiis totam dolore aut neque expedita cum.
      </div>
      
    </div>

    {/* Bottom Content: Date/Time & Action Button */}
    <div className='w-full grid grid-cols-3 gap-2 items-center pt-6 border-t'>
      
      {/* Date & Time */}
      <div className='col-span-2 flex items-center'> 
        <CalendarDays className='!size-7 text-gray-700 mr-2'/> 

        <div className='flex flex-col'>
          <span className='text-sm font-semibold'>March 12, 2024</span>
          <span className='text-xs text-gray-600'>10:00 AM - 5:00 PM</span>
        </div>
      </div>
      
      {/* View Button */}
      <Button size="sm" className='rounded-[8px]'>View</Button>
      
    </div>
    
  </div>
</div>

  )
}