import React from 'react'
import { sampleEvents } from '@/services/eventService';
import { StatCard } from '@/features/college/components/StatCard';
import { Doughnut } from '@/components/analytics/Doughnut';
import { BarChart, BarChart2 } from 'lucide-react';
import { CalendarComponent } from '@/features/college/components/CalendarComponent';
import { UpcomingEventCard } from '@/features/college/components/UpcomingEventCard';
import { UpcomingPublicEventCard } from '@/features/college/components/UpcomingPublicEventCard';
import { ClubOverviewHero } from '../../components/ClubOverviewHero';




export const ClubOverview: React.FC = () => {
  return (
    // The main container
    <section className="mx-auto p-2 min-h-screen w-full bg-gray-100 rounded-[8px]">

        {/* Search + Filters */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-10">

            <div className="bg-amber-100">SearchBar</div>
            <div className="bg-amber-300">Filters</div>
        </div>   

        {/* HERO / CTA SECTION */}
        <ClubOverviewHero />


        {/* Dashboard Grid Parent */}
        <div className="grid gap-8 md:gap-4 lg:gap-4 grid-cols-1 lg:grid-cols-5 lg:grid-rows-13">

            {/* The Stats Card Container */}
            <div className="w-full md:w-full lg:col-span-3 grid gap-4 place-items-center 
                grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                <StatCard title="Total Students" value="1200" />
                <StatCard title="Registered Events" value="32" />
                <StatCard title="Monthly Visitors" value="14.2k" />
            </div>

            {/* Charts & Bar Graphs Container */}
            <div className=" lg:col-span-3 lg:row-start-2 lg:row-span-4 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-4">
                <div className="bg-white h-full col-span-1 sm:col-span-1 lg:col-span-1 rounded-[8px]">
                    <Doughnut />
                </div>

                <div className="bg-white h-full col-span-1 sm:col-span-1 lg:col-span-2 rounded-[8px]">
                    <BarChart />
                </div>
            </div>


            {/* <div className="bg-white 
                lg:col-start-4 lg:col-span-2 
                lg:row-start-1 lg:row-span-4
                border-primary border-[1px] rounded-[8px]">
                <UpcomingEventCard />
            </div> */}


            <div className="w-full md:w-full lg:col-span-2 grid gap-2 place-items-center 
                grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
                <StatCard title="Overall Feedback" value="4.3" colour='yellow' />
                <StatCard title="Pending Approvals" value="3" colour='red' />
            </div>


            {/* Upcoming Events Container */}
            {/* <div className="bg-white 
                lg:col-start-4 lg:col-span-2 
                lg:row-start-2 lg:row-span-4
                rounded-[8px]
                ">
                <BarChart2 />
            </div> */}





            <div className='text-center flex justify-center items-center lg:col-start-4 lg:col-span-2
                lg:row-start-2'>
                <h3>Calender</h3>
            </div>


            <div className="h-full px-0 md:px-10 lg:px-10
                lg:col-start-4 lg:col-span-2
                lg:row-start-3 lg:row-span-7 rounded-[8px]">
                <CalendarComponent />
            </div>

            <div className='text-center flex justify-center items-center lg:col-start-1 lg:col-span-3
                lg:row-start-6'>
                <h3>Upcoming Events</h3>
            </div>

            {/* Public Events Container */}
            <div
            className="
                lg:col-start-1 lg:col-span-3
                lg:row-start-7 lg:row-span-5
                grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-4
            "
            >
            {sampleEvents.map((event) => (
                <div
                key={event.id}
                className="bg-white h-full col-span-1 rounded-[8px]"
                >
                <UpcomingEventCard {...event} />
                </div>
            ))}
            </div>
        </div>
    </section>
  );
};

