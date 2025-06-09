import React, { memo } from 'react';
import { Link } from 'react-router-dom';

// Memoized Link component to prevent unnecessary re-renders
const MemoizedLink = memo(({ to, children, className, onClick, ...props }) => {
  return (
    <Link 
      to={to} 
      className={className} 
      onClick={onClick}
      {...props}
    >
      {children}
    </Link>
  );
});

MemoizedLink.displayName = 'MemoizedLink';

export default MemoizedLink; 