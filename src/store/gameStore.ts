import { create } from 'zustand';
import { 
  GameState, 
  Player, 
  Unit, 
  Building, 
  GameMap, 
  GameSettings,
  Country,
  Position,
  MapTile,
  TerrainType,
  ResourceType,
} from '@/types/game';
import { COUNTRIES } from '@/data/countries';

interface GameStore {
  // Game State
  gameState: GameState | null;
  gameSettings: GameSettings;
  selectedCountry: Country | null;
  
  // UI State
  selectedUnits: string[];
  selectedBuilding: string | null;
  cameraPosition: Position;
  zoomLevel: number;
  
  // Actions
  setSelectedCountry: (country: Country) => void;
  setGameSettings: (settings: Partial<GameSettings>) => void;
  startGame: (playerName: string) => void;
  
  // Selection
  selectUnit: (unitId: string, addToSelection?: boolean) => void;
  selectUnits: (unitIds: string[]) => void;
  selectBuilding: (buildingId: string | null) => void;
  clearSelection: () => void;
  
  // Camera
  setCameraPosition: (position: Position) => void;
  setZoomLevel: (zoom: number) => void;
  
  // Game Actions
  moveUnits: (unitIds: string[], targetPosition: Position) => void;
  gatherResource: (unitId: string, position: Position) => void;
  constructBuilding: (unitId: string, buildingType: string, position: Position) => void;
  trainUnit: (buildingId: string, unitType: string) => void;
  
  // Game Loop
  updateGameState: () => void;
}

const generateMap = (width: number, height: number, terrainType: TerrainType): GameMap => {
  const tiles: MapTile[][] = [];
  
  for (let y = 0; y < height; y++) {
    tiles[y] = [];
    for (let x = 0; x < width; x++) {
      let terrain: TerrainType = terrainType;
      
      // Add variation
      const rand = Math.random();
      if (rand < 0.15) {
        terrain = 'forest';
      } else if (rand < 0.05) {
        terrain = 'water';
      }
      
      // Add resources
      let resource: MapTile['resource'] = undefined;
      if (terrain === 'forest' && Math.random() < 0.3) {
        const amounts = [50, 150, 200, 500];
        resource = {
          type: 'wood',
          amount: amounts[Math.floor(Math.random() * amounts.length)],
          maxAmount: 500,
        };
      } else if (terrain === 'grass' && Math.random() < 0.1) {
        const amounts = [50, 150, 200, 500];
        const types: ResourceType[] = ['food', 'gold', 'stone'];
        resource = {
          type: types[Math.floor(Math.random() * types.length)],
          amount: amounts[Math.floor(Math.random() * amounts.length)],
          maxAmount: 500,
        };
      }
      
      tiles[y][x] = {
        position: { x, y },
        terrain,
        resource,
        isExplored: false,
        isVisible: false,
      };
    }
  }
  
  return { width, height, tiles };
};

const createInitialUnits = (playerId: string, startPosition: Position): Unit[] => {
  const units: Unit[] = [];
  
  // Create 3 starting villagers
  for (let i = 0; i < 3; i++) {
    units.push({
      id: `unit-${playerId}-${i}`,
      type: 'villager',
      position: {
        x: startPosition.x + (i % 2),
        y: startPosition.y + Math.floor(i / 2),
      },
      stats: {
        health: 25,
        maxHealth: 25,
        attack: 3,
        defense: 0,
        speed: 1,
        range: 1,
      },
      playerId,
      isSelected: false,
      currentAction: 'idle',
    });
  }
  
  return units;
};

