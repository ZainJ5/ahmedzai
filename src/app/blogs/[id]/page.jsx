'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaCalendarAlt, FaArrowLeft, FaSpinner, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/blogs/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setBlog(data.data);
          fetchRelatedBlogs();
        } else {
          setError('Failed to fetch blog');
        }
      } catch (err) {
        setError('An error occurred while fetching blog');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchRelatedBlogs = async () => {
      try {
        const response = await fetch('/api/blogs?limit=3');
        const data = await response.json();
        
        if (data.success) {
          const filteredBlogs = data.data.filter(blog => blog._id !== id);
          setRelatedBlogs(filteredBlogs.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching related blogs:', err);
      }
    };
    
    fetchBlog();
  }, [id]);
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = blog ? blog.title : 'Blog Post';
  
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="flex flex-col items-center space-y-4">
            <FaSpinner className="animate-spin h-12 w-12 text-indigo-600" />
            <p className="text-gray-700 font-medium text-lg">Loading blog post...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  if (error || !blog) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
          <div className="text-center space-y-6 bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900">Blog Post Not Found</h2>
            <p className="text-gray-600 text-lg">{error || 'The blog post you are looking for does not exist or has been removed.'}</p>
            <Link href="/blogs" className="inline-flex items-center text-indigo-600 font-semibold text-lg hover:text-indigo-800 transition-colors duration-300">
              <FaArrowLeft className="mr-2" /> Back to all blogs
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      <main className="bg-gray-50">
        <div className="relative w-full h-[60vh] md:h-[70vh] bg-gray-900">
          {blog.thumbnail ? (
            <Image
              src={blog.thumbnail}
              alt={blog.title}
              fill
              priority
              className="object-cover transition-opacity duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-gray-900"></div>
          )}
          
          {/* Separate dark overlay */}
          <div className="absolute inset-0 bg-black opacity-30"></div>
          
          {/* Content without opacity reduction */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight shadow-text">
                {blog.title}
              </h1>
              <div className="flex items-center justify-center text-gray-200 text-base md:text-lg font-medium shadow-text">
                <FaCalendarAlt className="mr-2 text-indigo-400" />
                {formatDate(blog.createdAt)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="prose prose-lg max-w-none bg-white p-8 rounded-2xl shadow-sm">
            <p className="text-2xl text-gray-800 mb-8 font-medium leading-relaxed">
              {blog.description}
            </p>
            
            <div 
              className="blog-content text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
          
          {/* Share Links */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Share this article</h3>
            <div className="flex space-x-4">
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#3b5998] text-white p-3 rounded-full hover:bg-[#2a4373] transition-colors duration-300"
              >
                <FaFacebook className="h-6 w-6" />
              </a>
              <a 
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(shareTitle)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1da1f2] text-white p-3 rounded-full hover:bg-[#0c87d3] transition-colors duration-300"
              >
                <FaTwitter className="h-6 w-6" />
              </a>
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0077b5] text-white p-3 rounded-full hover:bg-[#005f93] transition-colors duration-300"
              >
                <FaLinkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          {/* Back Button */}
          <div className="mt-8">
            <Link 
              href="/blogs"
              className="inline-flex items-center text-indigo-600 font-semibold text-lg hover:text-indigo-800 transition-colors duration-300"
            >
              <FaArrowLeft className="mr-2" /> Back to all blogs
            </Link>
          </div>
        </div>
        
        {/* Related Posts */}
        {relatedBlogs.length > 0 && (
          <div className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-10 tracking-tight">Related Posts</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedBlogs.map((relatedBlog) => (
                  <div key={relatedBlog._id} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                    <Link href={`/blogs/${relatedBlog._id}`} className="block relative h-56 overflow-hidden rounded-t-xl">
                      {relatedBlog.thumbnail ? (
                        <Image
                          src={relatedBlog.thumbnail}
                          alt={relatedBlog.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400 font-medium">No image</span>
                        </div>
                      )}
                    </Link>
                    <div className="p-6">
                      <Link href={`/blogs/${relatedBlog._id}`}>
                        <h3 className="font-bold text-xl text-gray-900 mb-3 hover:text-indigo-600 transition-colors duration-300">
                          {relatedBlog.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-base line-clamp-2 mb-4 leading-relaxed">
                        {relatedBlog.description}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaCalendarAlt className="mr-2 text-indigo-600" />
                        {formatDate(relatedBlog.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}