import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotals: () => { subtotal: number; count: number };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.id === item.id);
        const qtyToAdd = item.quantity || 1;

        if (existingItem) {
          if (existingItem.quantity + qtyToAdd > item.stock) return;
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + qtyToAdd } : i
            ),
          });
        } else {
          if (qtyToAdd > item.stock) return;
          set({ items: [...items, { ...item, quantity: qtyToAdd }] });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        const items = get().items;
        const item = items.find(i => i.id === id);
        if (item && quantity > item.stock) return;

        set({
          items: items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotals: () => {
        const items = get().items;
        return {
          subtotal: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
          count: items.reduce((acc, item) => acc + item.quantity, 0),
        };
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
