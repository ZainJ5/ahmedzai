"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FaChevronDown, FaSearch, FaTimes, FaFilter } from 'react-icons/fa';
import { HiAdjustments } from 'react-icons/hi';
import { FaTruck, FaGasPump, FaCogs } from 'react-icons/fa6';
import 'rc-slider/assets/index.css';

export default function AdvancedSearchFilter() {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [makes, setMakes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentYear] = useState(new Date().getFullYear());
  const wrapperRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    category: '',
    year: '',
    engineConfiguration: '',
    fuelType: ''
  });
  
  const engineConfigOptions = [
    { value: '', label: 'All Engine Types' },
    { value: 'Inline', label: 'Inline/Straight' },
    { value: 'V-type', label: 'V-Type (V6, V8, etc.)' },
    { value: 'Flat', label: 'Flat/Boxer' },
    { value: 'Rotary', label: 'Rotary' },
    { value: 'Single', label: 'Single Cylinder' },
    { value: 'Electric', label: 'Electric Motor' },
    { value: 'Hybrid', label: 'Hybrid' },
    { value: 'Other', label: 'Other' }
  ];
  
  const fuelTypeOptions = [
    { value: '', label: 'All Fuel Types' },
    { value: 'Diesel', label: 'Diesel' },
    { value: 'Gasoline', label: 'Gasoline/Petrol' },
    { value: 'Electric', label: 'Electric' },
    { value: 'Hybrid', label: 'Hybrid' },
    { value: 'CNG', label: 'CNG' },
    { value: 'LPG', label: 'LPG' },
    { value: 'Other', label: 'Other' }
  ];

  const generateYears = () => {
    const years = [];
    years.push({ value: '', label: 'All years' });
    for (let year = currentYear; year >= currentYear - 30; year--) {
      years.push({ value: year.toString(), label: year.toString() });
    }
    return years;
  };
  
  const yearOptions = generateYears();

  // Set isClient to true once component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  useEffect(() => {
    const fetchFiltersData = async () => {
      setLoading(true);
      try {
        const [makesRes, categoriesRes] = await Promise.all([
          fetch('/api/brands'),
          fetch('/api/categories')
        ]);
        
        if (!makesRes.ok || !categoriesRes.ok) {
          throw new Error('Failed to fetch filter data');
        }
        
        const makesData = await makesRes.json();
        const categoriesData = await categoriesRes.json();
        
        setMakes(makesData.data || []);
        setCategories(categoriesData.data || []);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFiltersData();
  }, []);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        wrapperRef.current && 
        !wrapperRef.current.contains(event.target) &&
        isMobile
      ) {
        setIsExpanded(false);
      }
    }
    
    if (isClient) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [wrapperRef, isMobile, isClient]);
  
  const handleInputChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSearch = (e) => {
    e?.preventDefault();
    
    const queryParams = new URLSearchParams();
    
    // Set default pagination and sorting
    queryParams.append('page', '1');
    queryParams.append('limit', '12');
    queryParams.append('sortBy', 'createdAt');
    queryParams.append('sortOrder', 'desc');
    
    // Apply filters
    if (filters.make) queryParams.append('brand', filters.make);
    if (filters.model && filters.model.trim() !== '') queryParams.append('search', filters.model.trim());
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.year) queryParams.append('year', filters.year);
    if (filters.engineConfiguration) queryParams.append('engineConfiguration', filters.engineConfiguration);
    if (filters.fuelType) queryParams.append('fuelType', filters.fuelType);
    
    // Navigate to products page with search parameters
    router.push(`/products?${queryParams.toString()}`);
  };
  
  const resetFilters = () => {
    setFilters({
      make: '',
      model: '',
      category: '',
      year: '',
      engineConfiguration: '',
      fuelType: ''
    });
  };

  return (
    <section className="w-full bg-gradient-to-b from-blue-50/70 to-white py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <motion.h2 
            className="text-3xl text-nowrap sm:text-4xl font-bold text-gray-900 mb-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Find Your Perfect Match
          </motion.h2>
          <motion.p 
            className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Search our extensive inventory with precision and ease
          </motion.p>
        </div>
        
        <motion.div 
          ref={wrapperRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all"
        >
          {/* Mobile Header */}
          <div 
            className="lg:hidden flex items-center justify-between p-5 border-b border-gray-100 cursor-pointer bg-white"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center">
              <div className="bg-blue-50 p-2 rounded-md mr-3">
                <HiAdjustments className="text-blue-600 w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-800">Advanced Search</h3>
              {loading && <span className="ml-3 text-sm text-gray-500">Loading...</span>}
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaChevronDown className="text-gray-500" />
            </motion.div>
          </div>
          
          <AnimatePresence>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: isExpanded || !isMobile ? "auto" : 0,
                opacity: isExpanded || !isMobile ? 1 : 0
              }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`${isClient && !isExpanded && isMobile ? 'hidden' : ''} lg:block`}
            >
              <form onSubmit={handleSearch} className="p-6 lg:p-8">
                <div className="lg:flex lg:space-x-8">
                  <div className="lg:w-2/3 space-y-6">
                    <div className="hidden lg:block mb-2">
                      <div className="flex items-center">
                        <FaFilter className="text-blue-500 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">Search Filters</h3>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Refine your search with precise criteria</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label htmlFor="make" className="block text-sm font-medium text-gray-700">
                          Make / Brand
                        </label>
                        <div className="relative rounded-md">
                          <select
                            id="make"
                            value={filters.make}
                            onChange={(e) => handleInputChange('make', e.target.value)}
                            className="block w-full rounded-lg border-gray-300 shadow-sm pl-3 pr-10 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            disabled={loading}
                          >
                            <option value="">All Makes</option>
                            {makes.map(make => (
                              <option key={make._id} value={make._id}>
                                {make.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                          Model
                        </label>
                        <input
                          type="text"
                          id="model"
                          placeholder="Enter model number or keywords"
                          value={filters.model}
                          onChange={(e) => handleInputChange('model', e.target.value)}
                          className="block w-full rounded-lg border-gray-300 shadow-sm pl-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          disabled={loading}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                          Equipment Category
                        </label>
                        <div className="relative rounded-md">
                          <select
                            id="category"
                            value={filters.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            className="block w-full rounded-lg border-gray-300 shadow-sm pl-3 pr-10 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            disabled={loading}
                          >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                              <option key={category._id} value={category._id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                          Year
                        </label>
                        <div className="relative rounded-md">
                          <select
                            id="year"
                            value={filters.year}
                            onChange={(e) => handleInputChange('year', e.target.value)}
                            className="block w-full rounded-lg border-gray-300 shadow-sm pl-3 pr-10 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            disabled={loading}
                          >
                            {yearOptions.map(year => (
                              <option key={year.value} value={year.value}>
                                {year.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="engineConfiguration" className="block text-sm font-medium text-gray-700">
                          Engine Type
                        </label>
                        <div className="relative rounded-md">
                          <select
                            id="engineConfiguration"
                            value={filters.engineConfiguration}
                            onChange={(e) => handleInputChange('engineConfiguration', e.target.value)}
                            className="block w-full rounded-lg border-gray-300 shadow-sm pl-3 pr-10 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            disabled={loading}
                          >
                            {engineConfigOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700">
                          Fuel Type
                        </label>
                        <div className="relative rounded-md">
                          <select
                            id="fuelType"
                            value={filters.fuelType}
                            onChange={(e) => handleInputChange('fuelType', e.target.value)}
                            className="block w-full rounded-lg border-gray-300 shadow-sm pl-3 pr-10 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            disabled={loading}
                          >
                            {fuelTypeOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:w-1/3 mt-6 lg:mt-0 lg:border-l lg:border-gray-100 lg:pl-8">
                    <div className="space-y-6">
                      <div className="hidden lg:block mb-2">
                        <div className="flex items-center">
                          <FaTruck className="text-blue-500 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-800">Additional Options</h3>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Further refine your equipment search</p>
                      </div>
                      
                      <div className="pt-4 grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={resetFilters}
                          className="inline-flex justify-center items-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                          disabled={loading}
                        >
                          <FaTimes className="mr-2 h-4 w-4" />
                          Reset All
                        </button>
                        <button
                          type="submit"
                          className="inline-flex justify-center items-center px-4 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                          disabled={loading}
                        >
                          <FaSearch className="mr-2 h-4 w-4" />
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}