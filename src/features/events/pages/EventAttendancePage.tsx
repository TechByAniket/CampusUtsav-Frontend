import { StudentsInfoList } from '@/features/college/components/StudentsInfoList'
import { students } from '@/services/studentService'
import React from 'react'

export const EventAttendancePage:React.FC = () => {
  return (
    <>
        <StudentsInfoList students={students} />
    </>
  ) 
}
