'use client'

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({ className = '', isMobile = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        fetchSuggestions(searchQuery);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);
  
  const fetchSuggestions = async (query) => {
    if (!query || query.trim().length < 2) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=5`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      
      const data = await response.json();
      setSuggestions(data.data || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  const handleProductSelect = (productId) => {
    setShowSuggestions(false);
    setSearchQuery('');
    router.push(`/products/${productId}`);
  };
  
  const handleSearchFocus = () => {
    if (searchQuery.trim().length >= 2) {
      setShowSuggestions(true);
    }
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
    setSuggestions([]);
  };
  
  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSearch} className="w-full flex">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2.5 text-sm font-medium text-black bg-white border border-slate-200 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-red-700 focus:border-red-700 transition-all duration-300 ease-in-out"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleSearchFocus}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          )}
        </div>
        <button 
          type="submit"
          className="bg-red-700 text-white px-4 py-2.5 rounded-r-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-700 cursor-pointer  transition-all duration-300 ease-in-out"
        >
          <FaSearch className="w-4 h-4" />
        </button>
      </form>
      
      <AnimatePresence>
        {showSuggestions && (
          <motion.div 
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {loading ? (
              <div className="p-4 text-center text-slate-500 text-sm font-light">
                Searching...
              </div>
            ) : suggestions.length > 0 ? (
              <ul>
                {suggestions.map((product) => (
                  <li key={product._id}>
                    <button
                      onClick={() => handleProductSelect(product._id)}
                      className="w-full flex items-center p-4 hover:bg-amber-50 text-left transition-colors duration-200"
                    >
                      <div className="relative w-12 h-12 mr-4 flex-shrink-0">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          fill
                          className="object-contain rounded-sm"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 text-sm truncate">{product.title}</p>
                        <p className="text-xs text-slate-500 truncate">
                          {product.make?.name} · {product.model}
                        </p>
                      </div>
                      {/* <div className="ml-4 text-amber-600 font-semibold text-sm">
                         ${product.unitPrice.toLocaleString()}
                      </div> */}
                    </button>
                  </li>
                ))}
                <li className="border-t border-slate-200">
                  <button
                    onClick={handleSearch}
                    className="w-full p-3 text-center text-amber-600 text-sm font-medium hover:bg-amber-50 transition-colors duration-200"
                  >
                    See all results
                  </button>
                </li>
              </ul>
            ) : searchQuery.trim().length >= 2 ? (
              <div className="p-4 text-center text-slate-500 text-sm font-light">
                No products found
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;