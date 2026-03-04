import { create } from 'zustand';
import {
  GameState, Player, Unit, Building, GameSettings,
  Country, Position, BuildingType, UnitType,
  UNIT_DEFINITIONS, BUILDING_DEFINITIONS,
} from '@/types/game';
import { COUNTRIES } from '@/data/countries';
import { generateMap, createInitialUnits, createInitialBuildings, revealArea } from './mapGenerator';
import { updateMovement, updateGathering, updateConstruction, updateTraining, updateCombat, updateFogOfWar, checkVictory } from './gameSystems';
import { updateAI } from './gameAI';

interface GameStore {
  gameState: GameState | null;
  gameSettings: GameSettings;
  selectedCountry: Country | null;
  selectedUnits: string[];
  selectedBuilding: string | null;
  cameraPosition: Position;
  zoomLevel: number;
  placementMode: BuildingType | null;

  setSelectedCountry: (country: Country) => void;
  setGameSettings: (settings: Partial<GameSettings>) => void;
  startGame: (playerName: string) => void;
  resetGame: () => void;

  selectUnit: (unitId: string, addToSelection?: boolean) => void;
  selectUnits: (unitIds: string[]) => void;
  selectBuilding: (buildingId: string | null) => void;
  clearSelection: () => void;

  setCameraPosition: (position: Position) => void;
  setZoomLevel: (zoom: number) => void;
  setPlacementMode: (type: BuildingType | null) => void;

  moveUnits: (unitIds: string[], targetPosition: Position) => void;
  gatherResource: (unitIds: string[], position: Position) => void;
  attackMove: (unitIds: string[], targetPosition: Position) => void;
  constructBuilding: (position: Position) => void;
  trainUnit: (buildingId: string, unitType: UnitType) => void;

  updateGameState: () => void;
}

const applyCountryBonuses = (player: Player): Player => {
  const bonus = player.country.bonuses;
  const p = { ...player, resources: { ...player.resources } };
  switch (bonus.type) {
    case 'production': {
      const mult = 1 + bonus.value / 100;
      p.resources.wood = Math.floor(p.resources.wood * mult);
      p.resources.food = Math.floor(p.resources.food * mult);
      p.resources.gold = Math.floor(p.resources.gold * mult);
      p.resources.stone = Math.floor(p.resources.stone * mult);
      break;
    }
    case 'population':
      p.maxPopulation = Math.floor(p.maxPopulation * (1 + bonus.value / 100));
      break;
  }
  return p;
};

const applyMobilityBonus = (units: Unit[], country: Country): Unit[] => {
  if (country.bonuses.type !== 'mobility') return units;
  const mult = 1 + country.bonuses.value / 100;
  return units.map(u => ({ ...u, stats: { ...u.stats, speed: u.stats.speed * mult } }));
};

