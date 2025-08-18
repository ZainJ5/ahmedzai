"use client";

import Link from 'next/link';
import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleWhatsAppClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const message = encodeURIComponent(`Hello, I'm interested in the ${product.title} (${product.model}) Link:https://ahmadzaitrading.com/products/${product._id}`);
    window.open(`https://wa.me/+818046646786?text=${message}`, '_blank');
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border text-black border-gray-200 overflow-hidden transition-all duration-300 flex flex-col h-96"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={product.thumbnail || '/placeholder-product.jpg'} 
          alt={product.title}
          fill
          className={`object-cover transition-all duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
        />
      </div>
      
      <div className="p-3 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="font-bold text-center text-gray-900 text-sm sm:text-lg mb-2 line-clamp-2 h-14 overflow-hidden">
            {product.make?.name} {product.title} {product.year || ""}
          </h3>
          
          <div className="flex justify-between text-sm mb-3">
            <span className="font-medium">Ref#</span>
            <span>{product.model}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="font-medium">FOB Price</span>
            <span className="text-red-600 font-medium">ASK</span>
          </div>
        </div>
        
        <div className="flex gap-2 mt-3">
          <Link href={`/products/${product._id}`} className="flex-1">
            <button 
              className="w-full bg-red-700 hover:bg-red-800 cursor-pointer sm:text-lg text-sm   text-white font-medium rounded py-2 transition-colors"
            >
              More Details
            </button>
          </Link>
          
          <button 
            onClick={handleWhatsAppClick}
            className="w-10 sm:w-12 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors"
            aria-label="Contact via WhatsApp"
          >
            <FaWhatsapp size={30} />
          </button>
        </div>
      </div>
    </div>
  );
}