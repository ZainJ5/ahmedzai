'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';

const HeroSection = () => {
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const timestamp = useRef(Date.now());

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/hero');
        if (response.data.success && response.data.data.length > 0) {
          setBanners(response.data.data);
        } else {
          setBanners([
            { mediaUrl: '/hero-1.webp', alt: 'Banner 1' },
            { mediaUrl: '/hero-2.webp', alt: 'Banner 2' },
            { mediaUrl: '/hero-3.webp', alt: 'Banner 3' }
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch hero images:', err);
        setError(err);
        setBanners([
          { mediaUrl: '/hero-1.webp', alt: 'Banner 1' },
          { mediaUrl: '/hero-2.webp', alt: 'Banner 2' },
          { mediaUrl: '/hero-3.webp', alt: 'Banner 3' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroImages();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const goToPrevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const getImageUrl = (url) => {
    if (url.startsWith('http')) {
      return `${url}?v=${timestamp.current}`;
    }
    return `${url}?v=${timestamp.current}`;
  };

  if (isLoading) {
    return (
      <div className="relative w-full h-[60vh] flex items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
      </div>
    );
  }

  if (error && banners.length === 0) {
    return (
      <div className="relative w-full h-[40vh] flex items-center justify-center bg-white">
        <p className="text-gray-500">Unable to load hero images</p>
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden">
      <style jsx>{`
        .hero-container {
          position: relative;
          width: 100%;
          aspect-ratio: 940 / 348;
        }
        
        .banner-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transition: opacity 1000ms ease-in-out;
        }
        
        .banner-slide.active {
          opacity: 1;
          z-index: 10;
        }
        
        .banner-slide.inactive {
          opacity: 0;
          z-index: 0;
        }
        
        /* Fix for pagination dots positioning */
        .pagination-dots {
          position: absolute;
          bottom: 5px;
          left: 0;
          right: 0;
        }
      `}</style>

      <div className="hero-container">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`banner-slide ${currentBanner === index ? 'active' : 'inactive'}`}
          >
            <div className="relative h-full w-full">
              <Image
                src={getImageUrl(banner.mediaUrl)}
                alt={banner.title || `Hero Image ${index + 1}`}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
                quality={90}
                unoptimized
              />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 pointer-events-none"></div>
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevBanner}
            className="absolute left-2 md:left-8 top-1/2 transform -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white rounded-full p-1 md:p-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Previous banner"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNextBanner}
            className="absolute right-2 md:right-8 top-1/2 transform -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white rounded-full p-1 md:p-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Next banner"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="pagination-dots flex justify-center z-20 space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentBanner === index ? 'bg-white w-4' : 'bg-white/60 hover:bg-white/80'
                }`}
                onClick={() => setCurrentBanner(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroSection;