import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TileState, AnimalState, GameNotification, FloatingProduce } from '@/types/game';

const GRID_COLS = 10;
const GRID_ROWS = 8;

// Core owned area: cols 3-6, rows 2-5 (4x4 center)
function getCoreIndices(): number[] {
  const indices: number[] = [];
  for (let r = 2; r <= 5; r++) {
    for (let c = 3; c <= 6; c++) {
      indices.push(r * GRID_COLS + c);
    }
  }
  return indices;
}

function getExpansionCost(col: number, row: number): number {
  const centerCol = 4.5, centerRow = 3.5;
  const dist = Math.max(Math.abs(col - centerCol) - 1.5, 0) + Math.max(Math.abs(row - centerRow) - 1.5, 0);
  if (dist <= 1) return 50;
  if (dist <= 2) return 120;
  return 200;
}

function createInitialGrid(ownedSet: number[]): TileState[] {
  const grid: TileState[] = Array.from({ length: GRID_COLS * GRID_ROWS }, (_, i) => {
    if (ownedSet.includes(i)) return { type: 'grass' as const };
    return { type: 'locked' as const };
  });
  // Barn 2x2 at core top-left [row=2,col=3] and [row=2,col=4], [row=3,col=3], [row=3,col=4]
  const barnIdx = 2 * GRID_COLS + 3;
  grid[barnIdx] = { type: 'deco', decoEmoji: '🏠', decoLabel: 'Celeiro' };
  grid[barnIdx + 1] = { type: 'deco', decoEmoji: '🏠' };
  grid[(2 + 1) * GRID_COLS + 3] = { type: 'deco', decoEmoji: '🏠' };
  grid[(2 + 1) * GRID_COLS + 4] = { type: 'deco', decoEmoji: '🏠' };
  // Well
  grid[5 * GRID_COLS + 3] = { type: 'deco', decoEmoji: '💧', decoLabel: 'Poço' };
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
  ownedTiles: number[];
  inventory: Record<string, number>;
  floatingProduce: FloatingProduce[];

  addCoins: (amount: number) => void;
  setTile: (index: number, tile: Partial<TileState>) => void;
  setGrid: (grid: TileState[]) => void;
  addAnimal: (animal: AnimalState) => void;
  setAnimals: (animals: AnimalState[]) => void;
  removeAnimal: (id: string) => void;
  updateAnimal: (id: string, update: Partial<AnimalState>) => void;
  setActiveTool: (tool: 'plant' | 'water' | 'harvest' | 'clear') => void;
  setSelectedCrop: (crop: string | null) => void;
  addNotification: (msg: string, type: GameNotification['type']) => void;
  removeNotification: (id: string) => void;
  setShopOpen: (open: boolean) => void;
  setTimeOfDay: (t: number) => void;
  setDay: (d: number) => void;
  setWeather: (w: 'sunny' | 'rainy') => void;
  unlockTile: (index: number) => void;
  addToInventory: (itemId: string, qty: number) => void;
  removeFromInventory: (itemId: string, qty: number) => void;
  addFloatingProduce: (fp: FloatingProduce) => void;
  removeFloatingProduce: (id: string) => void;
  resetGame: () => void;
}

const initialOwned = getCoreIndices();

export { GRID_COLS, GRID_ROWS, getExpansionCost };

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      coins: 100,
      day: 1,
      timeOfDay: 0.15,
      weather: 'sunny',
      grid: createInitialGrid(initialOwned),
      animals: [],
      activeTool: 'plant',
      selectedCrop: null,
      notifications: [],
      shopOpen: false,
      ownedTiles: initialOwned,
      inventory: {},
      floatingProduce: [],

      addCoins: (amount) => set((s) => ({ coins: Math.max(0, s.coins + amount) })),
      setTile: (index, tile) => set((s) => {
        const grid = [...s.grid];
        grid[index] = { ...grid[index], ...tile };
        return { grid };
      }),
      setGrid: (grid) => set({ grid }),
      addAnimal: (animal) => set((s) => ({ animals: [...s.animals, animal] })),
      setAnimals: (animals) => set({ animals }),
      removeAnimal: (id) => set((s) => ({ animals: s.animals.filter(a => a.id !== id) })),
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
      unlockTile: (index) => set((s) => {
        const col = index % GRID_COLS;
        const row = Math.floor(index / GRID_COLS);
        const cost = getExpansionCost(col, row);
        if (s.coins < cost) return s;
        const grid = [...s.grid];
        grid[index] = { type: 'grass' };
        return {
          coins: s.coins - cost,
          grid,
          ownedTiles: [...s.ownedTiles, index],
        };
      }),
      addToInventory: (itemId, qty) => set((s) => ({
        inventory: { ...s.inventory, [itemId]: (s.inventory[itemId] || 0) + qty },
      })),
      removeFromInventory: (itemId, qty) => set((s) => {
        const current = s.inventory[itemId] || 0;
        const newQty = Math.max(0, current - qty);
        const inv = { ...s.inventory };
        if (newQty === 0) delete inv[itemId];
        else inv[itemId] = newQty;
        return { inventory: inv };
      }),
      addFloatingProduce: (fp) => set((s) => ({
        floatingProduce: [...s.floatingProduce, fp],
      })),
      removeFloatingProduce: (id) => set((s) => ({
        floatingProduce: s.floatingProduce.filter(f => f.id !== id),
      })),
      resetGame: () => set({
        coins: 100, day: 1, timeOfDay: 0.15, weather: 'sunny',
        grid: createInitialGrid(initialOwned), animals: [], notifications: [],
        activeTool: 'plant', selectedCrop: null, ownedTiles: initialOwned,
        inventory: {}, floatingProduce: [],
      }),
    }),
    { name: 'fazendinha-game' }
  )
);
