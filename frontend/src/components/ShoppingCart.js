import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from 'react-use-cart';
import ProductImageGallery from './ProductImageGallery';

const ShoppingCart = React.memo(() => {
  const { 
    isEmpty, 
    totalUniqueItems, 
    items, 
    updateItemQuantity, 
    removeItem, 
    cartTotal,
    totalItems
  } = useCart();

  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCartSidebar = () => setIsCartOpen(true);
  const closeCartSidebar = () => setIsCartOpen(false);

  // Listen for custom event from navbar
  useEffect(() => {
    const handleOpenCart = () => {
      openCartSidebar();
    };

    window.addEventListener('openCart', handleOpenCart);
    return () => window.removeEventListener('openCart', handleOpenCart);
  }, []);

  // Don't render anything if cart is closed
  if (!isCartOpen) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {isCartOpen && (
        <div className="fixed inset-0 z-50" style={{ top: 0 }}>
          {/* Background overlay */}
          <motion.div 
            className="absolute inset-0 bg-black bg-opacity-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCartSidebar}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-96 bg-white shadow-2xl flex flex-col"
            style={{ left: 0, right: 'auto' }}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-light text-gray-800">סל קניות</h2>
                <button
                  onClick={closeCartSidebar}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              <p className="text-sm text-gray-600 font-light">
                {totalUniqueItems} מוצרים • {totalItems} פריטים
              </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {isEmpty ? (
                <div className="text-center py-16 text-gray-500">
                  <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">הסל ריק</h3>
                  <p className="text-sm">התחילו לקנות והוסיפו מוצרים לסל</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl p-4 relative shadow-sm">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute top-3 left-3 p-1 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                      
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <ProductImageGallery 
                            images={item.images || item.image_url} 
                            productName={item.name}
                            className="w-full h-full"
                            showNavigation={false}
                          />
                        </div>

                        <div className="flex-1 space-y-2">
                          <h3 className="font-medium text-gray-900 text-sm leading-tight pr-6">
                            {item.name}
                          </h3>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-semibold text-yellow-600">
                              ₪{(item.price * item.quantity).toLocaleString()}
                            </p>
                            
                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                              <button
                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm hover:bg-yellow-50 transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              
                              <span className="w-8 text-center font-medium">
                                {item.quantity}
                              </span>
                              
                              <button
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm hover:bg-yellow-50 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-gray-500">
                            ₪{item.price.toLocaleString()} ליחידה
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {!isEmpty && (
              <div className="p-6 border-t border-gray-200 bg-white">
                <div className="space-y-4">
                  {/* Total */}
                  <div className="flex justify-between items-center text-xl font-semibold border-t pt-4">
                    <span className="text-gray-900">סה"כ:</span>
                    <span className="text-yellow-600">₪{cartTotal.toLocaleString()}</span>
                  </div>
                  
                  {/* Checkout Button */}
                  <Link
                    to="/checkout"
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 px-6 rounded-xl font-medium text-center block hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    onClick={closeCartSidebar}
                  >
                    <CreditCard className="w-5 h-5" />
                    המשך לתשלום
                  </Link>
                  
                  {/* Continue Shopping */}
                  <Link
                    to="/products"
                    className="block text-center text-gray-600 hover:text-gray-800 transition-colors duration-200 py-2"
                    onClick={closeCartSidebar}
                  >
                    המשך קנייה
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

export default ShoppingCart; 