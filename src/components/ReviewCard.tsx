import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaCheckCircle } from 'react-icons/fa';
import { Review } from '../lib/supabase';

interface ReviewCardProps {
  review: Review;
  index?: number;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, index = 0 }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours}h ago`;
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: (index || 0) * 0.1 }}
      viewport={{ once: true }}
      className="p-4 rounded-xl backdrop-blur-sm"
      style={{
        border: '2px solid rgba(0, 217, 255, 0.3)',
        background: 'rgba(10, 14, 39, 0.6)',
      }}
    >
      {/* Header with rating and date */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Stars */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className="text-sm"
                style={{
                  color: star <= (review.rating || 0) ? '#FFD700' : 'rgba(255, 215, 0, 0.2)',
                }}
              />
            ))}
          </div>
          <span
            className="text-sm font-bold"
            style={{ color: '#FFD700' }}
          >
            {review.rating}/5
          </span>
        </div>

        {/* Verified Badge */}
        {review.is_verified && (
          <div className="flex items-center gap-1">
            <FaCheckCircle className="text-sm" style={{ color: '#00FF41' }} />
            <span className="text-xs font-bold" style={{ color: '#00FF41' }}>
              Verified
            </span>
          </div>
        )}

        {/* Date */}
        <span
          className="text-xs"
          style={{ color: '#00D9FF' }}
        >
          {formatDate(review.created_at)}
        </span>
      </div>

      {/* Comment */}
      <p
        className="text-sm leading-relaxed"
        style={{ color: '#E0E0E0' }}
      >
        {review.comment}
      </p>
    </motion.div>
  );
};

export default ReviewCard;
