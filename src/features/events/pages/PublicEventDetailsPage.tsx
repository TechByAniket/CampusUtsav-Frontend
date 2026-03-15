
import type { Event} from '@/types/event'

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { sampleEvents } from '@/services/eventService'
import { EventKeyDetails } from '../components/EventKeyDetails'
import { EventDescription } from '../components/EventDescription'
import { EventContact } from '../components/EventContact'
import { EventOrganizer } from '../components/EventOrganizer'
import { EventCollege } from '../components/EventCollege'
import { Download, FileText, Share2 } from 'lucide-react'
// import { EventCollege } from '../components/EventCollege'


export const PublicEventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    const foundEvent = sampleEvents.find(
      (e) => e.id === Number(id)
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
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
  {/* 1. Hero Header - Full width focus */}
  <EventKeyDetails {...event} />

  {/* 2. Content & Utility Section */}
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
    
    {/* 🚀 LEFT SIDE: Deep Dive (8/12 Cols) */}
    <div className="lg:col-span-8 space-y-6">
      <EventDescription description={event.description} />
      
      {/* 📎 NEW: Horizontal Attachments Row underneath description */}
      {event.attachments && event.attachments.length > 0 && (
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 px-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Resources & Media</h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {event.attachments.map((file, idx) => (
              <a 
                key={idx}
                href="#" // Replace with actual URL
                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-indigo-50 rounded-2xl border border-transparent hover:border-indigo-100 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm group-hover:text-indigo-600">
                    <FileText size={18} />
                  </div>
                  <span className="text-xs font-bold text-gray-700">{file}</span>
                </div>
                <Download size={16} className="text-gray-400 group-hover:text-indigo-600" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* 🛠️ RIGHT SIDE: The Action Panel (4/12 Cols) - Sticky */}
    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
      {/* Unified Management Stack */}
      <div className="space-y-4">
        <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Event Context</h3>
        <EventOrganizer organizer={event} />
        <EventCollege college={event.college} />
      </div>

      <div className="space-y-4">
        <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Direct Support</h3>
        <EventContact contactDetails={event.contactDetails} />
      </div>     
    </div>
  </div>
</div>
  )
}
