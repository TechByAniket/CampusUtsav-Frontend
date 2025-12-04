import { Button } from '@/components/ui/button'
import { CalendarDays, MapPin } from 'lucide-react'
import React from 'react'

export const UpcomingEventCard = () => {
  return (
    <div className='w-full h-full flex flex-col justify-center items-center rounded-[8px]'>
    
    {/* Image with padding added */}
    <div className="relative w-full h-full px-3 py-2"> 
        <span className='absolute top-5 left-4 w-fit h-fit px-2 text-sm text-center bg-gray-200 rounded-full'>
            Technical
        </span>
        
        <img 
            src='/event/CodeClashEvent.jpg'
            alt="Upcoming Event Banner" 
            className='w-full h-full object-contain rounded-[8px]'
        />
    </div>

    <div className='h-[30%] w-full px-5 md:px-3 text-left flex justify-between'>
        <div className='flex flex-col'>
            <span className='text-lg font-bold'>Spring Fest 2024</span>
            <span className='text-sm text-gray-600 flex gap-1 items-center'><MapPin size={15}/> College Auditorium</span>
        </div>    
        <div>
            <span className='text-sm font-semibold'>CSI</span>
        </div>
    </div>

    {/* <div className='h-[20%] w-full md:py-2 px-5 md:px-2 text-sm'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit officiis totam dolore aut neque expedita cum.
    </div> */}

    <div className='w-full py-6 md:py-2 px-4 md:px-2 flex flex-col gap-4'>
        <div className='flex'> 
            <CalendarDays className='!size-7 text-gray-700 mr-2'/>

            <div className='flex flex-col'>
                <span className='text-sm font-semibold'> March 12, 2024</span>
                <span className='text-xs text-gray-600'>10:00 AM - 5:00 PM</span>
            </div>
        </div>

        <Button size="sm" className='rounded-[8px]'>View</Button>
    </div>

</div>

  )
}
