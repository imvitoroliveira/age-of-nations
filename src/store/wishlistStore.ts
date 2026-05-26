import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  items: (number | string)[];
  toggleItem: (id: number | string) => void;
  isInWishlist: (id: number | string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (id) => {
        const items = get().items;
        if (items.includes(id)) {
          set({ items: items.filter((itemId) => itemId !== id) });
        } else {
          set({ items: [...items, id] });
        }
      },
      isInWishlist: (id) => get().items.includes(id),
    }),
    {
      name: 'orbe-connect-wishlist',
    }
  )
);
