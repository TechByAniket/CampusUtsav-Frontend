import { sampleEvents } from '@/services/eventService'
import { UpcomingEventCard } from '../../components/UpcomingEventCard'
import { Input } from '@/components/ui/input'
import { Link } from 'react-router-dom'



export const Events = () => {
  return (
    // Main Container
    <section className="mx-auto p-2 min-h-screen w-full bg-gray-100 rounded-[8px]">

        {/* Search Bar & Filters  */}
        <div className="p-2 grid grid-cols-1 lg:grid-cols-2 gap-2 mb-10">
            <div className="flex gap-2 items-center">
              <Input 
                placeholder='Search for Events' 
                className='w-full px-4'
                />
              {/* <Search/> */}
            </div>
            <div className="bg-amber-300">Filters</div>
        </div> 

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-12">
          {sampleEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-[8px] bg-white hover:border-primary hover:bg-primary/5 hover:scale-[1.01] transition-all duration-300 ease-out"
            >
              <Link to={`/college-dashboard/events/${event.id}`} >
                <UpcomingEventCard {...event} />
              </Link>
            </div>
          ))}
        </div>


        <div className='text-center'>
          Pagination 
        </div>

    </section>
  )
}
