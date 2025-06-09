import React from 'react';

// Predefined jewelry colors
const JEWELRY_COLORS = {
  'זהב': { name: 'זהב', nameEn: 'Gold', code: '#FFD700' },
  'כסף': { name: 'כסף', nameEn: 'Silver', code: '#C0C0C0' },
  'ברונזה': { name: 'ברונזה', nameEn: 'Bronze', code: '#CD7F32' }
};

const ColorSelector = ({ 
  variants = [], 
  selectedVariant, 
  onVariantChange, 
  size = 'medium',
  showLabel = true 
}) => {
  if (!variants || variants.length === 0) {
    return null;
  }

  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-7 h-7',
    large: 'w-9 h-9'
  };

  const currentSize = sizeClasses[size] || sizeClasses.medium;

  // Get Hebrew name for display
  const getDisplayName = (variant) => {
    const colorInfo = JEWELRY_COLORS[variant.color_name];
    return colorInfo ? colorInfo.name : variant.color_name;
  };

  return (
    <div className="color-selector">
      {showLabel && (
        <span className="text-sm font-medium text-gray-700 mb-2 block">
          צבע: {selectedVariant ? getDisplayName(selectedVariant) : 'בחר צבע'}
        </span>
      )}
      
      <div className="flex gap-2 justify-center">
        {variants.map((variant) => {
          const colorInfo = JEWELRY_COLORS[variant.color_name];
          const displayColor = colorInfo ? colorInfo.code : variant.color_code;
          
          return (
            <button
              key={variant.id}
              onClick={() => onVariantChange?.(variant)}
              className={`
                ${currentSize} 
                rounded-full 
                border-3
                transition-all 
                duration-300 
                hover:scale-110 
                focus:outline-none 
                focus:ring-2 
                focus:ring-offset-2 
                focus:ring-yellow-500
                shadow-lg
                relative
                ${selectedVariant?.id === variant.id 
                  ? 'border-yellow-500 ring-2 ring-yellow-200 shadow-yellow-300' 
                  : 'border-gray-300 hover:border-gray-400 shadow-gray-300'
                }
              `}
              style={{ backgroundColor: displayColor }}
              title={`${getDisplayName(variant)} ${colorInfo ? `(${colorInfo.nameEn})` : ''}`}
              aria-label={`בחר צבע ${getDisplayName(variant)}`}
            >
              {/* Inner shine effect for metallic look */}
              <div 
                className="absolute inset-0 rounded-full opacity-30"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.8) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)`
                }}
              />
              
              {/* Selected indicator */}
              {selectedVariant?.id === variant.id && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full shadow-lg border border-gray-300"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Color name display for small variant */}
      {size === 'small' && selectedVariant && (
        <div className="text-xs text-gray-600 text-center mt-1">
          {getDisplayName(selectedVariant)}
        </div>
      )}
    </div>
  );
};

export default ColorSelector; 