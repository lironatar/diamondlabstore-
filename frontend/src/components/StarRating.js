import React, { memo } from 'react';
import { Star } from 'lucide-react';

// Memoized Star Rating Component to prevent unnecessary re-renders
const StarRating = memo(({ rating, className = "w-5 h-5 text-yellow-400 fill-current", showCount = false }) => {
  // Use useMemo to cache the star array creation
  const stars = React.useMemo(() => {
    return [...Array(rating)].map((_, i) => (
      <Star key={i} className={className} />
    ));
  }, [rating, className]);

  return (
    <div className="flex justify-center items-center">
      {stars}
      {showCount && (
        <span className="mr-2 text-sm text-gray-600">({rating})</span>
      )}
    </div>
  );
});

StarRating.displayName = 'StarRating';

export default StarRating; 