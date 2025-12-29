import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  modelId: string;
  name: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, color: string, size: string) => void;
  updateQuantity: (id: string, color: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (item: CartItem) => {
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.modelId === item.modelId && i.color === item.color && i.size === item.size
          );
          
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.modelId === item.modelId && i.color === item.color && i.size === item.size
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          
          return {
            items: [...state.items, { ...item, id: `${item.modelId}-${item.color}-${item.size}-${Date.now()}` }],
          };
        });
      },
      
      removeFromCart: (id: string, color: string, size: string) => {
        set((state) => ({
          items: state.items.filter((i) => !(i.modelId === id && i.color === color && i.size === size)),
        }));
      },
      
      updateQuantity: (id: string, color: string, size: string, quantity: number) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.modelId === id && i.color === color && i.size === size
              ? { ...i, quantity: Math.max(0, quantity) }
              : i
          ).filter((i) => i.quantity > 0),
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'royshop-cart',
    }
  )
);
