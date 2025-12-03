import { Button } from '@/components/ui/button'
import React from 'react'

export const CallToAction = () => {
  return (
   <section className="w-full h-[50vh] md:h-[50vh] bg-black py-10 md:py-16">
        <div className="container mx-auto max-w-7xl px-6">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center leading-tight">
                Your Next Successful Event is Just a Click Away!
            </h2>
            <p className="text-lg text-gray-300 text-center leading-relaxed max-w-3xl mx-auto">
                Onboard your college today and empower clubs, students, faculty with one unified platform.
            </p>

            <div className='flex justify-center items-center'>
                <Button size="lg" className='items-center justify-center mt-6'>Get Started Now</Button>
            </div>
        </div>
    </section>
  )
}
