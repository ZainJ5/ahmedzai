"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from './components/ProductCard';
import FilterSidebar from './components/FilterSiderbar';
import { FaFilter, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    category: [],
    brand: [],
    yearFrom: '',
    yearTo: '',
    fuelType: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    model: '',
    chassis: '',
    color: '',
    minMileage: '',
    maxMileage: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null);
  
  const isInitialMount = useRef(true);
  const isFetching = useRef(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const updatedFilters = { ...filters };
        
        if (searchParams.get('category')) {
          const categoryParam = searchParams.get('category');
          updatedFilters.category = categoryParam.split(',');
        }
        
        if (searchParams.get('brand')) {
          const brandParam = searchParams.get('brand');
          updatedFilters.brand = brandParam.split(',');
        }
        
        if (searchParams.get('yearFrom')) updatedFilters.yearFrom = searchParams.get('yearFrom');
        if (searchParams.get('yearTo')) updatedFilters.yearTo = searchParams.get('yearTo');
        if (searchParams.get('fuelType')) updatedFilters.fuelType = searchParams.get('fuelType');
        if (searchParams.get('model')) updatedFilters.model = searchParams.get('model');
        if (searchParams.get('chassis')) updatedFilters.chassis = searchParams.get('chassis');
        if (searchParams.get('color')) updatedFilters.color = searchParams.get('color');
        if (searchParams.get('minMileage')) updatedFilters.minMileage = searchParams.get('minMileage');
        if (searchParams.get('maxMileage')) updatedFilters.maxMileage = searchParams.get('maxMileage');
        
        if (searchParams.get('page')) setPagination(prev => ({ 
          ...prev, 
          page: parseInt(searchParams.get('page')) 
        }));
        
        setFilters(updatedFilters);
        
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/brands')
        ]);
        
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        if (!brandsRes.ok) throw new Error('Failed to fetch brands');
        
        const categoriesData = await categoriesRes.json();
        const brandsData = await brandsRes.json();
        
        setCategories(categoriesData.data);
        setBrands(brandsData.data);
        
      } catch (err) {
        setError(err.message);
      }
    };
    
    fetchInitialData();
  }, [searchParams]);

  const fetchProducts = useCallback(async () => {
    if (isFetching.current) return;
    
    try {
      isFetching.current = true;
      if (!isInitialMount.current) {
        setIsFiltering(true);
      }
      
      const queryParams = new URLSearchParams();
      queryParams.append('page', pagination.page);
      queryParams.append('limit', pagination.limit);
      
      if (filters.category && filters.category.length) {
        queryParams.append('category', filters.category.join(','));
      }
      
      if (filters.brand && filters.brand.length) {
        queryParams.append('brand', filters.brand.join(','));
      }
      
      if (filters.yearFrom && filters.yearFrom !== '') {
        queryParams.append('yearFrom', filters.yearFrom);
      }
      
      if (filters.yearTo && filters.yearTo !== '') {
        queryParams.append('yearTo', filters.yearTo);
      }
      
      if (filters.fuelType && filters.fuelType !== '') {
        queryParams.append('fuelType', filters.fuelType);
      }
      
      if (filters.model && filters.model !== '') {
        queryParams.append('model', filters.model);
      }
      
      if (filters.chassis && filters.chassis !== '') {
        queryParams.append('chassis', filters.chassis);
      }
      
      if (filters.color && filters.color !== '') {
        queryParams.append('color', filters.color);
      }
      
      if (filters.minMileage && filters.minMileage !== '') {
        queryParams.append('minMileage', filters.minMileage);
      }
      
      if (filters.maxMileage && filters.maxMileage !== '') {
        queryParams.append('maxMileage', filters.maxMileage);
      }
      
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
      
      const response = await fetch(`/api/products?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data.data);
      setPagination(data.pagination);
      
      router.push(`/products?${queryParams.toString()}`, { scroll: false });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      isFetching.current = false;
      
      setTimeout(() => setIsFiltering(false), 300);
      
      isInitialMount.current = false;
    }
  }, [filters, pagination.page, pagination.limit, router]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortClick = (e) => {
    setSortMenuAnchor(e.currentTarget);
    setShowSortOptions(!showSortOptions);
  };

  const handleSortSelect = (sortBy, sortOrder) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder
    }));
    setShowSortOptions(false);
  };

  const getSortLabel = () => {
    switch(filters.sortBy) {
      case 'unitPrice':
        return `Price: ${filters.sortOrder === 'asc' ? 'Low to High' : 'High to Low'}`;
      case 'createdAt':
        return `Date: ${filters.sortOrder === 'desc' ? 'Newest' : 'Oldest'}`;
      case 'title':
        return `Name: ${filters.sortOrder === 'asc' ? 'A to Z' : 'Z to A'}`;
      default:
        return 'Sort By';
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category.length) count += filters.category.length;
    if (filters.brand.length) count += filters.brand.length;
    if (filters.yearFrom || filters.yearTo) count += 1;
    if (filters.fuelType) count += 1;
    if (filters.model) count += 1;
    if (filters.chassis) count += 1;
    if (filters.color) count += 1;
    if (filters.minMileage || filters.maxMileage) count += 1;
    return count;
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (showSortOptions && sortMenuAnchor && !sortMenuAnchor.contains(event.target)) {
        setShowSortOptions(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSortOptions, sortMenuAnchor]);

  return (
    <div className="flex flex-col">
      <div className="w-full bg-white border-b-gray-600 z-50">
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden lg:block w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <FilterSidebar
            categories={categories}
            brands={brands}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="flex-1 bg-gray-50">
          <div className="lg:hidden p-4 bg-white border-b border-gray-200">
            <div
              onClick={() => setShowFilters(!showFilters)}
              className="flex justify-between items-center cursor-pointer"
            >
              <h2 className="text-lg font-medium text-gray-800">Advanced Search</h2>
              <FaChevronUp
                className={`text-gray-500 transition-transform ${
                  !showFilters ? 'transform rotate-180' : ''
                }`}
                size={16}
              />
            </div>
            {showFilters && (
              <div className="mt-4">
                <FilterSidebar
                  categories={categories}
                  brands={brands}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  isMobile={true}
                  onClose={() => setShowFilters(false)}
                />
              </div>
            )}
          </div>
          
          <div className="z-10 bg-white border-b border-gray-200 px-3 sm:px-4 py-3 lg:py-4">
            <div className="flex justify-between items-center">
              <div className="text-xs sm:text-sm text-gray-500">
                <span className="font-medium text-gray-900">{products.length}</span> of 
                <span className="font-medium text-gray-900"> {pagination.total}</span> products
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={handleSortClick}
                    className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-full text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
                  >
                    <span className="mr-1">Sort:</span> 
                    <span className="font-medium">{getSortLabel()}</span>
                    {showSortOptions ? <FaChevronUp className="ml-1.5" size={12} /> : <FaChevronDown className="ml-1.5" size={12} />}
                  </button>

                  {showSortOptions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                      <div className="py-1">
                        <button 
                          onClick={() => handleSortSelect('unitPrice', 'asc')}
                          className={`w-full text-left px-4 py-2 text-sm ${filters.sortBy === 'unitPrice' && filters.sortOrder === 'asc' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                          Price: Low to High
                        </button>
                        <button 
                          onClick={() => handleSortSelect('unitPrice', 'desc')}
                          className={`w-full text-left px-4 py-2 text-sm ${filters.sortBy === 'unitPrice' && filters.sortOrder === 'desc' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                          Price: High to Low
                        </button>
                        <button 
                          onClick={() => handleSortSelect('createdAt', 'desc')}
                          className={`w-full text-left px-4 py-2 text-sm ${filters.sortBy === 'createdAt' && filters.sortOrder === 'desc' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                          Date: Newest First
                        </button>
                        <button 
                          onClick={() => handleSortSelect('title', 'asc')}
                          className={`w-full text-left px-4 py-2 text-sm ${filters.sortBy === 'title' && filters.sortOrder === 'asc' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                          Name: A to Z
                        </button>
                        <button 
                          onClick={() => handleSortSelect('title', 'desc')}
                          className={`w-full text-left px-4 py-2 text-sm ${filters.sortBy === 'title' && filters.sortOrder === 'desc' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                          Name: Z to A
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-4 lg:p-6">
            {error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
                <p className="text-red-700">{error}</p>
              </div>
            ) : (
              <div className="relative">
                {isFiltering && (
                  <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                )}

                {loading && products.length === 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="h-40 xs:h-48 sm:h-56 bg-gray-200 animate-pulse"></div>
                        <div className="p-3 sm:p-4 space-y-3">
                          <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-5 sm:h-6 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                          <div className="h-7 sm:h-8 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center max-w-lg mx-auto">
                    <div className="text-gray-400 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 sm:h-16 w-12 sm:w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-6 text-sm sm:text-base">
                      We couldn't find any products matching your current filters.
                    </p>
                    <button
                      onClick={() => setFilters({
                        category: [],
                        brand: [],
                        yearFrom: '',
                        yearTo: '',
                        fuelType: '',
                        sortBy: 'createdAt',
                        sortOrder: 'desc',
                        model: '',
                        chassis: '',
                        color: '',
                        minMileage: '',
                        maxMileage: ''
                      })}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-sm text-sm sm:text-base"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
                  >
                    {products.map(product => (
                      <motion.div 
                        key={product._id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="h-full"
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {pagination.totalPages > 1 && (
                  <div className="mt-8 sm:mt-10 flex justify-center">
                    <nav className="inline-flex rounded-md shadow-sm">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className={`relative inline-flex items-center px-2 sm:px-4 py-2 rounded-l-md border border-gray-300 bg-white text-xs sm:text-sm font-medium ${
                          pagination.page === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Prev
                      </button>

                      {[...Array(pagination.totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        if (
                          pageNum === 1 ||
                          pageNum === pagination.totalPages ||
                          (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`relative inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 bg-white text-xs sm:text-sm font-medium ${
                                pagination.page === pageNum
                                  ? 'z-10 bg-blue-600 text-white border-blue-600'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          (pageNum === 2 && pagination.page > 3) ||
                          (pageNum === pagination.totalPages - 1 && pagination.page < pagination.totalPages - 2)
                        ) {
                          return <span key={pageNum} className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500">...</span>;
                        } else {
                          return null;
                        }
                      })}

                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className={`relative inline-flex items-center px-2 sm:px-4 py-2 rounded-r-md border border-gray-300 bg-white text-xs sm:text-sm font-medium ${
                          pagination.page === pagination.totalPages
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}