import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not configured. Some features will not work.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  model_url: string;
  texture_config: Record<string, any>;
  image_url?: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  created_at?: string;
}

export interface Order {
  id: string;
  user_name: string;
  phone: string;
  wilaya: string;
  baladiya: string;
  address: string;
  total_price: number;
  shipping_cost: number;
  items_json: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  site_rating?: number;
  created_at?: string;
}

export interface Review {
  id: string;
  product_id: string;
  rating: number;
  comment: string;
  is_verified: boolean;
  created_at?: string;
}

// Helper functions for database operations
export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) throw error;
    return data as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProduct(id: string) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function createOrder(order: Omit<Order, 'id' | 'created_at'>) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();
    
    if (error) throw error;
    return data as Order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function getReviews(productId: string) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Review[];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

export async function createReview(review: Omit<Review, 'id' | 'created_at'>) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert([review])
      .select()
      .single();
    
    if (error) throw error;
    return data as Review;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
}
