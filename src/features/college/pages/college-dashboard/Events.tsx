import { Calendar } from 'lucide-react'
import React from 'react'
import { UpcomingEventCard } from '../../components/UpcomingEventCard'


export const Events = () => {
  return (
    // Main Container
    <section className="mx-auto p-2 min-h-screen w-full bg-gray-100 rounded-[8px]">

        {/* Search Bar & Filters  */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-4">
            <div className="bg-amber-100">SearchBar</div>
            <div className="bg-amber-300">Filters</div>
        </div> 

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-12'>
          <div className=' rounded-[8px] bg-white hover:border-primary hover:bg-primary/5 hover:scale-[1.01] transition-all duration-300 ease-out
'>
            <UpcomingEventCard />
          </div>
          <UpcomingEventCard />
          <UpcomingEventCard />
          <UpcomingEventCard />
          <UpcomingEventCard />
        </div>

    </section>
  )
}
