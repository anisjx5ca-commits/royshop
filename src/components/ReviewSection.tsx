import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import { ReviewCard } from './ReviewCard';
import useProductReviews from '../hooks/useProductReviews';

interface ReviewSectionProps {
  productId: string;
  onRateClick?: () => void;
  showRateButton?: boolean;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  productId,
  onRateClick,
  showRateButton = true,
}) => {
  const { reviews, isLoading, fetchReviews, calculateStats, getRecentReviews } =
    useProductReviews(productId);
  const [stats, setStats] = useState(calculateStats());

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    setStats(calculateStats());
  }, [reviews, calculateStats]);

  const recentReviews = getRecentReviews(5);
  const hasReviews = reviews.length > 0;

  return (
    <div className="mt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2
          className="text-3xl font-black"
          style={{
            textShadow: '0 0 20px #00D9FF',
            color: '#00D9FF',
          }}
        >
          Customer Reviews
        </h2>

        {showRateButton && onRateClick && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRateClick}
            className="px-6 py-3 font-bold rounded-lg transition-all"
            style={{
              border: '2px solid #FF006E',
              background: 'rgba(255, 0, 110, 0.1)',
              color: '#FF006E',
              boxShadow: '0 0 20px rgba(255, 0, 110, 0.3)',
            }}
          >
            ⭐ Rate This Product
          </motion.button>
        )}
      </div>

      {isLoading && (
        <div
          className="text-center py-8"
          style={{ color: '#00D9FF' }}
        >
          <p className="font-bold">Loading reviews...</p>
        </div>
      )}

      {!isLoading && !hasReviews && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-8 rounded-xl text-center"
          style={{
            border: '2px dashed #00D9FF',
            background: 'rgba(0, 217, 255, 0.05)',
          }}
        >
          <p
            className="text-lg font-bold mb-4"
            style={{ color: '#00D9FF' }}
          >
            No reviews yet
          </p>
          <p style={{ color: '#00D9FF' }} className="opacity-70">
            Be the first to review this product!
          </p>
          {showRateButton && onRateClick && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRateClick}
              className="mt-4 px-6 py-2 font-bold rounded-lg"
              style={{
                border: '2px solid #FF006E',
                background: 'rgba(255, 0, 110, 0.1)',
                color: '#FF006E',
              }}
            >
              Write a Review
            </motion.button>
          )}
        </motion.div>
      )}

      {!isLoading && hasReviews && (
        <>
          {/* Rating Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            viewport={{ once: true }}
          >
            {/* Average Rating Card */}
            <motion.div
              className="p-6 rounded-xl backdrop-blur-sm"
              style={{
                border: '2px solid #FFD700',
                background: 'rgba(255, 215, 0, 0.05)',
              }}
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FaStar className="text-2xl" style={{ color: '#FFD700' }} />
                  <span
                    className="text-4xl font-black"
                    style={{
                      color: '#FFD700',
                      textShadow: '0 0 20px #FFD700',
                    }}
                  >
                    {stats.averageRating.toFixed(1)}
                  </span>
                </div>
                <p style={{ color: '#FFD700' }} className="font-bold">
                  Average Rating
                </p>
              </div>
            </motion.div>

            {/* Total Reviews Card */}
            <motion.div
              className="p-6 rounded-xl backdrop-blur-sm"
              style={{
                border: '2px solid #00FF41',
                background: 'rgba(0, 255, 65, 0.05)',
              }}
            >
              <div className="text-center">
                <p
                  className="text-4xl font-black mb-2"
                  style={{
                    color: '#00FF41',
                    textShadow: '0 0 20px #00FF41',
                  }}
                >
                  {stats.totalReviews}
                </p>
                <p style={{ color: '#00FF41' }} className="font-bold">
                  {stats.totalReviews === 1 ? 'Review' : 'Reviews'}
                </p>
              </div>
            </motion.div>

            {/* Rating Distribution */}
            <motion.div
              className="p-6 rounded-xl backdrop-blur-sm"
              style={{
                border: '2px solid #00D9FF',
                background: 'rgba(0, 217, 255, 0.05)',
              }}
            >
              <p style={{ color: '#00D9FF' }} className="font-bold text-sm mb-3">
                Rating Breakdown
              </p>
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2 text-xs">
                    <span style={{ color: '#00D9FF' }}>{rating}★</span>
                    <div
                      className="flex-1 h-2 rounded-full bg-white/10"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(stats.ratingDistribution[rating] / stats.totalReviews) * 100}%`,
                          background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                        }}
                      />
                    </div>
                    <span
                      style={{ color: '#00D9FF' }}
                      className="min-w-[20px] text-right"
                    >
                      {stats.ratingDistribution[rating]}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Reviews List */}
          <div className="space-y-4">
            {recentReviews.map((review, index) => (
              <ReviewCard key={review.id} review={review} index={index} />
            ))}

            {reviews.length > 5 && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-center text-sm mt-6"
                style={{ color: '#00D9FF' }}
              >
                Showing {recentReviews.length} of {reviews.length} reviews
              </motion.p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewSection;
