"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function BrandLogoGrid() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [screenSize, setScreenSize] = useState('large');
  const carouselRef = useRef(null);
  const router = useRouter();

  // Adjust items per page based on screen size
  const getItemsPerPage = () => {
    if (screenSize === 'small') {
      return 4; // 2 rows x 2 columns for small screens
    }
    return 10; // Keep 10 for larger screens
  };

  // Update screen size state based on window width
  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth < 640 ? 'small' : 'large');
    };

    // Set initial size
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const itemsPerPage = getItemsPerPage();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/brands');
        
        if (!response.ok) {
          throw new Error('Failed to fetch brands');
        }
        
        const data = await response.json();
        setBrands(data.data);
      } catch (err) {
        console.error('Error fetching brands:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBrands();
  }, []);

  useEffect(() => {
    // Reset to first page when screen size changes (and thus itemsPerPage)
    setCurrentPage(0);
  }, [screenSize]);

  const handleBrandClick = (brandId) => {
    router.push(`/products?brand=${brandId}`);
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(brands.length / itemsPerPage) - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const totalPages = Math.ceil(brands.length / itemsPerPage);
  const currentBrands = brands.slice(currentPage * itemsPerPage, (currentPage * itemsPerPage) + itemsPerPage);

  if (loading) {
    return (
      <section className="w-full bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-8 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Discover Top Car Brands</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
              Explore our curated selection of premium automotive brands
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6 mb-8">
            {[...Array(screenSize === 'small' ? 4 : 10)].map((_, index) => (
              <div key={index} className="aspect-square bg-white rounded-2xl shadow-sm p-3 sm:p-6 flex flex-col items-center justify-center border border-gray-200">
                <div className="w-12 h-12 sm:w-20 sm:h-20 bg-gray-100 rounded-full animate-pulse mb-3 sm:mb-6"></div>
                <div className="h-3 sm:h-4 w-12 sm:w-16 bg-gray-100 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-8 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700">Error loading brands: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white via-blue-50/30 to-purple-50/30 py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 px-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Discover Top Car Brands
          </motion.h2>
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Explore our curated selection of premium automotive brands
          </motion.p>
        </div>
        
        <div 
          className="relative px-4 sm:px-0" 
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300
              ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:bg-gray-50'}
              ${isHovering || screenSize === 'small' ? 'opacity-100' : 'opacity-0'}`}
            style={{ left: '4px', transform: 'translateY(-50%)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <AnimatePresence mode="wait">
            <motion.div 
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-rows-2 grid-cols-2 sm:grid-rows-none sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6 mb-8"
              ref={carouselRef}
              style={{ 
                gridTemplateRows: screenSize === 'small' ? 'repeat(2, minmax(0, 1fr))' : '', 
                height: screenSize === 'small' ? 'auto' : '' 
              }}
            >
              {currentBrands.map((brand) => (
                <motion.div
                  key={brand._id}
                  className="brand-card-wrapper"
                  onClick={() => handleBrandClick(brand._id)}
                >
                  <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 
                    flex flex-col items-center justify-center p-3 sm:p-6 h-full
                    border-2 border-gray-200 hover:border-[#1a3760] cursor-pointer">
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mb-3 sm:mb-5">
                      <Image
                        src={brand.thumbnail}
                        alt={`${brand.name} logo`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 48px, (max-width: 768px) 64px, (max-width: 1024px) 80px, 120px"
                      />
                    </div>
                    <h3 className="text-center font-semibold text-gray-900 text-sm sm:text-base md:text-lg lg:text-xl transition-colors">
                      {brand.name}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300
              ${currentPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:bg-gray-50'}
              ${isHovering || screenSize === 'small' ? 'opacity-100' : 'opacity-0'}`}
            style={{ right: '4px', transform: 'translateY(-50%)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex justify-center mt-6 sm:mt-8 mb-4 sm:mb-6 space-x-1.5 sm:space-x-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                currentPage === i ? 'w-6 sm:w-8 bg-black' : 'w-2 sm:w-2.5 bg-gray-300 hover:bg-gray-500'
              }`}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>

        <div className="flex justify-center mt-4">
          <Link 
            href="/products" 
            className="text-gray-800 text-sm sm:text-base font-medium flex items-center hover:text-[#1a3760] transition-colors border-b-2 border-transparent hover:border-[#1a3760] pb-1"
          >
            Show All Makes
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}