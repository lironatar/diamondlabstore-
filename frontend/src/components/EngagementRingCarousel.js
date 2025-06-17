import React, { useState, useEffect, memo, useCallback, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductImageGallery from './ProductImageGallery';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Memoized slide component with stable props to prevent unnecessary re-renders
const EngagementRingSlide = memo(({ ring, index, isActive }) => {
  // Memoize the ring data to prevent re-renders when parent scrolls
  const memoizedRing = useMemo(() => ring, [ring.id, ring.name, ring.price]);
  
  return (
    <Link to={`/products/${memoizedRing.id}`} className="group block cursor-pointer">
      <div className={`text-center transition-all duration-500 motion-safe:transition-all motion-reduce:transition-none ${isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-80'}`}>
        {/* Ring Image */}
        <div className="relative mb-8">
          <div className={`relative mx-auto transition-all duration-500 motion-reduce:transition-none ${
            isActive ? 'w-full max-w-md' : 'w-full max-w-sm'
          }`}>
            {memoizedRing.images || memoizedRing.image_url ? (
              <div className="engagement-ring-image-container">
                <ProductImageGallery 
                  images={memoizedRing.images || memoizedRing.image_url} 
                  productName={memoizedRing.name}
                  className="w-full aspect-square object-cover motion-safe:group-hover:scale-105 motion-safe:transition-transform motion-safe:duration-300 rounded-xl motion-reduce:transform-none"
                  showNavigation={false}
                />
              </div>
            ) : (
              // Clean fallback design
              <div className="w-full aspect-square flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">💍</div>
                  <div className="text-sm">תמונה לא זמינה</div>
                </div>
              </div>
            )}
            

            
            {/* Navigation indicator when not focused */}
            {!isActive && (
              <div className="absolute inset-0 bg-black bg-opacity-0 motion-safe:group-hover:bg-opacity-5 motion-safe:transition-all motion-safe:duration-300 flex items-center justify-center rounded-xl motion-reduce:hover:bg-opacity-0">
                <div className="opacity-0 motion-safe:group-hover:opacity-100 motion-safe:transition-opacity motion-safe:duration-300 bg-white bg-opacity-95 rounded-full p-2 motion-reduce:opacity-0">
                  <span className="text-gray-700 text-sm font-medium">לחץ לצפייה</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Ring Info - Below the image */}
        <div className={`space-y-4 transition-all duration-500 motion-reduce:transition-none ${isActive ? 'opacity-100' : 'opacity-60'}`}>
          <h3 className={`font-medium text-gray-800 motion-safe:group-hover:text-gray-900 motion-safe:transition-colors motion-safe:duration-300 motion-reduce:hover:text-gray-800 ${
            isActive ? 'text-xl md:text-2xl' : 'text-lg'
          }`}>
            {memoizedRing.name || 'טבעת יהלום יחיד - סוליטר 6 שיניים'}
          </h3>
          <div className={`${isActive ? 'text-lg md:text-xl' : 'text-base'}`}>
            <span className="text-gray-500 font-medium">החל מ</span>
            <span className="text-gray-800 font-semibold mr-2">
              ₪{memoizedRing.price?.toLocaleString() || '2,500'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
});

// Add display name for better debugging
EngagementRingSlide.displayName = 'EngagementRingSlide';

const EngagementRingCarousel = memo(() => {
  const [engagementRings, setEngagementRings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const swiperRef = useRef(null);

  // Memoize the API call to prevent unnecessary re-fetches
  const fetchEngagementRings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🔄 Fetching engagement rings from category...');
      
      // Fetch only engagement rings (category ID: 1) using query parameters
      const response = await axios.get('/api/products', {
        params: {
          category_id: 1, // טבעות אירוסין category
          limit: 6,       // Limit to 6 items for carousel
          is_active: true // Only active products
        }
      });
      console.log('✅ API Response:', response.data);
      
      const rings = response.data;
      console.log('💍 Engagement rings from category loaded:', rings.length);
      
      setEngagementRings(rings);
    } catch (error) {
      console.error('❌ Error fetching engagement rings:', error);
      setError(error.message);
      
      // Fallback engagement ring data to ensure component always renders something with enough slides for loop
      const fallbackRings = [
        {
          id: 'demo-engagement-1',
          name: 'טבעת אירוסין סוליטר קלאסית',
          price: 2500,
          images: null,
          category_id: 1
        },
        {
          id: 'demo-engagement-2', 
          name: 'טבעת אירוסין הילו יהלומים',
          price: 3200,
          images: null,
          category_id: 1
        },
        {
          id: 'demo-engagement-3',
          name: 'טבעת אירוסין פאווה מעוצבת',
          price: 2800,
          images: null,
          category_id: 1
        },
        {
          id: 'demo-engagement-4',
          name: 'טבעת אירוסין וינטג׳ יוקרתית',
          price: 3500,
          images: null,
          category_id: 1
        },
        {
          id: 'demo-engagement-5',
          name: 'טבעת אירוסין מודרנית מיוחדת',
          price: 2900,
          images: null,
          category_id: 1
        }
      ];
      setEngagementRings(fallbackRings);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Only fetch once on mount
  useEffect(() => {
    fetchEngagementRings();
  }, [fetchEngagementRings]);

  // Cleanup effect to properly destroy swiper instance
  useEffect(() => {
    return () => {
      if (swiperRef.current && !swiperRef.current.destroyed) {
        console.log('🎠 Cleaning up swiper instance');
        try {
          swiperRef.current.destroy(true, true);
        } catch (error) {
          console.error('🎠 Error destroying swiper:', error);
        }
      }
    };
  }, []);

  // Enhanced manual navigation handlers with better error handling
  const handleNext = useCallback(() => {
    if (swiperRef.current && !swiperRef.current.destroyed) {
      try {
        // Check if swiper is in transition
        if (swiperRef.current.animating) {
          console.log('🎠 Swiper is animating, skipping navigation');
          return;
        }

        // Force update before navigation
        swiperRef.current.update();
        
        if (swiperRef.current.isEnd && !swiperRef.current.params.loop) {
          console.log('🎠 Manual next: Going to first slide');
          swiperRef.current.slideTo(0, 600);
        } else {
          console.log('🎠 Manual next: Going to next slide');
          swiperRef.current.slideNext(600);
        }
      } catch (error) {
        console.error('🎠 Error in handleNext:', error);
      }
    }
  }, []);

  const handlePrev = useCallback(() => {
    if (swiperRef.current && !swiperRef.current.destroyed) {
      try {
        // Check if swiper is in transition
        if (swiperRef.current.animating) {
          console.log('🎠 Swiper is animating, skipping navigation');
          return;
        }

        // Force update before navigation
        swiperRef.current.update();
        
        if (swiperRef.current.isBeginning && !swiperRef.current.params.loop) {
          console.log('🎠 Manual prev: Going to last slide');
          swiperRef.current.slideTo(engagementRings.length - 1, 600);
        } else {
          console.log('🎠 Manual prev: Going to previous slide');
          swiperRef.current.slidePrev(600);
        }
      } catch (error) {
        console.error('🎠 Error in handlePrev:', error);
      }
    }
  }, [engagementRings.length]);

  // Memoize the swiper configuration to prevent re-renders
  const swiperConfig = useMemo(() => ({
    modules: [Navigation, Autoplay],
    spaceBetween: 30,
    slidesPerView: 3,
    centeredSlides: true,
    allowTouchMove: true,
    speed: 600,
    grabCursor: true,
    resistanceRatio: 0.85,
    threshold: 5,
    longSwipesRatio: 0.5,
    longSwipesMs: 300,
    followFinger: true,
    onSwiper: (swiper) => {
      swiperRef.current = swiper;
      // Force update after initialization
      setTimeout(() => {
        if (swiper && swiper.update) {
          swiper.update();
        }
      }, 100);
    },
    // Enhanced event handlers based on Swiper best practices
    on: {
      init: function () {
        console.log('🎠 Swiper initialized with', this.slides.length, 'slides');
        this.update();
      },
      beforeDestroy: function () {
        console.log('🎠 Swiper destroying...');
      },
      slideChange: function () {
        console.log('🎠 Slide changed to:', this.activeIndex);
        // Force update to prevent stuck states
        this.update();
      },
      slideChangeTransitionStart: function () {
        // Ensure smooth transition start
        this.allowTouchMove = true;
      },
      slideChangeTransitionEnd: function () {
        // Re-enable interactions after transition
        this.allowTouchMove = true;
        this.update();
      },
      touchStart: function () {
        // Pause autoplay on touch
        if (this.autoplay && this.autoplay.running) {
          this.autoplay.stop();
        }
      },
      touchEnd: function () {
        // Resume autoplay after touch
        if (this.autoplay && !this.autoplay.running) {
          setTimeout(() => {
            this.autoplay.start();
          }, 3000);
        }
      },
      reachEnd: function () {
        console.log('🎠 Reached end, loop enabled:', this.params.loop);
        if (!this.params.loop && engagementRings.length > 0) {
          // Smooth transition to beginning
          setTimeout(() => {
            this.slideTo(0, 600);
          }, 500);
        }
      },
      reachBeginning: function () {
        console.log('🎠 Reached beginning, loop enabled:', this.params.loop);
        if (!this.params.loop && engagementRings.length > 0) {
          // Smooth transition to end
          setTimeout(() => {
            this.slideTo(engagementRings.length - 1, 600);
          }, 500);
        }
      },
      resize: function () {
        // Handle window resize
        this.update();
      }
    },
    navigation: {
      nextEl: '.engagement-swiper-button-next',
      prevEl: '.engagement-swiper-button-prev',
      disabledClass: 'engagement-swiper-button-disabled',
      hiddenClass: 'engagement-swiper-button-hidden',
    },
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
      waitForTransition: true,
      stopOnLastSlide: false,
    },
    breakpoints: {
      320: {
        slidesPerView: 1.4,
        spaceBetween: 15,
        centeredSlides: true,
      },
      480: {
        slidesPerView: 1.6,
        spaceBetween: 20,
        centeredSlides: true,
      },
      640: {
        slidesPerView: 1.8,
        spaceBetween: 25,
        centeredSlides: true,
      },
      768: {
        slidesPerView: 2.2,
        spaceBetween: 30,
        centeredSlides: true,
      },
      1024: {
        slidesPerView: 2.6,
        spaceBetween: 35,
        centeredSlides: true,
      },
      1280: {
        slidesPerView: 3,
        spaceBetween: 40,
        centeredSlides: true,
      },
    },
    // Enhanced loop configuration based on Swiper docs
    loop: engagementRings.length >= 3,
    loopFillGroupWithBlank: false,
    loopedSlides: Math.max(engagementRings.length, 6), // Increased for better loop performance
    loopAdditionalSlides: 2,
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    observer: true,
    observeParents: true,
    observeSlideChildren: true,
    className: "engagement-ring-swiper",
    updateOnWindowResize: true,
    preventInteractionOnTransition: false, // Allow interaction during transitions
    freeMode: false, // Disable free mode to prevent stuck states
    freeModeSticky: false,
    dir: "rtl"
  }), [engagementRings.length]);

  // Memoize the slides to prevent unnecessary re-renders
  const memoizedSlides = useMemo(() => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, index) => (
        <SwiperSlide key={`loading-${index}`}>
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-full aspect-square bg-gray-200 motion-safe:animate-pulse max-w-sm mx-auto rounded-xl motion-reduce:animate-none"></div>
            </div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded motion-safe:animate-pulse mx-auto w-3/4 motion-reduce:animate-none"></div>
              <div className="h-5 bg-gray-200 rounded motion-safe:animate-pulse mx-auto w-1/2 motion-reduce:animate-none"></div>
            </div>
          </div>
        </SwiperSlide>
      ));
    }

    return engagementRings.map((ring, index) => (
      <SwiperSlide key={`${ring.id}-${index}`}>
        {({ isActive }) => (
          <EngagementRingSlide 
            ring={ring} 
            index={index} 
            isActive={isActive} 
          />
        )}
      </SwiperSlide>
    ));
  }, [isLoading, engagementRings]);

  // Don't render if there's an error and no fallback data
  if (error && engagementRings.length === 0) {
    console.log('⚠️ EngagementRingCarousel: Error with no fallback data, not rendering');
    return null;
  }

  console.log('🎠 EngagementRingCarousel rendering with', engagementRings.length, 'rings');

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-800 mb-6">
            קולקציית טבעות האירוסין שלנו
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-8"></div>
        </div>

        {/* Engagement Ring Carousel Container with space for arrows */}
        <div className="px-4 md:px-16 lg:px-20">
                    {/* Engagement Ring Carousel */}
          <div className="relative">
            {/* Swiper Container */}
            <div className="w-full overflow-hidden">
              <Swiper {...swiperConfig}>
                {memoizedSlides}
              </Swiper>
            </div>
            
            {/* Navigation Arrows - Positioned at the sides like in your image */}
            {/* Desktop Arrows */}
            <div 
              className="engagement-swiper-button-next absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-50 cursor-pointer hidden md:block"
              onClick={handleNext}
            >
              <div className="bg-white shadow-lg rounded-full p-3 lg:p-4 transition-all duration-300 border border-gray-200 hover:bg-gray-50 hover:scale-110">
                <ArrowLeft className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600 hover:text-gray-800" />
              </div>
            </div>
            
            <div 
              className="engagement-swiper-button-prev absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-50 cursor-pointer hidden md:block"
              onClick={handlePrev}
            >
              <div className="bg-white shadow-lg rounded-full p-3 lg:p-4 transition-all duration-300 border border-gray-200 hover:bg-gray-50 hover:scale-110">
                <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600 hover:text-gray-800" />
              </div>
            </div>

            {/* Mobile Arrows - Overlapping content slightly */}
            <div 
              className="engagement-swiper-button-next absolute left-2 top-1/2 -translate-y-1/2 z-50 cursor-pointer md:hidden"
              onClick={handleNext}
            >
              <div className="bg-white/95 backdrop-blur-sm shadow-md rounded-full p-2.5 border border-gray-200 active:scale-95">
                <ArrowLeft className="w-4 h-4 text-gray-700" />
              </div>
            </div>
            
            <div 
              className="engagement-swiper-button-prev absolute right-2 top-1/2 -translate-y-1/2 z-50 cursor-pointer md:hidden"
              onClick={handlePrev}
            >
              <div className="bg-white/95 backdrop-blur-sm shadow-md rounded-full p-2.5 border border-gray-200 active:scale-95">
                <ArrowRight className="w-4 h-4 text-gray-700" />
              </div>
            </div>
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link 
              to="/products?category=engagement-rings"
              className="inline-block bg-gray-800 motion-safe:hover:bg-gray-900 text-white px-8 py-4 rounded-full font-medium motion-safe:transition-colors shadow-md motion-safe:hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:bg-gray-800"
            >
              לכל טבעות האירוסין
            </Link>
          </div>
        </div>
      </div>

      {/* Optimized Styles with reduced motion support */}
      <style jsx="true">{`
        .engagement-ring-swiper {
          overflow: hidden;
          padding: 20px 0;
          width: 100%;
          contain: layout style paint;
        }
        
        .engagement-ring-swiper .swiper-wrapper {
          align-items: center;
        }
        
        .engagement-ring-swiper .swiper-slide {
          transition: transform 0.3s ease;
          will-change: auto;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .engagement-ring-swiper .swiper-slide {
            transition: none !important;
          }
        }
        
        .engagement-ring-swiper .swiper-slide-active {
          z-index: 2;
        }
        
        /* Navigation button styling - Simple and Reliable */
        .engagement-swiper-button-prev:after,
        .engagement-swiper-button-next:after {
          display: none !important;
        }
        
        /* Arrow disabled state */
        .engagement-swiper-button-disabled {
          opacity: 0.3 !important;
          cursor: not-allowed !important;
          pointer-events: none !important;
        }
        
        /* Ensure arrows are always clickable when loop is enabled */
        .engagement-ring-swiper.swiper-loop .engagement-swiper-button-next,
        .engagement-ring-swiper.swiper-loop .engagement-swiper-button-prev {
          opacity: 1 !important;
          pointer-events: auto !important;
          cursor: pointer !important;
        }
        
        /* Arrow positioning adjustments for larger screens */
        @media (min-width: 1024px) {
          .engagement-swiper-button-next {
            transform: translateY(-50%) translateX(-24px) !important;
          }
          
          .engagement-swiper-button-prev {
            transform: translateY(-50%) translateX(24px) !important;
          }
        }
        
        /* Ensure arrows are properly positioned */
        .engagement-swiper-button-next,
        .engagement-swiper-button-prev {
          position: absolute !important;
          z-index: 50 !important;
        }
        
        /* Hide ProductImageGallery controls in carousel */
        .engagement-ring-image-container .dots-container,
        .engagement-ring-image-container .dot,
        .engagement-ring-image-container .hover-indicator,
        .engagement-ring-image-container .image-counter {
          display: none !important;
        }
        
        /* Mobile optimizations - prevent re-renders */
        @media (max-width: 768px) {
          .engagement-ring-swiper {
            padding: 15px 0;
            touch-action: pan-x pan-y;
            contain: layout style paint;
          }
          
          .engagement-ring-swiper .swiper-slide:not(.swiper-slide-active) {
            opacity: 0.7;
          }
          
          /* Prevent scroll-triggered re-renders on mobile */
          .engagement-ring-swiper * {
            will-change: auto !important;
          }
          
          /* Disable heavy hover effects on mobile */
          @media (hover: none) and (pointer: coarse) {
            .group:hover .opacity-0 {
              opacity: 0 !important;
            }
            
            .group-hover\\:bg-opacity-10 {
              background-opacity: 0 !important;
            }
            
            .group-hover\\:scale-105 {
              transform: none !important;
            }
          }
        }
        
        /* Prevent layout shifts */
        .engagement-ring-image-container {
          contain: layout;
        }
      `}</style>
    </section>
  );
});

// Add display name for better debugging
EngagementRingCarousel.displayName = 'EngagementRingCarousel';

export default EngagementRingCarousel; 