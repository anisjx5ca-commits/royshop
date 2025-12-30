import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface ReviewModalProps {
  isOpen: boolean;
  productId: string;
  productName: string;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  productId,
  productName,
  onClose,
  onSubmitSuccess,
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (rating === 0) {
      toast.error('Please select a star rating');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Please write at least 10 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('📝 Submitting review to Supabase...');

      const { data, error } = await supabase
        .from('reviews')
        .insert([
          {
            product_id: productId,
            rating: rating,
            comment: comment.trim(),
            is_verified: false,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error:', error);
        toast.error(`Failed to submit review: ${error.message}`);
        return;
      }

      console.log('✅ Review submitted successfully:', data);
      toast.success('Thanks for your feedback! Review submitted.');
      
      // Reset form
      setRating(0);
      setComment('');
      
      // Close modal and trigger refresh
      onClose();
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Error submitting review:', errorMessage);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4 z-50"
          >
            <div
              className="rounded-2xl p-8 backdrop-blur-xl relative"
              style={{
                background: 'rgba(10, 14, 39, 0.95)',
                border: '2px solid #FF006E',
                boxShadow: '0 0 60px rgba(255, 0, 110, 0.4), 0 0 100px rgba(0, 217, 255, 0.2)',
              }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FaTimes className="text-xl" style={{ color: '#FF006E' }} />
              </button>

              {/* Header */}
              <div className="mb-6">
                <h2
                  className="text-2xl font-black mb-2"
                  style={{
                    textShadow: '0 0 20px #FF006E',
                    color: '#FF006E',
                  }}
                >
                  Rate This Product
                </h2>
                <p
                  className="text-sm"
                  style={{ color: '#00D9FF' }}
                >
                  {productName}
                </p>
              </div>

              {/* Star Rating */}
              <div className="mb-6">
                <label
                  className="block text-sm font-bold mb-4"
                  style={{ color: '#00D9FF' }}
                >
                  How would you rate this product?
                </label>
                <div className="flex gap-3 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="relative text-4xl transition-all duration-200"
                    >
                      <FaStar
                        className="absolute inset-0"
                        style={{
                          color:
                            star <= (hoverRating || rating)
                              ? '#FFD700'
                              : 'rgba(255, 215, 0, 0.2)',
                          filter:
                            star <= (hoverRating || rating)
                              ? 'drop-shadow(0 0 8px #FFD700) drop-shadow(0 0 16px #FFA500)'
                              : 'none',
                          transition: 'all 0.2s ease',
                        }}
                      />
                    </motion.button>
                  ))}
                </div>
                {rating > 0 && (
                  <p
                    className="text-center mt-3 text-sm font-bold"
                    style={{
                      color: '#00FF41',
                      textShadow: '0 0 10px #00FF41',
                    }}
                  >
                    {rating} out of 5 stars
                  </p>
                )}
              </div>

              {/* Comment Box */}
              <div className="mb-6">
                <label
                  className="block text-sm font-bold mb-2"
                  style={{ color: '#00D9FF' }}
                >
                  Your Review (minimum 10 characters)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-neon-black text-neon-white placeholder-neon-white/40 focus:outline-none resize-none transition-all duration-300"
                  style={{
                    border: '2px solid #00D9FF',
                    boxShadow: '0 0 10px rgba(0, 217, 255, 0.2)',
                  }}
                />
                <p className="text-xs mt-2" style={{ color: '#00D9FF' }}>
                  {comment.length} characters
                </p>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-3 font-bold text-lg rounded-lg transition-all duration-300"
                style={{
                  border: '2px solid #00FF41',
                  background: isSubmitting
                    ? 'rgba(0, 255, 65, 0.2)'
                    : 'rgba(0, 255, 65, 0.1)',
                  color: '#00FF41',
                  textShadow: '0 0 10px #00FF41',
                  boxShadow: '0 0 20px rgba(0, 255, 65, 0.4)',
                  opacity: isSubmitting ? 0.6 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? 'Submitting...' : '✓ Submit Review'}
              </motion.button>

              {/* Cancel Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                disabled={isSubmitting}
                className="w-full mt-3 py-3 font-bold text-lg rounded-lg transition-all duration-300"
                style={{
                  border: '2px solid #FF006E',
                  background: 'rgba(255, 0, 110, 0.1)',
                  color: '#FF006E',
                  opacity: isSubmitting ? 0.6 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                }}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReviewModal;
