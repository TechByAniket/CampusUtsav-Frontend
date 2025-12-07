import { Input } from '@/components/ui/input'
import { students } from '@/services/studentService'
import React from 'react'
import { StudentsInfoList } from '../../components/StudentsInfoList'

export const Students = () => {
  return (
    <section className="mx-auto p-2 min-h-screen w-full bg-gray-100 rounded-[8px]">

        {/* Search Bar & Filters  */}
        <div className="p-2 grid grid-cols-1 lg:grid-cols-2 gap-2 mb-10">
            <div className="flex gap-2 items-center">
              <Input 
                placeholder='Search Students' 
                className='w-full px-4'
                />
              {/* <Search/> */}
            </div>
            <div className="bg-amber-300">Filters</div>
        </div> 

        <div className='w-full min-h-screen'>
            <StudentsInfoList students = {students} />
        </div>

        <div className='text-center'>
          Pagination 
        </div>

    </section>
  )
}
