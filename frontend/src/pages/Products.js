import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Filter, Grid, List, Star, Eye, Heart, ChevronDown, Diamond, Sparkles, ShoppingBag } from 'lucide-react';
import { Menu } from '@headlessui/react';
import ProductImageGallery from '../components/ProductImageGallery';
import ColorSelector from '../components/ColorSelector';
import { useFavorites } from '../hooks/useFavorites';
import { useCart } from 'react-use-cart';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popular');

  
  // Track selected variants for each product
  const [selectedVariants, setSelectedVariants] = useState({});
  
  // Favorites functionality
  const { favorites, isFavorite, toggleFavorite, openSidebar } = useFavorites();
  
  // Cart functionality
  const { addItem } = useCart();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory]);

  // Update current category when selectedCategory or categories change
  useEffect(() => {
    if (selectedCategory && categories.length > 0) {
      const category = categories.find(c => c.id.toString() === selectedCategory);
      setCurrentCategory(category || null);
    } else {
      setCurrentCategory(null);
    }
  }, [selectedCategory, categories]);

  const fetchProducts = async () => {
    try {
      const params = selectedCategory ? { category_id: selectedCategory } : {};
      const response = await axios.get('/api/products', { params });
      setProducts(response.data);
      
      // Initialize selected variants (default or first variant for each product)
      const initialVariants = {};
      response.data.forEach(product => {
        if (product.variants && product.variants.length > 0) {
          const defaultVariant = product.variants.find(v => v.is_default) || product.variants[0];
          initialVariants[product.id] = defaultVariant;
        }
      });
      setSelectedVariants(initialVariants);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  };

  const handleVariantChange = (productId, variant) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variant
    }));
  };

  const getProductImages = (product) => {
    const selectedVariant = selectedVariants[product.id];
    
    // If variant is selected and has images, use variant images
    if (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0) {
      return selectedVariant.images;
    }
    
    // Fallback to product images or image_url
    return product.images || product.image_url;
  };

  const filteredProducts = products
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          // Sort by creation date (newest first) - assuming there's a created_at field
          return new Date(b.created_at || b.id) - new Date(a.created_at || a.id);
        case 'popular':
          // Sort by popularity - assuming there's a popularity field or using view count
          return (b.popularity || b.view_count || 0) - (a.popularity || a.view_count || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-rose-50" dir="rtl">
        <div className="glass-effect p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
            <Diamond className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 font-light">טוען מוצרים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50" dir="rtl">
      {/* Enhanced Styles */}
      <style jsx="true">{`
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(200, 200, 200, 0.2);
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }
        
        .product-card {
          background: transparent;
          border: none;
          border-radius: 0;
          box-shadow: none;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: visible;
          position: relative;
        }
        
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: none;
        }
        
        .product-image-container {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          background: transparent;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .product-card:hover .product-image-container {
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
          transform: translateY(-4px);
        }
        
        .product-content {
          padding: 16px 0 0 0;
          text-align: center;
          background: transparent;
        }
        
        .product-title {
          font-size: 16px;
          font-weight: 500;
          color: #2c3e50;
          margin-bottom: 8px;
          line-height: 1.4;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
        }
        
        .product-price {
          font-size: 18px;
          font-weight: 600;
          color: #2563eb;
          margin: 0;
          background: transparent;
        }
        
        .heart-button {
          position: absolute;
          top: 12px;
          left: 12px;
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
          z-index: 10;
        }
        
        .heart-button:hover {
          background: rgba(255, 255, 255, 1);
          transform: scale(1.1);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }
        
        .heart-icon {
          width: 18px;
          height: 18px;
          transition: all 0.3s ease;
        }
        
        .heart-icon.filled {
          fill: #e11d48;
          stroke: #e11d48;
        }
        
        .heart-icon:not(.filled) {
          fill: none;
          stroke: #6b7280;
          stroke-width: 2;
        }
        
        .add-to-cart-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, transparent 100%);
          padding: 20px 16px 16px;
          transform: translateY(100%);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          border-radius: 0 0 16px 16px;
        }
        
        .product-card:hover .add-to-cart-overlay {
          transform: translateY(0);
          opacity: 1;
        }
        
        .add-to-cart-button {
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #2563eb 100%);
          border: none;
          color: white;
          font-weight: 600;
          font-size: 14px;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
          display: flex;
          align-items: center;
          gap: 6px;
          width: 100%;
          justify-content: center;
          letter-spacing: 0.5px;
        }
        
        .add-to-cart-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
          background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #1d4ed8 100%);
        }

        /* Mobile-specific styles matching the design */
        .mobile-product-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.05);
          position: relative;
          z-index: 1 !important;
        }
        
        .mobile-product-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }
        
        .mobile-image-container {
          position: relative;
          background: #f8f9fa;
          border-radius: 12px 12px 0 0;
          overflow: hidden;
        }
        
        .mobile-heart-button {
          position: absolute;
          top: 8px;
          left: 8px;
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          z-index: 10;
        }
        
        .mobile-heart-button:hover {
          background: rgba(255, 255, 255, 1);
          transform: scale(1.1);
        }
        
        .mobile-heart-icon {
          width: 16px;
          height: 16px;
          transition: all 0.3s ease;
        }
        
        .mobile-heart-icon.filled {
          fill: #e11d48;
          stroke: #e11d48;
        }
        
        .mobile-heart-icon:not(.filled) {
          fill: none;
          stroke: #6b7280;
          stroke-width: 2;
        }
        
        .mobile-content {
          padding: 12px;
          text-align: center;
          background: white;
        }
        
        .mobile-title {
          font-size: 14px;
          font-weight: 500;
          color: #2c3e50;
          margin-bottom: 8px;
          line-height: 1.3;
          min-height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        
        .mobile-price {
          font-size: 16px;
          font-weight: 600;
          color: #2563eb;
          margin: 0;
          text-align: center;
        }
        
        /* Mobile breakpoint adjustments */
        @media (max-width: 768px) {
          .mobile-product-card {
            border-radius: 8px;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
          }
          
          .mobile-image-container {
            border-radius: 8px 8px 0 0;
          }
          
          .mobile-content {
            padding: 8px 6px;
          }
          
          .mobile-title {
            font-size: 13px;
            min-height: 30px;
            margin-bottom: 4px;
          }
          
          .mobile-price {
            font-size: 15px;
            font-weight: 700;
          }
          
          .mobile-heart-button {
            top: 6px;
            left: 6px;
            width: 28px;
            height: 28px;
          }
          
          .mobile-heart-icon {
            width: 14px;
            height: 14px;
          }
        }
        
        /* Extra small screens */
        @media (max-width: 480px) {
          .mobile-title {
            font-size: 12px;
            min-height: 30px;
          }
          
          .mobile-price {
            font-size: 14px;
          }
          
          .mobile-content {
            padding: 8px 6px;
          }
        }

        /* Headless UI Filter Dropdown Styles */
        .filter-container {
          position: relative;
          z-index: 10;
        }
        
        .filter-button {
          background: rgba(255, 255, 255, 0.95);
          border: 2px solid rgba(200, 200, 200, 0.3);
          border-radius: 12px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          color: #2c3e50;
          font-weight: 500;
          min-height: 40px;
          flex: 1;
        }
        
        @media (min-width: 768px) {
          .filter-button {
            flex: none;
            width: auto;
            min-height: auto;
          }
        }
        
        .filter-button:hover {
          background: rgba(255, 255, 255, 1);
          border-color: #6b7280;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .filter-menu {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          background: white;
          border: 1px solid rgba(200, 200, 200, 0.3);
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          z-index: 50;
          min-width: 250px;
          padding: 6px 0;
        }
        
        .filter-section {
          padding: 6px 0;
          border-bottom: 1px solid rgba(200, 200, 200, 0.2);
        }
        
        .filter-section:last-child {
          border-bottom: none;
        }
        
        .filter-option {
          width: 100%;
          padding: 10px 14px;
          text-align: right;
          border: none;
          background: none;
          cursor: pointer;
          transition: background-color 0.2s ease;
          font-size: 14px;
          color: #2c3e50;
          display: block;
          text-decoration: none;
        }
        
        .filter-option:visited {
          color: #2c3e50;
        }
        
        .filter-option:hover {
          background: rgba(240, 240, 240, 0.8);
        }
        
        .filter-option.active {
          background: rgba(37, 99, 235, 0.1);
          color: #2563eb;
          font-weight: 500;
        }
        
        .elegant-input {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 16px;
          transition: all 0.3s ease;
        }
        
        .elegant-input:focus {
          background: rgba(255, 255, 255, 0.95);
          border-color: #d4af37;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
          outline: none;
        }
        
        .elegant-button {
          background: linear-gradient(135deg, #d4af37, #f4e4bc, #d4af37);
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #8b5a00;
          font-weight: 500;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
          border-radius: 16px;
        }
        
        .elegant-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
          background: linear-gradient(135deg, #e6c558, #f4e4bc, #e6c558);
        }
        
        .text-elegant {
          color: #2c3e50;
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
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Diamond silver black gradient heart */
        .heart-icon-gradient {
          stroke: url(#diamondGradient);
          stroke-width: 2;
          fill: none;
          transition: all 0.3s ease;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
          position: relative;
        }
        
        .heart-icon-gradient.filled {
          fill: url(#diamondFillGradient);
          stroke: url(#diamondGradient);
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.2));
        }
        
        .heart-icon-gradient:hover {
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.25));
          transform: scale(1.15);
        }
        
        /* Add subtle shine animation */
        .heart-icon-gradient:after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: heartShine 2s ease-in-out infinite;
        }
        
        @keyframes heartShine {
          0% { left: -100%; }
          50% { left: 100%; }
          100% { left: 100%; }
        }
        
        /* List view heart gradient styles */
        .heart-icon-gradient-list {
          stroke: url(#diamondGradientList);
          stroke-width: 2;
          fill: none;
          transition: all 0.3s ease;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
          position: relative;
        }
        
        .heart-icon-gradient-list.filled {
          fill: url(#diamondFillGradientList);
          stroke: url(#diamondGradientList);
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.2));
        }
        
        .heart-icon-gradient-list:hover {
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.25));
          transform: scale(1.15);
        }

        .hero-banner {
          position: relative;
          height: 300px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.8), rgba(184, 134, 11, 0.9));
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        
        .hero-banner.with-image {
          background-attachment: fixed;
        }
        
        .hero-content {
          text-align: center;
          z-index: 2;
          max-width: 600px;
          padding: 0 2rem;
        }

        /* Remove conflicting dropdown styles for Headless UI */
      `}</style>

      {/* Hero Banner */}
      <div 
        className={`hero-banner ${currentCategory?.hero_image_url ? 'with-image' : ''}`}
        style={{
          backgroundImage: currentCategory?.hero_image_url 
            ? `url(${currentCategory.hero_image_url.startsWith('http') ? currentCategory.hero_image_url : `http://localhost:8001${currentCategory.hero_image_url}`})`
            : `url("https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")`
        }}
      >
        <div className="hero-content">
          <h1 className="text-4xl md:text-6xl font-light text-white mb-4">
            {currentCategory ? `קטגוריית ${currentCategory.name}` : 'קולקציית היהלומים שלנו'}
          </h1>
          <p className="text-xl text-white/90 font-light leading-relaxed">
            {currentCategory 
              ? (currentCategory.description || `גלו את מגוון ${currentCategory.name} הייחודיים שלנו`)
              : 'גלו את מגוון התכשיטים הייחודיים שלנו'
            }
          </p>
        </div>
      </div>

      {/* Filter Section - Using Headless UI Menu - Outside main container */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-3 md:pt-12">
        <div className="flex justify-start items-center gap-2 md:gap-3 mb-3 md:mb-6">
          {/* Category Selector */}
          <Menu as="div" className="relative filter-container">
            <Menu.Button className="filter-button">
              <span>קטגוריות</span>
              <ChevronDown className="w-4 h-4" />
            </Menu.Button>
          
            <Menu.Items className="filter-menu">
              {/* Category Options */}
              <div className="filter-section">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/products"
                      className={`filter-option ${active ? 'bg-gray-50' : ''} ${selectedCategory === '' ? 'active' : ''}`}
              >
                      כל הקטגוריות
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/products?category=1"
                      className={`filter-option ${active ? 'bg-gray-50' : ''} ${selectedCategory === '1' ? 'active' : ''}`}
              >
                      טבעות אירוסין
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/products?category=2"
                      className={`filter-option ${active ? 'bg-gray-50' : ''} ${selectedCategory === '2' ? 'active' : ''}`}
                    >
                      עגילים
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/products?category=3"
                      className={`filter-option ${active ? 'bg-gray-50' : ''} ${selectedCategory === '3' ? 'active' : ''}`}
                    >
                      שרשרות
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/products?category=4"
                      className={`filter-option ${active ? 'bg-gray-50' : ''} ${selectedCategory === '4' ? 'active' : ''}`}
                    >
                      צמידים
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/products?category=5"
                      className={`filter-option ${active ? 'bg-gray-50' : ''} ${selectedCategory === '5' ? 'active' : ''}`}
                    >
                      טבעות נישואין
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/products?category=6"
                      className={`filter-option ${active ? 'bg-gray-50' : ''} ${selectedCategory === '6' ? 'active' : ''}`}
                    >
                      סטים
                    </Link>
                  )}
                </Menu.Item>
                    </div>
            </Menu.Items>
          </Menu>

          {/* Sort Selector */}
          <Menu as="div" className="relative filter-container">
            <Menu.Button className="filter-button">
              <span>מיון לפי</span>
              <ChevronDown className="w-4 h-4" />
            </Menu.Button>
            
            <Menu.Items className="filter-menu">
              {/* Sort Options Only */}
                <div className="filter-section">
                <Menu.Item>
                  {({ active }) => (
                    <button
                                          className={`filter-option ${active ? 'bg-gray-50' : ''} ${sortBy === 'popular' ? 'active' : ''}`}
                      onClick={() => setSortBy('popular')}
                    >
                      הכי פופולרי
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                    className={`filter-option ${active ? 'bg-gray-50' : ''} ${sortBy === 'price-low' ? 'active' : ''}`}
                      onClick={() => setSortBy('price-low')}
                  >
                      מהזול ליקר
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                    className={`filter-option ${active ? 'bg-gray-50' : ''} ${sortBy === 'price-high' ? 'active' : ''}`}
                      onClick={() => setSortBy('price-high')}
                    >
                      מהיקר לזול
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                    className={`filter-option ${active ? 'bg-gray-50' : ''} ${sortBy === 'newest' ? 'active' : ''}`}
                      onClick={() => setSortBy('newest')}
                  >
                      תכשיטים חדשים קודם
                    </button>
                  )}
                </Menu.Item>
                  </div>
            </Menu.Items>
          </Menu>
        </div>

        {/* Products Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6" style={{ position: 'relative', zIndex: -1 }}>
            {filteredProducts.map((product) => (
              <div key={product.id} className="mobile-product-card">
                {/* Image Container */}
                <div className="mobile-image-container">
                  <Link to={`/products/${product.id}`}>
                    <ProductImageGallery 
                      images={getProductImages(product)} 
                      productName={product.name}
                      className="w-full h-48 md:h-64 lg:h-80"
                      showNavigation={false}
                    />
                  </Link>
                  
                  {/* Heart Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(product);
                      openSidebar();
                    }}
                    className="mobile-heart-button"
                  >
                    <Heart className={`mobile-heart-icon ${isFavorite(product.id) ? 'filled' : ''}`} />
                  </button>

                  {/* Add to Cart Overlay - hidden on mobile */}
                  <div className="add-to-cart-overlay hidden md:block">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addItem(product);
                      }}
                      className="add-to-cart-button"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      הוסף לסל
                    </button>
                  </div>
                </div>
                
                {/* Card Content */}
                <div className="mobile-content">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="mobile-title">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <Link to={`/products/${product.id}`}>
                    <p className="mobile-price">
                      ₪{(product.price || 0).toLocaleString()}
                    </p>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* SVG Gradient Definitions for List View */}
            <svg width="0" height="0" className="absolute">
              <defs>
                <linearGradient id="diamondGradientList" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34495e" />
                  <stop offset="25%" stopColor="#7f8c8d" />
                  <stop offset="50%" stopColor="#bdc3c7" />
                  <stop offset="75%" stopColor="#ecf0f1" />
                  <stop offset="100%" stopColor="#95a5a6" />
                </linearGradient>
                <linearGradient id="diamondFillGradientList" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#bdc3c7" />
                  <stop offset="30%" stopColor="#ecf0f1" />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="70%" stopColor="#f8f9fa" />
                  <stop offset="100%" stopColor="#e9ecef" />
                </linearGradient>
                {/* Shine effect for list */}
                <linearGradient id="diamondShineList" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                  <stop offset="40%" stopColor="rgba(255,255,255,0)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.8)" />
                  <stop offset="60%" stopColor="rgba(255,255,255,0)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
              </defs>
            </svg>
            
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="product-card group flex flex-col md:flex-row overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* Image Container for list view */}
                <div className="relative w-full md:w-64 lg:w-80 h-48 md:h-40 flex-shrink-0 overflow-hidden">
                  <ProductImageGallery 
                    images={getProductImages(product)} 
                    productName={product.name}
                    className="w-full h-full"
                    showNavigation={false}
                  />
                  
                  <div className="absolute top-3 left-3">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(product);
                        openSidebar();
                      }}
                      className="transition-all duration-200 hover:scale-110"
                    >
                      <Heart 
                        className={`w-6 h-6 transition-all duration-300 ${
                          isFavorite(product.id) 
                            ? 'heart-icon-gradient-list filled' 
                            : 'heart-icon-gradient-list'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 p-4 md:p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-medium text-elegant mb-2 group-hover:text-gold transition-colors duration-300">
                        {product.name}
                      </h3>
                      
                      {product.description && (
                        <p className="text-gray-600 mb-4 font-light leading-relaxed text-sm md:text-base">
                          {product.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        {product.carat_weight && (
                          <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                            <Diamond className="w-4 h-4 mr-1 text-gold" />
                            {product.carat_weight} קראט
                          </span>
                        )}
                        {product.color_grade && (
                          <span className="bg-gray-100 px-3 py-1 rounded-full">צבע: {product.color_grade}</span>
                        )}
                        {product.clarity_grade && (
                          <span className="bg-gray-100 px-3 py-1 rounded-full">בהירות: {product.clarity_grade}</span>
                        )}
                        {product.cut_grade && (
                          <span className="bg-gray-100 px-3 py-1 rounded-full">חיתוך: {product.cut_grade}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-left mr-6 flex-shrink-0">
                      <p className="text-xl md:text-2xl font-medium text-gold mb-3">
                        ₪{(product.price || 0).toLocaleString()}
                      </p>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addItem(product);
                          }}
                          className="elegant-button px-4 py-2 text-sm rounded-full flex items-center gap-2"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          הוסף לסל
                        </button>
                        <Link 
                          to={`/products/${product.id}`}
                          className="elegant-button px-4 py-2 text-sm rounded-full"
                        >
                          צפייה בפרטים
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="glass-card p-12 max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <Filter className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-elegant mb-4">לא נמצאו מוצרים</h3>
              <p className="text-gray-600 font-light mb-6">
                נסו לשנות את קריטריוני החיפוש או הסירו פילטרים
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('');
                }}
                className="elegant-button px-6 py-2"
              >
                אפס פילטרים
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products; 