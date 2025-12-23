import { Input } from '@/components/ui/input'
import { InboxList } from '@/features/inbox/components/InboxList'
import { InboxTabs } from '@/features/inbox/components/InboxTabs'
import { eventRequests } from '@/services/eventService'
import React, { useState } from 'react'

export const Inbox:React.FC = () => {
    const [activeStatus, setActiveStatus] = useState("pending");
    const filteredRequests = eventRequests.filter(item => item.status === activeStatus);

  return (
    <section className="mx-auto p-2 min-h-screen w-full bg-gray-100 rounded-[8px]">

        {/* Search Bar & Filters  */}
        <div className="p-2 grid grid-cols-1 lg:grid-cols-2 gap-2 mb-10">
            <div className="flex gap-2 items-center">
              <Input 
                placeholder='Search in Inbox' 
                className='w-full px-4 text-xs md:text-sm lg:text-sm'
                />
              {/* <Search/> */}
            </div>
            <InboxTabs activeStatus={activeStatus} setActiveStatus={setActiveStatus} />

            <div>
                
            </div>
        </div>

        <InboxList data={filteredRequests} />

        <div className='text-center'>
          Pagination 
        </div>

    </section>
  )
}
