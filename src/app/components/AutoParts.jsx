import React from 'react';
import Image from 'next/image'; 

export default function AutoParts({ primaryColor = '#162135' }) { 
  const componentParts = [
    {
      icon: '/engine.webp',
      title: "Engine and Gear x 1",
      subtitle: "(without catalytic converter)"
    },
    {
      icon: '/suspension.webp',
      title: "Front and Rear Suspension",
      subtitle: "x 1"
    },
    {
      icon: '/nose.webp',
      title: "Front Nose Cut x 1",
      subtitle: ""
    },
    {
      icon: '/fenders.webp',
      title: "Front Fenders x 2",
      subtitle: ""
    },
    {
      icon: '/bonnet.webp',
      title: "Bonnet x 1",
      subtitle: ""
    },
    {
      icon: '/sidedoor.webp',
      title: "Side Doors x 4",
      subtitle: ""
    },
    {
      icon: '/sidemirror.webp',
      title: "Side Mirrors x 2",
      subtitle: ""
    },
    {
      icon: '/trunck.webp',
      title: "Back Door or Trunk Lid x 1",
      subtitle: ""
    },
    {
      icon: '/bumper.webp',
      title: "Rear Bumper x 1",
      subtitle: ""
    },
    {
      icon: '/taillights.webp',
      title: "Tail Lights x 2",
      subtitle: ""
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

        <div className="flex flex-row overflow-x-auto gap-4 pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 lg:grid-cols-4 xl:grid-cols-5 md:gap-6 lg:gap-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {componentParts.map((part, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100 flex-shrink-0 w-[180px] md:w-auto"
            >
              <div className="p-4 md:p-6 flex flex-col items-center h-full">
                <div 
                  className="rounded-full p-3 md:p-4 mb-4 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative transition-all group-hover:shadow-inner"
                  style={{ width: '80px', height: '80px', minWidth: '80px', minHeight: '80px' }}
                >
                  <div className="w-full h-full relative">
                    <Image 
                      src={part.icon} 
                      alt={part.title}
                      fill
                      sizes="80px"
                      className="object-contain p-1 transition-all duration-300 filter invert-[25%] sepia-[25%] hue-rotate-[198deg] saturate-[1200%] brightness-[80%] contrast-[90%] group-hover:brightness-[90%]"
                    />
                  </div>
                </div>
                <h3 
                  className="font-semibold text-center text-base md:text-lg mb-1 transition-colors group-hover:text-[#162135]"
                  style={{ color: primaryColor }}
                >
                  {part.title}
                </h3>
                {part.subtitle && (
                  <p className="text-sm text-gray-500 text-center mt-1">{part.subtitle}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}