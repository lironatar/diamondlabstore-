import React, { useState, useEffect } from 'react';
import { Heart, X, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../hooks/useFavorites';
import ProductImageGallery from './ProductImageGallery';

const Favorites = React.memo(() => {
  const { favorites, isOpen, openSidebar, closeSidebar, removeFromFavorites } = useFavorites();

  const addToCart = (product) => {
    // Add to cart logic here
    // console.log('Adding to cart:', product);
  };

  // Don't render anything if sidebar is closed
  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50" style={{ top: 0 }}>
          {/* Background overlay */}
          <motion.div 
            className="absolute inset-0 bg-black bg-opacity-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 max-h-[85vh] w-96 bg-white shadow-2xl flex flex-col rounded-l-xl md:max-h-[90vh]"
            style={{ left: 0, right: 'auto' }}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-light text-gray-800">המועדפים שלי</h2>
                <button
                  onClick={closeSidebar}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              <p className="text-sm text-gray-600 font-light">מעיות חייב</p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {favorites.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">אין מועדפים עדיין</h3>
                  <p className="text-sm">התחילו לאסוף את התכשיטים הטובים ביותר</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {favorites.map((item) => {
                    return (
                      <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm relative">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeFromFavorites(item.id);
                          }}
                          className="absolute top-2 left-2 z-10 p-1 rounded-full hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-500" />
                        </button>
                        
                        <Link 
                          to={`/products/${item.id}`}
                          onClick={closeSidebar}
                          className="block"
                        >
                          <div className="relative h-44 overflow-hidden">
                            <ProductImageGallery 
                              images={item.images || item.image_url} 
                              productName={item.name}
                              className="w-full h-full"
                              showNavigation={false}
                            />
                          </div>

                          <div className="p-3 text-center">
                            <h3 className="font-medium text-gray-900 text-sm leading-tight mb-2 line-clamp-2">
                              {item.name}
                            </h3>
                            <p className="text-base font-semibold text-yellow-600">
                              ₪{item.price?.toLocaleString()}
                            </p>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {favorites.length > 0 && (
              <div className="p-6 border-t border-gray-200 bg-white">
                <Link
                  to="/products"
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 px-6 rounded-xl font-medium text-center block hover:shadow-lg transition-all duration-300"
                  onClick={closeSidebar}
                >
                  המשך קנייה
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

export default Favorites; 