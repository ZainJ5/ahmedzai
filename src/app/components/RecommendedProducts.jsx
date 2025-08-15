'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

export default function RecommendedProducts({ title = "Explore Our Latest Arrivals" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products?limit=16&sortBy=createdAt&sortOrder=desc');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data.data || []);
      } catch (err) {
        console.error('Error fetching recommended products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="bg-white">
        <div className="container mx-auto px-2 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Explore Our Latest Arrivals</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Check out the newest cars added to our collection
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-6">
            {[...Array(16)].map((_, index) => (
              <div key={index} className="w-full flex flex-col">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 h-full">
                  <div className="aspect-square bg-slate-100 animate-pulse"></div>
                  <div className="p-2 sm:p-3 md:p-4 flex-grow">
                    <div className="h-4 md:h-5 bg-slate-100 rounded animate-pulse mb-1 sm:mb-2"></div>
                    <div className="h-3 md:h-4 bg-slate-100 rounded animate-pulse w-2/3 mb-1 sm:mb-2"></div>
                    <div className="h-2 md:h-3 bg-slate-100 rounded animate-pulse w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Explore Our Latest Arrivals</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Check out the newest cars added to our collection
            </p>
          </div>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700 text-sm font-medium">Error loading recommended products. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const handleWhatsAppClick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      const message = encodeURIComponent(`Hello, I'm interested in the ${product.title} (${product.model}).`);
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
                className="w-full bg-[#0d6cfe] hover:bg-blue-600 cursor-pointer sm:text-lg text-sm   text-white font-medium rounded py-2 transition-colors"
              >
                More Details
              </button>
            </Link>
            
            <button 
              onClick={handleWhatsAppClick}
              className="w-10 sm:w-12 flex p-1 cursor-pointer items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors"
              aria-label="Contact via WhatsApp"
            >
              <FaWhatsapp size={30} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-4 bg-white">
      <div className="container mx-auto sm:px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Explore Our Latest Arrivals
          </motion.h2>
          <motion.p 
            className="sm:text-xl text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Check out the newest cars added to our collection
          </motion.p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-6">
          {products.map((product) => (
            <motion.div 
              key={product._id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-center mt-6 md:mt-8">
          <Link 
            href="/products" 
            className="text-gray-800 font-medium flex items-center hover:text-[#1a3760] transition-colors border-b-2 border-transparent hover:border-[#1a3760] pb-1"
          >
            View All Products 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}