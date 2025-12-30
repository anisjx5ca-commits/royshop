import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaCheckCircle } from 'react-icons/fa';
import { useLatestReviews } from '../hooks/useLatestReviews';

/**
 * Customer Reviews Section for Home Page
 * Displays latest verified reviews from the database
 * with neon cyberpunk styling
 */
export const CustomerReviewsSection: React.FC = () => {
  const { reviews, loading } = useLatestReviews(6);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} ساعة`;
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `${days} أيام`;
    } else {
      return date.toLocaleDateString('ar-DZ', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-24 relative">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2
          className="text-5xl md:text-6xl font-black mb-4 leading-tight"
          style={{
            textShadow: '0 0 40px #FF006E, 0 0 80px #FF006E, 0 0 120px #FF006E',
            background: 'linear-gradient(135deg, #FF006E 0%, #B800E8 50%, #00D9FF 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          آراء عملائنا
        </h2>
        <p
          className="text-xl text-neon-gray"
          style={{
            textShadow: '0 0 10px #00D9FF',
          }}
        >
          تقييمات حقيقية من عملاء حقيقيين
        </p>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-neon-pink border-t-neon-cyan rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-neon-gray">جاري تحميل التقييمات...</p>
        </div>
      )}

      {/* Reviews Grid */}
      {!loading && reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group relative"
            >
              {/* Glowing border effect */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, #FF006E, #00D9FF)',
                  padding: '2px',
                }}
              >
                <div className="w-full h-full rounded-2xl bg-neon-black"></div>
              </div>

              {/* Card Content */}
              <div
                className="relative p-6 rounded-2xl backdrop-blur-sm border-2 border-transparent group-hover:border-neon-pink transition-all duration-300 h-full flex flex-col"
                style={{
                  background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.8), rgba(30, 20, 50, 0.6))',
                  boxShadow: '0 0 20px rgba(0, 217, 255, 0.1), inset 0 0 20px rgba(0, 217, 255, 0.05)',
                }}
              >
                {/* Quote Icon */}
                <div className="mb-3 flex items-center gap-2">
                  <FaQuoteLeft
                    className="text-neon-pink opacity-60"
                    size={20}
                  />
                </div>

                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={14}
                      style={{
                        color: star <= review.rating ? '#FFD700' : 'rgba(255, 215, 0, 0.2)',
                        filter: star <= review.rating
                          ? 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))'
                          : 'none',
                      }}
                    />
                  ))}
                </div>

                {/* Review Comment */}
                <p
                  className="text-neon-white mb-6 flex-grow leading-relaxed"
                  style={{
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                  }}
                >
                  "{review.comment}"
                </p>

                {/* Divider */}
                <div
                  className="h-px mb-4"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(0, 217, 255, 0.3), transparent)',
                  }}
                ></div>

                {/* Review Meta */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p
                        className="font-semibold"
                        style={{
                          color: '#00D9FF',
                          textShadow: '0 0 5px #00D9FF',
                        }}
                      >
                        {review.user_name}
                      </p>
                      {review.is_verified && (
                        <FaCheckCircle
                          size={14}
                          style={{
                            color: '#00FF41',
                            filter: 'drop-shadow(0 0 4px rgba(0, 255, 65, 0.6))',
                          }}
                          title="تم التحقق من هذا التقييم"
                        />
                      )}
                    </div>
                    {review.product_name && (
                      <p
                        className="text-xs"
                        style={{
                          color: '#FF006E',
                          textShadow: '0 0 4px #FF006E',
                        }}
                      >
                        {review.product_name}
                      </p>
                    )}
                  </div>

                  {/* Date */}
                  <p
                    className="text-xs"
                    style={{
                      color: '#00D9FF',
                      opacity: 0.6,
                    }}
                  >
                    {formatDate(review.created_at)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && reviews.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center py-12"
        >
          <p
            className="text-xl"
            style={{
              color: '#00D9FF',
              textShadow: '0 0 10px #00D9FF',
            }}
          >
            لا توجد تقييمات حتى الآن. كن أول من يقيم! ⭐
          </p>
        </motion.div>
      )}

      {/* Bottom Accent */}
      <div className="mt-16">
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="h-1 max-w-xs mx-auto rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent, #FF006E, #00D9FF, transparent)',
          }}
        ></motion.div>
      </div>
    </section>
  );
};
