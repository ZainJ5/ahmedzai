"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { useParams, useRouter } from 'next/navigation';
import { 
  FaWhatsapp, 
  FaChevronLeft, 
  FaChevronRight, 
  FaArrowLeft, 
  FaWeightHanging, 
  FaCalendarAlt, 
  FaBoxes,
  FaSearch,
  FaShieldAlt,
  FaTruckMoving,
  FaCheckCircle,
  FaInfoCircle,
  FaHeart,
  FaShareAlt,
  FaPrint,
  FaDownload,
  FaMoneyBillWave,
  FaCreditCard,
  FaPaypal,
  FaMapMarkedAlt,
  FaCar,
  FaCubes,
  FaTag,
  FaTags,
  FaClock,
  FaClipboardCheck
} from 'react-icons/fa';
import { MdCategory, MdVerified } from 'react-icons/md';
import { IoMdHeartEmpty, IoMdHeart } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';

// Helper function to download images
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
  const paymentMethodsRef = useRef(null);

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

    // Check if product is in favorites
    const checkFavorite = () => {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.includes(id));
    };
    checkFavorite();
  }, [id]);

  useEffect(() => {
    // Scroll the active thumbnail into view when it changes
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
    window.open(`https://wa.me/923334928431?text=${message}`, '_blank');
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
        <div className="max-w-7xl mx-auto bg-white py-6 sm:py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
            <div className="space-y-4">
              <div className="h-[300px] sm:h-[550px] bg-gray-100 rounded-lg animate-pulse"></div>
              <div className="flex gap-2 sm:gap-3 overflow-x-auto">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 w-16 sm:h-24 sm:w-24 flex-shrink-0 bg-gray-100 rounded-md animate-pulse"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4 sm:space-y-6 pt-4">
              <div className="h-6 sm:h-8 bg-gray-100 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 sm:h-6 bg-gray-100 rounded w-1/2 animate-pulse"></div>
              <div className="h-8 sm:h-12 bg-gray-100 rounded w-1/3 animate-pulse my-4"></div>
              <div className="space-y-2 sm:space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-3 sm:h-4 bg-gray-100 rounded w-full animate-pulse"></div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 sm:h-10 bg-gray-100 rounded animate-pulse"></div>
                ))}
              </div>
              <div className="h-10 sm:h-12 bg-gray-100 rounded animate-pulse mt-4 sm:mt-6"></div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
          <div>
            <FaInfoCircle className="mx-auto text-red-500 text-5xl mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong.</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/products')}
              className="inline-flex items-center px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Return to Products
            </button>
          </div>
        </div>
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
      <div className="bg-white text-black">
        {/* Breadcrumb & Navigation */}
        <div className="bg-gray-50 py-3 sm:py-4 border-b border-gray-200 print:hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <nav aria-label="Breadcrumb" className="text-xs sm:text-sm">
                <ol className="flex items-center space-x-1 sm:space-x-2 text-gray-500">
                  <li><Link href="/" className="hover:text-gray-700">Home</Link></li>
                  <li><span className="mx-1 sm:mx-2">/</span></li>
                  <li><Link href="/products" className="hover:text-gray-700">Products</Link></li>
                  <li><span className="mx-1 sm:mx-2">/</span></li>
                  <li className="font-medium text-gray-800 truncate max-w-[120px] sm:max-w-[200px] md:max-w-xs">{product.title}</li>
                </ol>
              </nav>
              <button 
                onClick={() => router.back()}
                className="group inline-flex items-center text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft className="mr-1 sm:mr-2 group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline">Back</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
            <div>
              <div className="space-y-3 sm:space-y-4">
                <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full bg-gray-50 rounded-lg overflow-hidden group border border-gray-100">
                  <Image 
                    src={allImages[activeImage] || '/placeholder-image.jpg'}
                    alt={`${product.title} - view ${activeImage + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                    priority
                    onClick={() => setIsFullscreen(true)}
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity cursor-zoom-in flex items-center justify-center" onClick={() => setIsFullscreen(true)}>
                    <div className="p-2 bg-white/90 rounded-full">
                      <FaSearch size={18} className="text-gray-800" />
                    </div>
                  </div>
                  
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-2 print:hidden">
                    <motion.button 
                      onClick={toggleFavorite}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-white/90 backdrop-blur-sm rounded-full p-2 sm:p-2.5 shadow-md hover:bg-white transition"
                    >
                      {isFavorite ? 
                        <IoMdHeart className="text-red-500" size={18} /> : 
                        <IoMdHeartEmpty className="text-gray-600" size={18} />
                      }
                    </motion.button>
                    <motion.button 
                      onClick={shareProduct}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="relative bg-white/90 backdrop-blur-sm rounded-full p-2 sm:p-2.5 shadow-md hover:bg-white transition"
                    >
                      <FaShareAlt className="text-gray-600" size={16} />
                      {copySuccess && (
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          Link copied!
                        </span>
                      )}
                    </motion.button>
                  </div>
                  
                  {allImages.length > 1 && (
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-gray-900/70 text-white text-xs font-mono px-2 py-1 sm:px-3 sm:py-1.5 rounded-full">
                      {activeImage + 1} / {allImages.length}
                    </div>
                  )}
                  
                  {hasDiscount && (
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 bg-red-600 text-white text-xs sm:text-sm font-semibold px-3 py-1 sm:px-4 sm:py-1.5 rounded-md">
                      {product.discountPercentage}% OFF
                    </div>
                  )}
                </div>

                {/* Image Navigation */}
                {allImages.length > 1 && (
                  <div className="relative">
                    <div 
                      ref={thumbnailsRef}
                      className="flex gap-2 sm:gap-3 overflow-x-auto py-2 px-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scroll-smooth"
                    >
                      {allImages.map((image, index) => (
                        <button 
                          key={index}
                          onClick={() => setActiveImage(index)}
                          className={`relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-md overflow-hidden transition-all duration-200 ${
                            activeImage === index 
                              ? 'ring-2 ring-offset-2 ring-blue-600' 
                              : 'hover:opacity-80 border border-gray-200'
                          }`}
                        >
                          <Image 
                            src={image} 
                            alt={`Thumbnail ${index + 1}`} 
                            fill 
                            className="object-cover" 
                            sizes="80px" 
                          />
                        </button>
                      ))}
                    </div>
                    
                    {allImages.length > 4 && (
                      <>
                        <button 
                          onClick={() => {
                            const container = thumbnailsRef.current;
                            container.scrollBy({ left: -150, behavior: 'smooth' });
                          }}
                          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 sm:p-1.5 shadow-md hover:bg-gray-50 transition z-10"
                        >
                          <FaChevronLeft size={12} />
                        </button>
                        <button 
                          onClick={() => {
                            const container = thumbnailsRef.current;
                            container.scrollBy({ left: 150, behavior: 'smooth' });
                          }}
                          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 sm:p-1.5 shadow-md hover:bg-gray-50 transition z-10"
                        >
                          <FaChevronRight size={12} />
                        </button>
                      </>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs sm:text-sm print:hidden">
                  <button 
                    onClick={handleDownloadAll} 
                    className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <FaDownload size={12} className="sm:text-sm"/>
                    <span>Download images</span>
                  </button>
                  <button 
                    onClick={handlePrint} 
                    className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <FaPrint size={12} className="sm:text-sm"/>
                    <span>Print details</span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-1.5">
                    <Link 
                      href={`/categories/${product.category?._id}`}
                      className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {product.category?.name || 'Category'}
                    </Link>
                    <span className="text-gray-400">•</span>
                    <span className="text-xs sm:text-sm text-gray-500">Model: {product.model}</span>
                  </div>
                  
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{product.title}</h1>

                  {product.quantity > 0 ? (
                    <div className="mt-2 flex items-center text-xs sm:text-sm text-green-600">
                      <FaCheckCircle className="mr-1 sm:mr-2" size={12} />
                      <span>In Stock ({product.quantity} {product.quantity === 1 ? 'unit' : 'units'} available)</span>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center text-xs sm:text-sm text-red-500">
                      <FaInfoCircle className="mr-1 sm:mr-2" size={12} />
                      <span>Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                    {productPrice?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm sm:text-lg text-gray-400 line-through">
                      {product.unitPrice?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="text-xs sm:text-sm text-green-600 font-medium">
                      Save {(product.unitPrice - product.discountedPrice)?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </span>
                  )}
                </div>

                {/* Features */}
                <div className="border-t border-b border-gray-200 py-3 sm:py-5">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Product Features</h2>
                  <div dangerouslySetInnerHTML={{ __html: product.features }} className="prose prose-sm max-w-none text-gray-600 text-sm" />
                </div>
                
                {/* Key Specs */}
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Key Specifications</h2>
                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full flex-shrink-0">
                        <FaCalendarAlt size={16} />
                      </div>
                      <div>
                        <span className="text-gray-500">Year</span>
                        <p className="font-medium text-gray-800">{product.year || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-green-100 text-green-600 rounded-full flex-shrink-0">
                        <FaWeightHanging size={16} />
                      </div>
                      <div>
                        <span className="text-gray-500">Weight</span>
                        <p className="font-medium text-gray-800">{product.weight ? `${product.weight} kg` : 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full flex-shrink-0">
                        <MdCategory size={16} />
                      </div>
                      <div>
                        <span className="text-gray-500">Brand</span>
                        <p className="font-medium text-gray-800">{product.make?.name || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full flex-shrink-0">
                        <FaBoxes size={16} />
                      </div>
                      <div>
                        <span className="text-gray-500">Availability</span>
                        <p className="font-medium text-gray-800">{product.quantity > 0 ? 'In Stock' : 'Out of Stock'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <motion.button
                  onClick={handleWhatsAppClick}
                  className="w-full py-3 sm:py-4 flex items-center justify-center gap-2 sm:gap-3 bg-green-600 text-white text-base sm:text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md print:hidden"
                  whileHover={{ scale: 1.01 }} 
                  whileTap={{ scale: 0.98 }}
                >
                  <FaWhatsapp size={20} />
                  <span>Inquire on WhatsApp</span>
                </motion.button>

                {/* Assurance badges */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 sm:pt-4 print:hidden">
                  <div className="flex flex-col items-center justify-center text-center p-2 sm:p-3 border border-gray-100 rounded-lg">
                    <FaShieldAlt className="text-blue-500 mb-1 sm:mb-2" size={16} />
                    <span className="text-[10px] sm:text-xs font-medium text-gray-800">Quality Guarantee</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center p-2 sm:p-3 border border-gray-100 rounded-lg">
                    <FaClipboardCheck className="text-blue-500 mb-1 sm:mb-2" size={16} />
                    <span className="text-[10px] sm:text-xs font-medium text-gray-800">Verified Supplier</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center p-2 sm:p-3 border border-gray-100 rounded-lg">
                    <FaTruckMoving className="text-blue-500 mb-1 sm:mb-2" size={16} />
                    <span className="text-[10px] sm:text-xs font-medium text-gray-800">Fast Shipping</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 py-8 sm:py-12 print:hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">How It Works</h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto">We've made purchasing and receiving your product as simple as possible, just follow these steps.</p>
            </div>
            
            <div className="relative mb-8 sm:mb-16">
              <div 
                ref={howItWorksRef}
                className="flex overflow-x-auto sm:grid p-6 pl-4 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-4 snap-x snap-mandatory scrollbar-none scroll-smooth px-2"
                style={{ scrollbarWidth: 'none' }}
              >
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 relative snap-start min-w-[60%] sm:min-w-0 flex-shrink-0 flex flex-col items-center h-[180px] sm:h-auto">
                  <div className="absolute top-0 left-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-base sm:text-lg transform -translate-x-2 -translate-y-2 sm:-translate-x-4 sm:-translate-y-4">1</div>
                  <div className="w-10 h-10 sm:w-16 sm:h-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 mt-3">
                    <FaSearch size={20} className="sm:text-2xl"/>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-center mb-1 sm:mb-2">Select Vehicle</h3>
                  <p className="text-gray-600 text-center text-xs sm:text-sm">Find the perfect vehicle that meets your needs.</p>
                </div>
                
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 relative snap-start min-w-[60%] sm:min-w-0 flex-shrink-0 flex flex-col items-center h-[180px] sm:h-auto">
                  <div className="absolute top-0 left-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-base sm:text-lg transform -translate-x-2 -translate-y-2 sm:-translate-x-4 sm:-translate-y-4">2</div>
                  <div className="w-10 h-10 sm:w-16 sm:h-16 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 mt-3">
                    <FaShieldAlt size={20} className="sm:text-2xl"/>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-center mb-1 sm:mb-2">Secure Payment</h3>
                  <p className="text-gray-600 text-center text-xs sm:text-sm">Multiple secure payment options available.</p>
                </div>
                
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 relative snap-start min-w-[60%] sm:min-w-0 flex-shrink-0 flex flex-col items-center h-[180px] sm:h-auto">
                  <div className="absolute top-0 left-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-base sm:text-lg transform -translate-x-2 -translate-y-2 sm:-translate-x-4 sm:-translate-y-4">3</div>
                  <div className="w-10 h-10 sm:w-16 sm:h-16 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 mt-3">
                    <FaTruckMoving size={20} className="sm:text-2xl"/>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-center mb-1 sm:mb-2">Track Order</h3>
                  <p className="text-gray-600 text-center text-xs sm:text-sm">Real-time tracking of your shipment.</p>
                </div>
                
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 relative snap-start min-w-[60%] sm:min-w-0 flex-shrink-0 flex flex-col items-center h-[180px] sm:h-auto">
                  <div className="absolute top-0 left-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-base sm:text-lg transform -translate-x-2 -translate-y-2 sm:-translate-x-4 sm:-translate-y-4">4</div>
                  <div className="w-10 h-10 sm:w-16 sm:h-16 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 mt-3">
                    <FaCar size={20} className="sm:text-2xl"/>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-center mb-1 sm:mb-2">Get Delivery</h3>
                  <p className="text-gray-600 text-center text-xs sm:text-sm">Professional doorstep delivery service.</p>
                </div>
              </div>
              
              <div className="flex justify-center gap-1.5 mt-4 sm:hidden">
                <div className="h-1.5 w-8 bg-blue-600 rounded-full"></div>
                <div className="h-1.5 w-1.5 bg-gray-300 rounded-full"></div>
                <div className="h-1.5 w-1.5 bg-gray-300 rounded-full"></div>
              </div>
            </div>
            
            <div className="relative">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Payment Methods</h3>
              
              <div 
                ref={paymentMethodsRef}
                className="flex overflow-x-auto sm:grid sm:grid-cols-4 gap-3 sm:gap-6 pb-3 snap-x snap-mandatory scrollbar-none scroll-smooth px-2"
                style={{ scrollbarWidth: 'none' }}
              >
                <div className="text-center p-3 sm:p-4 border border-gray-100 bg-white rounded-lg snap-start min-w-[35%] sm:min-w-0 flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 text-gray-800 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <FaMoneyBillWave size={20}/>
                  </div>
                  <h4 className="font-semibold text-sm text-gray-800">Bank Transfer</h4>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Direct and secure</p>
                </div>
                
                <div className="text-center p-3 sm:p-4 border border-gray-100 bg-white rounded-lg snap-start min-w-[35%] sm:min-w-0 flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 text-gray-800 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <FaCreditCard size={20}/>
                  </div>
                  <h4 className="font-semibold text-sm text-gray-800">Credit Card</h4>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">All major cards</p>
                </div>
                
                <div className="text-center p-3 sm:p-4 border border-gray-100 bg-white rounded-lg snap-start min-w-[35%] sm:min-w-0 flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 text-gray-800 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <FaPaypal size={20}/>
                  </div>
                  <h4 className="font-semibold text-sm text-gray-800">PayPal</h4>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Fast and convenient</p>
                </div>
                
                <div className="text-center p-3 sm:p-4 border border-gray-100 bg-white rounded-lg snap-start min-w-[35%] sm:min-w-0 flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 text-gray-800 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <FaMapMarkedAlt size={20}/>
                  </div>
                  <h4 className="font-semibold text-sm text-gray-800">In-Person</h4>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Visit our branch</p>
                </div>
              </div>
              
              {/* Visual scroll indicator for payment methods */}
              <div className="flex justify-center gap-1.5 mt-3 sm:hidden">
                <div className="h-1.5 w-8 bg-blue-600 rounded-full"></div>
                <div className="h-1.5 w-1.5 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <div className="absolute top-4 right-4 z-10 flex gap-4">
              <button 
                onClick={(e) => {e.stopPropagation(); handleDownloadAll();}}
                className="text-white bg-black/50 rounded-full p-2 sm:p-3 hover:bg-black/70"
              >
                <FaDownload size={16} />
              </button>
              <button
                onClick={(e) => {e.stopPropagation(); setIsFullscreen(false)}}
                className="text-white bg-black/50 rounded-full p-2 sm:p-3 hover:bg-black/70"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative h-full w-full p-4 md:p-12"
            >
              <Image 
                src={allImages[activeImage]} 
                alt={product.title}
                fill
                className="object-contain"
                sizes="90vw"
                quality={90}
              />
              
              {product.title && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-xs sm:text-sm max-w-xs sm:max-w-md text-center truncate">
                  {product.title} - {product.model}
                </div>
              )}
            </motion.div>
            
            {allImages.length > 1 && (
              <>
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    setActiveImage(p => (p - 1 + allImages.length) % allImages.length);
                  }} 
                  className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-3 hover:bg-black/70"
                >
                  <FaChevronLeft size={16} className="sm:text-lg" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    setActiveImage(p => (p + 1) % allImages.length);
                  }} 
                  className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-3 hover:bg-black/70"
                >
                  <FaChevronRight size={16} className="sm:text-lg" />
                </button>
              </>
            )}
            
            {allImages.length > 1 && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-full px-4">
                {allImages.map((_, index) => (
                  <button 
                    key={index}
                    onClick={(e) => {e.stopPropagation(); setActiveImage(index)}}
                    className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${activeImage === index ? 'bg-white' : 'bg-white/40'}`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </>
  );
}