import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaFacebookF, 
  FaInstagram, 
  FaYoutube, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaChevronRight
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white pt-24 pb-12 font-sans">
      <div className="container mx-auto px-6 md:px-10 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          <div className="space-y-8">
            <div className="h-16 w-52 relative">
              <Image 
                src="/logo.jpg" 
                alt="ATJ Automotive" 
                fill
                style={{ objectFit: "contain" }}
                className="filter brightness-125 transition-transform duration-500 hover:scale-105"
              />
            </div>
            <p className="text-gray-300 text-base leading-relaxed max-w-sm font-light tracking-wide">
              ATJ Automotive: Pioneering the future of mobility with cutting-edge innovation, precision, and elegance.
            </p>
            <div className="flex space-x-6">
              {[
              { icon: FaFacebookF, href: 'https://www.facebook.com/search/top?q=ahmedzai%20trading%20japan%20co%20ltd'},
              { icon: FaYoutube, href: 'https://www.youtube.com/@AlmashriqTradingJapanCoLtd'},
              { icon: FaInstagram, href: 'https://www.instagram.com/ahmedzaitradingjapan/' },
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  className="bg-gray-800 bg-opacity-70 hover:bg-white hover:text-gray-900 p-3 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg"
                  aria-label={`Visit our ${social.icon.name} page`}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold mb-6 pb-3 border-b border-gray-700 tracking-wider text-white">Quick Links</h3>
            <ul className="space-y-5">
              {[
                { text: 'Home', href: '/' },
                { text: 'Products', href: '/products' },
                { text: 'Services', href: '#services' },
                { text: 'About Us', href: '/about' },
                { text: 'Contact', href: '#contact' }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-white text-base font-light flex items-center group transition-all duration-300"
                  >
                    <FaChevronRight className="mr-3 text-sm text-gray-500 group-hover:text-white transition-all duration-300 transform group-hover:translate-x-2" />
                    <span className="group-hover:translate-x-2 transition-transform duration-300">{link.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold mb-6 pb-3 border-b border-gray-700 tracking-wider text-white">Contact Us</h3>
            <ul className="space-y-7">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-4 text-gray-400" size={20} />
                <span className="text-gray-300 text-base font-light tracking-wide">123 Business Avenue, Technology Park, Karachi, Pakistan</span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="mr-4 text-gray-400" size={18} />
                <a href="tel:+921234567890" className="text-gray-300 hover:text-white text-base font-light transition-colors duration-300">+92 123 4567890</a>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-4 text-gray-400" size={18} />
                <a href="mailto:info@atj.com" className="text-gray-300 hover:text-white text-base font-light transition-colors duration-300">info@atj.com</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-base font-light">© {new Date().getFullYear()} ATJ Automotive. All rights reserved.</p>
            <div className="flex space-x-10">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-white text-base font-light transition-colors duration-300">Privacy Policy</Link>
              <Link href="/terms-conditions" className="text-gray-400 hover:text-white text-base font-light transition-colors duration-300">Terms & Conditions</Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white text-base font-light transition-colors duration-300">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;