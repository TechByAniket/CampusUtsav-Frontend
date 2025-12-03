import { Button } from '@/components/ui/button'
import React from 'react'
import { CircleArrowRight } from "lucide-react"


export const HeroSection = () => {
  return (
    <section style={{ backgroundImage: "url('/home/HeroSectionBG3.jpeg')" }}
      className="min-h-[91vh] px-4 md:px-8 py-8 bg-cover bg-center flex items-center justify-center flex-col gap-6">

        {/* Heading */}
        <div className='flex flex-col'>
            <h1 className='text-white text-center'>Celebrate Your Campus Spirit With</h1>
            <span><h1 className='text-primary text-center'>CampusUtsav</h1></span>
        </div>

        {/* SubHeading */}
        <div>
            <p className='text-center text-gray-200 text-sm md:text-lg'>Connect.Participate.Shine</p>
            <p className='text-center text-gray-200 text-sm md:text-lg'>Explore college fests, register for events, and be part of the ultimate celebration of talent and creativity across campuses!</p>
        </div>

        {/* CTA Buttons */}
        <div className='flex flex-col md:flex-row gap-4 md:gap-8'>
            <Button className='w-44 text-white' size='lg' variant='outline'>Join as College<CircleArrowRight className='!size-5'/></Button>
            <Button size='lg'>Explore Events</Button>
        </div>
    </section>
  )
}
