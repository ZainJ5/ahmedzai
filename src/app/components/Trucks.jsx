'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Trucks({ title = "Explore Our Latest Arrivals" }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Fetch up to 8 products for the 4x2 grid
                const response = await fetch('/api/products?limit=8&sortBy=createdAt&sortOrder=desc&category=6890ae47d1f3719edf5910a9');

                if (!response.ok) {
                    throw new Error('Failed to fetch trucks');
                }

                const data = await response.json();
                setProducts(data.data || []);
            } catch (err) {
                console.error('Error fetching trucks:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleProductClick = (productId) => {
        router.push(`/products/${productId}`);
    };

    if (loading) {
        return (
            <section className="bg-white py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Discover Top Picks</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-4"></div>
                        <p className="text-lg text-gray-600 max-w-xl mx-auto">
                            Explore our handpicked selection of premium cars from top brands
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="flex-shrink-0 w-full">
                                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
                                    <div className="h-52 bg-slate-100 animate-pulse"></div>
                                    <div className="p-5">
                                        <div className="h-7 bg-slate-100 rounded animate-pulse mb-3"></div>
                                        <div className="h-5 bg-slate-100 rounded animate-pulse w-2/3 mb-3"></div>
                                        <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4"></div>
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
                            Explore our handpicked selection of premium cars from top brands
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
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h2
                        className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Explore Our Truck Collection
                    </motion.h2>
                    <motion.p
                        className="sm:text-xl text-lg text-gray-600 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        Check out the newest trucks added to our collection
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <motion.div
                            key={product._id}
                            className="w-full cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 ease-in-out border border-slate-100"
                            onClick={() => handleProductClick(product._id)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="relative h-52 w-full bg-slate-100">
                                <Image
                                    src={product.thumbnail || '/placeholder-product.jpg'}
                                    alt={product.title}
                                    fill
                                    className="object-cover rounded-t-xl"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 280px"
                                    priority={products.indexOf(product) < 4} // Prioritize loading images for the first row
                                />
                            </div>

                            <div className="p-5">
                                <div className="flex items-baseline gap-2 mb-2">
                                    {product.discountPercentage > 0 ? (
                                        <>
                                            <h3 className="text-xl font-semibold text-slate-800">
                                                ${product.discountedPrice.toLocaleString()}
                                            </h3>
                                            <p className="text-sm text-slate-400 line-through">
                                                ${product.unitPrice.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-amber-600 font-medium">
                                                {product.discountPercentage}% OFF
                                            </p>
                                        </>
                                    ) : (
                                        <h3 className="text-xl font-semibold text-slate-800">
                                            ${product.unitPrice.toLocaleString()}
                                        </h3>
                                    )}
                                </div>

                                <h4 className="text-lg font-medium text-slate-700 mb-3 truncate">
                                    {product.make?.name} {product.title}
                                </h4>

                                <p className="text-sm text-slate-500 tracking-tight mb-2">
                                    {product.category?.name} | {product.year} | {product.model}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="flex justify-center mt-12">
                    <Link
                        href="/products?category=6890ae47d1f3719edf5910a9"
                        className="text-gray-800 font-medium flex items-center hover:text-[#1a3760] transition-colors border-b-2 border-transparent hover:border-[#1a3760] pb-1 text-lg"
                    >
                        View All Trucks
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 ml-2">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}