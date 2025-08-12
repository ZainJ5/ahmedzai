'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSearch, FaTruck, FaArrowRight } from 'react-icons/fa';

export default function Trucks({ title = "Explore Our Latest Arrivals" }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [truckCategories, setTruckCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch truck-specific categories
                const categoriesResponse = await fetch('/api/categories?type=truck');
                if (!categoriesResponse.ok) {
                    throw new Error('Failed to fetch truck categories');
                }
                const categoriesData = await categoriesResponse.json();
                setTruckCategories(categoriesData.data || []);

                // Fetch truck products
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
        // Navigate directly without any unnecessary redirects
        if (selectedCategory) {
            router.push(`/products?tag=Trucks&category=${selectedCategory}`);
        } else {
            router.push('/products?tag=Trucks');
        }
    };

    if (loading) {
        return (
            <section className="bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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

    return (
        <section className="py-4 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
                    
                    {/* Category Search Bar */}
                    <motion.div
                        className="max-w-md mx-auto mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <form onSubmit={handleCategorySearch} className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-grow">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <FaTruck size={16} />
                                </div>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-sm"
                                >
                                    <option value="">All Truck Categories</option>
                                    {truckCategories.map(category => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button 
                                type="submit"
                                className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300 shadow-md flex items-center justify-center"
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
                            className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 ease-in-out border border-slate-100 h-full flex flex-col"
                            onClick={() => handleProductClick(product._id)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="relative w-full aspect-square md:aspect-auto md:h-48 bg-slate-100">
                                <Image
                                    src={product.thumbnail || '/placeholder-product.jpg'}
                                    alt={product.title}
                                    fill
                                    className="object-cover rounded-t-xl"
                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                    loading="eager"
                                />
                            </div>

                            <div className="p-2 md:p-3 flex-grow flex flex-col">
                                <div className="flex flex-wrap items-baseline gap-1 mb-1">
                                    {product.discountPercentage > 0 ? (
                                        <>
                                            <h3 className="text-sm md:text-base font-semibold text-slate-800">
                                                ${product.discountedPrice.toLocaleString()}
                                            </h3>
                                            <p className="text-xs text-slate-400 line-through">
                                                ${product.unitPrice.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-amber-600 font-medium">
                                                {product.discountPercentage}% OFF
                                            </p>
                                        </>
                                    ) : (
                                        <h3 className="text-sm md:text-base font-semibold text-slate-800">
                                            ${product.unitPrice.toLocaleString()}
                                        </h3>
                                    )}
                                </div>

                                <h4 className="text-xs md:text-sm font-medium text-slate-700 mb-1 line-clamp-1">
                                    {product.make?.name} {product.title}
                                </h4>

                                <p className="text-xs text-slate-500 tracking-tight mt-auto line-clamp-1">
                                    {product.category?.name} | {product.year} | {product.model}
                                </p>
                            </div>
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