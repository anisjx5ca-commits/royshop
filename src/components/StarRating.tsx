import React from 'react';
import { FaStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number | null | undefined;
  reviewCount?: number | null | undefined;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  showCount?: boolean;
}

/**
 * Star Rating Component with Neon Styling
 * Displays stars based on average_rating from Supabase
 * Supports full stars, half stars, and empty stars
 * 
 * @param rating - Average rating (0-5), can be null
 * @param reviewCount - Number of reviews, optional
 * @param size - Star size: 'small' (12px), 'medium' (16px), 'large' (20px)
 * @param showLabel - Show rating number label
 * @param showCount - Show review count in parentheses
 */
export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  reviewCount,
  size = 'medium',
  showLabel = true,
  showCount = false,
}) => {
  // Default size mapping
  const sizeMap = {
    small: 12,
    medium: 16,
    large: 20,
  };

  const starSize = sizeMap[size];

  // Handle null/undefined/0 rating
  if (!rating || rating === 0) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((index) => (
            <FaStar
              key={index}
              size={starSize}
              className="text-neon-gray opacity-40"
              style={{
                filter: 'drop-shadow(0 0 3px rgba(200, 200, 200, 0.2))',
              }}
            />
          ))}
        </div>
        {showLabel && (
          <span className="text-sm text-neon-gray italic">
            (No ratings)
          </span>
        )}
      </div>
    );
  }

  // Create array of 5 stars
  const stars = Array.from({ length: 5 }, (_, i) => {
    const starValue = i + 1;
    
    if (rating >= starValue) {
      // Full star
      return 'full';
    } else if (rating > i && rating < starValue) {
      // Half star
      return 'half';
    } else {
      // Empty star
      return 'empty';
    }
  });

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {stars.map((starType, index) => (
          <div key={index} className="relative inline-block" style={{ width: starSize, height: starSize }}>
            {/* Background empty star */}
            <FaStar
              size={starSize}
              className="absolute text-neon-gray opacity-30"
              style={{
                filter: 'drop-shadow(0 0 2px rgba(200, 200, 200, 0.1))',
              }}
            />

            {/* Filled star (full or half) */}
            {starType !== 'empty' && (
              <div
                style={{
                  overflow: starType === 'half' ? 'hidden' : 'visible',
                  width: starType === 'half' ? '50%' : '100%',
                  height: '100%',
                }}
              >
                <FaStar
                  size={starSize}
                  className="text-yellow-400"
                  style={{
                    filter: 'drop-shadow(0 0 6px rgba(250, 204, 21, 0.7)) drop-shadow(0 0 12px rgba(250, 204, 21, 0.4))',
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {showLabel && (
        <span
          className="text-sm font-semibold ml-1"
          style={{
            color: '#FFD700',
            textShadow: '0 0 6px rgba(255, 215, 0, 0.6)',
          }}
        >
          {rating.toFixed(1)}
        </span>
      )}

      {showCount && reviewCount !== undefined && reviewCount !== null && (
        <span
          className="text-xs text-neon-gray ml-1"
          style={{
            textShadow: '0 0 4px rgba(200, 200, 200, 0.3)',
          }}
        >
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};

/**
 * Compact Star Rating (for product cards)
 * Shows only stars and rating number
 */
export const CompactStarRating: React.FC<StarRatingProps> = (props) => {
  return <StarRating {...props} size="small" showCount={false} />;
};

/**
 * Full Star Rating (for product detail pages)
 * Shows stars, rating number, and review count
 */
export const FullStarRating: React.FC<StarRatingProps> = (props) => {
  return <StarRating {...props} size="large" showCount={true} />;
};
