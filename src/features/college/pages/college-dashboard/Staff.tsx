import { StaffInfoList } from '../../components/StaffInfoList'
import { FileCard } from '@/components/common/FileCard'


export const Staff = () => {
  return (
    <div className="w-full">

        {/* Search Bar & Filters  */}
        

        <div className='w-full min-h-screen'>
            <StaffInfoList />
        </div>
        <FileCard url="https://drive.google.com/file/d/1uLO9ojCX5LQWS3cBX_1MhB4KzsarlbeH/view?usp=sharing" />

        <div className='text-center'>
          Pagination 
        </div>

    </div>
  );
};
