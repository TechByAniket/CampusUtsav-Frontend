import { testimonials } from '@/lib/TestimonialData';
import React from 'react'

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  avatar?: string;
}

export const Testimonial = () => {
  return (
    <section className="w-full bg-white py-10 md:py-16">
        <div className="container mx-auto max-w-7xl px-6">
            <span className="block text-red-500 font-semibold text-base uppercase tracking-widest mb-3">
            Don't Just Take Our Word For It
          </span>
          
          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            What Real Organizers Are Saying.
          </h2>
          
          {/* Subtitle */}
          <p className="mt-4 text-lg text-gray-600 leading-relaxed max-w-3xl">
            See how CampusUtsav transformed event management at leading clubs and institutions across the network.
          </p>
        </div>

        <div className='container max-w-7xl mx-auto px-6 mt-6 flex flex-col md:flex-row gap-6'>
            {/* Testimonial content card */}
            {
                testimonials.map((testimonial, index) => (
                    <TestimonialCard 
                      key={index}
                      quote={testimonial.quote}
                      name={testimonial.name}
                      role={testimonial.role}
                      avatar={testimonial.avatar}
                    />
                ))
            }
        </div>
    </section>
  )
}


const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  name,
  role,
  avatar,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-start gap-4">
      <p className="text-gray-700 text-base">{quote}</p>

      <div className="flex items-center gap-3 mb-2 mt-4">
        {/* Profile Picture with border */}
        <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>

        {/* Name and Role */}
        <div className="flex flex-col">
          <span className="font-bold text-gray-900">{name}</span>
          <span className="text-sm text-gray-500">{role}</span>
        </div>
      </div>
    </div>
  );
};