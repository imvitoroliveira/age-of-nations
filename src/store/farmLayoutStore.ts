import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PlacedItem {
  key: string;
  row: number;
  col: number;
}

interface FarmLayoutState {
  // childId -> placed items
  layouts: Record<string, PlacedItem[]>;
  placeItem: (childId: string, key: string, row: number, col: number) => void;
  moveItem: (childId: string, key: string, row: number, col: number) => void;
  removeItem: (childId: string, key: string) => void;
  getLayout: (childId: string) => PlacedItem[];
  isOccupied: (childId: string, row: number, col: number) => boolean;
}

export const useFarmLayoutStore = create<FarmLayoutState>()(
  persist(
    (set, get) => ({
      layouts: {},

      placeItem: (childId, key, row, col) => {
        set(state => {
          const items = [...(state.layouts[childId] || [])];
          // Remove if already placed
          const filtered = items.filter(i => i.key !== key);
          filtered.push({ key, row, col });
          return { layouts: { ...state.layouts, [childId]: filtered } };
        });
      },

      moveItem: (childId, key, row, col) => {
        set(state => {
          const items = (state.layouts[childId] || []).map(i =>
            i.key === key ? { ...i, row, col } : i
          );
          return { layouts: { ...state.layouts, [childId]: items } };
        });
      },

      removeItem: (childId, key) => {
        set(state => {
          const items = (state.layouts[childId] || []).filter(i => i.key !== key);
          return { layouts: { ...state.layouts, [childId]: items } };
        });
      },

      getLayout: (childId) => get().layouts[childId] || [],

      isOccupied: (childId, row, col) => {
        return (get().layouts[childId] || []).some(i => i.row === row && i.col === col);
      },
    }),
    { name: 'kidari-farm-layout' }
  )
);
