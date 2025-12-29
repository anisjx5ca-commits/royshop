/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Read environment variables - works on both local (.env.local) and Netlify (Environment Variables)
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Detailed logging for debugging
console.log('🔍 Supabase Configuration Check:');
console.log('  Environment:', import.meta.env.MODE);
console.log('  URL Present:', supabaseUrl ? '✅ Yes' : '❌ No');
console.log('  Key Present:', supabaseKey ? '✅ Yes' : '❌ No');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ CRITICAL ERROR: Supabase credentials missing!');
  console.error('\n📍 Solution:');
  console.error('   1. Local Dev: Add to .env.local');
  console.error('   2. Netlify: Add to Settings → Build & deploy → Environment variables');
  console.error('   3. Variables needed:');
  console.error('      - VITE_SUPABASE_URL: https://pguzlxoigpbjyfburfzw.supabase.co');
  console.error('      - VITE_SUPABASE_ANON_KEY: sb_publishable_4dYNskT-7b0uEfBfNUkUww_GMOTn6OR');
  console.error('   4. After adding to Netlify, trigger deploy');
}

// Create client - will work if credentials are available
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
  customer_name: string;
  phone_number: string;
  wilaya: string;
  baladiya: string;
  exact_address: string;
  items: any[];
  total_price: number;
  shipping_cost: number;
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
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
