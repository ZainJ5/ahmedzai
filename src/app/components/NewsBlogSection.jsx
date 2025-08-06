'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa';

export default function FeaturedBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs?limit=3&sortBy=createdAt&sortOrder=desc');
        const data = await response.json();
        
        if (data.success) {
          setBlogs(data.data);
        } else {
          setError('Failed to fetch blogs');
        }
      } catch (err) {
        setError('An error occurred while fetching blogs');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (isLoading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest From Our Blog</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest From Our Blog</h2>
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return null;
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="py-8 mb-8 bg-gray-50 rounded-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Latest From Our Blog</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the newest automotive trends, tips, and insights
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <Link href={`/blogs/${blog._id}`} className="block relative h-56 overflow-hidden">
                {blog.thumbnail ? (
                  <Image
                    src={blog.thumbnail}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </Link>
              <div className="p-6">
                <p className="text-sm text-blue-600 font-medium mb-2">
                  {formatDate(blog.createdAt)}
                </p>
                <Link href={`/blogs/${blog._id}`} className="block">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                    {blog.title}
                  </h3>
                </Link>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {blog.description}
                </p>
                <Link href={`/blogs/${blog._id}`} className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors">
                  Read more <FaArrowRight className="ml-2 h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        
          <div className="flex justify-center pt-8 mt-4">
            <Link 
              href="/blogs" 
              className="text-gray-800 text-sm sm:text-base font-medium flex items-center hover:text-[#1a3760] transition-colors border-b-2 border-transparent hover:border-[#1a3760] pb-1"
            >
              View All Blogs
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
      </div>
    </div>
  );
}