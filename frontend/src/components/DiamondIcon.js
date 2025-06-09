import React from 'react';

const DiamondIcon = ({ size = 24, className = '', filled = true }) => {
  if (filled) {
    // Filled diamond icon for logos and primary usage
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className={`inline-block ${className}`}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`diamondGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:"#e0f2fe", stopOpacity:1}} />
            <stop offset="50%" style={{stopColor:"#0ea5e9", stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:"#0284c7", stopOpacity:1}} />
          </linearGradient>
          <linearGradient id={`sparkleGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:"#ffffff", stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:"#f0f9ff", stopOpacity:0.8}} />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle cx="50" cy="50" r="48" fill="currentColor" stroke="currentColor" strokeWidth="2"/>
        
        {/* Diamond shape */}
        <g transform="translate(50, 50)">
          {/* Main diamond body */}
          <polygon 
            points="0,-20 12,-8 12,8 0,20 -12,8 -12,-8" 
            fill={`url(#diamondGradient-${size})`}
            stroke="#0369a1" 
            strokeWidth="1"
          />
          
          {/* Diamond top facet */}
          <polygon 
            points="0,-20 8,-12 0,-8 -8,-12" 
            fill={`url(#sparkleGradient-${size})`}
            opacity="0.9"
          />
          
          {/* Diamond left facet */}
          <polygon 
            points="-12,-8 -8,-12 0,-8 -8,0" 
            fill={`url(#sparkleGradient-${size})`}
            opacity="0.6"
          />
          
          {/* Diamond right facet */}
          <polygon 
            points="12,-8 8,-12 0,-8 8,0" 
            fill={`url(#sparkleGradient-${size})`}
            opacity="0.6"
          />
          
          {/* Sparkle effects */}
          <g fill="white" opacity="0.8">
            <circle cx="-15" cy="-15" r="1.5"/>
            <circle cx="15" cy="-15" r="1"/>
            <circle cx="-18" cy="10" r="1"/>
            <circle cx="18" cy="12" r="1.2"/>
            <circle cx="-8" cy="-25" r="0.8"/>
            <circle cx="10" cy="-28" r="0.6"/>
            <circle cx="-20" cy="-5" r="0.7"/>
            <circle cx="22" cy="0" r="0.9"/>
          </g>
        </g>
      </svg>
    );
  }

  // Outline diamond icon for subtle usage
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      className={`inline-block ${className}`}
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points="12,2 22,8.5 16,21 8,21 2,8.5" />
      <polygon points="12,2 8,8.5 16,8.5" />
      <line x1="2" y1="8.5" x2="22" y2="8.5" />
      <line x1="8" y1="8.5" x2="8" y2="21" />
      <line x1="16" y1="8.5" x2="16" y2="21" />
    </svg>
  );
};

export default DiamondIcon; 