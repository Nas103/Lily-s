import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types';

type WishlistItem = {
  productId: string;
  product: Product;
  size?: string;
  color?: string;
  addedAt: string;
};

type WishlistStore = {
  items: WishlistItem[];
  addItem: (product: Product, size?: string, color?: string) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  isInWishlist: (productId: string, size?: string, color?: string) => boolean;
  clearWishlist: () => void;
  itemCount: () => number;
};

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, size, color) =>
        set((state) => {
          // Check if item already exists with same size and color
          const existing = state.items.find(
            (item) =>
              item.productId === product.id &&
              item.size === size &&
              item.color === color
          );
          
          if (existing) {
            // Already in wishlist
            return state;
          }
          
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                product,
                size,
                color,
                addedAt: new Date().toISOString(),
              },
            ],
          };
        }),
      
      removeItem: (productId, size, color) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.productId === productId &&
                (size ? item.size === size : !item.size) &&
                (color ? item.color === color : !item.color)
              )
          ),
        })),
      
      isInWishlist: (productId, size, color) => {
        const { items } = get();
        return items.some(
          (item) =>
            item.productId === productId &&
            (size ? item.size === size : !item.size) &&
            (color ? item.color === color : !item.color)
        );
      },
      
      clearWishlist: () => set({ items: [] }),
      
      itemCount: () => {
        const { items } = get();
        return items.length;
      },
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

