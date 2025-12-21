
import type { Event} from '@/types/event'

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { sampleEvents } from '@/services/eventService'
import { EventKeyDetails } from '../components/EventKeyDetails'
import { EventDescription } from '../components/EventDescription'
import { EventContact } from '../components/EventContact'
import { EventOrganizer } from '../components/EventOrganizer'
import { EventCollege } from '../components/EventCollege'
import { EventSocialShare } from '../components/EventSocialShare'


export const EventDetailsPage: React.FC = () => {
  const { id } = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('Fetching event with ID:', id)
    if (!id) {
      setLoading(false)
    
      return
    }

    const foundEvent = sampleEvents.find(
      (e) => e.id === id
    )

    setEvent(foundEvent ?? null)
    setLoading(false)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading event details...
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Event not found
      </div>
    )
  }

  return (
    <section className="mx-auto p-2 min-h-screen w-full bg-gray-100 rounded-[8px]">

      <EventKeyDetails {...event}/>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

  {/* Left: Description */}
  <div className="lg:col-span-2">
    <div className="bg-white rounded-2xl border p-6">
      <EventDescription description={event.description} />
    </div>
  </div>

  {/* Right: Meta */}
  <div className="space-y-5">
    <div className="bg-white rounded-2xl border p-5">
      <EventContact contact={event.contact} />
    </div>

    <div className="bg-white rounded-2xl border p-5">
      <EventOrganizer organizer={event.organizer} />
    </div>

    <div className="bg-white rounded-2xl border p-5">
      <EventCollege
        name={event.collegeName}
        meta={event.collegeMeta}
      />
    </div>

    <div className="bg-white rounded-2xl border p-5">
      <EventSocialShare socials={event.socials} />
    </div>
  </div>

</div>

    </section>
  )
}