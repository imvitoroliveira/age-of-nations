import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TileState, AnimalState, GameNotification, FloatingProduce } from '@/types/game';

const GRID_COLS = 6;
const GRID_ROWS = 6;

// Core owned area: inner 4×4 (rows 1-4, cols 1-4)
function getCoreIndices(): number[] {
  const indices: number[] = [];
  for (let r = 1; r <= 4; r++) {
    for (let c = 1; c <= 4; c++) {
      indices.push(r * GRID_COLS + c);
    }
  }
  return indices;
}

function getExpansionCost(col: number, row: number): number {
  // Ring tiles are cheaper near center
  const centerCol = 2.5, centerRow = 2.5;
  const dist = Math.abs(col - centerCol) + Math.abs(row - centerRow);
  if (dist <= 3) return 50;
  if (dist <= 4) return 100;
  return 150;
}

function createInitialGrid(ownedSet: number[]): TileState[] {
  const grid: TileState[] = Array.from({ length: GRID_COLS * GRID_ROWS }, (_, i) => {
    if (ownedSet.includes(i)) return { type: 'grass' as const };
    // Only show locked for the outer ring (row 0, row 5, col 0, col 5)
    const row = Math.floor(i / GRID_COLS);
    const col = i % GRID_COLS;
    if (row === 0 || row === 5 || col === 0 || col === 5) {
      return { type: 'locked' as const };
    }
    return { type: 'locked' as const };
  });

  // Barn 2×2 at core top-left: [row=1,col=1], [row=1,col=2], [row=2,col=1], [row=2,col=2]
  const barnTL = 1 * GRID_COLS + 1; // index 7
  grid[barnTL] = { type: 'deco', decoEmoji: '🏠', decoLabel: 'Celeiro' };
  grid[barnTL + 1] = { type: 'deco', decoEmoji: '🏠' };
  grid[2 * GRID_COLS + 1] = { type: 'deco', decoEmoji: '🏠' };
  grid[2 * GRID_COLS + 2] = { type: 'deco', decoEmoji: '🏠' };

  // Oak tree at [row=1, col=3] (decorative)
  grid[1 * GRID_COLS + 3] = { type: 'deco', decoEmoji: '🌳', decoLabel: 'Carvalho' };

  // Well at [row=4, col=4] (interactive)
  grid[4 * GRID_COLS + 4] = { type: 'deco', decoEmoji: '💧', decoLabel: 'Poço' };

  // Pre-planted wheat seedlings at [row=3,col=3], [row=3,col=4], [row=4,col=3]
  grid[3 * GRID_COLS + 3] = { type: 'planted', cropKey: 'wheat', plantedAt: Date.now() - 3000, watered: false };
  grid[3 * GRID_COLS + 4] = { type: 'planted', cropKey: 'wheat', plantedAt: Date.now() - 3000, watered: false };
  grid[4 * GRID_COLS + 3] = { type: 'planted', cropKey: 'carrot', plantedAt: Date.now() - 2000, watered: false };

  // Soil tiles ready to plant
  grid[2 * GRID_COLS + 3] = { type: 'soil' };
  grid[2 * GRID_COLS + 4] = { type: 'soil' };

  // Remaining core tiles stay as grass (already set)

  return grid;
}

function createStarterAnimals(): AnimalState[] {
  return [
    {
      id: 'starter-chicken',
      defId: 'chicken',
      x: 200,
      y: 50,
      targetX: 300,
      targetY: 60,
      state: 'walking',
      lastProduce: Date.now(),
      nextMoveAt: Date.now() + 3000,
      facingLeft: false,
      boughtAt: Date.now(),
    },
    {
      id: 'starter-cow',
      defId: 'cow',
      x: 450,
      y: 55,
      targetX: 350,
      targetY: 45,
      state: 'walking',
      lastProduce: Date.now(),
      nextMoveAt: Date.now() + 4000,
      facingLeft: true,
      boughtAt: Date.now(),
    },
  ];
}

interface GameState {
  coins: number;
  xp: number;
  level: number;
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

  addXP: (amount: number) => void;
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
      xp: 0,
      level: 1,
      day: 1,
      timeOfDay: 0.15,
      weather: 'sunny',
      grid: createInitialGrid(initialOwned),
      animals: createStarterAnimals(),
      activeTool: 'plant',
      selectedCrop: null,
      notifications: [],
      shopOpen: false,
      ownedTiles: initialOwned,
      inventory: {},
      floatingProduce: [],

      addXP: (amount) => set((s) => {
        const newXP = s.xp + amount;
        const nextLevelXP = s.level * 100;
        if (newXP >= nextLevelXP) {
          return { xp: newXP - nextLevelXP, level: s.level + 1 };
        }
        return { xp: newXP };
      }),
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
        coins: 100, xp: 0, level: 1, day: 1, timeOfDay: 0.15, weather: 'sunny',
        grid: createInitialGrid(initialOwned), animals: createStarterAnimals(), notifications: [],
        activeTool: 'plant', selectedCrop: null, ownedTiles: initialOwned,
        inventory: {}, floatingProduce: [],
      }),
    }),
    { name: 'fazendinha-game' }
  )
);
