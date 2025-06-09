import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User, LogOut, Settings, Phone, ChevronDown, ShoppingBag, Home, Grid3X3, Heart, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from 'react-use-cart';
import { useFavorites } from '../hooks/useFavorites';
import Logo from './Logo';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const scrollTimeoutRef = useRef(null);
  
  // Cart and Favorites functionality
  const { totalUniqueItems } = useCart();
  const { favorites, openSidebar: openFavorites } = useFavorites();

  // Scroll to top when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Throttled scroll handler to improve performance
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 150);
    }, 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserDropdownOpen && !event.target.closest('.user-section') && !event.target.closest('.dropdown-menu')) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isUserDropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
  };

  const isActivePage = (path) => {
    return location.pathname === path;
  };

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
  };

  // Enhanced navigation handler that scrolls to top
  const handleNavigation = (path) => {
    closeAllMenus();
    navigate(path);
    // Ensure scroll to top after navigation
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  const handleCartClick = () => {
    window.dispatchEvent(new CustomEvent('openCart'));
    closeAllMenus();
  };

  const handleFavoritesClick = () => {
    openFavorites();
    closeAllMenus();
  };

  return (
    <>
      {/* Enhanced Styles - Elegant Single Line Design */}
      <style jsx="true">{`
        .elegant-navbar {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          position: sticky;
          top: 0;
          z-index: 50;
          will-change: background, box-shadow;
        }
        
        .elegant-navbar.scrolled {
          background: rgba(255, 255, 255, 0.70);
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }
        
        .diamond-brand {
          display: flex;
          align-items: center;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .diamond-brand:hover {
          transform: translateY(-2px);
        }
        
        .brand-icon {
          width: 10rem;
          height: 4rem;
          transition: all 0.3s ease;image.png
          filter: drop-shadow(0 2px 8px rgba(212, 175, 55, 0.3));
        }
        
        .brand-icon:hover {
          filter: drop-shadow(0 6px 16px rgba(212, 175, 55, 0.5));
        }
        
        .search-container {
          position: relative;
          max-width: 300px;
          width: 100%;
        }
        
        .search-input {
          width: 100%;
          padding: 0.5rem 2.5rem 0.5rem 1rem;
          border: 1px solid #e5e5e5;
          border-radius: 25px;
          font-size: 0.875rem;
          font-family: 'Heebo', sans-serif;
          background: rgba(255, 255, 255, 0.9);
          transition: all 0.3s ease;
          direction: rtl;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #d4af37;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
        }
        
        .search-button {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #888;
          cursor: pointer;
          transition: color 0.3s ease;
        }
        
        .search-button:hover {
          color: #d4af37;
        }
        
        .nav-menu {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin: 0;
          white-space: nowrap;
        }
        
        .nav-link {
          font-family: 'Heebo', sans-serif;
          font-size: 1rem;
          font-weight: 400;
          letter-spacing: 0.5px;
          color: #2c3e50;
          text-decoration: none;
          text-transform: uppercase;
          transition: all 0.3s ease;
          position: relative;
          padding: 0.5rem 0;
        }
        
        .nav-link:hover {
          color: #d4af37;
        }
        
        .nav-link.active {
          color: #d4af37;
          font-weight: 500;
        }
        
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 2px;
          background: #d4af37;
          border-radius: 1px;
        }
        
        .nav-icons {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        
        .nav-icon {
          position: relative;
          color: #2c3e50;
          transition: all 0.3s ease;
          cursor: pointer;
          padding: 0.75rem;
          border-radius: 12px;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .nav-icon:hover {
          color: #d4af37;
          background: rgba(212, 175, 55, 0.1);
          transform: translateY(-1px);
        }
        
        /* Gold Gradient Numbers for Cart and Favorites */
        .diamond-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: linear-gradient(135deg, #d4af37 0%, #f4e4bc 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%);
          color: #8b5a00;
          font-size: 0.75rem;
          font-weight: 700;
          font-family: 'Heebo', sans-serif;
          min-width: 1.25rem;
          height: 1.25rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 2px 8px rgba(212, 175, 55, 0.4);
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
        }
        
        .user-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
        }
        
        .user-section:hover {
          background: rgba(212, 175, 55, 0.1);
        }
        
        .user-avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #d4af37, #f4e4bc);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          min-width: 200px;
          overflow: hidden;
          margin-top: 8px;
        }
        
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: #2c3e50;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
          background: none;
          width: 100%;
          text-align: right;
          text-decoration: none;
          font-family: 'Heebo', sans-serif;
        }
        
        .dropdown-item:hover {
          background: rgba(212, 175, 55, 0.1);
          color: #d4af37;
        }
        
        .dropdown-item.danger {
          color: #dc2626;
        }
        
        .dropdown-item.danger:hover {
          background: rgba(220, 38, 38, 0.1);
          color: #dc2626;
        }
        
        .mobile-menu {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          color: #2c3e50;
          text-decoration: none;
          font-family: 'Heebo', sans-serif;
          font-size: 0.875rem;
          font-weight: 400;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          transition: all 0.3s ease;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .mobile-nav-link:hover, .mobile-nav-link.active {
          background: rgba(212, 175, 55, 0.1);
          color: #d4af37;
        }
        
        /* Mobile Optimizations */
        @media (max-width: 768px) {
          .brand-icon {
            width: 120px;
            height: 48px;
            max-width: 30vw;
          }
          
          .search-container {
            display: none;
          }
          
          .nav-menu {
            display: none;
          }
          
          .nav-icon {
            padding: 0.5rem;
          }
          
          .diamond-badge {
            top: -6px;
            right: -6px;
            min-width: 1rem;
            height: 1rem;
            font-size: 0.65rem;
          }

          .user-section {
            padding: 0.25rem 0.5rem;
          }

          .user-avatar {
            width: 28px;
            height: 28px;
          }

          /* Fix mobile layout flexbox issues */
          .elegant-navbar .max-w-7xl {
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .elegant-navbar .flex {
            min-height: 64px;
          }
        }
        
        /* Galaxy S8+ and smaller devices */
        @media (max-width: 375px) {
          .brand-icon {
            width: 100px;
            height: 40px;
            max-width: 25vw;
          }
          
          .nav-icons {
            gap: 0.5rem;
          }
          
          .nav-icon {
            padding: 0.375rem;
          }

          .elegant-navbar .max-w-7xl {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
        }
        
        /* Very small devices */
        @media (max-width: 320px) {
          .brand-icon {
            width: 80px;
            height: 32px;
            max-width: 22vw;
          }
          
          .nav-icons {
            gap: 0.25rem;
          }
          
          .nav-icon {
            padding: 0.25rem;
          }

          .elegant-navbar .max-w-7xl {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
        }
        
        /* Performance optimizations */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <nav className={`elegant-navbar ${scrolled ? 'scrolled' : ''}`} dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col pt-4 pb-2">
            {/* Single Row - Navigation left, Logo center, Icons right */}
            <div className="flex justify-between items-center w-full">
              {/* Left - Navigation Menu */}
              <div className="w-64 flex justify-start">
                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>

                <div className="hidden lg:flex items-center space-x-8 space-x-reverse">
                  <Link 
                    to="/" 
                    className={`nav-link whitespace-nowrap ${isActivePage('/') ? 'active' : ''}`}
                    onClick={closeAllMenus}
                  >
                    דף הבית
                  </Link>
                  <Link 
                    to="/about" 
                    className={`nav-link whitespace-nowrap ${isActivePage('/about') ? 'active' : ''}`}
                    onClick={closeAllMenus}
                  >
                    אודותינו
                  </Link>
                  <Link 
                    to="/products" 
                    className={`nav-link whitespace-nowrap ${isActivePage('/products') ? 'active' : ''}`}
                    onClick={closeAllMenus}
                  >
                    מוצרים
                  </Link>
                  <Link 
                    to="/categories" 
                    className={`nav-link whitespace-nowrap ${isActivePage('/categories') ? 'active' : ''}`}
                    onClick={closeAllMenus}
                  >
                    קטגוריות
                  </Link>
                  <a 
                    href="tel:03-1234567" 
                    className="nav-link whitespace-nowrap"
                    onClick={closeAllMenus}
                  >
                    צור קשר
                  </a>
                </div>
              </div>

              {/* Center - Logo */}
              <div className="flex flex-1 lg:flex-none justify-center">
                <Link to="/" className="diamond-brand" onClick={closeAllMenus}>
                  <img
                    src="/icon.png"
                    alt="ליבי תכשיטים"
                    className="brand-icon"
                  />
                </Link>
              </div>

              {/* Right - Icons */}
              <div className="flex items-center space-x-3 space-x-reverse w-64 justify-end">
                {/* User Section */}
                {user && (
                  <div className="hidden sm:block relative">
                    <div 
                      className="user-section"
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    >
                      <div className="user-avatar">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium text-gray-900">{user.full_name}</div>
                        <div className="text-xs text-gray-500">לקוח יקר</div>
                      </div>
                      <motion.div
                        animate={{ rotate: isUserDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-3 h-3 text-gray-500" />
                      </motion.div>
                    </div>
                    
                    <AnimatePresence>
                      {isUserDropdownOpen && (
                        <motion.div
                          className="dropdown-menu"
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          {isAdmin && (
                            <Link
                              to="/admin"
                              className="dropdown-item"
                              onClick={closeAllMenus}
                            >
                              <Settings className="w-4 h-4" />
                              <span>ניהול</span>
                            </Link>
                          )}
                          
                          <button
                            onClick={handleLogout}
                            className="dropdown-item danger"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>התנתק</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Cart and Favorites Icons */}
                <div className="flex items-center space-x-2 space-x-reverse">
                  <button
                    onClick={handleCartClick}
                    className="nav-icon"
                    title="סל קניות"
                  >
                    <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                    {totalUniqueItems > 0 && (
                      <span className="diamond-badge">
                        {totalUniqueItems}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={handleFavoritesClick}
                    className="nav-icon"
                    title="מועדפים"
                  >
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                    {favorites.length > 0 && (
                      <span className="diamond-badge">
                        {favorites.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="lg:hidden mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="divide-y divide-gray-100">
                <Link
                  to="/"
                  className={`mobile-nav-link ${isActivePage('/') ? 'active' : ''}`}
                  onClick={closeAllMenus}
                >
                  <Home className="w-4 h-4" />
                  דף הבית
                </Link>
                <Link
                  to="/about"
                  className={`mobile-nav-link ${isActivePage('/about') ? 'active' : ''}`}
                  onClick={closeAllMenus}
                >
                  <User className="w-4 h-4" />
                  אודותינו
                </Link>
                <Link
                  to="/products"
                  className={`mobile-nav-link ${isActivePage('/products') ? 'active' : ''}`}
                  onClick={closeAllMenus}
                >
                  <ShoppingBag className="w-4 h-4" />
                  מוצרים
                </Link>
                <Link
                  to="/categories"
                  className={`mobile-nav-link ${isActivePage('/categories') ? 'active' : ''}`}
                  onClick={closeAllMenus}
                >
                  <Grid3X3 className="w-4 h-4" />
                  קטגוריות
                </Link>
                <a
                  href="tel:03-1234567"
                  className="mobile-nav-link"
                  onClick={closeAllMenus}
                >
                  <Phone className="w-4 h-4" />
                  צור קשר
                </a>
                
                {/* Cart and Favorites in Mobile Menu */}
                <button
                  onClick={handleFavoritesClick}
                  className="mobile-nav-link relative w-full text-right"
                >
                  <Heart className="w-4 h-4" />
                  מועדפים
                  {favorites.length > 0 && (
                    <span className="diamond-badge" style={{ left: 'auto', right: '50px' }}>
                      {favorites.length}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={handleCartClick}
                  className="mobile-nav-link relative w-full text-right"
                >
                  <ShoppingBag className="w-4 h-4" />
                  סל קניות
                  {totalUniqueItems > 0 && (
                    <span className="diamond-badge" style={{ left: 'auto', right: '50px' }}>
                      {totalUniqueItems}
                    </span>
                  )}
                </button>
                
                {user && (
                  <>
                    <div className="p-4 bg-gray-50">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="user-avatar">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                          <div className="text-xs text-gray-500">לקוח יקר</div>
                        </div>
                      </div>
                    </div>
                    
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="mobile-nav-link"
                        onClick={closeAllMenus}
                      >
                        <Settings className="w-4 h-4" />
                        ניהול
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="mobile-nav-link w-full text-right text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      התנתק
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar; 