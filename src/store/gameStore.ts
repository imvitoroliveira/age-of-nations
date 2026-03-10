import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TileState, AnimalState, GameNotification } from '@/types/game';

const GRID_COLS = 8;
const GRID_ROWS = 6;

function createInitialGrid(): TileState[] {
  const grid: TileState[] = Array.from({ length: GRID_COLS * GRID_ROWS }, () => ({ type: 'grass' as const }));
  // Barn 2x2 at [col=0,row=0]
  grid[0 * GRID_COLS + 0] = { type: 'deco', decoEmoji: '🏠', decoLabel: 'Celeiro' };
  grid[0 * GRID_COLS + 1] = { type: 'deco', decoEmoji: '🏠' };
  grid[1 * GRID_COLS + 0] = { type: 'deco', decoEmoji: '🏠' };
  grid[1 * GRID_COLS + 1] = { type: 'deco', decoEmoji: '🏠' };
  // Trees & deco
  grid[0 * GRID_COLS + 4] = { type: 'deco', decoEmoji: '🌳' }; // Pine
  grid[5 * GRID_COLS + 7] = { type: 'deco', decoEmoji: '🌳' }; // Oak
  grid[5 * GRID_COLS + 3] = { type: 'deco', decoEmoji: '🪨' }; // Rock
  grid[5 * GRID_COLS + 0] = { type: 'deco', decoEmoji: '💧', decoLabel: 'Poço' }; // Well
  return grid;
}

interface GameState {
  coins: number;
  day: number;
  timeOfDay: number;
  weather: 'sunny' | 'rainy';
  grid: TileState[];
  animals: AnimalState[];
  activeTool: 'plant' | 'water' | 'harvest' | 'clear';
  selectedCrop: string | null;
  notifications: GameNotification[];
  shopOpen: boolean;
  
  addCoins: (amount: number) => void;
  setTile: (index: number, tile: Partial<TileState>) => void;
  setGrid: (grid: TileState[]) => void;
  addAnimal: (animal: AnimalState) => void;
  setAnimals: (animals: AnimalState[]) => void;
  updateAnimal: (id: string, update: Partial<AnimalState>) => void;
  setActiveTool: (tool: 'plant' | 'water' | 'harvest' | 'clear') => void;
  setSelectedCrop: (crop: string | null) => void;
  addNotification: (msg: string, type: GameNotification['type']) => void;
  removeNotification: (id: string) => void;
  setShopOpen: (open: boolean) => void;
  setTimeOfDay: (t: number) => void;
  setDay: (d: number) => void;
  setWeather: (w: 'sunny' | 'rainy') => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      coins: 100,
      day: 1,
      timeOfDay: 0.15,
      weather: 'sunny',
      grid: createInitialGrid(),
      animals: [],
      activeTool: 'plant',
      selectedCrop: null,
      notifications: [],
      shopOpen: false,

      addCoins: (amount) => set((s) => ({ coins: s.coins + amount })),
      setTile: (index, tile) => set((s) => {
        const grid = [...s.grid];
        grid[index] = { ...grid[index], ...tile };
        return { grid };
      }),
      setGrid: (grid) => set({ grid }),
      addAnimal: (animal) => set((s) => ({ animals: [...s.animals, animal] })),
      setAnimals: (animals) => set({ animals }),
      updateAnimal: (id, update) => set((s) => ({
        animals: s.animals.map((a) => a.id === id ? { ...a, ...update } : a),
      })),
      setActiveTool: (tool) => set({ activeTool: tool }),
      setSelectedCrop: (crop) => set({ selectedCrop: crop }),
      addNotification: (msg, type) => set((s) => ({
        notifications: [
          ...s.notifications.slice(-3),
          { id: crypto.randomUUID(), message: msg, type, createdAt: Date.now() },
        ],
      })),
      removeNotification: (id) => set((s) => ({
        notifications: s.notifications.filter((n) => n.id !== id),
      })),
      setShopOpen: (open) => set({ shopOpen: open }),
      setTimeOfDay: (t) => set({ timeOfDay: t }),
      setDay: (d) => set({ day: d }),
      setWeather: (w) => set({ weather: w }),
      resetGame: () => set({
        coins: 100, day: 1, timeOfDay: 0.15, weather: 'sunny',
        grid: createInitialGrid(), animals: [], notifications: [],
        activeTool: 'plant', selectedCrop: null,
      }),
    }),
    { name: 'fazendinha-game' }
  )
);
