/**
 * Zustand Cart Store
 * 
 * Manages shopping cart state with localStorage persistence.
 * Handles adding, removing, and updating cart items.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Cart Store Hook
 * 
 * State:
 * - items: Array of cart items with id, name, price, color, size, quantity, image
 * - addItem: Add item or increment quantity if exists
 * - removeItem: Remove item from cart
 * - updateQuantity: Update item quantity
 * - clearCart: Empty the entire cart
 * - getTotalPrice: Calculate total price of all items
 * - getTotalItems: Get total item count
 */
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      /**
       * Add item to cart or increment if already exists
       * @param {Object} item - The item to add
       * @param {number} item.id - Unique item identifier
       * @param {number} item.productId - Product ID for linking to product data
       * @param {string} item.name - Product name
       * @param {number} item.price - Product price
       * @param {string} item.color - Selected color
       * @param {string} item.size - Selected size
       * @param {string} item.image - Product image URL
       * @param {number} [item.quantity=1] - Quantity (default: 1)
       */
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(
            (cartItem) =>
              cartItem.productId === item.productId &&
              cartItem.color === item.color &&
              cartItem.size === item.size
          );

          if (existingItem) {
            // Item already in cart - increment quantity
            return {
              items: state.items.map((cartItem) =>
                cartItem.id === existingItem.id
                  ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
                  : cartItem
              ),
            };
          } else {
            // New item - add to cart
            const newItem = {
              id: Date.now().toString(), // Unique ID for this cart entry
              productId: item.productId,
              name: item.name,
              price: item.price,
              color: item.color,
              size: item.size,
              image: item.image,
              quantity: item.quantity || 1,
            };
            return { items: [...state.items, newItem] };
          }
        });
      },

      /**
       * Remove item from cart by its cart ID
       * @param {string} itemId - The cart item ID (not product ID)
       */
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      /**
       * Update quantity of an item
       * @param {string} itemId - The cart item ID
       * @param {number} quantity - New quantity (must be > 0)
       */
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      /**
       * Clear all items from cart
       */
      clearCart: () => {
        set({ items: [] });
      },

      /**
       * Calculate total price of all items
       * @returns {number} Total price in DA (Algerian Dinars)
       */
      getTotalPrice: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      /**
       * Get total number of items in cart (sum of quantities)
       * @returns {number} Total items count
       */
      getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },

      /**
       * Get cart items array (for checkout or display)
       * @returns {Array} Array of cart items
       */
      getItems: () => {
        return get().items;
      },
    }),
    {
      name: 'royshop-cart', // localStorage key
      version: 1,
      // Optional: Add migrations if store structure changes in future
      migrate: (persistedState, version) => {
        if (version === 0) {
          // Migration example for future versions
          return persistedState;
        }
        return persistedState;
      },
    }
  )
);
