import { useState, FC } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaStar } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
// @ts-ignore
import Confetti from 'react-confetti';

interface ReviewState {
  productId: string;
  productName: string;
  productImage: string;
  rating: number;
  comment: string;
  isSubmitted: boolean;
  quantity: number;
}

interface OrderItem {
  id?: string;
  modelId?: string;
  name: string;
  image_url?: string;
  quantity: number;
  color?: string;
  size?: string;
}

interface OrderReviewListProps {
  orderItems?: OrderItem[];
  customerName?: string;
  onSubmitSuccess?: () => void;
}

export const OrderReviewList: FC<OrderReviewListProps> = ({ 
  orderItems = [], 
  customerName = '', 
  onSubmitSuccess = undefined 
}) => {
  // Local state for all reviews
  const [reviews, setReviews] = useState<ReviewState[]>(
    orderItems.map((item) => ({
      productId: item.id || item.modelId || '',
      productName: item.name || '',
      productImage: item.image_url || '',
      rating: 0,
      comment: '',
      isSubmitted: false,
      quantity: item.quantity || 1,
    }))
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Handle star rating change for a specific item
  const handleStarClick = (itemIndex: number, starValue: number) => {
    setReviews((prev) =>
      prev.map((review, idx) =>
        idx === itemIndex ? { ...review, rating: starValue } : review
      )
    );
  };

  // Handle comment change for a specific item
  const handleCommentChange = (itemIndex: number, text: string) => {
    setReviews((prev) =>
      prev.map((review, idx) =>
        idx === itemIndex ? { ...review, comment: text } : review
      )
    );
  };

  // Validate reviews before submission
  const getReviewsToSubmit = () => {
    return reviews.filter((review) => review.rating > 0 && !review.isSubmitted);
  };

  // Handle bulk submission
  const handleSubmitAllReviews = async () => {
    const reviewsToSubmit = getReviewsToSubmit();

    if (reviewsToSubmit.length === 0) {
      toast.error('Please rate at least one product before submitting.');
      return;
    }

    // Validate that all reviews have comments (optional - adjust as needed)
    const missingComments = reviewsToSubmit.filter(
      (review) => review.comment.trim().length < 10
    );

    if (missingComments.length > 0) {
      toast.error(
        `Please add at least 10 characters to comments for rated items.`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare bulk insert data
      const bulkReviews = reviewsToSubmit.map((review) => ({
        product_id: review.productId,
        rating: review.rating,
        comment: review.comment.trim(),
        user_name: customerName || 'Anonymous Customer',
        is_verified: true, // Mark as verified since it's from order
      }));

      // Bulk insert to Supabase
      const { data, error } = await supabase
        .from('reviews')
        .insert(bulkReviews)
        .select();

      if (error) {
        console.error('❌ Bulk review submission error:', error);
        throw error;
      }

      console.log('✅ Bulk reviews submitted successfully:', data);

      // Update local state to mark as submitted
      setReviews((prev) =>
        prev.map((review) => {
          const wasSubmitted = bulkReviews.some(
            (br) => br.product_id === review.productId
          );
          return wasSubmitted ? { ...review, isSubmitted: true } : review;
        })
      );

      // Show celebration
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);

      toast.success(
        `🎉 Thanks for your feedback! ${bulkReviews.length} review(s) submitted!`
      );

      // Callback to parent if provided
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error('❌ Error submitting reviews:', error);
      toast.error('Failed to submit reviews. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate stats
  const totalRated = reviews.filter((r) => r.rating > 0).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="w-full p-8 rounded-2xl mb-8"
      style={{
        border: '3px solid #FF006E',
        background: 'rgba(255, 0, 110, 0.08)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 0 50px rgba(255, 0, 110, 0.2)',
      }}
    >
      {/* Confetti */}
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-black"
          style={{
            textShadow: '0 0 25px #FF006E',
            color: '#FF006E',
          }}
        >
          ⭐ Rate Your Items
        </motion.h2>

        {/* Progress Badge */}
        <motion.div
          className="px-4 py-2 rounded-full font-bold"
          style={{
            background: `linear-gradient(135deg, 
              ${totalRated > 0 ? '#00FF41' : '#FFD700'} 0%,
              ${totalRated > 0 ? '#00D9FF' : '#FF006E'} 100%)`,
            color: '#0A0E27',
            textShadow: '0 0 10px rgba(0,0,0,0.2)',
          }}
        >
          {totalRated}/{reviews.length} Rated
        </motion.div>
      </div>

      {/* Info Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-8 text-lg"
        style={{
          color: '#00D9FF',
          textShadow: '0 0 10px rgba(0, 217, 255, 0.3)',
        }}
      >
        Help us improve by rating the products you just received. Feedback is valuable and helps other customers make better choices!
      </motion.p>

      {/* Review Items Container */}
      <div className="space-y-6 mb-8">
        {reviews.map((review, itemIndex) => (
          <motion.div
            key={itemIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + itemIndex * 0.1 }}
            className="p-6 rounded-xl transition-all overflow-hidden"
            style={{
              border: review.isSubmitted
                ? '2px solid #00FF41'
                : '2px solid #00D9FF',
              background: review.isSubmitted
                ? 'rgba(0, 255, 65, 0.08)'
                : 'rgba(10, 14, 39, 0.6)',
              boxShadow: review.isSubmitted
                ? '0 0 20px rgba(0, 255, 65, 0.2)'
                : 'inset 0 0 20px rgba(0, 217, 255, 0.1)',
            }}
          >
            {/* Product Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4 flex-1">
                {/* Product Image */}
                {review.productImage && (
                  <motion.img
                    src={review.productImage}
                    alt={review.productName}
                    className="w-20 h-20 rounded-lg object-cover border-2"
                    style={{
                      borderColor: review.isSubmitted ? '#00FF41' : '#00D9FF',
                      boxShadow: `0 0 15px ${
                        review.isSubmitted
                          ? 'rgba(0, 255, 65, 0.4)'
                          : 'rgba(0, 217, 255, 0.2)'
                      }`,
                    }}
                  />
                )}

                {/* Product Info */}
                <div className="flex-1">
                  <h3
                    className="text-xl font-bold mb-1"
                    style={{
                      color: review.isSubmitted ? '#00FF41' : '#00D9FF',
                      textShadow: `0 0 10px ${
                        review.isSubmitted ? '#00FF41' : '#00D9FF'
                      }`,
                    }}
                  >
                    {review.productName}
                  </h3>
                  <p
                    className="text-sm"
                    style={{
                      color: '#FF006E',
                    }}
                  >
                    Quantity ordered: {review.quantity}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              {review.isSubmitted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-4 py-2 rounded-full font-bold flex items-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #00FF41 0%, #00D9FF 100%)',
                    color: '#0A0E27',
                    textShadow: '0 0 5px rgba(0,0,0,0.1)',
                  }}
                >
                  ✓ Submitted
                </motion.div>
              )}
            </div>

            {/* Rating Section */}
            <div className="mb-6">
              <p
                className="text-sm font-bold mb-3"
                style={{
                  color: '#FFD700',
                  textShadow: '0 0 10px rgba(255, 215, 0, 0.4)',
                }}
              >
                How would you rate this product?
              </p>

              <motion.div
                className="flex gap-3"
                variants={{
                  container: {
                    staggerChildren: 0.05,
                  } as any,
                }}
                initial="container"
                animate="container"
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    variants={{
                      container: {
                        opacity: 1,
                        scale: 1,
                      } as any,
                    }}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleStarClick(itemIndex, star)}
                    disabled={review.isSubmitted}
                    className={`text-4xl transition-all ${
                      review.isSubmitted
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer hover:drop-shadow-lg'
                    }`}
                    style={{
                      color:
                        star <= review.rating
                          ? '#FFD700'
                          : 'rgba(255, 215, 0, 0.3)',
                      filter:
                        star <= review.rating
                          ? 'drop-shadow(0 0 10px #FFD700)'
                          : 'none',
                      textShadow:
                        star <= review.rating
                          ? '0 0 15px rgba(255, 215, 0, 0.6)'
                          : 'none',
                    }}
                  >
                    <FaStar />
                  </motion.button>
                ))}
              </motion.div>

              {review.rating > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm font-bold"
                  style={{
                    color: '#FFD700',
                    textShadow: '0 0 8px #FFD700',
                  }}
                >
                  {review.rating} out of 5 stars
                </motion.p>
              )}
            </div>

            {/* Comment Section */}
            {!review.isSubmitted && review.rating > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <label
                  className="text-sm font-bold block"
                  style={{
                    color: '#00D9FF',
                    textShadow: '0 0 10px rgba(0, 217, 255, 0.3)',
                  }}
                >
                  Share your feedback (minimum 10 characters)
                </label>

                <textarea
                  value={review.comment}
                  onChange={(e) => handleCommentChange(itemIndex, e.target.value)}
                  placeholder="How was the product? What did you think about its quality, fit, or performance?"
                  className="w-full p-3 rounded-lg bg-opacity-20 backdrop-blur-sm resize-none focus:outline-none transition-all"
                  rows={3}
                  style={{
                    borderColor: '#00D9FF',
                    background: 'rgba(0, 217, 255, 0.05)',
                    color: '#FFF',
                    border: '2px solid #00D9FF',
                    boxShadow:
                      'inset 0 0 10px rgba(0, 217, 255, 0.1), 0 0 15px rgba(0, 217, 255, 0.2)',
                  }}
                />

                <p
                  className="text-xs"
                  style={{
                    color:
                      review.comment.length >= 10
                        ? '#00FF41'
                        : '#FF006E',
                    textShadow:
                      review.comment.length >= 10
                        ? '0 0 8px #00FF41'
                        : '0 0 8px #FF006E',
                  }}
                >
                  {review.comment.length}/254 characters
                </p>
              </motion.div>
            )}

            {/* Submitted Message */}
            {review.isSubmitted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-lg text-center"
                style={{
                  background: 'rgba(0, 255, 65, 0.1)',
                  border: '1px solid #00FF41',
                }}
              >
                <p
                  style={{
                    color: '#00FF41',
                    textShadow: '0 0 10px #00FF41',
                  }}
                  className="font-bold"
                >
                  ✓ Your rating has been submitted. Thank you!
                </p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Submit All Button */}
      {reviews.some((r) => !r.isSubmitted) && (
        <motion.button
          whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
          onClick={handleSubmitAllReviews}
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-xl font-black text-lg transition-all uppercase"
          style={{
            border: '3px solid #00FF41',
            background: isSubmitting
              ? 'rgba(0, 255, 65, 0.2)'
              : 'linear-gradient(135deg, rgba(0, 255, 65, 0.2) 0%, rgba(0, 217, 255, 0.2) 100%)',
            color: '#00FF41',
            boxShadow: `0 0 30px ${
              isSubmitting
                ? 'rgba(0, 255, 65, 0.2)'
                : 'rgba(0, 255, 65, 0.5)'
            }`,
            cursor: isSubmitting ? 'wait' : 'pointer',
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting ? (
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Submitting {totalRated} Review{totalRated !== 1 ? 's' : ''}...
            </motion.span>
          ) : (
            <span>
              Submit {totalRated > 0 ? `${totalRated} Review${totalRated !== 1 ? 's' : ''}` : 'Ratings'}
            </span>
          )}
        </motion.button>
      )}

      {/* All Submitted Message */}
      {reviews.every((r) => r.isSubmitted) && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-6 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, #00FF41 0%, #00D9FF 100%)',
            color: '#0A0E27',
            textShadow: '0 0 10px rgba(0,0,0,0.1)',
          }}
        >
          <p className="text-xl font-black">
            🎉 All reviews submitted! Thank you for your feedback!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};