const applyDefenseBonus = (buildings: Building[], country: Country): Building[] => {
  if (country.bonuses.type !== 'defense') return buildings;
  const mult = 1 + country.bonuses.value / 100;
  return buildings.map(b => ({
    ...b,
    stats: { ...b.stats, health: Math.floor(b.stats.health * mult), maxHealth: Math.floor(b.stats.maxHealth * mult) },
  }));
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
  placementMode: null,

  setSelectedCountry: (country) => set({ selectedCountry: country }),
  setGameSettings: (settings) => set((state) => ({
    gameSettings: { ...state.gameSettings, ...settings },
  })),
  setPlacementMode: (type) => set({ placementMode: type }),

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

    let player: Player = {
      id: 'player-1',
      name: playerName,
      country: selectedCountry,
      resources: { ...startingResources[gameSettings.startingResources] },
      population: 3,
      maxPopulation: 5,
      era: 'dark',
      isAI: false,
      color: '#3B82F6',
    };
    player = applyCountryBonuses(player);

    const aiCountry = Object.values(COUNTRIES).find(c => c.id !== selectedCountry.id)!;
    let aiPlayer: Player = {
      id: 'player-ai',
      name: 'IA Oponente',
      country: aiCountry,
      resources: { ...startingResources[gameSettings.startingResources] },
      population: 3,
      maxPopulation: 5,
      era: 'dark',
      isAI: true,
      color: '#EF4444',
    };
    aiPlayer = applyCountryBonuses(aiPlayer);

    const map = generateMap(mapSize, mapSize, selectedCountry.terrainType);
    const startX = Math.floor(mapSize * 0.2);
    const startY = Math.floor(mapSize * 0.2);
    revealArea(map, startX, startY, 8);

    let playerUnits = createInitialUnits('player-1', { x: startX + 2, y: startY + 2 });
    let playerBuildings = createInitialBuildings('player-1', { x: startX, y: startY });
    playerUnits = applyMobilityBonus(playerUnits, selectedCountry);
    playerBuildings = applyDefenseBonus(playerBuildings, selectedCountry);

    const aiStartX = Math.floor(mapSize * 0.8);
    const aiStartY = Math.floor(mapSize * 0.8);
    let aiUnits = createInitialUnits('player-ai', { x: aiStartX + 2, y: aiStartY + 2 });
    let aiBuildings = createInitialBuildings('player-ai', { x: aiStartX, y: aiStartY });
    aiUnits = applyMobilityBonus(aiUnits, aiCountry);
    aiBuildings = applyDefenseBonus(aiBuildings, aiCountry);

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
      placementMode: null,
      selectedUnits: [],
      selectedBuilding: null,
    });
  },

  resetGame: () => set({
    gameState: null,
    selectedUnits: [],
    selectedBuilding: null,
    placementMode: null,
  }),

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
        return { ...unit, targetPosition, currentAction: 'moving' as const };
      }
      return unit;
    });
    return { gameState: { ...state.gameState, units } };
  }),

  gatherResource: (unitIds, position) => set((state) => {
    if (!state.gameState) return state;
    const units = state.gameState.units.map(unit => {
      if (unitIds.includes(unit.id) && unit.type === 'villager') {
        return { ...unit, targetPosition: position, currentAction: 'gathering' as const };
      }
      return unit;
    });
    return { gameState: { ...state.gameState, units } };
  }),

  attackMove: (unitIds, targetPosition) => set((state) => {
    if (!state.gameState) return state;
    const units = state.gameState.units.map(unit => {
      if (unitIds.includes(unit.id)) {
        return { ...unit, targetPosition, currentAction: 'attacking' as const };
      }
      return unit;
    });
    return { gameState: { ...state.gameState, units } };
  }),

  constructBuilding: (position) => set((state) => {
    if (!state.gameState || !state.placementMode) return state;

    const player = state.gameState.players.find(p => p.id === state.gameState!.currentPlayerId);
    if (!player) return state;

    const buildingType = state.placementMode;
    const def = BUILDING_DEFINITIONS[buildingType];

    if (player.resources.wood < def.cost.wood ||
      player.resources.food < def.cost.food ||
      player.resources.gold < def.cost.gold ||
      player.resources.stone < def.cost.stone) {
      return { placementMode: null };
    }

    const tx = Math.round(position.x);
    const ty = Math.round(position.y);
    const tile = state.gameState.map.tiles[ty]?.[tx];
    if (!tile || tile.terrain === 'water' || tile.terrain === 'mountain') {
      return state;
    }

    const newPlayers = state.gameState.players.map(p => {
      if (p.id !== player.id) return p;
      return {
        ...p,
        resources: {
          wood: p.resources.wood - def.cost.wood,
          food: p.resources.food - def.cost.food,
          gold: p.resources.gold - def.cost.gold,
          stone: p.resources.stone - def.cost.stone,
        },
      };
    });

    const newBuilding: Building = {
      id: `building-${player.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: buildingType,
      position: { x: tx, y: ty },
      stats: { ...def.stats },
      playerId: player.id,
      isSelected: false,
      isConstructing: true,
      constructionProgress: 0,
      trainingQueue: [],
    };

    // Send selected villagers to build
    const units = state.gameState.units.map(u => {
      if (state.selectedUnits.includes(u.id) && u.playerId === player.id && u.type === 'villager') {
        return { ...u, currentAction: 'building' as const, targetPosition: { x: tx, y: ty } };
      }
      return u;
    });

    return {
      gameState: {
        ...state.gameState,
        players: newPlayers,
        buildings: [...state.gameState.buildings, newBuilding],
        units,
      },
      placementMode: null,
    };
  }),

  trainUnit: (buildingId, unitType) => set((state) => {
    if (!state.gameState) return state;

    const building = state.gameState.buildings.find(b => b.id === buildingId);
    if (!building || building.isConstructing) return state;

    const player = state.gameState.players.find(p => p.id === building.playerId);
    if (!player) return state;

    const def = UNIT_DEFINITIONS[unitType];

    if (player.resources.wood < def.cost.wood ||
      player.resources.food < def.cost.food ||
      player.resources.gold < def.cost.gold ||
      player.resources.stone < def.cost.stone) {
      return state;
    }

    if (player.population + def.populationCost > player.maxPopulation) {
      return state;
    }

    const newPlayers = state.gameState.players.map(p => {
      if (p.id !== player.id) return p;
      return {
        ...p,
        resources: {
          wood: p.resources.wood - def.cost.wood,
          food: p.resources.food - def.cost.food,
          gold: p.resources.gold - def.cost.gold,
          stone: p.resources.stone - def.cost.stone,
        },
      };
    });

    const newBuildings = state.gameState.buildings.map(b => {
      if (b.id !== buildingId) return b;
      return {
        ...b,
        trainingQueue: [...b.trainingQueue, {
          unitType,
          progress: 0,
          totalTime: def.trainTime,
        }],
      };
    });

    return {
      gameState: {
        ...state.gameState,
        players: newPlayers,
        buildings: newBuildings,
      },
    };
  }),

  updateGameState: () => set((state) => {
    if (!state.gameState || state.gameState.isPaused || state.gameState.winner) return state;

    let gs = { ...state.gameState, gameTime: state.gameState.gameTime + 1 };

    gs = updateMovement(gs);
    gs = updateGathering(gs);
    gs = updateConstruction(gs);
    gs = updateTraining(gs);
    gs = updateCombat(gs);
    gs = updateFogOfWar(gs);
    gs = updateAI(gs);
    gs = checkVictory(gs);

    return { gameState: gs };
  }),
}));
