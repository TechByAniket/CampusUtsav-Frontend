import type { Student } from '@/services/studentService'
import React from 'react'

type StudentsInfoListProps = {
    students : Student[]
}

export const StudentsInfoList = ({students} : StudentsInfoListProps) => {
  return (
    <section className='w-full min-h-screen px-2'>

        {/* Mobile (Grid / Cards) */}
      <div className="sm:hidden grid gap-1 bg-white">
        {students.map((s) => (
          <div key={s.regId} className="p-4 grid grid-cols-3 grid-rows-3 border rounded-lg bg-white">
            <p className="col-span-2 row-start-1 text-black font-semibold">{s.name}</p>
            <p className="col-span-1 row-start-1 text-black font-semibold">{s.collegeUid}</p>
            <p className="col-span-1 row-start-2 text-black font-semibold">{s.collegeUid}</p>
            <p className="col-span-1 row-start-2 text-black font-semibold">{s.collegeUid}</p>
            <p className="col-span-1 row-start-2 text-black font-semibold">{s.collegeUid}</p>
            <p className="col-span-1 row-start-3 text-black font-semibold">{s.collegeUid}</p>
            <p className="col-span-1 row-start-3 text-black font-semibold">{s.collegeUid}</p>
            <p className="col-span-1 row-start-3 text-black font-semibold">{s.collegeUid}</p>
          </div>
        ))}
      </div>

      {/* Desktop (Table) */}
      <div className="hidden sm:block bg-white">
        <table className="w-full bg-white rounded-[8px]">
          <thead>
            <tr className="text-left border-gray-200 border-b-[0.5px]">
              <th className="p-2">Sr No.</th>
              <th className="p-2">Reg ID</th>
              <th className="p-2">UID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Year</th>
              <th className="p-2">Branch</th>
              <th className="p-2">Divison</th>
              <th className="p-2">Roll No</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.regId} className="border-b">
                <td className="p-2">{s.srNo}</td>
                <td className="p-2">{s.regId}</td>
                <td className="p-2">{s.collegeUid}</td>
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.year}</td>
                <td className="p-2">{s.branch}</td>
                <td className="p-2">{s.division}</td>
                <td className="p-2">{s.rollNo}</td>
                <td className="p-2">{s.phone}</td>
                <td className="p-2">{s.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
    
  )
}
