import React, { useState, useEffect, useMemo } from 'react';
import { Diamond, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductImageGallery = React.memo(({ images = [], productName = '', className = '', showNavigation = true }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverInterval, setHoverInterval] = useState(null);

  // Cleanup interval on unmount or when images change
  useEffect(() => {
    return () => {
      if (hoverInterval) {
        clearInterval(hoverInterval);
      }
    };
  }, [hoverInterval]);

  // Reset to first image when images change
  useEffect(() => {
    setCurrentImageIndex(0);
    setIsHovering(false);
    if (hoverInterval) {
      clearInterval(hoverInterval);
      setHoverInterval(null);
    }
  }, [images, showNavigation]);

  // Memoize processed images to avoid recomputation on every render
  const processedImages = useMemo(() => {
    if (!images || images.length === 0) {
      return [];
  }

    // Convert single string to array
    let imageArray = Array.isArray(images) ? images : [images];
    
    // Prepare images array with proper URLs
    return imageArray.map((image, index) => {
      let imageUrl;
      if (typeof image === 'string') {
        imageUrl = image;
      } else if (image && typeof image === 'object') {
        imageUrl = image.image_url || image.url || image.src || '';
      } else {
        imageUrl = '';
      }
      
      const fullImageUrl = imageUrl.startsWith('http') 
        ? imageUrl 
        : `http://localhost:8001${imageUrl}`;
      
      return {
        id: index,
        url: fullImageUrl,
        alt: `${productName} - תמונה ${index + 1}`
      };
    });
  }, [images, productName]);

  // Show placeholder if no processed images
  if (!processedImages || processedImages.length === 0) {
    return (
      <div className={`aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-lg ${className}`}>
        <Diamond className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % processedImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + processedImages.length) % processedImages.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const handleMouseEnter = () => {
    if (!showNavigation && processedImages.length > 1) {
      setIsHovering(true);
      // Start cycling through images - reduced frequency for better performance
      let imageIndex = 1;
      setCurrentImageIndex(imageIndex);
      
      const interval = setInterval(() => {
        imageIndex = (imageIndex + 1) % processedImages.length;
        setCurrentImageIndex(imageIndex);
      }, 1200); // Increased to 1200ms for better performance
      
      setHoverInterval(interval);
    }
  };

  const handleMouseLeave = () => {
    if (!showNavigation && processedImages.length > 1) {
      setIsHovering(false);
      setCurrentImageIndex(0); // Return to first image when hover ends
      
      // Clear the interval
      if (hoverInterval) {
        clearInterval(hoverInterval);
        setHoverInterval(null);
      }
    }
  };

  const currentImage = processedImages[currentImageIndex];

  return (
    <div className={`relative ${className}`} dir="rtl">
      <style jsx="true">{`
        .product-gallery {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          border-radius: 12px;
          background: #f8f9fa;
        }
        
        .main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.2s ease;
          transform: translate3d(0, 0, 0);
          will-change: opacity;
        }
        
        .main-image.hover-transition {
          transition: opacity 0.15s ease;
        }
        
        .dots-container {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 10;
        }
        
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.7);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .dot.active {
          background: #d4af37;
          transform: scale(1.1);
        }
        
        .thumbnails-container {
          display: flex;
          gap: 4px;
          margin-top: 8px;
          justify-content: center;
          overflow-x: auto;
          padding: 4px 0;
        }
        
        .thumbnail {
          width: 40px;
          height: 40px;
          border-radius: 6px;
          object-fit: cover;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }
        
        .thumbnail:hover {
          border-color: rgba(212, 175, 55, 0.5);
          transform: scale(1.05);
        }
        
        .thumbnail.active {
          border-color: #d4af37;
          transform: scale(1.1);
        }
        
        .image-counter {
          position: absolute;
          top: 8px;
          left: 8px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          z-index: 10;
        }
        
        .hover-indicator {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 500;
          z-index: 10;
          opacity: 0.8;
          transition: opacity 0.3s ease;
        }
        
        .product-gallery:hover .hover-indicator {
          opacity: 1;
        }
        
        @media (max-width: 768px) {
          .dots-container {
            bottom: 8px;
            gap: 6px;
          }
          
          .dot {
            width: 8px;
            height: 8px;
          }
          
          .thumbnail {
            width: 32px;
            height: 32px;
          }
          
          .image-counter {
            top: 4px;
            left: 4px;
            padding: 2px 6px;
            font-size: 11px;
          }
        }
      `}</style>

      <div 
        className="product-gallery"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Main Image */}
        <img
          src={currentImage.url}
          alt={currentImage.alt}
          className={`main-image ${!showNavigation ? 'hover-transition' : ''}`}
          onError={(e) => {
            e.target.parentElement.innerHTML = `
              <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #f3f4f6, #e5e7eb); display: flex; align-items: center; justify-content: center; border-radius: 12px;">
                <div style="color: #9ca3af; font-size: 24px;">💎</div>
              </div>
            `;
          }}
        />

        {/* Navigation Arrows (only if multiple images) */}
        {/* Removed navigation arrows as per requirements */}

        {/* Image Counter */}
        {showNavigation && processedImages.length > 1 && (
          <div className="image-counter">
            {currentImageIndex + 1} / {processedImages.length}
          </div>
        )}

        {/* Dots Indicator (always show if multiple images) */}
        {processedImages.length > 1 && (
          <div className="dots-container">
            {processedImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                aria-label={`עבור לתמונה ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Hover Indicator */}
        {!showNavigation && processedImages.length > 1 && (
          <div className="hover-indicator">
            +{processedImages.length - 1}
          </div>
        )}
      </div>

      {/* Thumbnails (only if multiple images) */}
      {showNavigation && processedImages.length > 1 && (
        <div className="thumbnails-container">
          {processedImages.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={`תמונה ממוזערת ${index + 1}`}
              className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => goToImage(index)}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default ProductImageGallery; 