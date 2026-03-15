import { Input } from '@/components/ui/input'
import { students } from '@/services/studentService'
import { StaffInfoList } from '../../components/StaffInfoList'

export const Staff = () => {
  return (
    <section className="mx-auto p-2 min-h-screen w-full bg-gray-100 rounded-[8px]">

        {/* Search Bar & Filters  */}
        

        <div className='w-full min-h-screen'>
            <StaffInfoList students = {students} />
        </div>

        <div className='text-center'>
          Pagination 
        </div>

    </section>
  )
}
