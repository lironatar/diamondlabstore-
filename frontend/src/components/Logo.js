import React from 'react';

const Logo = ({ height = 40, className = '', showText = true, variant = 'full' }) => {
  if (variant === 'icon-only') {
    // Just the icon for compact spaces
    return (
      <img
        src="/icon.png"
        alt="ליבי תכשיטים"
        height={height}
        className={`inline-block ${className}`}
        style={{ height: `${height}px`, width: 'auto' }}
      />
    );
  }

  return (
    <div className={`inline-flex items-center ${className}`} style={{ height: `${height}px` }}>
      {/* Icon */}
      <img
        src="/icon.png"
        alt="ליבי תכשיטים"
        className="ml-3"
        style={{ height: `${height}px`, width: 'auto' }}
      />
      
      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col justify-center">
          <h1 
            className="font-semibold text-gold leading-none"
            style={{ 
              fontSize: `${height * 0.6}px`,
              fontFamily: 'Heebo, Arial, sans-serif'
            }}
          >
            ליבי תכשיטים
          </h1>
          <p 
            className="text-gray-500 font-light leading-none mt-1"
            style={{ 
              fontSize: `${height * 0.25}px`,
              letterSpacing: '1px'
            }}
          >
            יהלומי מעבדה איכותיים
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo; 