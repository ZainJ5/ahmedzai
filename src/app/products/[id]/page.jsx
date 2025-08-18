"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { useParams, useRouter } from 'next/navigation';
import { 
  FaWhatsapp, 
  FaChevronLeft, 
  FaChevronRight, 
  FaArrowLeft,
  FaSearch,
  FaDownload,
  FaPrint,
  FaShareAlt,
  FaShieldAlt,
  FaTruckMoving,
  FaInfoCircle,
  FaCar,
  FaPhoneVolume,
  FaCreditCard,
  FaFileInvoice,
  FaShip
} from 'react-icons/fa';

import {
  FaMagnifyingGlassChart,
  FaMoneyBillTransfer,
  FaBoxesPacking
} from 'react-icons/fa6';
import { IoMdHeartEmpty, IoMdHeart } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';
import { BsCarFrontFill } from "react-icons/bs";
import { HiOutlineCreditCard } from "react-icons/hi2";
import { LuPackageCheck } from "react-icons/lu";
import { PiHandshakeFill } from "react-icons/pi";
import RelatedProducts from '../components/ReleatedProducts';

const downloadImage = async (url, filename) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename || url.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Failed to download image:", error);
  }
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const thumbnailsRef = useRef(null);
  const howItWorksRef = useRef(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Product not found' : 'Failed to fetch product details');
        }
        const data = await response.json();
        setProduct(data.data);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();

    const checkFavorite = () => {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.includes(id));
    };
    checkFavorite();
  }, [id]);

  useEffect(() => {
    if (thumbnailsRef.current && activeImage > 0) {
      const thumbnailElements = thumbnailsRef.current.children;
      if (thumbnailElements[activeImage]) {
        thumbnailElements[activeImage].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [activeImage]);

  const handleWhatsAppClick = () => {
    if (!product) return;
    const price = product.discountedPrice?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || 
                 product.unitPrice?.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    const message = encodeURIComponent(
      `Hello, I'm interested in the ${product.title} (${product.model}) that costs ${price}. Can you provide more information?`
    );
    window.open(`https://wa.me/+818046646786?text=${message}`, '_blank');
  };

  const handleDownloadAll = () => {
    if (product && product.images) {
      product.images.forEach((url, index) => {
        downloadImage(url, `${product.model}_${index + 1}.jpg`);
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const newFavorites = isFavorite
      ? favorites.filter(favoriteId => favoriteId !== id)
      : [...favorites, id];
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title,
        text: `Check out this ${product?.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto bg-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8 min-h-screen"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
            <div className="space-y-4">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="h-[300px] sm:h-[550px] bg-gray-200 rounded-lg animate-pulse"
              />
              <motion.div 
                className="flex gap-2 sm:gap-3 overflow-x-auto"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="h-16 w-16 sm:h-24 sm:w-24 flex-shrink-0 bg-gray-200 rounded-md animate-pulse"
                  />
                ))}
              </motion.div>
            </div>
            <motion.div 
              className="space-y-4 sm:space-y-6 pt-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }} className="h-6 sm:h-8 bg-gray-200 rounded w-3/4 animate-pulse"/>
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.3, delay: 0.1 }} className="h-4 sm:h-6 bg-gray-200 rounded w-1/2 animate-pulse"/>
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.3, delay: 0.2 }} className="h-8 sm:h-12 bg-gray-200 rounded w-1/3 animate-pulse my-4"/>
              <motion.div className="space-y-2 sm:space-y-3">
                {[...Array(4)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="h-3 sm:h-4 bg-gray-200 rounded w-full animate-pulse"
                  />
                ))}
              </motion.div>
              <motion.div 
                className="grid grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                {[...Array(4)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="h-8 sm:h-10 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </motion.div>
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="h-10 sm:h-12 bg-gray-200 rounded animate-pulse mt-4 sm:mt-6"
              />
            </motion.div>
          </div>
        </motion.div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-[60vh] flex items-center justify-center text-center px-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-red-500 font-semibold mb-2"
            >
              Error
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2"
            >
              Oops! Something went wrong.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="text-gray-600 mb-6"
            >
              {error}
            </motion.p>
            <motion.button
              onClick={() => router.push('/products')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="inline-flex items-center px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-200"
            >
              <FaArrowLeft className="mr-2" />
              Return to Products
            </motion.button>
          </motion.div>
        </motion.div>
        <Footer />
      </>
    );
  }

  if (!product) return null;

  const allImages = product.images?.length ? product.images : (product.thumbnail ? [product.thumbnail] : []);
  const productPrice = product.discountedPrice || product.unitPrice;
  const hasDiscount = product.discountPercentage > 0;

  return (
    <>
      <div className='border-b border-gray-200'>
        <Navbar />
      </div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white text-black"
      >
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-gray-50 py-4 sm:py-6 border-b border-gray-200 print-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <nav aria-label="Breadcrumb" className="text-sm sm:text-base">
                <motion.ol 
                  className="flex items-center space-x-2 sm:space-x-3 text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <motion.li initial={{ x: -10 }} animate={{ x: 0 }} transition={{ duration: 0.2, delay: 0.1 }}>
                    <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
                  </motion.li>
                  <li><span className="mx-2">/</span></li>
                  <motion.li initial={{ x: -10 }} animate={{ x: 0 }} transition={{ duration: 0.2, delay: 0.2 }}>
                    <Link href="/products" className="hover:text-gray-700 transition-colors">Products</Link>
                  </motion.li>
                  <li><span className="mx-2">/</span></li>
                  <motion.li initial={{ x: -10 }} animate={{ x: 0 }} transition={{ duration: 0.2, delay: 0.3 }} className="font-medium text-gray-800 truncate max-w-[150px] sm:max-w-[250px]">{product.title}</motion.li>
                </motion.ol>
              </nav>
              <motion.button 
                onClick={() => router.back()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="group inline-flex items-center text-sm sm:text-base font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <FaArrowLeft className="mr-2 group-hover:-translate-x-0.5 transition-transform duration-200" />
                <span className="hidden sm:inline">Back</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="space-y-4">
                <motion.div 
                  className="relative h-[300px] sm:h-[450px] md:h-[550px] w-full bg-white rounded-xl overflow-hidden group border border-gray-100 shadow-sm"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeImage}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img 
                        src={allImages[activeImage] || '/placeholder-image.jpg'}
                        alt={`${product.title} - view ${activeImage + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                        priority
                        onClick={() => setIsFullscreen(true)}
                      />
                    </motion.div>
                  </AnimatePresence>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-zoom-in flex items-center justify-center" 
                    onClick={() => setIsFullscreen(true)}
                  >
                    <div className="p-2 bg-white/90 rounded-full shadow-sm">
                      <FaSearch size={20} className="text-gray-800" />
                    </div>
                  </motion.div>
                  
                  <div className="absolute top-4 right-4 flex items-center gap-3 print-hidden">
                    <motion.button 
                      onClick={toggleFavorite}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-sm hover:bg-white transition-colors duration-200"
                    >
                      <motion.div
                        initial={{ scale: isFavorite ? 1.2 : 1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isFavorite ? 
                          <IoMdHeart className="text-red-500" size={20} /> : 
                          <IoMdHeartEmpty className="text-gray-600" size={20} />
                        }
                      </motion.div>
                    </motion.button>
                    <motion.button 
                      onClick={shareProduct}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="relative bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-sm hover:bg-white transition-colors duration-200"
                    >
                      <FaShareAlt className="text-gray-600" size={18} />
                      <AnimatePresence>
                        {copySuccess && (
                          <motion.span 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded whitespace-nowrap"
                          >
                            Link copied!
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                  
                  {allImages.length > 1 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-4 left-4 bg-gray-900/70 text-white text-xs font-mono px-3 py-1.5 rounded-full"
                    >
                      {activeImage + 1} / {allImages.length}
                    </motion.div>
                  )}
                  
                  {hasDiscount && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute bottom-4 left-4 bg-red-600 text-white text-sm font-semibold px-4 py-1.5 rounded-md"
                    >
                      {product.discountPercentage}% OFF
                    </motion.div>
                  )}
                </motion.div>

                {allImages.length > 1 && (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="relative"
                  >
                    <div 
                      ref={thumbnailsRef}
                      className="flex gap-3 overflow-x-auto py-2 px-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scroll-smooth"
                    >
                      {allImages.map((image, index) => (
                        <motion.button 
                          key={index}
                          onClick={() => setActiveImage(index)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className={`relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 rounded-md overflow-hidden transition-all duration-200 ${
                            activeImage === index 
                              ? 'ring-2 ring-offset-2 ring-blue-600' 
                              : 'hover:opacity-80 border border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <img
                            src={image} 
                            alt={`Thumbnail ${index + 1}`} 
                            fill 
                            className="object-cover transition-transform duration-200 hover:scale-105" 
                            sizes="96px" 
                          />
                        </motion.button>
                      ))}
                    </div>
                    
                    {allImages.length > 4 && (
                      <>
                        <motion.button 
                          onClick={() => {
                            const container = thumbnailsRef.current;
                            container.scrollBy({ left: -150, behavior: 'smooth' });
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors duration-200 z-10"
                        >
                          <FaChevronLeft size={14} />
                        </motion.button>
                        <motion.button 
                          onClick={() => {
                            const container = thumbnailsRef.current;
                            container.scrollBy({ left: 150, behavior: 'smooth' });
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors duration-200 z-10"
                        >
                          <FaChevronRight size={14} />
                        </motion.button>
                      </>
                    )}
                  </motion.div>
                )}
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between text-sm print-hidden"
                >
                  <motion.button 
                    onClick={handleDownloadAll} 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    <FaDownload size={14} />
                    <span>Download images</span>
                  </motion.button>
                  <motion.button 
                    onClick={handlePrint} 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    <FaPrint size={14} />
                    <span>Print details</span>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="flex items-center gap-2 mb-2"
                    initial={{ y: 10 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link 
                      href={`/products`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      {product.category?.name || 'Category'}
                    </Link>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500">Model: {product.model}</span>
                  </motion.div>
                  
                  <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900"
                  >
                    {product.title}
                  </motion.h1>

                  {product.quantity > 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="mt-2 flex items-center text-sm text-green-600"
                    >
                      <span>In Stock ({product.quantity} {product.quantity === 1 ? 'unit' : 'units'} available)</span>
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="mt-2 flex items-center text-sm text-red-500"
                    >
                      <span>Out of Stock</span>
                    </motion.div>
                  )}
                </motion.div>

                {/* <motion.div 
                  className="flex items-baseline gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                    {productPrice?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </span>
                  {hasDiscount && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="text-lg text-gray-400 line-through"
                    >
                      {product.unitPrice?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </motion.span>
                  )}
                  {hasDiscount && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="text-sm text-green-600 font-medium"
                    >
                      Save {(product.unitPrice - product.discountedPrice)?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </motion.span>
                  )}
                </motion.div> */}

                <motion.div 
                  className="grid grid-cols-2 gap-4 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {[
                    { label: 'Make', value: product.make?.name || 'N/A' },
                    { label: 'Model', value: product.model || 'N/A' },
                    { label: 'Year', value: product.year || 'N/A' },
                    { label: 'Mileage', value: `${product.mileage || 'N/A'} ${product.mileageUnit || ''}` }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 shadow-sm"
                    >
                      <div>
                        <span className="text-gray-500">{item.label}</span>
                        <p className="font-medium text-gray-800">{item.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.button
                  onClick={handleWhatsAppClick}
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full py-4 flex items-center justify-center cursor-pointer gap-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md print-hidden"
                >
                  <FaWhatsapp size={32} />
                  <span>Inquire on WhatsApp</span>
                </motion.button>

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs text-gray-500 text-center print-hidden"
                >
                  Quality verified product with satisfaction guarantee
                </motion.p>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-12 sm:mt-16"
          >
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-red-800 p-5 border-b border-gray-200"
              >
                <div className="flex items-center">
                  <FaInfoCircle className="text-white mr-2" size={20} />
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Technical Specifications</h2>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="p-4 md:p-6 bg-white"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse font-['Inter',sans-serif]">
                    <thead className="bg-gray-50 text-left">
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 font-semibold text-gray-700 w-1/3">Specification</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: 'Make', value: product.make?.name || 'N/A' },
                        { label: 'Model', value: product.model || 'N/A' },
                        { label: 'Year', value: product.year || 'N/A' },
                        { label: 'Mileage', value: `${product.mileage || 'N/A'} ${product.mileageUnit || ''}` },
                        { label: 'Chassis', value: product.chassis || 'N/A' },
                        { label: 'Colour', value: product.color || 'N/A' },
                        { label: 'Axle Configuration', value: product.axleConfiguration || 'N/A' },
                        { label: 'Fuel type', value: product.fuelType || 'N/A' },
                        { label: 'Vehicle Grade', value: product.vehicleGrade || 'N/A' }
                      ].map((item, index) => (
                        <motion.tr 
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="bg-white border-b border-gray-100 hover:bg-blue-50/30 transition-colors"
                        >
                          <td className="py-3 px-4 font-medium text-gray-600">{item.label}</td>
                          <td className="py-3 px-4 text-gray-800">{item.value}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-12 sm:mt-16"
          >
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-r from-gray-700 to-gray-900 p-5 border-b border-gray-200"
              >
                <div className="flex items-center">
                  <FaInfoCircle className="text-white mr-2" size={20} />
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Features & Description</h2>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="p-6 bg-white overflow-x-auto"
              >
                <div dangerouslySetInnerHTML={{ __html: product.features }} className="prose prose-sm sm:prose-base  max-w-none text-gray-600 font-['Inter',sans-serif]" />
              </motion.div>
            </div>
          </motion.div> */}


<motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: 0.3 }}
  className="mt-12 sm:mt-16"
>
  <div className="border border-gray-200 overflow-hidden shadow-sm">
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white"
    >
      <div className="grid grid-cols-3 sm:grid-cols-6">
        <div className={`border border-gray-300 p-3 text-center ${product.features?.camera360 ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
          360<br/>Camera
        </div>
        <div className={`border border-gray-300 p-3 text-center ${product.features?.airBags ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
          Air Bags
        </div>
        <div className={`border border-gray-300 p-3 text-center ${product.features?.airCondition ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
          Air<br/>Condition
        </div>
        <div className={`border border-gray-300 p-3 text-center ${product.features?.alloyWheels ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
          Alloy<br/>Wheels
        </div>
        <div className={`border border-gray-300 p-3 text-center ${product.features?.abs ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
          ABS
        </div>
        <div className={`border border-gray-300 p-3 text-center ${product.features?.sunRoof ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
          Sun<br/>Roof
        </div>
        
        <div className={`border border-gray-300 p-3 text-center ${product.features?.autoAC ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
          Auto A/C
        </div>
        <div className={`border border-gray-300 p-3 text-center ${product.features?.backCamera ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
          Back<br/>Camera
        </div>
        <div className={`border border-gray-300 p-3 text-center ${product.features?.backSpoiler ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
          Back<br/>Spoiler
        </div>
        <div className={`border border-gray-300 p-3 text-center ${product.features?.doubleMuffler ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
          Double<br/>Muffler
        </div>
        <div className={`border border-gray-300 p-3 text-center ${product.features?.fogLights ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
          Fog Lights
        </div>
        <div className={`border border-gray-300 p-3 text-center ${product.features?.tv ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
          TV
        </div>
        
        <div className={`border border-gray-300 p-3 text-center ${product.features?.hidLights ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
          HID<br/>Lights
        </div>
        <div className={`border border-gray-300 p-3 text-center ${product.features?.keylessEntry ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
          Key-less<br/>Entry
        </div>
        <div className={`border border-gray-300 p-3 text-center ${product.features?.leatherSeats ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
          Leather<br/>Seats
        </div>
        <div className={`border border-gray-300 p-3 text-center ${product.features?.navigation ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
          Navigation
        </div>
        <div className={`border border-gray-300 p-3 text-center ${product.features?.parkingSensors ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
          Parking<br/>Sensors
        </div>
        <div className={`border border-gray-300 p-3 text-center ${product.features?.doubleAC ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
          Double<br/>A/C
        </div>
        
        <div className={`border border-gray-300 p-3 text-center ${product.features?.powerSteering ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
          Power<br/>Steering
        </div>
        <div className={`border border-gray-300 p-3 text-center ${product.features?.powerWindows ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
          Power<br/>Windows
        </div>
        <div className={`border border-gray-300 p-3 text-center ${product.features?.pushStart ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
          Push<br/>Start
        </div>
        <div className={`border border-gray-300 p-3 text-center ${product.features?.radio ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
          Radio
        </div>
        <div className={`border border-gray-300 p-3 text-center ${product.features?.retractableMirrors ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
          Retractable<br/>Mirrors
        </div>
        <div className={`border border-gray-300 p-3 text-center ${product.features?.roofRail ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
          Roof<br/>Rail
        </div>
      </div>
    </motion.div>
  </div>
</motion.div>




        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16 print-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-8 sm:mb-12"
            >
              <motion.h2 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4"
              >
                How It Works
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto"
              >
                We've made purchasing and receiving your product as simple as possible, just follow these steps.
              </motion.p>
            </motion.div>
            
<div 
  ref={howItWorksRef}
  className="flex overflow-x-auto gap-3 snap-x snap-mandatory py-4 px-4 scrollbar-none scroll-smooth"
  style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
>
  {[
    { 
      icon: FaCar, 
      title: 'Select Vehicle', 
      desc: 'Browse and select your desired vehicle.', 
      gradient: 'bg-gradient-to-br from-blue-500/10 to-indigo-500/20', 
      color: 'text-blue-700',
      iconSize: 38
    },
    { 
      icon: FaPhoneVolume, 
      title: 'Contact & Reserve', 
      desc: 'Contact us to reserve your chosen car.', 
      gradient: 'bg-gradient-to-br from-green-500/10 to-lime-500/20', 
      color: 'text-green-700',
      iconSize: 38
    },
    { 
      icon: FaCreditCard, 
      title: 'Down Payment', 
      desc: 'Make a down payment and send receipt.', 
      gradient: 'bg-gradient-to-br from-emerald-500/10 to-teal-500/20', 
      color: 'text-emerald-700',
      iconSize: 38
    },
    { 
      icon: FaMagnifyingGlassChart, 
      title: 'Inspection & Port', 
      desc: 'Vehicle inspection and move to port.', 
      gradient: 'bg-gradient-to-br from-red-500/10 to-rose-500/20', 
      color: 'text-red-700',
      iconSize: 38
    },
    { 
      icon: FaFileInvoice, 
      title: 'Booking Confirmed', 
      desc: 'Receive booking confirmation.', 
      gradient: 'bg-gradient-to-br from-yellow-500/10 to-amber-500/20', 
      color: 'text-yellow-700',
      iconSize: 38
    },
    { 
      icon: FaShip, 
      title: 'Track Shipment', 
      desc: 'Receive Bill of Lading and track shipment.', 
      gradient: 'bg-gradient-to-br from-amber-500/10 to-orange-500/20', 
      color: 'text-amber-700',
      iconSize: 38
    },
    { 
      icon: FaMoneyBillTransfer, 
      title: 'Final Payment', 
      desc: 'Complete the final payment.', 
      gradient: 'bg-gradient-to-br from-teal-500/10 to-cyan-500/20', 
      color: 'text-teal-700',
      iconSize: 38
    },
    { 
      icon: FaBoxesPacking, 
      title: 'Receive Documents', 
      desc: 'Get documents and release papers via DHL.', 
      gradient: 'bg-gradient-to-br from-violet-500/10 to-purple-500/20', 
      color: 'text-violet-700',
      iconSize: 38
    }
  ].map((step, index) => (
    <motion.div 
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative snap-start min-w-[200px] flex-shrink-0 flex flex-col items-center h-auto group hover:shadow-lg transition-all duration-300"
    >
      <motion.div 
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute top-0 left-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-lg transform -translate-x-3 -translate-y-3 shadow-md"
      >
        {index + 1}
      </motion.div>
      <motion.div 
        className={`w-14 h-14 sm:w-20 sm:h-20 ${step.gradient} ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 mt-2 shadow-sm group-hover:shadow group-hover:scale-105 transition-all duration-300`}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <step.icon size={step.iconSize * 0.7} className="group-hover:scale-110 transition-transform duration-300" />
      </motion.div>
      <motion.h3 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="font-bold text-sm sm:text-lg text-center mb-2 text-gray-800"
      >
        {step.title}
      </motion.h3>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="text-gray-600 text-center text-xs sm:text-sm leading-relaxed"
      >
        {step.desc}
      </motion.p>
    </motion.div>
  ))}
</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white py-12 sm:py-16 border-t border-gray-100 print-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between mb-6"
            >
              <motion.h2 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-2xl sm:text-3xl font-bold text-gray-900"
              >
                Related Products
              </motion.h2>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Link href={`/products`} className="text-blue-600 hover:text-blue-800 text-base font-medium transition-colors duration-200">
                  View All
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <RelatedProducts categoryId={product.category?._id} currentProductId={id} />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute top-4 right-4 z-10 flex gap-4"
            >
              <motion.button 
                onClick={(e) => {e.stopPropagation(); handleDownloadAll();}}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-white bg-black/50 rounded-full p-3 hover:bg-black/70 transition-colors duration-200"
              >
                <FaDownload size={18} />
              </motion.button>
              <motion.button
                onClick={(e) => {e.stopPropagation(); setIsFullscreen(false)}}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-white bg-black/50 rounded-full p-3 hover:bg-black/70 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </motion.div>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative h-full w-full p-4 md:p-12"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={allImages[activeImage]} 
                    alt={product.title}
                    fill
                    className="object-contain"
                    sizes="90vw"
                    quality={90}
                  />
                </motion.div>
              </AnimatePresence>
              
              {product.title && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm max-w-md text-center truncate"
                >
                  {product.title} - {product.model}
                </motion.div>
              )}
            </motion.div>
            
            {allImages.length > 1 && (
              <>
                <motion.button 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    setActiveImage(p => (p - 1 + allImages.length) % allImages.length);
                  }} 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-3 hover:bg-black/70 transition-colors duration-200"
                >
                  <FaChevronLeft size={18} />
                </motion.button>
                <motion.button 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    setActiveImage(p => (p + 1) % allImages.length);
                  }} 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-3 hover:bg-black/70 transition-colors duration-200"
                >
                  <FaChevronRight size={18} />
                </motion.button>
              </>
            )}
            
            {allImages.length > 1 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-full px-4"
              >
                {allImages.map((_, index) => (
                  <motion.button 
                    key={index}
                    onClick={(e) => {e.stopPropagation(); setActiveImage(index)}}
                    whileHover={{ scale: 1.2 }}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`w-2.5 h-2.5 rounded-full ${activeImage === index ? 'bg-white' : 'bg-white/40'}`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </>
  );
}