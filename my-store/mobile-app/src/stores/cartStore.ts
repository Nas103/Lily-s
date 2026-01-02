import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size?: string;
  color?: string;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size?: string, color?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.id === item.id &&
              i.size === item.size &&
              i.color === item.color
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id &&
                i.size === item.size &&
                i.color === item.color
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      
      removeItem: (id, size, color) =>
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(
                i.id === id &&
                (size ? i.size === size : true) &&
                (color ? i.color === color : true)
              )
          ),
        })),
      
      updateQuantity: (id, quantity, size, color) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id &&
            (size ? i.size === size : true) &&
            (color ? i.color === color : true)
              ? { ...i, quantity: Math.max(1, quantity) }
              : i
          ),
        })),
      
      clearCart: () => set({ items: [] }),
      
      total: () => {
        const { items } = get();
        return items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
      
      itemCount: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

