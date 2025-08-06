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
  FaSearch,
  FaDownload,
  FaPrint,
  FaShareAlt,
  FaShieldAlt,
  FaTruckMoving,
  FaCar,
  FaInfoCircle
} from 'react-icons/fa';
import { IoMdHeartEmpty, IoMdHeart } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';
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
        <div className="max-w-7xl mx-auto bg-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
            <div className="space-y-4">
              <div className="h-[300px] sm:h-[550px] bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="flex gap-2 sm:gap-3 overflow-x-auto">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 w-16 sm:h-24 sm:w-24 flex-shrink-0 bg-gray-200 rounded-md animate-pulse"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4 sm:space-y-6 pt-4">
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 sm:h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-8 sm:h-12 bg-gray-200 rounded w-1/3 animate-pulse my-4"></div>
              <div className="space-y-2 sm:space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-3 sm:h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 sm:h-10 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
              <div className="h-10 sm:h-12 bg-gray-200 rounded animate-pulse mt-4 sm:mt-6"></div>
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
            <p className="text-red-500 font-semibold mb-2">Error</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Oops! Something went wrong.</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/products')}
              className="inline-flex items-center px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-200"
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
        <div className="bg-gray-50 py-4 sm:py-6 border-b border-gray-200 print:hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <nav aria-label="Breadcrumb" className="text-sm sm:text-base">
                <ol className="flex items-center space-x-2 sm:space-x-3 text-gray-500">
                  <li><Link href="/" className="hover:text-gray-700 transition-colors">Home</Link></li>
                  <li><span className="mx-2">/</span></li>
                  <li><Link href="/products" className="hover:text-gray-700 transition-colors">Products</Link></li>
                  <li><span className="mx-2">/</span></li>
                  <li className="font-medium text-gray-800 truncate max-w-[150px] sm:max-w-[250px]">{product.title}</li>
                </ol>
              </nav>
              <button 
                onClick={() => router.back()}
                className="group inline-flex items-center text-sm sm:text-base font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <FaArrowLeft className="mr-2 group-hover:-translate-x-0.5 transition-transform duration-200" />
                <span className="hidden sm:inline">Back</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                <div className="relative h-[300px] sm:h-[450px] md:h-[550px] w-full bg-white rounded-xl overflow-hidden group border border-gray-100 shadow-sm">
                  <Image 
                    src={allImages[activeImage] || '/placeholder-image.jpg'}
                    alt={`${product.title} - view ${activeImage + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                    priority
                    onClick={() => setIsFullscreen(true)}
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-zoom-in flex items-center justify-center" onClick={() => setIsFullscreen(true)}>
                    <div className="p-2 bg-white/90 rounded-full shadow-sm">
                      <FaSearch size={20} className="text-gray-800" />
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4 flex items-center gap-3 print-hidden">
                    <motion.button 
                      onClick={toggleFavorite}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-sm hover:bg-white transition-colors duration-200"
                    >
                      {isFavorite ? 
                        <IoMdHeart className="text-red-500" size={20} /> : 
                        <IoMdHeartEmpty className="text-gray-600" size={20} />
                      }
                    </motion.button>
                    <motion.button 
                      onClick={shareProduct}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="relative bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-sm hover:bg-white transition-colors duration-200"
                    >
                      <FaShareAlt className="text-gray-600" size={18} />
                      {copySuccess && (
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded whitespace-nowrap">
                          Link copied!
                        </span>
                      )}
                    </motion.button>
                  </div>
                  
                  {allImages.length > 1 && (
                    <div className="absolute top-4 left-4 bg-gray-900/70 text-white text-xs font-mono px-3 py-1.5 rounded-full">
                      {activeImage + 1} / {allImages.length}
                    </div>
                  )}
                  
                  {hasDiscount && (
                    <div className="absolute bottom-4 left-4 bg-red-600 text-white text-sm font-semibold px-4 py-1.5 rounded-md">
                      {product.discountPercentage}% OFF
                    </div>
                  )}
                </div>

                {allImages.length > 1 && (
                  <div className="relative">
                    <div 
                      ref={thumbnailsRef}
                      className="flex gap-3 overflow-x-auto py-2 px-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scroll-smooth"
                    >
                      {allImages.map((image, index) => (
                        <button 
                          key={index}
                          onClick={() => setActiveImage(index)}
                          className={`relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 rounded-md overflow-hidden transition-all duration-200 ${
                            activeImage === index 
                              ? 'ring-2 ring-offset-2 ring-blue-600' 
                              : 'hover:opacity-80 border border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <Image 
                            src={image} 
                            alt={`Thumbnail ${index + 1}`} 
                            fill 
                            className="object-cover transition-transform duration-200 hover:scale-105" 
                            sizes="96px" 
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
                          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors duration-200 z-10"
                        >
                          <FaChevronLeft size={14} />
                        </button>
                        <button 
                          onClick={() => {
                            const container = thumbnailsRef.current;
                            container.scrollBy({ left: 150, behavior: 'smooth' });
                          }}
                          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors duration-200 z-10"
                        >
                          <FaChevronRight size={14} />
                        </button>
                      </>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm print-hidden">
                  <button 
                    onClick={handleDownloadAll} 
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    <FaDownload size={14} />
                    <span>Download images</span>
                  </button>
                  <button 
                    onClick={handlePrint} 
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    <FaPrint size={14} />
                    <span>Print details</span>
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Link 
                      href={`/categories/${product.category?._id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      {product.category?.name || 'Category'}
                    </Link>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500">Model: {product.model}</span>
                  </div>
                  
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{product.title}</h1>

                  {product.quantity > 0 ? (
                    <div className="mt-2 flex items-center text-sm text-green-600">
                      <span>In Stock ({product.quantity} {product.quantity === 1 ? 'unit' : 'units'} available)</span>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center text-sm text-red-500">
                      <span>Out of Stock</span>
                    </div>
                  )}
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                    {productPrice?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </span>
                  {hasDiscount && (
                    <span className="text-lg text-gray-400 line-through">
                      {product.unitPrice?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="text-sm text-green-600 font-medium">
                      Save {(product.unitPrice - product.discountedPrice)?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
                    <div>
                      <span className="text-gray-500">Year</span>
                      <p className="font-medium text-gray-800">{product.year || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
                    <div>
                      <span className="text-gray-500">Fuel</span>
                      <p className="font-medium text-gray-800">{product.fuelType || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
                    <div>
                      <span className="text-gray-500">Brand</span>
                      <p className="font-medium text-gray-800">{product.make?.name || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
                    <div>
                      <span className="text-gray-500">Availability</span>
                      <p className="font-medium text-gray-800">{product.quantity > 0 ? 'In Stock' : 'Out of Stock'}</p>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={handleWhatsAppClick}
                  className="w-full py-4 flex items-center justify-center cursor-pointer gap-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md print-hidden"
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                >
                  <FaWhatsapp size={32} />
                  <span>Inquire on WhatsApp</span>
                </motion.button>

                <p className="text-xs text-gray-500 text-center print-hidden">
                  Quality verified product with satisfaction guarantee
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-12 sm:mt-16"
          >
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-5 border-b border-gray-200">
                <div className="flex items-center">
                  <FaInfoCircle className="text-white mr-2" size={20} />
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Technical Specifications</h2>
                </div>
              </div>

              <div className="p-4 md:p-6 bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse font-['Inter',sans-serif]">
                    <thead className="bg-gray-50 text-left">
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 font-semibold text-gray-700 w-1/3">Specification</th>
                        <th className="py-3 px-4 font-semibold text-gray-700">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-600">Model</td>
                        <td className="py-3 px-4 text-gray-800">{product.model || 'N/A'}</td>
                      </tr>
                      <tr className="bg-gray-50/50 border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-600">Brand</td>
                        <td className="py-3 px-4 text-gray-800">{product.make?.name || 'N/A'}</td>
                      </tr>
                      <tr className="bg-white border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-600">Year</td>
                        <td className="py-3 px-4 text-gray-800">{product.year || 'N/A'}</td>
                      </tr>
                      <tr className="bg-gray-50/50 border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-600">Category</td>
                        <td className="py-3 px-4 text-gray-800">{product.category?.name || 'N/A'}</td>
                      </tr>
                      <tr className="bg-white border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-600">Fuel Type</td>
                        <td className="py-3 px-4 text-gray-800">{product.fuelType || 'N/A'}</td>
                      </tr>
                      <tr className="bg-gray-50/50 border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-600">Engine Displacement</td>
                        <td className="py-3 px-4 text-gray-800">{product.engine?.displacement ? `${product.engine.displacement} cc` : 'N/A'}</td>
                      </tr>
                      <tr className="bg-white border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-600">Number of Cylinders</td>
                        <td className="py-3 px-4 text-gray-800">{product.engine?.cylinders || 'N/A'}</td>
                      </tr>
                      <tr className="bg-gray-50/50 border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-600">Horsepower</td>
                        <td className="py-3 px-4 text-gray-800">{product.engine?.horsepower ? `${product.engine.horsepower} hp` : 'N/A'}</td>
                      </tr>
                      <tr className="bg-white border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-600">Engine Configuration</td>
                        <td className="py-3 px-4 text-gray-800">{product.engine?.configuration || 'N/A'}</td>
                      </tr>
                      <tr className="bg-gray-50/50 border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-600">City Mileage</td>
                        <td className="py-3 px-4 text-gray-800">
                          {product.mileage?.city ? `${product.mileage.city} ${product.mileage.unit || 'km/l'}` : 'N/A'}
                        </td>
                      </tr>
                      <tr className="bg-white border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-600">Highway Mileage</td>
                        <td className="py-3 px-4 text-gray-800">
                          {product.mileage?.highway ? `${product.mileage.highway} ${product.mileage.unit || 'km/l'}` : 'N/A'}
                        </td>
                      </tr>
                      <tr className="bg-gray-50/50 hover:bg-blue-50/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-600">Weight</td>
                        <td className="py-3 px-4 text-gray-800">{product.weight ? `${product.weight} kg` : 'N/A'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mt-12 sm:mt-16"
          >
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-5 border-b border-gray-200">
                <div className="flex items-center">
                  <FaInfoCircle className="text-white mr-2" size={20} />
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Features & Description</h2>
                </div>
              </div>
              <div className="p-6 bg-white">
                <div dangerouslySetInnerHTML={{ __html: product.features }} className="prose prose-sm sm:prose-base max-w-none text-gray-600 font-['Inter',sans-serif]" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16 print-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-8 sm:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">How It Works</h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">We've made purchasing and receiving your product as simple as possible, just follow these steps.</p>
            </motion.div>
            
            <div className="relative">
              <div 
                ref={howItWorksRef}
                className="flex overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 snap-x snap-mandatory p-8 scrollbar-none scroll-smooth px-2"
                style={{ scrollbarWidth: 'none' }}
              >
                {[
                  { icon: FaSearch, title: 'Select Vehicle', desc: 'Find the perfect vehicle that meets your needs.', bg: 'bg-blue-100', color: 'text-blue-600' },
                  { icon: FaShieldAlt, title: 'Secure Payment', desc: 'Multiple secure payment options available.', bg: 'bg-green-100', color: 'text-green-600' },
                  { icon: FaTruckMoving, title: 'Track Order', desc: 'Real-time tracking of your shipment.', bg: 'bg-orange-100', color: 'text-orange-600' },
                  { icon: FaCar, title: 'Get Delivery', desc: 'Professional doorstep delivery service.', bg: 'bg-purple-100', color: 'text-purple-600' }
                ].map((step, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative snap-start min-w-[70%] sm:min-w-0 flex-shrink-0 flex flex-col items-center h-[200px] sm:h-auto"
                  >
                    <div className="absolute top-0 left-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg transform -translate-x-4 -translate-y-4">{index + 1}</div>
                    <div className={`w-16 h-16 ${step.bg} ${step.color} rounded-xl flex items-center justify-center mx-auto mb-4 mt-4`}>
                      <step.icon size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-center mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-center text-sm">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex justify-center gap-2 mt-6 sm:hidden">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className={`h-2 w-2 rounded-full ${index === 0 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white py-12 sm:py-16 border-t border-gray-100 print-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Related Products</h2>
              <Link href={`/categories/${product.category?._id}`} className="text-blue-600 hover:text-blue-800 text-base font-medium transition-colors duration-200">
                View All
              </Link>
            </div>
            
            <RelatedProducts categoryId={product.category?._id} currentProductId={id} />
          </div>
        </div>
      </div>

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
                className="object-cover"
                sizes="90vw"
                quality={90}
              />
              
              {product.title && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm max-w-md text-center truncate">
                  {product.title} - {product.model}
                </div>
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
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-3 hover:bg-black/70 transition-colors duration-200"
                >
                  <FaChevronRight size={18} />
                </motion.button>
              </>
            )}
            
            {allImages.length > 1 && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-full px-4">
                {allImages.map((_, index) => (
                  <motion.button 
                    key={index}
                    onClick={(e) => {e.stopPropagation(); setActiveImage(index)}}
                    whileHover={{ scale: 1.2 }}
                    className={`w-2.5 h-2.5 rounded-full ${activeImage === index ? 'bg-white' : 'bg-white/40'}`}
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