const createInitialBuildings = (playerId: string, startPosition: Position): Building[] => {
  return [
    {
      id: `building-${playerId}-tc`,
      type: 'townCenter',
      position: startPosition,
      stats: {
        health: 2400,
        maxHealth: 2400,
        armor: 5,
      },
      playerId,
      isSelected: false,
      isConstructing: false,
      constructionProgress: 100,
    },
  ];
};

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: null,
  gameSettings: {
    mode: 'singlePlayer',
    mapSize: 'medium',
    aiDifficulty: 'medium',
    startingResources: 'medium',
  },
  selectedCountry: null,
  selectedUnits: [],
  selectedBuilding: null,
  cameraPosition: { x: 0, y: 0 },
  zoomLevel: 1,

  setSelectedCountry: (country) => set({ selectedCountry: country }),
  
  setGameSettings: (settings) => set((state) => ({
    gameSettings: { ...state.gameSettings, ...settings },
  })),

  startGame: (playerName) => {
    const { selectedCountry, gameSettings } = get();
    if (!selectedCountry) return;

    const mapSizes = { small: 50, medium: 100, large: 150 };
    const mapSize = mapSizes[gameSettings.mapSize];
    
    const startingResources = {
      low: { wood: 100, food: 100, gold: 50, stone: 50 },
      medium: { wood: 200, food: 200, gold: 100, stone: 100 },
      high: { wood: 500, food: 500, gold: 300, stone: 200 },
    };

    const player: Player = {
      id: 'player-1',
      name: playerName,
      country: selectedCountry,
      resources: startingResources[gameSettings.startingResources],
      population: 3,
      maxPopulation: 5,
      era: 'dark',
      isAI: false,
      color: '#3B82F6',
    };

    // Create AI opponent
    const aiCountry = Object.values(COUNTRIES).find(c => c.id !== selectedCountry.id)!;
    const aiPlayer: Player = {
      id: 'player-ai',
      name: 'AI Opponent',
      country: aiCountry,
      resources: startingResources[gameSettings.startingResources],
      population: 3,
      maxPopulation: 5,
      era: 'dark',
      isAI: true,
      color: '#EF4444',
    };

    const map = generateMap(mapSize, mapSize, selectedCountry.terrainType);
    
    // Reveal starting area
    const startX = Math.floor(mapSize * 0.2);
    const startY = Math.floor(mapSize * 0.2);
    for (let dy = -5; dy <= 5; dy++) {
      for (let dx = -5; dx <= 5; dx++) {
        const y = startY + dy;
        const x = startX + dx;
        if (y >= 0 && y < mapSize && x >= 0 && x < mapSize) {
          map.tiles[y][x].isExplored = true;
          map.tiles[y][x].isVisible = true;
        }
      }
    }

    const playerUnits = createInitialUnits('player-1', { x: startX + 2, y: startY + 2 });
    const playerBuildings = createInitialBuildings('player-1', { x: startX, y: startY });
    
    const aiStartX = Math.floor(mapSize * 0.8);
    const aiStartY = Math.floor(mapSize * 0.8);
    const aiUnits = createInitialUnits('player-ai', { x: aiStartX + 2, y: aiStartY + 2 });
    const aiBuildings = createInitialBuildings('player-ai', { x: aiStartX, y: aiStartY });

    set({
      gameState: {
        id: `game-${Date.now()}`,
        players: [player, aiPlayer],
        currentPlayerId: player.id,
        map,
        units: [...playerUnits, ...aiUnits],
        buildings: [...playerBuildings, ...aiBuildings],
        gameTime: 0,
        isPaused: false,
        isStarted: true,
      },
      cameraPosition: { x: startX, y: startY },
    });
  },

  selectUnit: (unitId, addToSelection = false) => set((state) => {
    if (addToSelection) {
      if (state.selectedUnits.includes(unitId)) {
        return { selectedUnits: state.selectedUnits.filter(id => id !== unitId), selectedBuilding: null };
      }
      return { selectedUnits: [...state.selectedUnits, unitId], selectedBuilding: null };
    }
    return { selectedUnits: [unitId], selectedBuilding: null };
  }),

  selectUnits: (unitIds) => set({ selectedUnits: unitIds, selectedBuilding: null }),

  selectBuilding: (buildingId) => set({ selectedBuilding: buildingId, selectedUnits: [] }),

  clearSelection: () => set({ selectedUnits: [], selectedBuilding: null }),

  setCameraPosition: (position) => set({ cameraPosition: position }),

  setZoomLevel: (zoom) => set({ zoomLevel: Math.max(0.5, Math.min(2, zoom)) }),

  moveUnits: (unitIds, targetPosition) => set((state) => {
    if (!state.gameState) return state;
    
    const units = state.gameState.units.map(unit => {
      if (unitIds.includes(unit.id)) {
        return {
          ...unit,
          targetPosition,
          currentAction: 'moving' as const,
        };
      }
      return unit;
    });
    
    return {
      gameState: { ...state.gameState, units },
    };
  }),

  gatherResource: (unitId, position) => set((state) => {
    if (!state.gameState) return state;
    
    const units = state.gameState.units.map(unit => {
      if (unit.id === unitId && unit.type === 'villager') {
        return {
          ...unit,
          targetPosition: position,
          currentAction: 'gathering' as const,
        };
      }
      return unit;
    });
    
    return {
      gameState: { ...state.gameState, units },
    };
  }),

  constructBuilding: (_unitId, _buildingType, _position) => {
    // Implementation for building construction
  },

  trainUnit: (_buildingId, _unitType) => {
    // Implementation for training units
  },

  updateGameState: () => set((state) => {
    if (!state.gameState || state.gameState.isPaused) return state;
    
    // Update game time
    const gameTime = state.gameState.gameTime + 1;
    
    // Update unit positions (simple movement)
    const units = state.gameState.units.map(unit => {
      if (unit.currentAction === 'moving' && unit.targetPosition) {
        const dx = unit.targetPosition.x - unit.position.x;
        const dy = unit.targetPosition.y - unit.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < unit.stats.speed) {
          return {
            ...unit,
            position: unit.targetPosition,
            currentAction: 'idle' as const,
            targetPosition: undefined,
          };
        }
        
        const moveX = (dx / distance) * unit.stats.speed * 0.1;
        const moveY = (dy / distance) * unit.stats.speed * 0.1;
        
        return {
          ...unit,
          position: {
            x: unit.position.x + moveX,
            y: unit.position.y + moveY,
          },
        };
      }
      return unit;
    });
    
    return {
      gameState: {
        ...state.gameState,
        gameTime,
        units,
      },
    };
  }),
}));
