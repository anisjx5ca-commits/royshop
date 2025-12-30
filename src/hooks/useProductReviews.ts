import { useState, useCallback } from 'react';
import { getReviews, Review } from '../lib/supabase';

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number; // 1-5 stars: count
  };
}

export const useProductReviews = (productId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch reviews for a product
  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`📚 Fetching reviews for product: ${productId}`);
      const data = await getReviews(productId);
      setReviews(data);
      console.log(`✅ Loaded ${data.length} reviews`);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load reviews';
      console.error('❌ Error fetching reviews:', errorMessage);
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  // Calculate review statistics
  const calculateStats = useCallback((): ReviewStats => {
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRating = 0;

    reviews.forEach((review) => {
      const rating = review.rating || 0;
      if (rating >= 1 && rating <= 5) {
        ratingDistribution[rating]++;
        totalRating += rating;
      }
    });

    const averageRating = totalRating / reviews.length;

    return {
      averageRating: Math.round((averageRating + Number.EPSILON) * 10) / 10, // Round to 1 decimal
      totalReviews: reviews.length,
      ratingDistribution,
    };
  }, [reviews]);

  // Get recent reviews (latest N reviews)
  const getRecentReviews = useCallback((limit: number = 5) => {
    return reviews.slice(0, limit);
  }, [reviews]);

  // Get reviews by rating
  const getReviewsByRating = useCallback((rating: number) => {
    return reviews.filter((review) => review.rating === rating);
  }, [reviews]);

  return {
    reviews,
    isLoading,
    error,
    fetchReviews,
    calculateStats,
    getRecentReviews,
    getReviewsByRating,
    refreshReviews: fetchReviews,
  };
};

export default useProductReviews;
