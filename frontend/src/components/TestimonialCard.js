import React, { memo } from 'react';
import StarRating from './StarRating';

// Memoized Testimonial Card Component
const TestimonialCard = memo(({ testimonial, GlassCard }) => {
  return (
    <GlassCard className="p-8 text-center h-full">
      <div className="flex justify-center mb-6">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-20 h-20 rounded-full object-cover border-4 border-gold/20"
          loading="lazy"
        />
      </div>
      
      <StarRating rating={testimonial.rating} />

      <p className="text-gray-600 font-light mb-6 leading-relaxed italic">
        "{testimonial.text}"
      </p>
      
      <div className="mb-4">
        <h4 className="font-medium text-elegant">{testimonial.name}</h4>
        <p className="text-gray-500 text-sm">{testimonial.location}</p>
      </div>
    </GlassCard>
  );
});

TestimonialCard.displayName = 'TestimonialCard';

export default TestimonialCard; 