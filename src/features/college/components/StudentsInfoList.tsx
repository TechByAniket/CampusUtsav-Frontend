import type { Student } from '@/services/studentService'

type StudentsInfoListProps = {
    students : Student[]
}

export const StudentsInfoList = ({ students }: StudentsInfoListProps) => {
  return (
    <section className="w-full min-h-screen px-2">

      {/* Mobile (Grid / Cards) */}
      <div className="sm:hidden grid gap-3">
  {students.map((s) => (
    <div
      key={s.regId}
      className="p-4 rounded-[8px] bg-white text-sm hover:scale-105 transition-all"
    >
      {/* Name */}
      <p className="font-semibold text-black text-base mb-2">{s.name}</p>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <div className="flex justify-between">
          <span className="text-xs text-gray-400">Reg ID</span>
          <span className="text-black font-medium">{s.regId}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-xs text-gray-400">UID</span>
          <span className="text-black font-medium">{s.collegeUid}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-xs text-gray-400">Year</span>
          <span className="text-black font-medium">{s.year}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-xs text-gray-400">Branch</span>
          <span className="text-black font-medium">{s.branch}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-xs text-gray-400">Division</span>
          <span className="text-black font-medium">{s.division}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-xs text-gray-400">Roll No</span>
          <span className="text-black font-medium">{s.rollNo}</span>
        </div>
      </div>
    </div>
  ))}
</div>




      {/* Desktop (Table) */}
      <div className="hidden sm:block">
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
      <thead className="bg-gradient-to-r from-orange-600 to-orange-400 text-white">
        <tr>
          <th className="p-3 text-left text-sm font-semibold">Sr No.</th>
          <th className="p-3 text-left text-sm font-semibold">Reg ID</th>
          <th className="p-3 text-left text-sm font-semibold">UID</th>
          <th className="p-3 text-left text-sm font-semibold">Name</th>
          <th className="p-3 text-left text-sm font-semibold">Year</th>
          <th className="p-3 text-left text-sm font-semibold">Branch</th>
          <th className="p-3 text-left text-sm font-semibold">Division</th>
          <th className="p-3 text-left text-sm font-semibold">Roll No</th>
          <th className="p-3 text-left text-sm font-semibold">Phone</th>
          <th className="p-3 text-left text-sm font-semibold">Email</th>
        </tr>
      </thead>
      <tbody>
        {students.map((s) => (
          <tr
            key={s.regId}
            className="border-b last:border-none hover:bg-orange-50 transition-colors"
          >
            <td className="p-3 text-black">{s.srNo}</td>
            <td className="p-3 text-black">{s.regId}</td>
            <td className="p-3 text-black">{s.collegeUid}</td>
            <td className="p-3 text-black font-medium">{s.name}</td>
            <td className="p-3 text-black">{s.year}</td>
            <td className="p-3 text-black">{s.branch}</td>
            <td className="p-3 text-black">{s.division}</td>
            <td className="p-3 text-black">{s.rollNo}</td>
            <td className="p-3 text-black">{s.phone}</td>
            <td className="p-3 text-black">{s.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>



    </section>
  );
};
