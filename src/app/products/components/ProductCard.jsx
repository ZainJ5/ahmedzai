"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaWhatsapp, FaCalendarAlt, FaTruck, FaWeightHanging } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleWhatsAppClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const message = encodeURIComponent(`Hello, I'm interested in the ${product.title} (${product.model}).`);
    window.open(`https://wa.me/923334928431?text=${message}`, '_blank');
  };

  return (
    <Link href={`/products/${product._id}`}>
      <motion.div 
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 h-full flex flex-col"
        whileHover={{ y: -3, boxShadow: '0 8px 15px rgba(0,0,0,0.06)' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-48 xs:h-52 sm:h-56 w-full bg-gray-50 overflow-hidden">
          <Image 
            src={product.thumbnail || '/placeholder-product.jpg'} 
            alt={product.title}
            fill
            className={`object-contain transition-all duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
          />
          {product.discountPercentage > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {product.discountPercentage}% OFF
            </div>
          )}
        </div>
        
        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          <div className="flex items-center justify-center gap-2 xs:gap-3 sm:gap-5 text-xs text-gray-600 mb-3 border-b border-gray-100 pb-3">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-1 text-gray-500" /> 
              <span>{product.year || "2023"}</span>
            </div>
            <div className="flex items-center">
              <FaTruck className="mr-1 text-gray-500" /> 
              <span className="uppercase">{product.category?.name || "TRUCKS"}</span>
            </div>
            <div className="flex items-center">
              <FaWeightHanging className="mr-1 text-gray-500" /> 
              <span>{product.weight || "0"} Tons</span>
            </div>
          </div>
          
          <h3 className="font-medium text-center text-gray-800 text-sm xs:text-base sm:text-lg mb-4">
            {product.make?.name} {product.title}
          </h3>
          
          <button 
            onClick={handleWhatsAppClick}
            className="mt-auto flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800 text-white font-medium rounded-lg py-2 sm:py-3 px-4 transition-colors w-full text-sm sm:text-base"
            aria-label="Contact via WhatsApp"
          >
            <FaWhatsapp size={20} /> 
            <span>Chat Now</span>
          </button>
        </div>
      </motion.div>
    </Link>
  );
}