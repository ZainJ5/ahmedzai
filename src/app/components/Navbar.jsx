'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaWhatsapp, FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './SearchBar';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="w-full z-50">
      <div className="hidden sm:block bg-gradient-to-r from-slate-900 to-slate-800 text-white py-3">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <div className="flex items-center space-x-6 text-sm font-light tracking-wide">
            <a 
              href="mailto:ahmedzai.trading@gmail.com" 
              className="flex items-center hover:text-amber-400 transition duration-300 ease-in-out group"
            >
              <FaEnvelope className="mr-2 text-amber-400 group-hover:text-amber-400 transition duration-300" />
              <span>ahmedzai.trading@gmail.com</span>
            </a>
            <a 
              href="https://wa.me/+818046646786" 
              className="flex items-center hover:text-amber-400 transition duration-300 ease-in-out group"
            >
              <FaWhatsapp className="mr-2 text-green-400 group-hover:text-amber-400 transition duration-300" />
              <span>+81 8046646786</span>
            </a>
          </div>
          
          <div className="flex items-center space-x-5">
            {[
              { icon: FaFacebook, href: 'https://www.facebook.com/search/top?q=ahmedzai%20trading%20japan%20co%20ltd'},
              { icon: FaYoutube, href: 'https://www.youtube.com/@AlmashriqTradingJapanCoLtd'},
              { icon: FaInstagram, href: 'https://www.instagram.com/ahmedzaitradingjapan/' },
            ].map((social, index) => (
              <a 
                key={index}
                href={social.href} 
                className="text-white hover:text-amber-400 transition-all duration-300 ease-in-out transform hover:scale-110"
              >
                <social.icon className="text-lg" />
              </a>
            ))}
          </div>
        </div>
      </div>
      
      <div className={`bg-white transition-all duration-500 ease-in-out ${
        scrolled ? 'shadow-xl py-2' : 'shadow-md py-4'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0">
              <Link href="/">
                <div className={`relative cursor-pointer transition-all duration-300 ease-in-out ${
                  scrolled ? 'h-14 w-24' : 'h-16 w-28'
                }`}>
                  <Image
                    src="/logo-3.png"
                    alt="Company Logo"
                    fill
                    style={{ objectFit: "contain" }}
                    priority
                    className="rounded-sm"
                  />
                </div>
              </Link>
            </div>
            
            <div className="hidden lg:block flex-1 max-w-md mx-8">
              <SearchBar />
            </div>
            
            <nav className="hidden lg:block">
              <ul className="flex space-x-10">
                {['Home', 'Products', 'Contact', 'About Us','Blogs','Auto-Parts'].map((item, index) => (
                  <li key={index}>
                    <Link 
                      href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '')}`}
                      className="text-slate-800 text-sm font-medium uppercase tracking-wider relative group transition-all duration-300 ease-in-out hover:text-[#1a3760]"
                    >
                      {item}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1a3760] transition-all duration-300 ease-in-out group-hover:w-full"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="lg:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-slate-100 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Toggle menu"
              >
                <svg 
                  className="h-6 w-6 text-slate-800" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                  />
                </svg>
              </button>
            </div>
          </div>
          
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="lg:hidden mt-4"
              >
                <motion.ul 
                  className="space-y-4 pb-6 border-b border-slate-200"
                  initial="closed"
                  animate="open"
                  variants={{
                    open: {
                      transition: {
                        staggerChildren: 0.1
                      }
                    },
                    closed: {}
                  }}
                >
                  {['Home', 'Products', 'Contact', 'About Us','Blogs','Auto-Parts'].map((item, index) => (
                    <motion.li 
                      key={index}
                      variants={{
                        open: { opacity: 1, y: 0 },
                        closed: { opacity: 0, y: -10 }
                      }}
                    >
                      <Link 
                        href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '')}`}
                        className="block text-slate-800 text-base font-medium uppercase tracking-wider py-3 px-4 rounded-lg hover:bg-amber-50 hover:text-amber-600 transition-all duration-300 ease-in-out"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="mt-4 mb-4 lg:hidden">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;