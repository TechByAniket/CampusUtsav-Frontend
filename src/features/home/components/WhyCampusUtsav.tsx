import React from 'react';
import { LayoutDashboard, QrCode, Users, BarChart3 } from "lucide-react";
import { FeaturesCard } from './FeaturesCard'; 

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <LayoutDashboard className="w-16 h-16 text-white" />,
    title: "Unified Command Center",
    description: "Ditch the scattered Google Forms. Manage approvals, schedules, and venues from a single dashboard."
  },
  {
    icon: <QrCode className="w-16 h-16 text-white" />,
    title: "Smart Check-ins",
    description: "Say goodbye to paper lists. Integrated QR-based ticketing makes registration and entry instant."
  },
  {
    icon: <Users className="w-16 h-16 text-white" />,
    title: "Boosted Engagement",
    description: "Students can easily discover fests, browse club profiles, and get notified about events they care about."
  },
  {
    icon: <BarChart3 className="w-16 h-16 text-white" />,
    title: "Real-Time Insights",
    description: "Track live attendance, analyze participation trends, and generate reports to improve future events."
  }
];

export const WhyCampusUtsav: React.FC = () => {
  return (
    <section className="w-full bg-white py-10 md:py-16">
      <div className="container mx-auto max-w-7xl px-6">
        
        {/* --- HEADING START --- */}
        <div className="max-w-3xl mb-16 text-left">
          <span className="block text-red-500 font-bold text-sm uppercase tracking-widest mb-3">
            The Campus Advantage
          </span>
          
          {/* H2 has the responsive sizing from the CSS reset: text-4xl md:text-5xl font-extrabold etc. */}
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Why choose{' '}
            <span className="relative z-10 inline-block">
              <span className="relative z-10 text-gray-900">CampusUtsav</span>
              {/* The marker swipe effect */}
              <span className="absolute -bottom-2 left-0 w-full h-4 bg-red-500 opacity-20 -z-10 -rotate-2 rounded-sm"></span>
            </span>
            ?
          </h2>

          <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-2xl">
            Move beyond spreadsheets and disjointed tools. We provide the infrastructure 
            to make campus life smarter, faster, and more connected for everyone.
          </p>
        </div>
        {/* --- HEADING END --- */}


        {/* --- CARDS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              // Pass the feature object to the typed component
              <FeaturesCard key={index} feature={feature} />
            ))}
        </div>

      </div>
    </section>
  );
};