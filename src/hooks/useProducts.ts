import { useState, useEffect } from 'react';
import { getProducts } from '../lib/supabase.ts';

// @ts-ignore
import { products as localProducts } from '../data/ProductData.js';

export interface Product {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  image_url?: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  model_url?: string;
  modelPath?: string;
  stock?: number;
  texture_config?: Record<string, any>;
  [key: string]: any;
}

interface UseProductsOptions {
  limit?: number;
  offset?: number;
}

/**
 * Custom hook to fetch products from Supabase
 * Falls back to local ProductData.js if Supabase is not available
 * 
 * Usage:
 * const { products, loading, error } = useProducts();
 * const { products, loading, error } = useProducts({ limit: 4 });
 */
export const useProducts = (options?: UseProductsOptions) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to fetch from Supabase first
        try {
          console.log('🔄 Fetching products from Supabase...');
          const supabaseProducts = await getProducts();
          
          if (supabaseProducts && supabaseProducts.length > 0) {
            console.log('✅ Products fetched from Supabase:', supabaseProducts.length);
            setProducts(supabaseProducts);
            return;
          }
        } catch (supabaseError) {
          console.warn('⚠️ Supabase fetch failed, using local products:', supabaseError);
        }

        // Fallback to local products
        console.log('📦 Using local ProductData.js:', localProducts.length);
        
        // Convert local products to match the interface
        const convertedProducts: Product[] = localProducts.map((p: any) => ({
          id: p.id.toString(),
          name: p.name,
          price: p.price,
          image: p.image || p.image_url,
          image_url: p.image || p.image_url,
          description: p.description,
          rating: p.rating || 0,
          reviewCount: p.reviewCount || 0,
          model_url: p.modelPath || p.model_url,
          stock: p.stock || 100,
          texture_config: p.texture_config || {},
          ...p,
        }));

        // Apply limit if specified
        const slicedProducts = options?.limit
          ? convertedProducts.slice(options.offset || 0, (options.offset || 0) + options.limit)
          : convertedProducts;

        setProducts(slicedProducts);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('❌ Error fetching products:', errorMessage);
        setError(errorMessage);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [options?.limit, options?.offset]);

  return { products, loading, error };
};

/**
 * Get all products (without pagination)
 * Used when you need the full product list
 */
export const getAllProducts = (): Product[] => {
  // Convert local products
  return localProducts.map((p: any) => ({
    id: p.id.toString(),
    name: p.name,
    price: p.price,
    image: p.image || p.image_url,
    image_url: p.image || p.image_url,
    description: p.description,
    rating: p.rating || 0,
    reviewCount: p.reviewCount || 0,
    model_url: p.modelPath || p.model_url,
    stock: p.stock || 100,
    texture_config: p.texture_config || {},
    ...p,
  }));
};

/**
 * Get featured products (first N items)
 * Used for home page showcase
 */
export const getFeaturedProducts = (count: number = 4): Product[] => {
  return getAllProducts().slice(0, count);
};
