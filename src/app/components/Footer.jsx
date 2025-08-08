"use client"

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  FaFacebookF, 
  FaInstagram, 
  FaYoutube, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt,
} from 'react-icons/fa';

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const headingVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const socialHoverVariants = {
    hover: {
      scale: 1.1,
      backgroundColor: "#ffffff",
      color: "#000000",
      transition: {
        duration: 0.3
      }
    }
  };
  
  return (
    <motion.footer 
      className="bg-black text-white sm:pt-15 pt-8 pb-10 font-sans"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-6">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12"
          variants={containerVariants}
        >
          <motion.div className="space-y-6" variants={itemVariants}>
            <div className="h-20 w-40 relative">
              <Image 
                src="/footer-logo.jpg" 
                alt="ATJ Automotive" 
                fill
                style={{ objectFit: "contain" }}
                className="brightness-110"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              ATJ Automotive: Pioneering the future of mobility with cutting-edge innovation, precision, and elegance.
            </p>
            <div className="flex space-x-3 pt-2">
              {[
                { icon: FaFacebookF, href: 'https://www.facebook.com/search/top?q=ahmedzai%20trading%20japan%20co%20ltd', label: 'Facebook'},
                { icon: FaYoutube, href: 'https://www.youtube.com/@AlmashriqTradingJapanCoLtd', label: 'YouTube' },
                { icon: FaInstagram, href: 'https://www.instagram.com/ahmedzaitradingjapan/', label: 'Instagram' },
              ].map((social) => (
                <motion.a 
                  key={social.label}
                  href={social.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 text-gray-300 p-3 rounded-full transition-colors duration-300 border border-gray-700"
                  aria-label={`Visit our ${social.label} page`}
                  variants={socialHoverVariants}
                  whileHover="hover"
                >
                  <social.icon size={16} />
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <motion.h3 
              className="text-xl font-bold mb-5 tracking-wide text-left relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-26 after:bg-white"
              variants={headingVariants}
              custom={1}
            >
              COMPANY
            </motion.h3>
            <ul className="space-y-3 text-center md:text-left">
              {[
                { text: 'Home', href: '/' },
                { text: 'About Us', href: '/about' },
                { text: 'Contact Us', href: '/contact' },
              ].map((link, index) => (
                <motion.li 
                  key={link.text}
                  variants={itemVariants}
                  custom={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                    {link.text}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.h3 
              className="text-xl font-bold mb-5 tracking-wide text-left relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-26 after:bg-white"
              variants={headingVariants}
              custom={2}
            >
              SERVICES
            </motion.h3>
            <ul className="space-y-3 text-center md:text-left">
              {[
                { text: 'Blogs', href: '/blogs' },
                { text: 'Services', href: '#services' },
                { text: 'Products', href: '/products' },
              ].map((link, index) => (
                <motion.li 
                  key={link.text}
                  variants={itemVariants}
                  custom={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                      {link.text}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <motion.h3 
              className="text-xl font-bold mb-5 tracking-wide text-center md:text-left relative pb-2 md:after:content-[''] md:after:absolute md:after:left-0 md:after:bottom-0 md:after:h-1 md:after:w-33 md:after:bg-white"
              variants={headingVariants}
              custom={3}
            >
              CONTACT US
            </motion.h3>
            <ul className="space-y-4">
              <motion.li 
                className="flex items-start group"
                variants={itemVariants}
                whileHover={{ x: 5 }}
              >
                <FaMapMarkerAlt className="mt-1 mr-4 text-gray-500 group-hover:text-blue-400 transition-colors duration-300 flex-shrink-0" size={16} />
                <span className="text-gray-400 text-sm">
                  123 Business Avenue, Technology Park, Karachi, Pakistan
                </span>
              </motion.li>
              <motion.li 
                className="flex items-center group"
                variants={itemVariants}
                whileHover={{ x: 5 }}
              >
                <FaPhoneAlt className="mr-4 text-gray-500 group-hover:text-blue-400 transition-colors duration-300" size={14} />
                <a href="tel:+819027801563" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                  +81 90-2780-1563
                </a>
              </motion.li>
              <motion.li 
                className="flex items-center group"
                variants={itemVariants}
                whileHover={{ x: 5 }}
              >
                <FaEnvelope className="mr-4 text-gray-500 group-hover:text-blue-400 transition-colors duration-300" size={14} />
                <a href="mailto:ahmedzai.trading@gmail.com" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                  ahmedzai.trading@gmail.com
                </a>
              </motion.li>
            </ul>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="border-t border-gray-800 pt-8 mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center">
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} ATJ Automotive. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;