import React from 'react';
import { useThemeDOM } from '@/hooks/theme';
import { getStarColor } from '../helpers';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  primaryColor: string;
}

export const StarRating = React.memo<StarRatingProps>(({ value, onChange, primaryColor }) => {
  const { hasClass } = useThemeDOM();
  const isDark = hasClass('dark');

  return (
    <div className="flex justify-center gap-2 mb-6">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          className="transition-transform duration-150 cursor-pointer focus:outline-none"
          style={{
            color: getStarColor(star, value, primaryColor, isDark),
            fontSize: '2.4rem',
            transform: 'scale(1)',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          ★
        </button>
      ))}
    </div>
  );
});

StarRating.displayName = 'StarRating';