import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Filter, Grid, List, Star, Eye, Heart, ChevronDown, Diamond, Sparkles, ShoppingBag } from 'lucide-react';
import ProductImageGallery from '../components/ProductImageGallery';
import ColorSelector from '../components/ColorSelector';
import { useFavorites } from '../hooks/useFavorites';
import { useCart } from 'react-use-cart';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [filterOpen, setFilterOpen] = useState(false);
  
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

  const fetchProducts = async () => {
    try {
      const params = selectedCategory ? { category_id: selectedCategory } : {};
      const response = await axios.get('/products', { params });
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
      const response = await axios.get('/categories');
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
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-rose-50" dir="rtl">
        <div className="glass-effect p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
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
          border: 1px solid rgba(212, 175, 55, 0.1);
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
          color: #d4af37;
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
          fill: #d4af37;
          stroke: #d4af37;
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
          background: linear-gradient(135deg, #d4af37 0%, #f4e4bc 50%, #d4af37 100%);
          border: none;
          color: #8b5a00;
          font-weight: 600;
          font-size: 14px;
          padding: 10px 20px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          justify-content: center;
          letter-spacing: 0.5px;
        }
        
        .add-to-cart-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
          background: linear-gradient(135deg, #e6c558 0%, #f4e4bc 50%, #e6c558 100%);
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
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.8), rgba(184, 134, 11, 0.9)), 
                      url('https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80');
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        
        .hero-content {
          text-align: center;
          z-index: 2;
          max-width: 600px;
          padding: 0 2rem;
        }

        .filter-dropdown {
          position: relative;
          display: inline-block;
        }

        .filter-button {
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid rgba(212, 175, 55, 0.2);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
          color: #2c3e50;
        }

        .filter-button:hover {
          background: rgba(255, 255, 255, 1);
          border-color: #d4af37;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);
        }

        .filter-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
          z-index: 10;
          min-width: 250px;
          padding: 0.5rem 0;
          margin-top: 0.5rem;
          opacity: 0;
          transform: translateY(-10px);
          pointer-events: none;
          transition: all 0.3s ease;
        }

        .filter-dropdown:hover .filter-menu,
        .filter-dropdown.active .filter-menu {
          opacity: 1;
          transform: translateY(0);
          pointer-events: all;
        }

        .filter-section {
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
        }

        .filter-section:last-child {
          border-bottom: none;
        }

        .filter-section-title {
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: #8b5a00;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filter-option {
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
          font-size: 0.9rem;
          color: #2c3e50;
        }

        .filter-option:hover {
          background: rgba(212, 175, 55, 0.1);
        }

        .filter-option.active {
          background: rgba(212, 175, 55, 0.2);
          color: #8b5a00;
          font-weight: 500;
        }
      `}</style>

      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1 className="text-4xl md:text-6xl font-light text-white mb-4">
            קולקציית היהלומים שלנו
          </h1>
          <p className="text-xl text-white/90 font-light leading-relaxed">
            גלו את מגוון התכשיטים הייחודיים שלנו
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16">
        {/* Compact Filter Section */}
        <div className="flex justify-between items-center mb-12">
          <p className="text-gray-600">
            נמצאו <span className="font-medium text-gold">{filteredProducts.length}</span> מוצרים
            {selectedCategory && (
              <span className="font-medium">
                {' '} בקטגוריה "{categories.find(c => c.id == selectedCategory)?.name}"
              </span>
            )}
          </p>
          
          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex glass-card border-0 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-colors duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-colors duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Dropdown */}
            <div className="filter-dropdown">
              <div 
                className="filter-button"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Filter className="w-4 h-4" />
                <span>סינון ומיון</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
              </div>
              
              <div className={`filter-menu ${filterOpen ? 'active' : ''}`}>
                {/* Category Filter */}
                <div className="filter-section">
                  <div className="filter-section-title">קטגוריה</div>
                  <div 
                    className={`filter-option ${selectedCategory === '' ? 'active' : ''}`}
                    onClick={() => {
                      handleCategoryChange('');
                      setFilterOpen(false);
                    }}
                  >
                    כל הקטגוריות
                  </div>
                  {categories.map((category) => (
                    <div 
                      key={category.id}
                      className={`filter-option ${selectedCategory == category.id ? 'active' : ''}`}
                      onClick={() => {
                        handleCategoryChange(category.id);
                        setFilterOpen(false);
                      }}
                    >
                      {category.name}
                    </div>
                  ))}
                </div>

                {/* Sort Options */}
                <div className="filter-section">
                  <div className="filter-section-title">מיון</div>
                  <div 
                    className={`filter-option ${sortBy === 'name' ? 'active' : ''}`}
                    onClick={() => {
                      setSortBy('name');
                      setFilterOpen(false);
                    }}
                  >
                    לפי שם
                  </div>
                  <div 
                    className={`filter-option ${sortBy === 'price-low' ? 'active' : ''}`}
                    onClick={() => {
                      setSortBy('price-low');
                      setFilterOpen(false);
                    }}
                  >
                    מחיר: נמוך לגבוה
                  </div>
                  <div 
                    className={`filter-option ${sortBy === 'price-high' ? 'active' : ''}`}
                    onClick={() => {
                      setSortBy('price-high');
                      setFilterOpen(false);
                    }}
                  >
                    מחיר: גבוה לנמוך
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                {/* Image Container */}
                <div className="product-image-container">
                  <Link to={`/products/${product.id}`}>
                    <ProductImageGallery 
                      images={getProductImages(product)} 
                      productName={product.name}
                      className="w-full h-80"
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
                    className="heart-button"
                  >
                    <Heart className={`heart-icon ${isFavorite(product.id) ? 'filled' : ''}`} />
                  </button>

                  {/* Add to Cart Overlay */}
                  <div className="add-to-cart-overlay">
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
                <div className="product-content">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="product-title">
                      {product.name}
                    </h3>
                  </Link>
                  
                  {/* Color Selector */}
                  {product.variants && product.variants.length > 0 && (
                    <div className="mb-3">
                      <ColorSelector
                        variants={product.variants}
                        selectedVariant={selectedVariants[product.id]}
                        onVariantChange={(variant) => handleVariantChange(product.id, variant)}
                        size="small"
                        showLabel={false}
                      />
                    </div>
                  )}
                  
                  <Link to={`/products/${product.id}`}>
                    <p className="product-price">
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