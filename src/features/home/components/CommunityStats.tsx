import React from 'react'
import {stats}  from '@/lib/StatsData'

interface IndividualStatProps {
  label: string;
  value: string;
}

export const CommunityStats = () => {
  return (
    <section className="w-full md:h-[55vh] bg-black py-10 md:py-16">
        <div className="container mx-auto max-w-7xl px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Join Our{' '}
            <span className="relative z-10 inline-block">
            <span className="relative z-10 text-primary">Ever-Growing Community</span>
              {/* The marker swipe effect */}
              <span className="absolute -bottom-2 left-0 w-full h-4 bg-white opacity-20 -z-10 -rotate-2 rounded-sm"></span>
            </span>
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-0 justify-items-center mt-12'>
            {
                stats.map((stat, index) => (
                    <IndividualStat key={index} label={stat.label} value={stat.value} />
                ))
            }
          </div>
        </div>
    </section>
  )
}


const IndividualStat: React.FC<IndividualStatProps> = ({ label, value }) =>{
    return (
        <div className="w-8/12 md:w-10/12 bg-white rounded-[8px] p-4 flex items-center justify-center">

            {/* Inner Square */} 
            <div className="w-[80%] p-6 bg-gray-300 rounded-[8px] shadow-black shadow-xl flex flex-col items-center justify-center space-y-1">
                <h3 className="text-5xl font-extrabold text-black tracking-tight">
                    {value}
                </h3>
                <p className="text-lg text-gray-700 -mt-10 font-semibold">
                    {label}
                </p>
            </div>

        </div>


    )
}