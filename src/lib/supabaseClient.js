/**
 * Supabase Client Configuration
 * 
 * This file initializes the Supabase client using environment variables.
 * It provides authenticated access to the RoyShop database.
 * 
 * Environment variables required:
 * - VITE_SUPABASE_URL: The Supabase project URL
 * - VITE_SUPABASE_ANON_KEY: The Supabase anonymous public key
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with credentials from environment variables
// Works on both local (.env.local) and Netlify (Environment Variables)
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase Initialization Failed - Missing Credentials');
  throw new Error(
    'Missing Supabase credentials.\n\nLocal: Add to .env.local\nNetlify: Add to Settings → Build & deploy → Environment variables'
  );
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Service Functions for Database Operations
 */

/**
 * Fetch all wilayas (provinces) with their shipping costs
 * @returns {Promise<Array>} Array of wilaya objects with id, name_ar, name_fr, shipping_cost
 */
export const fetchWilayas = async () => {
  try {
    const { data, error } = await supabase
      .from('wilayas')
      .select('*')
      .order('name_ar', { ascending: true });

    if (error) {
      console.error('Error fetching wilayas:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Unexpected error fetching wilayas:', err);
    return [];
  }
};

/**
 * Fetch shipping cost for a specific wilaya
 * @param {string} wilayaName - The name of the wilaya (Arabic or French)
 * @returns {Promise<number>} The shipping cost for the wilaya
 */
export const getShippingCost = async (wilayaName) => {
  try {
    const { data, error } = await supabase
      .from('wilayas')
      .select('shipping_cost')
      .or(`name_ar.eq.${wilayaName},name_fr.eq.${wilayaName}`)
      .single();

    if (error || !data) {
      console.error('Error fetching shipping cost:', error);
      return 0;
    }
    return data.shipping_cost || 0;
  } catch (err) {
    console.error('Unexpected error fetching shipping cost:', err);
    return 0;
  }
};

/**
 * Create a new order in the database
 * @param {Object} orderData - The order information
 * @param {string} orderData.customer_name - Full name of the customer
 * @param {string} orderData.phone_number - Algerian phone number (validated)
 * @param {string} orderData.wilaya - Province name
 * @param {string} orderData.baladiya - Municipality/City name
 * @param {string} orderData.exact_address - Delivery address
 * @param {Array} orderData.items - Array of cart items (stored as JSON)
 * @param {number} orderData.total_price - Total price of all items
 * @param {number} orderData.shipping_cost - Shipping cost for the wilaya
 * @returns {Promise<Object>} The created order object with id and status
 */
export const createOrder = async (orderData) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          customer_name: orderData.customer_name,
          phone_number: orderData.phone_number,
          wilaya: orderData.wilaya,
          baladiya: orderData.baladiya,
          exact_address: orderData.exact_address,
          items: orderData.items, // Stored as JSONB array
          total_price: orderData.total_price,
          shipping_cost: orderData.shipping_cost,
          status: 'pending', // Default status for new orders
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      throw new Error(`Failed to create order: ${error.message}`);
    }
    return data;
  } catch (err) {
    console.error('Unexpected error creating order:', err);
    throw err;
  }
};

/**
 * Fetch order by ID
 * @param {number} orderId - The ID of the order
 * @returns {Promise<Object>} The order object
 */
export const fetchOrderById = async (orderId) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Unexpected error fetching order:', err);
    return null;
  }
};
