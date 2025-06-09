import React, { useState, useEffect, memo, useCallback, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductImageGallery from './ProductImageGallery';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Memoized ProductImageGallery to prevent unnecessary re-renders
const MemoizedProductImageGallery = memo(ProductImageGallery);

// Memoized slide component with enhanced click handling
const EngagementRingSlide = memo(({ ring, index, isActive, onSlideClick, swiperRef }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const timeoutRef = useRef(null);

  const handleClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isActive) {
      // If already focused, navigate immediately
      window.location.href = `/products/${ring.id}`;
    } else {
      // If not focused, focus first then navigate after 1 second
      onSlideClick(index);
      setIsNavigating(true);
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setIsNavigating(false);
        window.location.href = `/products/${ring.id}`;
      }, 1000);
    }
  }, [isActive, index, onSlideClick, ring.id]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="group block cursor-pointer" onClick={handleClick}>
      <div className={`text-center transition-all duration-500 ${isActive ? 'scale-100' : 'scale-75 opacity-70'}`}>
        {/* Ring Image */}
        <div className="relative mb-8">
          <div className={`relative mx-auto transition-all duration-500 ${
            isActive ? 'w-full max-w-md' : 'w-full max-w-sm'
          }`}>
            {ring.images || ring.image_url ? (
              <div className="engagement-ring-image-container">
                <MemoizedProductImageGallery 
                  images={ring.images || ring.image_url} 
                  productName={ring.name}
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  showNavigation={false}
                />
              </div>
            ) : (
              // Clean fallback design without weird squares
              <div className="w-full aspect-square flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">💍</div>
                  <div className="text-sm">תמונה לא זמינה</div>
                </div>
              </div>
            )}
            
            {/* Badge for featured rings - only on active slide */}
            {isActive && index === 0 && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-gold to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                מומלץ
              </div>
            )}
            
            {/* Navigation indicator when not focused */}
            {!isActive && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center rounded-xl">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-2">
                  <span className="text-gold text-sm font-medium">לחץ לצפייה</span>
                </div>
              </div>
            )}
            
            {/* Simple focusing indicator without yellow background */}
            {isNavigating && (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl">
                <div className="bg-white bg-opacity-95 rounded-full px-4 py-2 shadow-lg border border-gray-200">
                  <span className="text-gray-700 text-sm font-medium">מעבר לעמוד המוצר...</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Ring Info - Below the image */}
        <div className={`space-y-4 transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
          <h3 className={`font-medium text-gray-800 group-hover:text-gold transition-colors duration-300 ${
            isActive ? 'text-xl md:text-2xl' : 'text-lg'
          }`}>
            {ring.name || 'טבעת יהלום יחיד - סוליטר 6 שיניים'}
          </h3>
          <div className={`${isActive ? 'text-lg md:text-xl' : 'text-base'}`}>
            <span className="text-gray-600 font-medium">אחל מ</span>
            <span className="text-gold font-semibold mr-2">
              ₪{ring.price?.toLocaleString() || '2,500'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

const EngagementRingCarousel = () => {
  const [engagementRings, setEngagementRings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const swiperRef = useRef(null);

  // Detect mobile device for optimized settings
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchEngagementRings = useCallback(async () => {
    try {
      setIsLoading(true);
      // Try to fetch engagement ring category products
      const response = await axios.get('/products');
      // Filter or get first few products as engagement rings
      // You can modify this to filter by category when you have categories set up
      const rings = response.data.slice(0, 6);
      setEngagementRings(rings);
    } catch (error) {
      console.error('Error fetching engagement rings:', error);
      // Fallback data if needed
      setEngagementRings([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSlideClick = useCallback((slideIndex) => {
    if (swiperRef.current) {
      // For mobile, use different navigation method to prevent stuck states
      if (isMobile) {
        const swiper = swiperRef.current;
        const currentIndex = swiper.realIndex;
        const targetIndex = slideIndex;
        
        // Calculate the shortest path to the target slide
        const totalSlides = engagementRings.length;
        let direction = targetIndex - currentIndex;
        
        if (Math.abs(direction) > totalSlides / 2) {
          direction = direction > 0 ? direction - totalSlides : direction + totalSlides;
        }
        
        // Use slideNext/slidePrev for smoother mobile experience
        if (direction > 0) {
          for (let i = 0; i < Math.abs(direction); i++) {
            setTimeout(() => swiper.slideNext(), i * 100);
          }
        } else if (direction < 0) {
          for (let i = 0; i < Math.abs(direction); i++) {
            setTimeout(() => swiper.slidePrev(), i * 100);
          }
        }
      } else {
        // Desktop: use slideToLoop for direct navigation
        swiperRef.current.slideToLoop(slideIndex, 800);
      }
    }
  }, [isMobile, engagementRings.length]);

  useEffect(() => {
    fetchEngagementRings();
  }, [fetchEngagementRings]);

  // Performance monitoring for React Scan
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 EngagementRingCarousel optimized for performance');
      console.log('⚡ Applied optimizations:');
      console.log('  - Mobile-optimized touch settings');
      console.log('  - Improved swipe sensitivity');
      console.log('  - Prevented stuck states at boundaries');
      console.log('  - Enhanced mobile navigation logic');
      console.log('  - Fixed navigation direction with slideToLoop');
      console.log('  - Removed dots, +1 indicators, and yellow background');
    }
  }, []);

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 overflow-hidden">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-800 mb-6">
            קולקציית טבעות האירוסין שלנו
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8"></div>
        </div>

        {/* Engagement Ring Carousel */}
        <div className="relative overflow-hidden">
          {/* Floating Navigation Arrows - Hidden on Mobile */}
          {!isMobile && (
            <>
              <div className="absolute inset-y-0 left-4 md:left-8 z-10 flex items-center">
                <div className="engagement-swiper-button-next cursor-pointer group">
                  <div className="bg-white/80 hover:bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl rounded-lg p-3 transition-all duration-300 border border-white/20 hover:border-gold/30">
                    <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-gold transition-colors duration-300" />
                  </div>
                </div>
              </div>
              
              <div className="absolute inset-y-0 right-4 md:right-8 z-10 flex items-center">
                <div className="engagement-swiper-button-prev cursor-pointer group">
                  <div className="bg-white/80 hover:bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl rounded-lg p-3 transition-all duration-300 border border-white/20 hover:border-gold/30">
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-gold transition-colors duration-300" />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="w-full max-w-full overflow-hidden">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={isMobile ? 30 : 60}
              slidesPerView={isMobile ? 1.2 : 3}
              centeredSlides={true}
              allowTouchMove={true}
              watchOverflow={true}
              observer={false}
              observeParents={false}
              watchSlidesProgress={false}
              preventClicks={false}
              preventClicksPropagation={false}
              updateOnWindowResize={true}
              resizeObserver={true}
              speed={isMobile ? 300 : 500}
              
              // Mobile-optimized touch settings
              touchRatio={isMobile ? 1.5 : 1}
              touchAngle={45}
              grabCursor={true}
              
              // Improved swipe thresholds for mobile
              threshold={isMobile ? 20 : 10}
              longSwipes={true}
              longSwipesRatio={isMobile ? 0.3 : 0.25}
              longSwipesMs={isMobile ? 400 : 300}
              shortSwipes={true}
              followFinger={true}
              
              // Prevent stuck states
              freeMode={false}
              freeModeSticky={false}
              resistance={true}
              resistanceRatio={0.85}
              
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              navigation={isMobile ? false : {
                nextEl: '.engagement-swiper-button-next',
                prevEl: '.engagement-swiper-button-prev',
              }}
              autoplay={{
                delay: isMobile ? 8000 : 6000,
                disableOnInteraction: false,
                pauseOnMouseEnter: !isMobile,
                waitForTransition: true,
              }}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                  centeredSlides: true,
                  speed: 300,
                  touchRatio: 2,
                },
                480: {
                  slidesPerView: 1.1,
                  spaceBetween: 25,
                  centeredSlides: true,
                  speed: 300,
                  touchRatio: 1.8,
                },
                640: {
                  slidesPerView: 1.2,
                  spaceBetween: 30,
                  centeredSlides: true,
                  speed: 350,
                  touchRatio: 1.5,
                },
                768: {
                  slidesPerView: 1.8,
                  spaceBetween: 40,
                  centeredSlides: true,
                  speed: 400,
                  touchRatio: 1.2,
                },
                1024: {
                  slidesPerView: 2.5,
                  spaceBetween: 60,
                  centeredSlides: true,
                  speed: 500,
                  touchRatio: 1,
                },
                1280: {
                  slidesPerView: 3,
                  spaceBetween: 80,
                  centeredSlides: true,
                  speed: 500,
                  touchRatio: 1,
                },
              }}
              loop={engagementRings.length > 2} // Changed from 3 to 2 for better mobile experience
              loopAdditionalSlides={2}
              loopedSlides={engagementRings.length}
              className="engagement-ring-swiper-exact"
              dir="rtl"
            >
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <SwiperSlide key={index}>
                    <div className="text-center transition-all duration-500">
                      <div className="relative mb-8">
                        <div className="w-full aspect-square bg-gray-200 animate-pulse max-w-sm mx-auto rounded-lg"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-6 bg-gray-200 rounded animate-pulse mx-auto w-3/4"></div>
                        <div className="h-5 bg-gray-200 rounded animate-pulse mx-auto w-1/2"></div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              ) : engagementRings.length > 0 ? (
                engagementRings.map((ring, index) => (
                  <SwiperSlide key={ring.id || index}>
                    {({ isActive }) => (
                      <EngagementRingSlide 
                        ring={ring} 
                        index={index} 
                        isActive={isActive} 
                        onSlideClick={handleSlideClick}
                        swiperRef={swiperRef}
                      />
                    )}
                  </SwiperSlide>
                ))
              ) : (
                // Default showcase when no products
                <SwiperSlide>
                  {({ isActive }) => (
                    <EngagementRingSlide 
                      ring={{
                        id: 'default',
                        name: 'טבעת יהלום יחיד - סוליטר 6 שיניים',
                        price: 2500,
                        images: null
                      }}
                      index={0}
                      isActive={isActive}
                      onSlideClick={handleSlideClick}
                      swiperRef={swiperRef}
                    />
                  )}
                </SwiperSlide>
              )}
            </Swiper>
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link 
            to="/products?category=engagement-rings"
            className="inline-block btn-elegant"
          >
            לכל טבעות האירוסין
          </Link>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx="true">{`
        .engagement-ring-swiper-exact {
          overflow: hidden;
          padding: 20px 0;
          width: 100%;
          max-width: 100%;
          transform: translate3d(0, 0, 0);
          will-change: transform;
          touch-action: pan-y pinch-zoom;
        }
        
        /* Ensure the swiper wrapper doesn't overflow */
        .engagement-ring-swiper-exact .swiper-wrapper {
          box-sizing: border-box;
          transform: translate3d(0, 0, 0);
        }
        
        /* Constrain the entire carousel within viewport */
        .engagement-ring-swiper-exact .swiper-slide {
          box-sizing: border-box;
          max-width: 100vw;
          transform: translate3d(0, 0, 0);
          will-change: transform;
          touch-action: pan-y pinch-zoom;
        }
        
        .engagement-ring-swiper-exact .swiper-slide {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-sizing: border-box;
          transform: translate3d(0, 0, 0);
        }
        
        /* Focused slide styling - reduced animations during swipe */
        .engagement-ring-swiper-exact .swiper-slide-active {
          z-index: 2;
        }
        
        .engagement-ring-swiper-exact .swiper-slide-next,
        .engagement-ring-swiper-exact .swiper-slide-prev {
          z-index: 1;
        }
        
        /* Reduced hover effects to improve performance */
        .engagement-ring-swiper-exact .swiper-slide:not(.swiper-slide-active):hover {
          transform: translate3d(0, -2px, 0);
        }
        
        .engagement-ring-swiper-exact .swiper-slide-active:hover {
          transform: translate3d(0, -3px, 0) scale(1.01);
        }
        
        /* Clean Navigation button styling - no circles, just floating */
        .engagement-swiper-button-prev,
        .engagement-swiper-button-next {
          position: static;
          width: auto;
          height: auto;
          margin-top: 0;
          font-size: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Remove default Swiper styling */
        .engagement-swiper-button-prev:after,
        .engagement-swiper-button-next:after {
          display: none;
        }
        
        /* Enhanced hover effects for floating arrows */
        .engagement-swiper-button-prev:hover > div,
        .engagement-swiper-button-next:hover > div {
          transform: translateY(-1px) scale(1.05);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        /* Active state */
        .engagement-swiper-button-prev:active > div,
        .engagement-swiper-button-next:active > div {
          transform: translateY(0) scale(0.98);
        }
        
        /* Mobile-specific optimizations */
        @media (max-width: 768px) {
          .engagement-ring-swiper-exact {
            padding: 20px 0;
            overflow: hidden;
            touch-action: pan-x pan-y;
          }
          
          /* Better touch targets on mobile */
          .engagement-ring-swiper-exact .swiper-slide {
            touch-action: manipulation;
          }
          
          /* Improve click responsiveness on mobile */
          .group {
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
          }
          
          /* Reduce animations on mobile for better performance */
          .group-hover\\:scale-105 {
            transform: none !important;
          }
          
          /* Optimize mobile layout */
          .engagement-ring-swiper-exact .swiper-slide-active {
            transform: scale(1) !important;
          }
          
          .engagement-ring-swiper-exact .swiper-slide:not(.swiper-slide-active) {
            transform: scale(0.85) !important;
            opacity: 0.7;
          }
        }
        
        /* Extra small devices optimization */
        @media (max-width: 480px) {
          .engagement-ring-swiper-exact .swiper-slide:not(.swiper-slide-active) {
            transform: scale(0.8) !important;
            opacity: 0.6;
          }
          
          /* Ensure proper spacing on very small screens */
          .engagement-ring-swiper-exact {
            padding: 15px 0;
          }
        }
        
        /* Smooth image transitions */
        .engagement-ring-swiper-exact img {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Custom gold color utilities */
        .text-gold {
          color: #d4af37;
        }
        
        .bg-gold {
          background-color: #d4af37;
        }
        
        .border-gold {
          border-color: #d4af37;
        }
        
        .via-gold {
          --tw-gradient-to: #d4af37;
          --tw-gradient-stops: var(--tw-gradient-from), #d4af37, var(--tw-gradient-to);
        }
        
        /* Remove background from image cards in engagement ring carousel */
        .engagement-ring-swiper-exact .product-gallery {
          background: transparent !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          border: none !important;
        }
        
        /* Ring focus animation */
        .ring-gold {
          border-color: #d4af37;
        }
        
        .ring-opacity-50 {
          border-opacity: 0.5;
        }
        
        /* Enhanced click feedback */
        .group:active {
          transform: scale(0.98);
        }
        
        /* Remove any remaining pagination dots */
        .engagement-ring-swiper-exact .swiper-pagination,
        .engagement-ring-swiper-exact .swiper-pagination-bullet,
        .engagement-ring-swiper-exact .swiper-pagination-bullet-active {
          display: none !important;
        }
        
        /* Ensure no dots or pagination elements show */
        .swiper-pagination {
          display: none !important;
        }
        
        .swiper-pagination-bullet {
          display: none !important;
        }
        
        /* Hide ALL ProductImageGallery dots and indicators in engagement ring carousel */
        .engagement-ring-image-container .dots-container,
        .engagement-ring-image-container .dot,
        .engagement-ring-image-container .hover-indicator,
        .engagement-ring-image-container .image-counter {
          display: none !important;
        }
        
        /* Force hide any remaining image gallery elements */
        .engagement-ring-swiper-exact .dots-container,
        .engagement-ring-swiper-exact .dot,
        .engagement-ring-swiper-exact .hover-indicator,
        .engagement-ring-swiper-exact .image-counter,
        .engagement-ring-swiper-exact .thumbnails-container {
          display: none !important;
          visibility: hidden !important;
        }
        
        /* Clean up any ProductImageGallery styling in carousel */
        .engagement-ring-image-container .product-gallery {
          background: none !important;
          border: none !important;
          border-radius: 12px !important;
          overflow: hidden;
        }
        
        /* Ensure clean image display */
        .engagement-ring-image-container .main-image {
          border-radius: 12px;
          transition: transform 0.3s ease;
        }
        
        /* Mobile touch optimization */
        @media (hover: none) and (pointer: coarse) {
          .engagement-ring-swiper-exact .swiper-slide {
            transition: transform 0.2s ease;
          }
          
          .group:hover .opacity-0 {
            opacity: 0 !important;
          }
          
          .group-hover\\:bg-opacity-10 {
            background-opacity: 0 !important;
          }
        }
      `}</style>
    </section>
  );
};

export default EngagementRingCarousel; 