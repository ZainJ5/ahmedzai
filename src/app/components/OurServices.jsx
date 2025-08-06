"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  HiOutlineTruck, 
  HiOutlineBanknotes,
  HiOutlineUserGroup, 
  HiOutlineWrenchScrewdriver, 
  HiOutlineGlobeAmericas, 
  HiOutlineShieldCheck, 
  HiOutlineCube 
} from "react-icons/hi2";
import { 
  MdKeyboardArrowLeft, 
  MdKeyboardArrowRight 
} from "react-icons/md";
import { motion } from "framer-motion";

export default function OurServices() {
  const carouselRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const services = [
    {
      icon: <HiOutlineTruck size={42} strokeWidth={1.5} className="text-[#3e6db5]" />,
      title: "Stock Buying & Export",
      description:
        "Seamlessly purchase vehicles from our curated stock and export them globally with ease.",
    },
    {
      icon: <HiOutlineBanknotes size={42} strokeWidth={1.5} className="text-[#3e6db5]" />,
      title: "Auction Buying Access",
      description:
        "Gain exclusive access to premium car auctions to discover your perfect vehicle.",
    },
    {
      icon: <HiOutlineUserGroup size={42} strokeWidth={1.5} className="text-[#3e6db5]" />,
      title: "Auction with Assistance",
      description:
        "Benefit from expert guidance to confidently navigate and bid at vehicle auctions.",
    },
    {
      icon: <HiOutlineWrenchScrewdriver size={42} strokeWidth={1.5} className="text-[#3e6db5]" />,
      title: "Car Buying for Parts",
      description:
        "Source high-quality vehicles specifically for parts and components with precision.",
    },
    {
      icon: <HiOutlineGlobeAmericas size={42} strokeWidth={1.5} className="text-[#3e6db5]" />,
      title: "Third-Party Outsourcing",
      description:
        "Leverage our expertise for streamlined logistics and procurement outsourcing.",
    },
    {
      icon: <HiOutlineShieldCheck size={42} strokeWidth={1.5} className="text-[#3e6db5]" />,
      title: "RORO Buying & Export",
      description:
        "Efficient Roll-on/Roll-off vehicle buying and export services tailored to your needs.",
    },
    {
      icon: <HiOutlineCube size={42} strokeWidth={1.5} className="text-[#3e6db5]" />,
      title: "Container Buying",
      description:
        "Comprehensive solutions for full container vehicle buying and global export.",
    },
  ];

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, []);

  const checkScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollAmount = direction === "left" ? -clientWidth / 2 : clientWidth / 2;
      carouselRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: "smooth",
      });

      setTimeout(() => {
        checkScrollButtons();
      }, 300);
    }
  };

  const handleScroll = () => {
    checkScrollButtons();
  };

  return (
    <section id="services" className="w-full bg-gradient-to-b from-white to-[#f7faff] py-10 sm:py-18 sm:pb-10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-10">
          <motion.h2
            className="text-4xl sm:text-5xl font-bold text-[#1a3760] tracking-tight"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Our Services
          </motion.h2>
          <motion.p
            className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            Discover our tailored solutions for vehicle procurement, auctions, and global export, designed with precision and professionalism.
          </motion.p>
        </div>

        <div className="relative">
          {showLeftButton && (
            <motion.button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 bg-white rounded-full shadow-lg p-2.5 hover:bg-gray-50 transition-all duration-200 border border-gray-100"
              aria-label="Scroll left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.1, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <MdKeyboardArrowLeft size={28} className="text-[#1a3760]" />
            </motion.button>
          )}
          
          <div 
            ref={carouselRef}
            className="flex space-x-8 overflow-x-auto pb-10 pt-2 px-2 snap-x scrollbar-none"
            onScroll={handleScroll}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                className="min-w-[320px] max-w-[320px] h-[260px] bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 snap-start flex-shrink-0 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="p-8 h-full flex flex-col">
                  <div className="flex justify-center mb-6">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#1a3760] mb-3 text-center">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed flex-grow text-center">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {showRightButton && (
            <motion.button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 bg-white rounded-full shadow-lg p-2.5 hover:bg-gray-50 transition-all duration-200 border border-gray-100"
              aria-label="Scroll right"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.1, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <MdKeyboardArrowRight size={28} className="text-[#1a3760]" />
            </motion.button>
          )}
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