
import type { Event} from '@/types/event'

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { sampleEvents } from '@/services/eventService'
import { EventKeyDetails } from '../components/EventKeyDetails'
import { EventDescription } from '../components/EventDescription'
import { EventContact } from '../components/EventContact'
import { EventOrganizer } from '../components/EventOrganizer'
// import { EventCollege } from '../components/EventCollege'
import { EventSocialShare } from '../components/EventSocialShare'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { Button } from '@/components/ui/button'

export const AdminEventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  const role = useSelector((state: RootState) => state.auth.role)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    const foundEvent = sampleEvents.find(
      (e) => e.id === Number(id) // ✅ FIX
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

  /* ===== Date & Time Logic (FIXED) ===== */
  const now = new Date()

  const startTime = new Date(`${event.date}T${event.startTime}`)
  const endTime = new Date(`${event.date}T${event.endTime}`)

  const minutesToStart =
    (startTime.getTime() - now.getTime()) / (1000 * 60)

  const isWithinAttendanceWindow =
    minutesToStart <= 30 && now <= endTime

  return (
    <section className="mx-auto p-2 min-h-screen w-full bg-gray-100 rounded-[8px]">

      {/* Event header */}
      <EventKeyDetails {...event} />

      {/* Action bar (role-based) */}
      {role !== "ROLE_STUDENT" && (
        <div className="mt-4 flex justify-end gap-4">
          <Link to={`/college-dashboard/events/${event.id}/analytics`}>
            <Button className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition">
              Analytics
            </Button>
          </Link>

          <Link to={`/college-dashboard/events/${event.id}/registrations`}>
            <Button className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition">
              Registrations
            </Button>
          </Link>

          <Link to={`/college-dashboard/events/${event.id}/attendance`}>
            <Button className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition">
              Attendance
            </Button>
          </Link>
        </div>
      )}

      {/* Main content */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left */}
        <div className="lg:col-span-2">
          
            <EventDescription description={event.description} />
          
        </div>

        {/* Right */}
        <div className="space-y-5">
            <EventContact contactDetails={event.contactDetails} />
            <EventOrganizer organizer={event} />
            {/* <EventSocialShare /> */}
          
        </div>
      </div>
    </section>
  )
}
