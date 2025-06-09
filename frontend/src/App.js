import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from 'react-use-cart';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import DefaultSEO from './components/SEO/DefaultSEO';
import CoreWebVitals from './components/SEO/CoreWebVitals';
import ReactScanConfig from './components/ReactScanConfig';
import Navbar from './components/Navbar';
import ShoppingCart from './components/ShoppingCart';
import Favorites from './components/Favorites';
import Home from './pages/Home';
import About from './pages/About';
import Categories from './pages/Categories';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import ProductDetailSlider from './pages/ProductDetailSlider';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCaratPricing from './pages/admin/AdminCaratPricing';
import AdminProductCarats from './pages/admin/AdminProductCarats';
import LabDiamondsArticle from './pages/LabDiamondsArticle';
import EngagementRingGuide from './pages/EngagementRingGuide';
import DiamondCareGuide from './pages/DiamondCareGuide';
import Blog from './pages/Blog';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <Router>
              {/* Default SEO configuration for the entire site */}
              <DefaultSEO />
              
              {/* Core Web Vitals monitoring and optimization */}
              <CoreWebVitals />
              
              {/* React Scan Performance Monitoring */}
              <ReactScanConfig />
              
              <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 relative" dir="rtl">
                <Navbar />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetailSlider />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/lab-diamonds-guide" element={<LabDiamondsArticle />} />
                    <Route path="/engagement-ring-guide" element={<EngagementRingGuide />} />
                    <Route path="/diamond-care-guide" element={<DiamondCareGuide />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/checkout" element={<Checkout />} />
                    
                    {/* Admin Routes */}
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute adminOnly>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/categories" 
                      element={
                        <ProtectedRoute adminOnly>
                          <AdminCategories />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/products" 
                      element={
                        <ProtectedRoute adminOnly>
                          <AdminProducts />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/carat-pricing" 
                      element={
                        <ProtectedRoute adminOnly>
                          <AdminCaratPricing />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/product-carats" 
                      element={
                        <ProtectedRoute adminOnly>
                          <AdminProductCarats />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                </main>
                
                <Toaster 
                  position="top-center"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: 'rgba(44, 62, 80, 0.95)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      color: '#fff',
                      direction: 'rtl',
                      fontFamily: 'Heebo, Assistant, system-ui, sans-serif',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '16px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    },
                    success: {
                      style: {
                        background: 'rgba(52, 168, 83, 0.95)',
                        border: '1px solid rgba(52, 168, 83, 0.3)',
                      }
                    },
                    error: {
                      style: {
                        background: 'rgba(239, 68, 68, 0.95)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                      }
                    }
                  }}
                />
                    
                {/* Global Shopping Cart and Favorites - Inside main container for proper scrolling */}
                <ShoppingCart />
                <Favorites />
              </div>
            </Router>
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App; 