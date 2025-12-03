import React from 'react';
// ... other imports

export const HowItWorks = () => {
  return (
    <section className="w-full bg-white py-10 md:py-16">
      <div className="container mx-auto max-w-7xl px-6">
        
        {/* --- UNIQUE HEADING START: Centered Block Style --- */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          
          {/* Eyebrow Tag */}
          <span className="block text-red-500 font-semibold text-base uppercase tracking-widest mb-3">
            The Digital Event Lifecycle
          </span>
          
          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Seamlessly Execute, Step by Step.
          </h2>
          
          {/* Separator Line */}
          <div className="w-16 h-1 bg-red-500 mx-auto mt-6 rounded-full"></div>
        </div>
        {/* --- UNIQUE HEADING END --- */}

        {/* Placeholder for your infographic image, using the responsive swap logic */}
        <div className="mt-12">
            <div className="hidden md:block">
                {/* Horizontal Infographic Placeholder */}
                <div className="h-[60vh] bg-gray-100 flex items-center justify-center text-gray-500 rounded-xl">
                    <img src="/home/HowItWorksDesktop.png" 
                        alt="How It Works Infographics"
                        className='w-full h-full object-cover rounded-xl' 
                    />
                </div>
            </div>
            <div className="block md:hidden">
                 {/* Vertical Infographic Placeholder */}
                <div className="h-[70vh] bg-gray-100 flex items-center justify-center text-gray-500 rounded-xl">
                    <img src="/home/HowItWorksMobile.png" 
                        alt="How It Works Infographics"
                        className='w-full h-auto object-contain rounded-xl' 
                    />
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};