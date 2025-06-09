import React, { memo, useCallback, useMemo } from 'react';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import MemoizedLink from './MemoizedLink';
import StarRating from './StarRating';

// Memoized Product Card Component
const OptimizedProductCard = memo(({ 
  product, 
  onFavoriteClick, 
  onAddToCart, 
  isFavorite = false,
  showQuickView = true,
  className = ""
}) => {
  
  // Memoize the product image URL
  const imageUrl = useMemo(() => {
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      if (typeof firstImage === 'string') {
        return firstImage.startsWith('http') ? firstImage : `http://localhost:8001${firstImage}`;
      }
      return firstImage.image_url?.startsWith('http') 
        ? firstImage.image_url 
        : `http://localhost:8001${firstImage.image_url}`;
    }
    return product.image_url?.startsWith('http') 
      ? product.image_url 
      : `http://localhost:8001${product.image_url}`;
  }, [product.images, product.image_url]);

  // Memoize formatted price
  const formattedPrice = useMemo(() => {
    return product.price ? `₪${(product.price || 0).toLocaleString()}` : 'מחיר לא זמין';
  }, [product.price]);

  // Memoized event handlers
  const handleFavoriteClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteClick?.(product);
  }, [onFavoriteClick, product]);

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  }, [onAddToCart, product]);

  const handleQuickView = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick view logic here
    console.log('Quick view for product:', product.id);
  }, [product.id]);

  return (
    <div className={`group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}>
      <MemoizedLink to={`/products/${product.id}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300">
            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleFavoriteClick}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  isFavorite 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
                }`}
                aria-label={isFavorite ? 'הסר מהמועדפים' : 'הוסף למועדפים'}
              >
                <Heart className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>
            
            {showQuickView && (
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={handleQuickView}
                  className="p-2 rounded-full bg-white text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                  aria-label="צפייה מהירה"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          
          {/* Sale Badge */}
          {product.original_price && product.original_price > product.price && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
              הנחה
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-gold transition-colors duration-200">
            {product.name}
          </h3>
          
          {/* Rating */}
          {product.rating && (
            <div className="mb-2">
              <StarRating rating={product.rating} className="w-4 h-4 text-yellow-400 fill-current" />
            </div>
          )}
          
          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-xl font-semibold text-gold">
                {formattedPrice}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ₪{(product.original_price || 0).toLocaleString()}
                </span>
              )}
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-gold to-yellow-500 text-white py-2 px-4 rounded-lg font-medium hover:from-yellow-500 hover:to-gold transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            הוסף לסל
          </button>
        </div>
      </MemoizedLink>
    </div>
  );
});

OptimizedProductCard.displayName = 'OptimizedProductCard';

export default OptimizedProductCard; 