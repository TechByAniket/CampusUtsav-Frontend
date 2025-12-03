import { Button } from '@/components/ui/button'
import { CalendarDays } from 'lucide-react'
import React from 'react'

export const UpcomingEventCard = () => {
  return (
    <div className='w-full h-full flex flex-col justify-center items-center'>
        <img 
            // src="/home/WhatIsCampusUtsav.jpeg" 
            src='/event/CodeClashEvent.jpg'
            alt="Upcoming Event Banner" 
            className='w-full h-[50%] object-cover rounded-[8px]'
        />
        <div className='h-[10%] w-full p-2 text-left flex justify-between'>
            <div className='flex flex-col'>
                <span className='text-lg font-bold'>Spring Fest 2024</span>
                <span className='text-xs text-gray-600'>Location: College Auditorium</span>
            </div>    
            <div>
                <span className='text-sm font-semibold'>CSI</span>
            </div>
        </div>

        <div className='h-[20%] w-full p-2 text-sm'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit officiis totam dolore aut neque expedita cum.
        </div>

        <div className='w-full p-2 grid grid-cols-1 md:grid-cols-3 gap-2'>
            <div className='col-span-2 flex'> 
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
