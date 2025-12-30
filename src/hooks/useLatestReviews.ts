import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Review {
  id: string;
  product_id: string;
  rating: number;
  comment: string;
  is_verified: boolean;
  user_name?: string;
  created_at?: string;
  product_name?: string;
  product_image?: string;
}

/**
 * Hook to fetch latest reviews from the database
 * Used to display customer testimonials on home page
 */
export const useLatestReviews = (limit: number = 6) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch latest reviews with product info
        const { data, error: supabaseError } = await supabase
          .from('reviews')
          .select(`
            id,
            product_id,
            rating,
            comment,
            is_verified,
            user_name,
            created_at,
            products(name, image_url)
          `)
          .eq('is_verified', true)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (supabaseError) {
          console.error('Error fetching reviews:', supabaseError);
          throw supabaseError;
        }

        // Transform data to include product info
        const transformedReviews: Review[] = (data || []).map((review: any) => ({
          id: review.id,
          product_id: review.product_id,
          rating: review.rating,
          comment: review.comment,
          is_verified: review.is_verified,
          user_name: review.user_name || 'Anonymous',
          created_at: review.created_at,
          product_name: review.products?.name || 'Product',
          product_image: review.products?.image_url || undefined,
        }));

        setReviews(transformedReviews);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('❌ Error fetching latest reviews:', errorMessage);
        setError(errorMessage);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [limit]);

  return { reviews, loading, error };
};
