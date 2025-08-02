"use client"

import { 
  FiSearch, 
  FiPhone, 
  FiCreditCard, 
  FiCheckCircle,
  FiFileText,
  FiMapPin,
  FiTruck,
  FiFile
} from "react-icons/fi";
import { motion } from 'framer-motion';

export default function HowToImport() {
  const steps = [
    {
      icon: <FiSearch size={40} className="text-[#1A3760]" />,
      title: "Select Vehicle",
      description: "Browse and select your desired vehicle",
    },
    {
      icon: <FiPhone size={40} className="text-[#1A3760]" />,
      title: "Contact & Reserve",
      description: "Contact us to reserve your chosen car",
    },
    {
      icon: <FiCreditCard size={40} className="text-[#1A3760]" />,
      title: "Down Payment",
      description: "Make a down payment and send receipt",
    },
    {
      icon: <FiCheckCircle size={40} className="text-[#1A3760]" />,
      title: "Inspection & Port",
      description: "Vehicle inspection and move to port",
    },
    {
      icon: <FiFileText size={40} className="text-[#1A3760]" />,
      title: "Booking Confirmed",
      description: "Receive booking confirmation",
    },
    {
      icon: <FiMapPin size={40} className="text-[#1A3760]" />,
      title: "Track Shipment",
      description: "Receive Bill of Lading and track shipment",
    },
    {
      icon: <FiCreditCard size={40} className="text-[#1A3760]" />,
      title: "Final Payment",
      description: "Complete the final payment",
    },
    {
      icon: <FiFile size={40} className="text-[#1A3760]" />,
      title: "Receive Documents",
      description: "Get documents and release papers via DHL",
    },
  ];

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-10 rounded-2xl">
      <div className="mx-auto px-6 max-w-8xl">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            How to Import Car
          </motion.h2>
          <motion.p 
            className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Follow these simple steps to import your dream car
          </motion.p>
        </div>
        
        <div className="flex md:grid md:grid-cols-4 gap-6 overflow-x-auto md:overflow-x-hidden snap-x snap-mandatory scrollbar-hide">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-6 md:p-8 text-center flex-shrink-0 w-[200px] md:w-auto snap-center"
            >
              <div className="flex justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="text-lg md:text-xl font-medium text-gray-800 mb-3">{step.title}</h3>
              <p className="text-gray-600 text-sm md:text-base">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}