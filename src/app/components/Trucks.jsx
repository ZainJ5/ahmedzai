'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSearch, FaTruck, FaArrowRight, FaChevronDown, FaWhatsapp } from 'react-icons/fa';

export default function Trucks({ title = "Explore Our Latest Arrivals" }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [truckCategories, setTruckCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCategoryName, setSelectedCategoryName] = useState('All Truck Categories');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                const categoriesResponse = await fetch('/api/categories?type=truck');
                if (!categoriesResponse.ok) {
                    throw new Error('Failed to fetch truck categories');
                }
                const categoriesData = await categoriesResponse.json();
                setTruckCategories(categoriesData.data || []);

                const productsResponse = await fetch('/api/products?limit=12&sortBy=createdAt&sortOrder=desc&tag=Trucks');
                if (!productsResponse.ok) {
                    throw new Error('Failed to fetch trucks');
                }
                const productsData = await productsResponse.json();
                setProducts(productsData.data || []);
                
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleProductClick = (productId) => {
        router.push(`/products/${productId}`);
    };

    const handleCategorySearch = (e) => {
        e.preventDefault();
        if (selectedCategory) {
            router.push(`/products?tag=Trucks&category=${selectedCategory}`);
        } else {
            router.push('/products?tag=Trucks');
        }
    };

    const handleCategorySelect = (categoryId, categoryName) => {
        setSelectedCategory(categoryId);
        setSelectedCategoryName(categoryName || 'All Truck Categories');
        setDropdownOpen(false);
    };

    if (loading) {
        return (
            <section className="bg-white">
                <div className="container mx-auto sm:px-4 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Discover Top Picks</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-4"></div>
                        <p className="text-lg text-gray-600 max-w-xl mx-auto">
                            Explore our handpicked selection of premium trucks from top brands
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4">
                        {[...Array(12)].map((_, index) => (
                            <div key={index} className="w-full flex flex-col">
                                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 h-full">
                                    <div className="aspect-square md:aspect-auto md:h-48 bg-slate-100 animate-pulse"></div>
                                    <div className="p-2 md:p-3 flex-grow">
                                        <div className="h-4 md:h-5 bg-slate-100 rounded animate-pulse mb-1 md:mb-2"></div>
                                        <div className="h-3 md:h-4 bg-slate-100 rounded animate-pulse w-2/3 mb-1 md:mb-2"></div>
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
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Discover Top Picks</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-4"></div>
                        <p className="text-lg text-gray-600 max-w-xl mx-auto">
                            Explore our handpicked selection of premium trucks from top brands
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
    const message = encodeURIComponent(`Hello, I'm interested in the ${product.title} (${product.model}) Link:https://ahmadzaitrading.com/products/${product._id}`);
          window.open(`https://wa.me/+818046646786?text=${message}`, '_blank');
        };

        const handleCardClick = () => {
            window.location.href = `/products/${product._id}`;
        };
      
        return (
          <div 
            className="bg-white rounded-lg shadow-sm border text-black border-gray-200 overflow-hidden transition-all duration-300 flex flex-col h-96 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleCardClick}
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
                  <span className="font-medium">Stock Id#</span>
                  <span>{product.model}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="font-medium">FOB Price</span>
                  <span className="text-red-600 font-medium">ASK</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                <button 
                  className="flex-1 bg-red-700 hover:bg-red-800 cursor-pointer sm:text-lg text-sm text-white font-medium rounded py-2 transition-colors"
                >
                  More Details
                </button>
                
                <button 
                  onClick={handleWhatsAppClick}
                  className="w-10 sm:w-12 flex items-center p-1 cursor-pointer justify-center bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors"
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
            <div className="container mx-auto sm:px-4  lg:px-8">
                <div className="text-center mb-8 md:mb-12">
                    <motion.h2
                        className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Explore Our Truck Collection
                    </motion.h2>
                    <motion.p
                        className="sm:text-xl text-lg text-gray-600 max-w-2xl mx-auto mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        Check out the newest trucks added to our collection
                    </motion.p>
                    
                    <motion.div
                        className="max-w-md mx-auto mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <form onSubmit={handleCategorySearch} className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-grow" ref={dropdownRef}>
                                <div 
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm flex items-center justify-between cursor-pointer"
                                >
                                    <div className="flex items-center">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <FaTruck size={16} />
                                        </div>
                                        <span>{selectedCategoryName}</span>
                                    </div>
                                    <FaChevronDown className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </div>
                                
                                {dropdownOpen && (
                                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                        <div 
                                            className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                                            onClick={() => handleCategorySelect('', 'All Truck Categories')}
                                        >
                                            <FaTruck className="text-gray-500" size={16} />
                                            <span>All Truck Categories</span>
                                        </div>
                                        
                                        {truckCategories.map(category => (
                                            <div 
                                                key={category._id} 
                                                className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                                                onClick={() => handleCategorySelect(category._id, category.name)}
                                            >
                                                <div className="relative w-6 h-6 flex-shrink-0">
                                                    <img
                                                        src={category.thumbnail || '/placeholder-category.png'}
                                                        alt={category.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <span>{category.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                <input 
                                    type="hidden" 
                                    name="category"
                                    value={selectedCategory}
                                />
                            </div>
                            <button 
                                type="submit"
                                className="py-3 px-6 bg-red-700 hover:bg-red-800 cursor-pointer text-white font-medium rounded-lg transition duration-300 shadow-md flex items-center justify-center"
                            >
                                <FaSearch className="mr-2" />
                                Search Trucks
                            </button>
                        </form>
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-5">
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

                <div className="flex justify-center mt-8">
                    <Link
                        href="/products?tag=Trucks"
                        className="text-gray-800 font-medium flex items-center hover:text-[#1a3760] transition-colors border-b-2 border-transparent hover:border-[#1a3760] pb-1"
                    >
                        View All Trucks
                        <FaArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}