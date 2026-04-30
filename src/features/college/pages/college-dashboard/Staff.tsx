import React from 'react';
import { StaffInfoList } from '../../components/StaffInfoList'


export const Staff = () => {
  return (
    <div className="w-full">

      {/* Search Bar & Filters  */}


      <div className='w-full min-h-screen'>
        <StaffInfoList />
      </div>

      <div className='text-center'>
        Pagination
      </div>

    </div>
  );
};
