import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Diamond, Sparkles, Shield, Award, ArrowLeft, Star, Phone, Mail, Leaf, Heart, ChevronDown, Play, Eye, Gem, Zap, TrendingUp, MapPin, Clock, Award as AwardIcon, Settings, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// Import required modules
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Logo from '../components/Logo';
import ProductImageGallery from '../components/ProductImageGallery';
import EngagementRingCarousel from '../components/EngagementRingCarousel';
import PageSEO from '../components/SEO/PageSEO';
import StarRating from '../components/StarRating';
import TestimonialCard from '../components/TestimonialCard';
import OptimizedTestimonialsSwiper from '../components/OptimizedSwiper';
import { useFavorites } from '../hooks/useFavorites';
import { useCart } from 'react-use-cart';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [titleAnimationComplete, setTitleAnimationComplete] = useState(false);
  const heroRef = useRef(null);
  const featuredSectionRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const [isVisible, setIsVisible] = useState({});

  // Throttled scroll handler for better performance
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      setScrollY(window.scrollY);
    }, 32); // Reduced frequency to ~30fps for better performance
  }, []);

  // Intersection Observer for performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    // Observe sections
    const sections = document.querySelectorAll('.section-container');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Memoized data fetching functions to prevent recreation on every render
  const fetchFeaturedProducts = useCallback(async () => {
    try {
      console.log('Fetching featured products...');
      const response = await axios.get('/products');
      const featured = response.data.slice(0, 6);
      console.log('Featured products loaded:', featured.length);
      setFeaturedProducts(featured);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, []);

  const fetchSelectedProducts = useCallback(async () => {
    try {
      console.log('Fetching selected products...');
      const response = await axios.get('/products/featured?limit=6');
      console.log('Selected products response:', response.data);
      setSelectedProducts(response.data);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      // Fallback to regular products if featured endpoint fails
      try {
        const fallbackResponse = await axios.get('/products');
        const fallbackData = fallbackResponse.data.slice(0, 6);
        console.log('Using fallback products:', fallbackData.length);
        setSelectedProducts(fallbackData);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    }
  }, []);

  const fetchDiscountedProducts = useCallback(async () => {
    try {
      console.log('Fetching discounted products...');
      const response = await axios.get('/products/discounted?limit=8');
      console.log('Discounted products response:', response.data);
      setDiscountedProducts(response.data);
    } catch (error) {
      console.error('Error fetching discounted products:', error);
      // Fallback to regular products
      try {
        const fallbackResponse = await axios.get('/products');
        const fallbackData = fallbackResponse.data.slice(0, 8);
        console.log('Using fallback discounted products:', fallbackData.length);
        setDiscountedProducts(fallbackData);
      } catch (fallbackError) {
        console.error('Discounted fallback also failed:', fallbackError);
      }
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      console.log('Fetching categories...');
      const response = await axios.get('/categories');
      console.log('Categories loaded:', response.data.length);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  // Memoized data loading function - defined after fetch functions
  const loadData = useCallback(async () => {
    setIsLoading(true);
    console.log('Starting data loading...');
    console.log('Is mobile device:', window.innerWidth <= 768);
    console.log('User agent:', navigator.userAgent);
    
    // Load all data in parallel for better performance
    await Promise.all([
      fetchFeaturedProducts(),
      fetchSelectedProducts(), 
      fetchDiscountedProducts(),
      fetchCategories()
    ]);
    
    setIsLoading(false);
    console.log('Data loading completed');
  }, [fetchFeaturedProducts, fetchSelectedProducts, fetchDiscountedProducts, fetchCategories]);

  useEffect(() => {
    loadData();

    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [loadData, handleScroll]);

  useEffect(() => {
    // Switch to scroll-controlled animation after initial animation completes
    const timer = setTimeout(() => {
      setTitleAnimationComplete(true);
    }, 3000); // Initial animation duration

    return () => clearTimeout(timer);
  }, []);

  // Memoized GlassCard component to prevent unnecessary re-renders
  const GlassCard = useMemo(() => memo(({ children, className = "" }) => (
    <div className={`glass-card ${className}`}>
      {children}
    </div>
  )), []);

  // Memoized testimonials data to prevent recreation on every render
  const testimonialsData = useMemo(() => [
    {
      name: "שרה וענמצ'ץ",
      location: "תל אביב",
      text: "טבעת האירוסין עם יהלום מעבדה הייתה מושלמת! האיכות מדהימה והמחיר הוגן בהרבה. ממליצה בחום!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      purchase: "טבעת אירוסין 2 קראט"
    },
    {
      name: "דוד כהן",
      location: "ירושלים",
      text: "השירות מקצועי והמוצר איכותי. הבנתי שיהלומי מעבדה זה העתיד ואני מרוצה מהבחירה.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      purchase: "עגילי יהלום"
    },
    {
      name: "מירב לוי",
      location: "חיפה",
      text: "קניתי שרשרת עם יהלום מעבדה והיא פשוט מדהימה. בלתי ניתן להבדיל מיהלום טבעי!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      purchase: "שרשרת יהלום"
    },
    {
      name: "אורי שמואלי",
      location: "באר שבע",
      text: "הקנייה הכי טובה שעשיתי! התכשיטים איכותיים והשירות מעולה. המליץ לכל החברים שלי.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      purchase: "צמיד יהלום"
    },
    {
      name: "רותי אברהם",
      location: "חיפה",
      text: "הצוות מקצועי ונעים להתמודד איתו. המוצרים באיכות גבוהה במחירים הוגנים. תודה!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      purchase: "עגילי יהלום"
    }
  ], []);

  const scrollToFeatured = useCallback(() => {
    if (featuredSectionRef.current) {
      featuredSectionRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50" dir="rtl">
      {/* SEO Optimization for Home Page */}
      <PageSEO 
        page="home"
        title="דף הבית"
        description="ברוכים הבאים לליבי תכשיטים - החנות המובילה ביהלומי מעבדה איכותיים בישראל. גלו את הקולקציה המיוחדת שלנו של טבעות אירוסין, עגילים ושרשראות במחירים מיוחדים."
        canonical="https://libi-jewelry.com/"
      />
      
      {/* Enhanced Styles */}
      <style jsx="true">{`
        @import url('https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@300;400;500;700&display=swap');
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(212, 175, 55, 0.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          border-radius: 16px;
          transition: all 0.2s ease-out;
        }
        
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
          border-color: rgba(212, 175, 55, 0.2);
        }
        
        .elegant-button {
          background: linear-gradient(135deg, #d4af37, #f4e4bc);
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #8b5a00;
          font-weight: 600;
          transition: all 0.3s ease;
          border-radius: 25px;
        }
        
        .elegant-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
          background: linear-gradient(135deg, #e6c558, #f4e4bc);
        }
        
        .hero-text-background {
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid rgba(212, 175, 55, 0.1);
          border-radius: 20px;
          padding: 24px 32px;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        
        .text-elegant {
          color: #2c3e50;
          font-family: 'Heebo', sans-serif;
        }
        
        .text-gold {
          color: #d4af37;
        }
        
        .section-divider {
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            #d4af37 20%,
            #d4af37 80%,
            transparent 100%
          );
          margin: 0 auto;
        }
        
        .parallax-section {
          transform: translate3d(0, ${scrollY * 0.02}px, 0);
          will-change: transform;
        }
        
        .floating-sparkle {
          display: none;
        }
        
        .hero-image {
          background: url('/Background-White.png') center center;
          background-size: cover;
          background-repeat: no-repeat;
          background-attachment: scroll;
          position: relative;
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          will-change: transform;
          transform: translateZ(0);
          contain: layout style paint;
        }
        
        /* Alternative hero image sizing for better display */
        @media (max-width: 768px) {
          .hero-image {
            background-size: contain;
            background-position: center center;
            min-height: 50vh;
          }
        }
        
        @media (min-width: 769px) {
          .hero-image {
            background-size: cover;
            background-position: center 30%;
            min-height: 60vh;
          }
        }
        
        .hero-text-shadow {
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        .popular-badge {
          animation: none;
          will-change: auto;
        }
        
        @keyframes badgeGlow {
          0% { 
            box-shadow: 0 0 5px rgba(212, 175, 55, 0.3);
            transform: scale(1) translateZ(0);
          }
          100% { 
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
            transform: scale(1.05) translateZ(0);
          }
        }
        
        .elegant-shadow {
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #2c3e50, #34495e, #2c3e50);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .aspect-square {
          aspect-ratio: 1 / 1;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .product-card-hover {
          transition: all 0.2s ease-out;
          will-change: transform;
          transform: translateZ(0);
          contain: layout style;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Disable heavy effects on mobile */
        @media (max-width: 768px) {
          .glass-card {
            background: rgba(255, 255, 255, 0.98) !important;
            backdrop-filter: blur(2px) !important;
            -webkit-backdrop-filter: blur(2px) !important;
            min-height: auto;
          }
          
          .hero-text-background {
            background: rgba(255, 255, 255, 0.95) !important;
            padding: 15px;
          }
          
          .floating-sparkle {
            display: none;
          }
          
          .parallax-section {
            transform: none !important;
          }
          
          /* Ensure grid items are visible */
          .grid {
            gap: 0.75rem;
          }
          
          /* Make sure product cards have minimum height */
          .product-card-hover {
            min-height: 280px;
          }
          
          /* Disable bouncing arrow on mobile - too aggressive */
          .scroll-indicator {
            animation: none !important;
          }
          
          /* Reduce scroll sensitivity for title gradient on mobile */
          .diamond-gradient-title.scroll-controlled {
            background-position: ${Math.min(Math.max(scrollY * 0.02, 0), 100)}% ${Math.min(Math.max(50 + scrollY * 0.015, 0), 100)}%;
          }

          /* Fix mobile layout overflow */
          body, html {
            overflow-x: hidden;
          }

          /* Better touch targets */
          button, .btn-elegant, a {
            min-height: 44px;
            min-width: 44px;
          }

          /* Ensure all containers are mobile-friendly */
          .container, .max-w-7xl {
            max-width: 100%;
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
        
        @media (max-width: 480px) {
          .glass-card {
            background: rgba(255, 255, 255, 0.98);
            padding: 0.75rem;
          }
          
          /* Ensure single column on very small screens with proper spacing */
          .grid {
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
          }
          
          /* Adjust product card sizing for very small screens */
          .product-card-hover {
            min-height: 260px;
          }
          
          /* Further reduce scroll sensitivity on small screens */
          .diamond-gradient-title.scroll-controlled {
            background-position: ${Math.min(Math.max(scrollY * 0.01, 0), 100)}% ${Math.min(Math.max(50 + scrollY * 0.008, 0), 100)}%;
          }
          
          /* Make hero section more mobile-friendly */
          .hero-text-background {
            padding: 12px;
            margin: 0 10px;
          }
        }
        
        /* Galaxy S8+ specific optimizations (360px width) */
        @media (max-width: 375px) and (min-width: 350px) {
          .glass-card {
            padding: 0.625rem;
            border-radius: 12px;
          }
          
          /* Perfect spacing for Galaxy S8+ */
          .grid {
            gap: 0.375rem;
          }
          
          /* Optimize product card height for Galaxy S8+ screen ratio */
          .product-card-hover {
            min-height: 240px;
          }
          
          /* Better image aspect ratio for Galaxy S8+ */
          .product-image-galaxy {
            height: 140px;
          }
          
          /* Optimize text sizing for Galaxy S8+ */
          .product-title-galaxy {
            font-size: 0.8rem;
            line-height: 1.2;
          }
          
          .product-price-galaxy {
            font-size: 0.9rem;
          }
          
          /* Perfect hero section for Galaxy S8+ */
          .hero-text-background {
            padding: 8px 12px;
            margin: 0 8px;
          }
          
          /* Optimize section padding for Galaxy S8+ */
          .section-padding-galaxy {
            padding-top: 3rem;
            padding-bottom: 3rem;
          }
          
          /* Better button sizing for Galaxy S8+ */
          .button-galaxy {
            padding: 0.5rem 1.5rem;
            font-size: 0.875rem;
          }
        }
        
        /* Performance optimizations */
        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
            animation: none !important;
          }
        }
        
        /* CSS-only animations for better performance */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        
        /* Swiper Carousel Styles */
        .popular-jewelry-swiper-full {
          padding: 20px 0 60px 0;
          overflow: visible;
          width: 100%;
          max-width: 100%;
        }
        
        .popular-jewelry-swiper-full .swiper-pagination {
          bottom: 0;
          direction: ltr;
        }
        
        .popular-jewelry-swiper-full .swiper-pagination-bullet {
          background: #d4af37;
          opacity: 0.3;
          transition: all 0.3s ease;
          width: 8px;
          height: 8px;
        }
        
        .popular-jewelry-swiper-full .swiper-pagination-bullet-active {
          opacity: 1;
          transform: scale(1.3);
        }
        
        .popular-jewelry-swiper-full .swiper-slide {
          transition: all 0.3s ease;
        }
        
        .popular-jewelry-swiper-full .swiper-slide img {
          transition: all 0.3s ease;
        }
        
        .popular-jewelry-swiper-full .swiper-slide:hover img {
          transform: scale(1.02);
        }
        
        /* Custom navigation arrows styles */
        .swiper-button-prev-custom,
        .swiper-button-next-custom {
          transition: all 0.3s ease;
        }
        
        .swiper-button-prev-custom:hover,
        .swiper-button-next-custom:hover {
          transform: translateY(-50%) scale(1.05);
        }
        
        /* RTL adjustments for Swiper */
        .popular-jewelry-swiper-full[dir="rtl"] .swiper-pagination {
          direction: ltr;
        }
        
        /* Mobile responsiveness for navigation */
        @media (max-width: 768px) {
          .swiper-button-prev-custom,
          .swiper-button-next-custom {
            display: none;
          }
          
          .mobile-navigation .swiper-button-prev-custom,
          .mobile-navigation .swiper-button-next-custom {
            display: inline-block;
            position: static;
            transform: none;
            margin: 0;
          }
          
          .popular-jewelry-swiper-full {
            padding: 20px 0 80px 0;
          }
          
          .mobile-navigation {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 30px;
          }
        }
        
        /* Enhanced typography */
        .popular-jewelry-swiper-full h3 {
          font-family: 'Heebo', sans-serif;
          line-height: 1.2;
        }
        
        .popular-jewelry-swiper-full p {
          font-family: 'Heebo', sans-serif;
          letter-spacing: 0.3px;
        }
        
        /* Square aspect ratio utility */
        .aspect-square {
          aspect-ratio: 1 / 1;
        }
        
        /* Smooth transitions for cards */
        .popular-jewelry-swiper-full .product-card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .popular-jewelry-swiper-full .swiper-slide:hover .product-card-hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        /* Luxury Diamond title styling */
        .diamond-gradient-title {
          background: linear-gradient(
            135deg,
            #1a1a1a 0%,
            #2c2c2c 15%,
            #d4af37 30%,
            #f4e4bc 45%,
            #d4af37 50%,
            #f4e4bc 55%,
            #d4af37 70%,
            #2c2c2c 85%,
            #1a1a1a 100%
          );
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: luxuryShimmer 4s ease-in-out infinite;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
          filter: drop-shadow(0 4px 8px rgba(212, 175, 55, 0.3));
          font-weight: 700;
          letter-spacing: 0.02em;
          will-change: background-position;
        }
        
        .diamond-gradient-title.scroll-controlled {
          animation: none;
          background-position: ${Math.min(Math.max(scrollY * 0.05, 0), 100)}% ${Math.min(Math.max(50 + scrollY * 0.03, 0), 100)}%;
        }
        
        @keyframes luxuryShimmer {
          0% {
            background-position: 0% 50%;
          }
          25% {
            background-position: 100% 30%;
          }
          50% {
            background-position: 0% 70%;
          }
          75% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        /* Luxury text enhancement */
        .luxury-text {
          font-family: 'Frank Ruhl Libre', 'Heebo', serif;
          font-weight: 500;
          letter-spacing: 0.025em;
        }
        
        /* Textured background elements */
        .hero-image::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%);
          pointer-events: none;
          z-index: 1;
        }
        
        /* Luxury section styling */
        .luxury-section {
          position: relative;
          overflow: hidden;
        }
        
        .luxury-section::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: 
            radial-gradient(circle at 30% 70%, rgba(212, 175, 55, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 70% 30%, rgba(212, 175, 55, 0.02) 0%, transparent 50%);
          animation: slowFloat 20s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }
        
        @keyframes slowFloat {
          0%, 100% {
            transform: rotate(0deg) translate(0px, 0px);
          }
          50% {
            transform: rotate(1deg) translate(-10px, -5px);
          }
        }
        
        /* Intersection observer optimization */
        .section-container {
          contain: layout style paint;
        }
        
        /* Testimonials Carousel Styles */
        .testimonials-swiper-unique {
          padding: 20px 0 40px 0;
          overflow: hidden;
        }
        
        .testimonials-pagination {
          text-align: center;
          margin-top: 20px;
        }
        
        .testimonials-bullet {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #d4af37;
          opacity: 0.3;
          margin: 0 4px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-block;
        }
        
        .testimonials-bullet-active {
          opacity: 1;
          transform: scale(1.3);
        }
        
        .testimonials-swiper-unique .swiper-slide {
          height: auto;
          display: flex;
          align-items: stretch;
        }
        
        .testimonials-swiper-unique .swiper-slide .glass-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 100%;
          height: 100%;
        }
      `}</style>

      {/* 1. Hero Section */}
      <section ref={heroRef} className="relative h-80 md:h-96 lg:h-[500px] flex items-center justify-center hero-image">
        
        <div className="relative z-10 text-center px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
            {/* Hero Content */}
            <motion.div 
              className="space-y-4 md:space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="text-center">
                <div className="hero-text-background">
                  <h1 className="text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-light leading-tight hero-text-shadow">
                    <span className={`block font-normal ${titleAnimationComplete ? 'diamond-gradient-title scroll-controlled' : 'diamond-gradient-title'}`}>
                      תכשיטים ברמה אחרת
                    </span>
                  </h1>
                </div>
              </div>
              
              <div className="section-divider w-24 md:w-32" />
            </motion.div>

            {/* Call to Action */}
            <motion.div 
              className="space-y-3 md:space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              <button
                onClick={scrollToFeatured}
                className="elegant-button px-6 sm:px-8 md:px-12 py-2 sm:py-3 md:py-4 text-sm sm:text-lg md:text-xl font-semibold inline-block transform transition-all duration-300 shadow-2xl button-galaxy"
              >
                גלו את הקולקציה שלנו
              </button>
              
              
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 cursor-pointer scroll-indicator animate-bounce md:animate-bounce"
          onClick={scrollToFeatured}
        >
          <ChevronDown className="w-6 h-6 text-gray-400 hover:text-gold transition-colors duration-300" />
        </div>
      </section>

      {/* 2. Engagement Ring Carousel */}
      <EngagementRingCarousel />

      {/* 3. Jewelry Categories Section */}
      <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-white luxury-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-right mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-elegant mb-8 luxury-text">
              עולם תכשיטי היהלומים של LIBI DIAMONDS
            </h2>
            <div className="section-divider w-32 mb-8 mr-0" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Dynamic Categories from Database */}
            {categories.length > 0 ? categories.slice(0, 4).map((category, index) => (
              <div key={category.id || index} className="group cursor-pointer">
                <Link to={`/products?category=${category.id}`} className="block">
                  <div className="relative overflow-hidden rounded-2xl aspect-square mb-4 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                    <img 
                      src={category.image_url || "/api/placeholder/300/300"} 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <h3 className="text-center text-lg md:text-xl font-medium text-elegant mb-2 group-hover:text-gold transition-colors duration-300">
                    {category.name}
                  </h3>
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <ArrowLeft className="w-4 h-4 text-gold group-hover:transform group-hover:-translate-x-1 transition-all duration-300" />
                    <span className="text-sm text-gray-600 group-hover:text-gold transition-colors duration-300">צפייה בקולקציה</span>
                  </div>
                </Link>
              </div>
            )) : (
              // Loading skeleton for categories
              isLoading ? Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="block">
                    <div className="relative overflow-hidden rounded-2xl aspect-square mb-4 shadow-lg bg-gray-200 animate-pulse">
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400">טוען...</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 max-w-32 mx-auto"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse max-w-24 mx-auto"></div>
                    </div>
                  </div>
                </div>
              )) : (
                // Fallback categories if no categories found
                [
                  { id: 'rings', name: 'טבעות יהלומים', image: '/api/placeholder/300/300' },
                  { id: 'earrings', name: 'עגילי יהלומים', image: '/api/placeholder/300/300' },
                  { id: 'bracelets', name: 'צמידים', image: '/api/placeholder/300/300' },
                  { id: 'necklaces', name: 'שרשראות יהלומים', image: '/api/placeholder/300/300' }
                ].map((category, index) => (
                  <div key={category.id} className="group cursor-pointer">
                    <Link to={`/products?category=${category.id}`} className="block">
                      <div className="relative overflow-hidden rounded-2xl aspect-square mb-4 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      <h3 className="text-center text-lg md:text-xl font-medium text-elegant mb-2 group-hover:text-gold transition-colors duration-300">
                        {category.name}
                      </h3>
                      <div className="flex items-center justify-center space-x-2 space-x-reverse">
                        <ArrowLeft className="w-4 h-4 text-gold group-hover:transform group-hover:-translate-x-1 transition-all duration-300" />
                        <span className="text-sm text-gray-600 group-hover:text-gold transition-colors duration-300">צפייה בקולקציה</span>
                      </div>
                    </Link>
                  </div>
                ))
              )
            )}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-right">
            <Link to="/categories" className="elegant-button px-8 py-4 rounded-full text-lg font-semibold inline-block transform transition-all duration-300 hover:scale-105">
              צפייה בכל הקטגוריות
            </Link>
          </div>
        </div>
      </section>

      {/* 4. About Us - Partners in Life's Beautiful Moments - Hidden on Mobile */}
      <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-white hidden md:block">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Right side - Image */}
            <div className="relative order-1 lg:order-2">
              <div className="relative overflow-hidden rounded-3xl aspect-[4/3] shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&h=450&fit=crop"
                  alt="זוג מחזיק ידיים עם טבעת אירוסין"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-transparent to-transparent" />
                
                {/* Floating elements */}
                <div className="absolute top-6 right-6">
                  <div className="glass-card p-3 backdrop-blur-sm">
                    <Heart className="w-6 h-6 text-gold" />
                  </div>
                </div>
                
                <div className="absolute bottom-6 left-6">
                  <div className="glass-card p-4 backdrop-blur-sm">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Sparkles className="w-5 h-5 text-gold" />
                      <span className="text-elegant font-medium text-sm">רגעים יפים</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Left side - Content */}
            <div className="order-2 lg:order-1 space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-light text-elegant mb-8 leading-tight">
                  שמחים להיות שותפים לרגעים היפים שבחיים
            </h2>
                <div className="section-divider w-32 mb-8 lg:mr-0" />
              </div>

              <div className="space-y-6 text-lg leading-relaxed">
                <p className="text-gray-700 font-light">
                  <span className="font-semibold text-gold">LIBI DIAMONDS</span> היא חברה לעיצוב, 
                  ייצור ושיווק תכשיטים המתמקמת בחזית הטכנולוגיה בתחום היהלומים.
                </p>
                
                <p className="text-gray-700 font-light">
                  אנחנו מעצבים תכשיטים עכשוויים ברמה גבוהה וגם מפעילים יד למחישים חלום 
                  ולהכין תכשיט בעיצוב אישי.
                </p>

                <p className="text-gray-700 font-light">
                  המחויבות שלנו לך מתבטאת במחירים הוגנים, שירות אישי ומקצועי במה שיותר בחירה 
                  והכינות אמיתית.
                </p>

                <p className="text-gray-700 font-light">
                  התכשיטים נבחרים בקפידה ומשובצים ומוכמים, וצופצים ומלטשי ברק. 
                  הכל במטרה שתתחו מרצוצים ותגולו לטבעת את ההטמלטת, או לתכשיט שאתם שולמתחם עליו.
            </p>
          </div>

              <div className="space-y-4 pt-6">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div className="glass-card p-4 rounded-2xl">
                    <div className="text-2xl font-light text-gold mb-1">15+</div>
                    <div className="text-gray-600 text-sm">שנות ניסיון</div>
                </div>
                  <div className="glass-card p-4 rounded-2xl">
                    <div className="text-2xl font-light text-gold mb-1">2,450+</div>
                    <div className="text-gray-600 text-sm">לקוחות מרוצים</div>
                  </div>
                  <div className="glass-card p-4 rounded-2xl">
                    <div className="text-2xl font-light text-gold mb-1">98%</div>
                    <div className="text-gray-600 text-sm">שביעות רצון</div>
                  </div>
          </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/about" 
                    className="elegant-button px-8 py-4 rounded-full text-lg font-medium inline-flex items-center justify-center flex-1"
                  >
                    קראו עוד עלינו
                    <ArrowLeft className="w-5 h-5 mr-3" />
                  </Link>
                  
                  <button className="glass-card border border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-medium hover:bg-white/50 transition-all duration-300 inline-flex items-center justify-center flex-1">
                    <Phone className="w-5 h-5 ml-3" />
                    יצירת קשר
              </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Discounted Jewelry - Row of Items */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-right mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-elegant mb-8">
              תכשיטים מוזלים
            </h2>
            <div className="section-divider w-32 mb-8 mr-0" />
          </div>

          <div className="overflow-x-auto md:overflow-x-visible">
            <div className="flex space-x-4 space-x-reverse pb-6 scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:space-x-0 min-w-max md:min-w-0">
              {discountedProducts.length > 0 ? discountedProducts.slice(0, 8).map((product, index) => (
              <div key={product.id || index} className="flex-shrink-0 w-60 md:w-auto md:flex-shrink">
                <Link to={`/products/${product.id}`} className="group block">
                    <GlassCard className="overflow-hidden h-full flex flex-col hover:scale-105 transition-all duration-300 product-card-hover">
                    {/* Image Container with fixed height */}
                    <div className="relative overflow-hidden">
                      <ProductImageGallery 
                        images={product.images || product.image_url} 
                        productName={product.name}
                          className="w-full h-40 sm:h-48 md:h-56"
                          showNavigation={false}
                      />
                      
                      <div className="absolute top-2 left-2">
                        <span className="text-sm font-bold text-black">
                          Sale
                        </span>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-4">
                        <button className="elegant-button px-3 py-1 text-xs rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                          רכישה מהירה
                        </button>
                      </div>
                    </div>
                    
                    {/* Card Content */}
                    <div className="p-3 md:p-4 flex-1 flex flex-col justify-between">
                        <h3 className="text-sm md:text-base font-medium text-elegant mb-2 line-clamp-2 leading-snug group-hover:text-gold transition-colors duration-300">
                          {product.name || 'תכשיט יהלום'}
                        </h3>
                      
                      <div className="text-center mt-auto">
                        {/* Prices in one line */}
                        <p className="text-sm md:text-base">
                          <span className="text-gray-500 line-through ml-2">
                            ₪{product.price?.toLocaleString() || '4,000'}
                          </span>
                          <span className="font-semibold text-black underline">
                            ₪{(() => {
                              const originalPrice = product.price || 4000;
                              const discountPercentage = product.discount_percentage || 20;
                              const discountedPrice = Math.round(originalPrice * (1 - discountPercentage / 100));
                              return discountedPrice.toLocaleString();
                            })()}
                          </span>
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </div>
              )) : (
                // Loading skeleton for discounted products
                isLoading && Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex-shrink-0 w-60 md:w-auto md:flex-shrink">
                    <div className="glass-card overflow-hidden h-full flex flex-col product-card-hover">
                      <div className="w-full h-40 sm:h-48 md:h-56 bg-gray-200 animate-pulse flex items-center justify-center">
                        <span className="text-gray-400">טוען...</span>
                      </div>
                      <div className="p-3 md:p-4 flex-1 flex flex-col justify-between">
                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="text-center space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3 mx-auto"></div>
                          <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2 mx-auto"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>


        </div>
      </section>

      {/* 6. Blog Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-right mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-elegant mb-8 luxury-text">
              הבלוג שלנו
            </h2>
            <div className="section-divider w-32 mb-8 mr-0" />
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: "blog-1",
                title: "יהלומי מעבדה נגד יהלומים טבעיים - המדריך המלא",
                summary: "כל מה שרציתם לדעת על יהלומי מעבדה: איך הם נוצרים, מה ההבדלים מיהלומים טבעיים, ולמה הם העתיד של תעשיית התכשיטים",
                category: "מדריכים",
                author: "צוות LIBI DIAMONDS",
                published: "15 בפברואר 2024",
                image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop",
                readTime: "10 דקות קריאה",
                link: "/lab-diamonds-guide"
              },
              {
                id: "blog-2", 
                title: "איך לבחור טבעת אירוסין מושלמת",
                summary: "כל מה שצריך לדעת על בחירת טבעת האירוסין הנכונה - מגודל היהלום ועד לסגנון התפאורה שיתאים לכם בדיוק.",
                                  category: "טבעות אירוסין",
                  author: "צוות LIBI DIAMONDS",
                  published: "22 בפברואר 2024", 
                image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop",
                readTime: "7 דקות קריאה",
                link: "/engagement-ring-guide"
              },
              {
                id: "blog-3",
                title: "טיפוח ושמירה על תכשיטי יהלום",
                summary: "למדו את הדרכים הטובות ביותר לשמור על הברק והיופי של התכשיטים שלכם לאורך שנים רבות.",
                category: "טיפוח ותחזוקה",
                author: "צוות LIBI DIAMONDS",
                published: "1 במרץ 2024",
                image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
                readTime: "4 דקות קריאה",
                link: "/diamond-care-guide"
              }
            ].map((post) => {
              const content = (
                <>
                  <div className="overflow-hidden rounded-lg mb-4">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="text-center space-y-3">
                    <h3 className="text-lg font-medium text-gray-900 leading-tight">
                      {post.title}
                    </h3>
                    
                    <span className={`text-sm transition-colors duration-300 ${post.link ? 'text-gold hover:text-yellow-600' : 'text-gray-600 hover:text-gray-900'}`}>
                      « קרא עוד
                    </span>
                  </div>
                </>
              );

              return (
                <div key={post.id} className="group cursor-pointer">
                  {post.link ? (
                    <Link to={post.link}>
                      {content}
                    </Link>
                  ) : (
                    <div>
                      {content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-right mt-12">
            <Link 
              to="/blog" 
              className="elegant-button px-8 py-4 rounded-full text-lg font-medium inline-flex items-center"
            >
              צפייה בכל הכתבות
              <ArrowLeft className="w-5 h-5 mr-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Our Customers - What They Say */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-right mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-elegant mb-8 luxury-text">
              מה אומרים עלינו בגוגל
            </h2>
            <div className="section-divider w-32 mb-8 mr-0" />
          </div>

          {/* Optimized Testimonials Swiper */}
          <OptimizedTestimonialsSwiper 
            testimonials={testimonialsData} 
            GlassCard={GlassCard} 
          />

          <div className="text-center">
            <GlassCard className="p-12 max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <Heart className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-medium text-elegant mb-6">הצטרפו לאלפי לקוחות מרוצים</h3>
              <p className="text-gray-600 font-light mb-8 leading-relaxed">
                כל יום עוד לקוחות מגלים את היתרונות של יהלומי מעבדה ובוחרים בעתיד התכשיטים.
                הצטרפו גם אתם למהפכה!
              </p>
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-light text-gold mb-2">4.9/5</div>
                  <div className="text-gray-600 text-sm">דירוג ממוצע</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-gold mb-2">2,450+</div>
                  <div className="text-gray-600 text-sm">לקוחות מרוצים</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-gold mb-2">98%</div>
                  <div className="text-gray-600 text-sm">יחזרו לקנות</div>
                </div>
              </div>
              <button className="elegant-button px-8 py-3 rounded-full">
                קרא עוד עדויות לקוחות
              </button>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-6">
                <Logo className="h-10 w-10 text-gold ml-3" />
                <h3 className="text-2xl font-light text-white">LIBI DIAMONDS</h3>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 font-light">
                החברה המובילה בישראל לעיצוב וייצור תכשיטי יהלומי מעבדה איכותיים. 
                אנחנו מביאים לכם את עתיד התכשיטים עם טכנולוגיה מתקדמת ומחירים הוגנים.
              </p>
              <div className="flex space-x-4 space-x-reverse">
                {[
                  { icon: '📧', label: 'אימייל' },
                  { icon: '📱', label: 'וואטסאפ' },
                  { icon: '📘', label: 'פייסבוק' },
                  { icon: '📷', label: 'אינסטגרם' }
                ].map((social, idx) => (
                  <button 
                    key={idx}
                    className="w-10 h-10 rounded-full bg-gray-700/50 hover:bg-gold/20 border border-gray-600/50 hover:border-gold/30 flex items-center justify-center transition-all duration-300"
                    aria-label={social.label}
                  >
                    <span className="text-lg">{social.icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-medium mb-6 text-white">קישורים מהירים</h4>
              <ul className="space-y-4">
                {[
                  { text: 'דף הבית', href: '/' },
                  { text: 'המוצרים שלנו', href: '/products' },
                  { text: 'קטגוריות', href: '/categories' },
                  { text: 'אודותינו', href: '/about' },
                  { text: 'יצירת קשר', href: '/contact' }
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link 
                      to={link.href} 
                      className="text-gray-300 hover:text-gold transition-colors duration-300 flex items-center group font-light"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gold/50 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-xl font-medium mb-6 text-white">השירותים שלנו</h4>
              <ul className="space-y-4">
                {[
                  'טבעות אירוסין',
                  'עגילי יהלום',
                  'שרשראות יהלום',
                  'צמידי יהלום',
                  'עיצוב אישי',
                  'יהלומי מעבדה'
                ].map((service, idx) => (
                  <li key={idx} className="text-gray-300 hover:text-gold transition-colors duration-300 flex items-center group font-light cursor-pointer">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/50 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-xl font-medium mb-6 text-white">יצירת קשר</h4>
              <div className="space-y-4">
                <div className="flex items-center text-gray-300">
                  <MapPin className="w-5 h-5 ml-3 text-gold" />
                  <div>
                    <p className="font-light">רחוב הזהב 15</p>
                    <p className="font-light">תל אביב, ישראל</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-300">
                  <Phone className="w-5 h-5 ml-3 text-gold" />
                  <div>
                    <p className="font-light">03-123-4567</p>
                    <p className="text-sm text-gray-400">ראשון - חמישי: 09:00-18:00</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-300">
                  <Mail className="w-5 h-5 ml-3 text-gold" />
                  <div>
                    <p className="font-light">info@diamondhouse.co.il</p>
                    <p className="text-sm text-gray-400">מענה תוך 24 שעות</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-300">
                  <Clock className="w-5 h-5 ml-3 text-gold" />
                  <div>
                    <p className="font-light">שעות פתיחה</p>
                    <p className="text-sm text-gray-400">א׳-ה׳: 09:00-18:00 | ו׳: 09:00-14:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col md:flex-row items-center gap-4 text-gray-400 text-sm">
                <p className="font-light">© 2024 LIBI DIAMONDS. כל הזכויות שמורות.</p>
                <div className="flex gap-4">
                  <Link to="/privacy" className="hover:text-gold transition-colors duration-300">מדיניות פרטיות</Link>
                  <span>|</span>
                  <Link to="/terms" className="hover:text-gold transition-colors duration-300">תנאי שימוש</Link>
                  <span>|</span>
                  <Link to="/warranty" className="hover:text-gold transition-colors duration-300">אחריות</Link>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Shield className="w-4 h-4 text-gold" />
                <span className="font-light">קנייה מאובטחת</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 