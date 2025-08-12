"use client"

import React from 'react';
import Link from 'next/link';

export default function AutoParts({ primaryColor = '#162135' }) { 
  const componentParts = [
    {
      image: '/auto-engine.jpg',
      title: "Engine Components",
      description: "High-quality engines and transmission systems from premium Japanese vehicles."
    },
    {
      image: '/auto-nosecut.jpg', 
      title: "Front Nose Cuts",
      description: "Complete front assemblies including bumpers, lights, and radiator supports."
    },
    {
      image: '/auto-halfcut.jpg', 
      title: "Half Cuts",
      description: "Efficient solution for multiple parts from a single vehicle section."
    },
    {
      image: '/auto-bodyshell.jpg',
      title: "Body Shells",
      description: "Complete vehicle frames for full rebuilds and restoration projects."
    },
    {
      image: '/auto-bumper.jpg', 
      title: "Exterior Components",
      description: "Bumpers, panels, and exterior trim parts for various vehicle makes and models."
    }
  ];

  return (
    <section className="py-8 rounded-xl md:py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-2"
          style={{ color: primaryColor }}
        >
          COMPONENTS FOR DISMANTLING
        </h2>
        <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: primaryColor }}></div>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10 text-base md:text-lg">
          High-quality automotive components from premium Japanese vehicles
        </p>

        <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-none">
          {componentParts.map((part, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 flex-shrink-0 w-[280px] md:w-[320px] snap-start flex flex-col"
            >
              <div className="relative w-full h-48">
                <img
                  src={part.image} 
                  alt={part.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                <h3 
                  className="font-semibold text-xl mb-2"
                  style={{ color: primaryColor }}
                >
                  {part.title}
                </h3>
                <p className="text-gray-600 mb-4 flex-grow">{part.description}</p>
                <Link href={`/auto-parts`} className="mt-auto">
                  <button 
                    className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors flex items-center"
                  >
                    View Parts
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
      </div>
      
      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-none {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </section>
  );
}