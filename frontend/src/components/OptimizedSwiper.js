import React, { memo, useMemo, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import TestimonialCard from './TestimonialCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Memoized Swiper Component for Testimonials
const OptimizedTestimonialsSwiper = memo(({ testimonials, GlassCard }) => {
  // Memoize Swiper configuration to prevent recreation on every render
  const swiperConfig = useMemo(() => ({
    modules: [Navigation, Pagination, Autoplay],
    spaceBetween: 24,
    slidesPerView: 1,
    centeredSlides: false,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '.testimonials-pagination',
      clickable: true,
      bulletClass: 'testimonials-bullet',
      bulletActiveClass: 'testimonials-bullet-active',
    },
    navigation: {
      nextEl: '.testimonials-nav-next',
      prevEl: '.testimonials-nav-prev',
    },
    breakpoints: {
      640: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
    },
  }), []);

  // Memoize testimonial slides to prevent recreation
  const testimonialSlides = useMemo(() => {
    return testimonials.map((testimonial, index) => (
      <SwiperSlide key={`testimonial-${index}`}>
        <TestimonialCard testimonial={testimonial} GlassCard={GlassCard} />
      </SwiperSlide>
    ));
  }, [testimonials, GlassCard]);

  return (
    <div className="testimonials-swiper-container mb-16">
      <Swiper
        {...swiperConfig}
        className="testimonials-swiper-unique"
        dir="rtl"
      >
        {testimonialSlides}
      </Swiper>

      {/* Custom Pagination */}
      <div className="testimonials-pagination mt-8"></div>
      
      {/* Navigation buttons */}
      <div className="flex justify-center items-center mt-4 space-x-4 space-x-reverse">
        <button className="testimonials-nav-prev w-10 h-10 rounded-full bg-white/80 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-gold border border-gray-200">
          <ChevronRight className="w-5 h-5" />
        </button>
        <button className="testimonials-nav-next w-10 h-10 rounded-full bg-white/80 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-gold border border-gray-200">
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
});

OptimizedTestimonialsSwiper.displayName = 'OptimizedTestimonialsSwiper';

export default OptimizedTestimonialsSwiper; 