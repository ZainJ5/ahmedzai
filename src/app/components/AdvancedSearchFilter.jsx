"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FaChevronDown, FaSearch, FaTimes, FaFilter, FaGasPump, FaTachometerAlt, FaPalette, FaCarSide, FaCar, FaTruckLoading } from 'react-icons/fa';
import { HiAdjustments } from 'react-icons/hi';
import { FaCogs } from 'react-icons/fa6';
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
    yearFrom: '',
    yearTo: '',
    fuelType: '',
    chassis: '',
    color: '',
    minMileage: '',
    maxMileage: '',
    axleConfiguration: ''
  });
  
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

  const generateYears = (label) => {
    const years = [];
    years.push({ value: '', label: label });
    for (let year = currentYear; year >= currentYear - 30; year--) {
      years.push({ value: year.toString(), label: year.toString() });
    }
    return years;
  };
  
  const yearFromOptions = generateYears('From');
  const yearToOptions = generateYears('To');

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
    
    queryParams.append('page', '1');
    queryParams.append('limit', '12');
    queryParams.append('sortBy', 'createdAt');
    queryParams.append('sortOrder', 'desc');
    
    if (filters.make) queryParams.append('brand', filters.make);
    if (filters.model && filters.model.trim() !== '') queryParams.append('model', filters.model.trim());
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.yearFrom) queryParams.append('yearFrom', filters.yearFrom);
    if (filters.yearTo) queryParams.append('yearTo', filters.yearTo);
    if (filters.fuelType) queryParams.append('fuelType', filters.fuelType);
    if (filters.chassis) queryParams.append('chassis', filters.chassis);
    if (filters.color) queryParams.append('color', filters.color);
    if (filters.minMileage) queryParams.append('minMileage', filters.minMileage);
    if (filters.maxMileage) queryParams.append('maxMileage', filters.maxMileage);
    if (filters.axleConfiguration) queryParams.append('axleConfiguration', filters.axleConfiguration);
    
    router.push(`/products?${queryParams.toString()}`);
  };
  
  const resetFilters = () => {
    setFilters({
      make: '',
      model: '',
      category: '',
      yearFrom: '',
      yearTo: '',
      fuelType: '',
      chassis: '',
      color: '',
      minMileage: '',
      maxMileage: '',
      axleConfiguration: ''
    });
  };

  return (
    <section className="w-full bg-gradient-to-b from-blue-50 to-white/90 py-10 sm:py-14">
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
            transition={{ opacity: 0.6, delay: 0.3 }}
          >
            Search our extensive inventory with precision and ease
          </motion.p>
        </div>
        
        <motion.div 
          ref={wrapperRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden transition-all"
        >
          <div 
            className="lg:hidden flex items-center justify-between p-5 border-b border-gray-100 cursor-pointer bg-white"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center">
              <div className="bg-blue-50 p-2 rounded-lg mr-3">
                <HiAdjustments className="text-red-700 w-5 h-5" />
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
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="hidden lg:block mb-2">
                      <div className="flex items-center">
                        <FaFilter className="text-red-700 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">Search Filters</h3>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Refine your search with precise criteria</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      <div className="space-y-2">
                        <label htmlFor="make" className="block text-sm font-medium text-gray-700 flex items-center">
                          <FaCar className="mr-2 text-gray-500" /> Make / Brand
                        </label>
                        <div className="relative rounded-lg">
                          <select
                            id="make"
                            value={filters.make}
                            onChange={(e) => handleInputChange('make', e.target.value)}
                            className="block w-full rounded-lg border border-gray-200 bg-white shadow-sm pl-3 pr-10 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                            disabled={loading}
                          >
                            <option value="">All Makes</option>
                            {makes.map(make => (
                              <option key={make._id} value={make._id}>
                                {make.name}
                              </option>
                            ))}
                          </select>
                          <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="model" className="block text-sm font-medium text-gray-700 flex items-center">
                          <FaCar className="mr-2 text-gray-500" /> Model
                        </label>
                        <input
                          type="text"
                          id="model"
                          placeholder="Enter model number or keywords"
                          value={filters.model}
                          onChange={(e) => handleInputChange('model', e.target.value)}
                          className="block w-full rounded-lg border border-gray-200 bg-white shadow-sm pl-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          disabled={loading}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 flex items-center">
                          <FaTruckLoading className="mr-2 text-gray-500" /> Categories (Body Type)
                        </label>
                        <div className="relative rounded-lg">
                          <select
                            id="category"
                            value={filters.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            className="block w-full rounded-lg border border-gray-200 bg-white shadow-sm pl-3 pr-10 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                            disabled={loading}
                          >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                              <option key={category._id} value={category._id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                          <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700 flex items-center">
                          <FaCar className="mr-2 text-gray-500" /> Year Range
                        </label>
                        <div className="flex items-center space-x-2">
                          <div className="relative rounded-lg w-1/2">
                            <select
                              id="yearFrom"
                              value={filters.yearFrom}
                              onChange={(e) => handleInputChange('yearFrom', e.target.value)}
                              className="block w-full rounded-lg border border-gray-200 bg-white shadow-sm pl-3 pr-10 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                              disabled={loading}
                            >
                              {yearFromOptions.map(year => (
                                <option key={year.value} value={year.value}>
                                  {year.label}
                                </option>
                              ))}
                            </select>
                            <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          </div>
                          <div className="relative rounded-lg w-1/2">
                            <select
                              id="yearTo"
                              value={filters.yearTo}
                              onChange={(e) => handleInputChange('yearTo', e.target.value)}
                              className="block w-full rounded-lg border border-gray-200 bg-white shadow-sm pl-3 pr-10 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                              disabled={loading}
                            >
                              {yearToOptions.map(year => (
                                <option key={year.value} value={year.value}>
                                  {year.label}
                                </option>
                              ))}
                            </select>
                            <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 flex items-center">
                          <FaGasPump className="mr-2 text-gray-500" /> Fuel Type
                        </label>
                        <div className="relative rounded-lg">
                          <select
                            id="fuelType"
                            value={filters.fuelType}
                            onChange={(e) => handleInputChange('fuelType', e.target.value)}
                            className="block w-full rounded-lg border border-gray-200 bg-white shadow-sm pl-3 pr-10 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                            disabled={loading}
                          >
                            {fuelTypeOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="chassis" className="block text-sm font-medium text-gray-700 flex items-center">
                          <FaCarSide className="mr-2 text-gray-500" /> Chassis
                        </label>
                        <input
                          type="text"
                          id="chassis"
                          placeholder="Enter chassis"
                          value={filters.chassis}
                          onChange={(e) => handleInputChange('chassis', e.target.value)}
                          className="block w-full rounded-lg border border-gray-200 bg-white shadow-sm pl-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          disabled={loading}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="color" className="block text-sm font-medium text-gray-700 flex items-center">
                          <FaPalette className="mr-2 text-gray-500" /> Colour
                        </label>
                        <input
                          type="text"
                          id="color"
                          placeholder="Enter colour"
                          value={filters.color}
                          onChange={(e) => handleInputChange('color', e.target.value)}
                          className="block w-full rounded-lg border border-gray-200 bg-white shadow-sm pl-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          disabled={loading}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="axleConfiguration" className="block text-sm font-medium text-gray-700 flex items-center">
                          <FaTruckLoading className="mr-2 text-gray-500" /> Axle Configuration
                        </label>
                        <input
                          type="text"
                          id="axleConfiguration"
                          placeholder="Enter axle configuration"
                          value={filters.axleConfiguration}
                          onChange={(e) => handleInputChange('axleConfiguration', e.target.value)}
                          className="block w-full rounded-lg border border-gray-200 bg-white shadow-sm pl-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          disabled={loading}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 flex items-center">
                          <FaTachometerAlt className="mr-2 text-gray-500" /> Mileage Range
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            id="minMileage"
                            placeholder="Min (e.g. 10000)"
                            value={filters.minMileage}
                            onChange={(e) => handleInputChange('minMileage', e.target.value)}
                            className="block w-1/2 rounded-lg border border-gray-200 bg-white shadow-sm pl-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            disabled={loading}
                          />
                          <input
                            type="number"
                            id="maxMileage"
                            placeholder="Max (e.g. 50000)"
                            value={filters.maxMileage}
                            onChange={(e) => handleInputChange('maxMileage', e.target.value)}
                            className="block w-1/2 rounded-lg border border-gray-200 bg-white shadow-sm pl-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-6 md:flex md:justify-end md:space-x-4">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="w-full md:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 mb-3 md:mb-0"
                      disabled={loading}
                    >
                      <FaTimes className="mr-2 h-5 w-5" />
                      Clear Filters
                    </button>
                    <button
                      type="submit"
                      className="w-full md:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer transition-all duration-200"
                      disabled={loading}
                    >
                      <FaSearch className="mr-2 h-5 w-5" />
                      Search Inventory
                    </button>
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