import React from 'react'

export const Footer = () => {
  return (
    <>
    <section className="w-full bg-gray-200 py-10 md:py-16">
      <div className="container mx-auto max-w-7xl px-6 md:pl-20 text-center md:text-left grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Logo */}
        <div>
          <h2 className='text-primary font-bold'>CampusUtsav</h2> 
        </div> 

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul>
            <li className="mb-2"><a href="#" className="text-gray-700 hover:text-primary">Home</a></li>
            <li className="mb-2"><a href="#" className="text-gray-700 hover:text-primary">Explore Events</a></li>
            <li className="mb-2"><a href="#" className="text-gray-700 hover:text-primary">About Us</a></li>
            <li className="mb-2"><a href="#" className="text-gray-700 hover:text-primary">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <p className="text-gray-700">123 Campus St.</p>
          <p className="text-gray-700">City, State, ZIP</p>
          <p className="text-gray-700">Email: info@campusutsav.com</p>
        </div>
      </div>
    </section>
      <div className='w-full h-8 bg-primaryDark text-white text-center'>Copyrights @2025 CampusUtsav</div>
      </>
  )
}
