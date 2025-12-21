
export const WhatIsCampusUtsav = () => {
  return (
    <section className="w-full bg-white py-10 md:py-16">
      <div className="container mx-auto max-w-7xl px-6">
        
        {/* The Grid: 1 col on mobile, 2 cols on md+ screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Col 1: Image */}
          <div className="flex justify-center w-full">
            <img 
              src="/home/WhatIsCampusUtsav.jpeg" 
              alt="CampusUtsav Dashboard" 
              className="w-full h-auto object-contain shadow-2xl rounded-xl"
            />
          </div>

          {/* Col 2: Content */}
          <div>
            {/* Heading */}
            <h2 className="text-4xl md:text-5xl text-foreground mb-6">
              What is <span className="text-red-500">CampusUtsav?</span>
            </h2>

            <div className="space-y-5 text-lg leading-relaxed">
              <p className='text-foreground'>
                CampusUtsav is a centralized digital platform designed to simplify how 
                colleges, clubs, and students connect, organize, and celebrate campus events.
              </p>
              <p className='text-foreground'>
                It brings every part of college event management — from event creation 
                and registration to attendance tracking — into one seamless system.
              </p>
              <p className='text-foreground'>
                With CampusUtsav, colleges can digitize their fests, clubs can promote 
                and manage events effortlessly, and students can explore, register, and 
                participate with just a few clicks.
              </p>
              <p className='text-foreground'>
                Whether it’s a cultural fest, technical symposium, or inter-college 
                competition — CampusUtsav makes managing and experiencing 
                campus life smarter, simpler, and more connected.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
