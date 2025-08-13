import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function RelatedProducts({ categoryId, currentProductId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!categoryId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/products?category=${categoryId}&limit=10`);
        if (!response.ok) throw new Error('Failed to fetch related products');
        const data = await response.json();
        
        const filteredProducts = data.data.filter(product => product._id !== currentProductId);
        setProducts(filteredProducts.slice(0, 10));
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [categoryId, currentProductId]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth / 2 : current.offsetWidth / 2;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex overflow-x-auto gap-4 pb-4 px-2 scrollbar-hide">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-60 animate-pulse">
            <div className="h-40 bg-gray-200 rounded-lg mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) return null;

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <div className="absolute left-0 top-1/2 -mt-12 z-10">
          <button
            onClick={() => scroll('left')}
            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition hidden sm:block"
            aria-label="Scroll left"
          >
            <FaChevronLeft size={16} />
          </button>
        </div>
        
        <div className="absolute right-0 top-1/2 -mt-12 z-10">
          <button
            onClick={() => scroll('right')}
            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition hidden sm:block"
            aria-label="Scroll right"
          >
            <FaChevronRight size={16} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef} 
        className="flex overflow-x-auto gap-4 pb-6 px-2 scrollbar-hide snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <Link
            href={`/products/${product._id}`}
            key={product._id}
            className="flex-shrink-0 w-60 sm:w-64 bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition snap-start"
          >
            <div className="relative h-40 sm:h-48 bg-gray-100">
              <img
                src={product.thumbnail || product.images?.[0] || '/placeholder-image.jpg'}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 60vw, 256px"
              />
              {product.discountPercentage > 0 && (
                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                  {product.discountPercentage}% OFF
                </div>
              )}
            </div>
            <div className="p-3 sm:p-4">
              <h3 className="font-medium text-gray-800 line-clamp-1">{product.title}</h3>
              <p className="text-xs text-gray-500 mb-2">{product.model}</p>
              <div className="flex items-baseline gap-1">
                <span className="font-semibold text-sm sm:text-base">
                  {(product.discountedPrice || product.unitPrice)?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </span>
                {product.discountPercentage > 0 && product.discountedPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    {product.unitPrice?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}