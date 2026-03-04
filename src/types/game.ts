// Game Types and Interfaces

export type ResourceType = 'wood' | 'food' | 'gold' | 'stone';

export interface Resources {
  wood: number;
  food: number;
  gold: number;
  stone: number;
}

export type Era = 'dark' | 'feudal' | 'castle' | 'imperial';

export interface Position {
  x: number;
  y: number;
}

export type UnitType = 'villager' | 'infantry' | 'archer' | 'cavalry';

export interface UnitStats {
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  speed: number;
  range: number;
}

export interface Unit {
  id: string;
  type: UnitType;
  position: Position;
  stats: UnitStats;
  playerId: string;
  isSelected: boolean;
  currentAction: 'idle' | 'moving' | 'gathering' | 'building' | 'attacking';
  targetPosition?: Position;
  carryingResource?: { type: ResourceType; amount: number };
}

export interface TrainingQueueItem {
  unitType: UnitType;
  progress: number;
  totalTime: number;
}

export type BuildingType = 
  | 'townCenter' 
  | 'house' 
  | 'barracks' 
  | 'archeryRange' 
  | 'stable' 
  | 'tower'
  | 'lumberCamp'
  | 'mill'
  | 'miningCamp';

export interface BuildingStats {
  health: number;
  maxHealth: number;
  armor: number;
}

export interface Building {
  id: string;
  type: BuildingType;
  position: Position;
  stats: BuildingStats;
  playerId: string;
  isSelected: boolean;
  isConstructing: boolean;
  constructionProgress: number;
  rallyPoint?: Position;
}

export type TerrainType = 'grass' | 'forest' | 'water' | 'mountain' | 'sand' | 'snow';

export interface MapTile {
  position: Position;
  terrain: TerrainType;
  resource?: {
    type: ResourceType;
    amount: number;
    maxAmount: number;
  };
  isExplored: boolean;
  isVisible: boolean;
}

export interface GameMap {
  width: number;
  height: number;
  tiles: MapTile[][];
}

export type CountryId = 
  | 'usa' | 'germany' | 'japan' | 'france' 
  | 'uk' | 'italy' | 'canada' | 'brazil'
  | 'russia' | 'india' | 'china' | 'southAfrica';

export interface Country {
  id: CountryId;
  name: string;
  flag: string;
  bonuses: {
    type: 'production' | 'defense' | 'population' | 'mobility';
    value: number;
    description: string;
  };
  terrainType: TerrainType;
  description: string;
}

export interface Player {
  id: string;
  name: string;
  country: Country;
  resources: Resources;
  population: number;
  maxPopulation: number;
  era: Era;
  isAI: boolean;
  color: string;
}

export interface GameState {
  id: string;
  players: Player[];
  currentPlayerId: string;
  map: GameMap;
  units: Unit[];
  buildings: Building[];
  gameTime: number;
  isPaused: boolean;
  isStarted: boolean;
  winner?: string;
}

export type GameMode = 'singlePlayer' | 'multiplayer';

export interface GameSettings {
  mode: GameMode;
  mapSize: 'small' | 'medium' | 'large';
  aiDifficulty: 'easy' | 'medium' | 'hard';
  startingResources: 'low' | 'medium' | 'high';
}

// Unit Definitions
export const UNIT_DEFINITIONS: Record<UnitType, {
  name: string;
  cost: Resources;
  trainTime: number;
  stats: UnitStats;
  populationCost: number;
}> = {
  villager: {
    name: 'Aldeão',
    cost: { wood: 0, food: 50, gold: 0, stone: 0 },
    trainTime: 25,
    stats: { health: 25, maxHealth: 25, attack: 3, defense: 0, speed: 1, range: 1 },
    populationCost: 1,
  },
  infantry: {
    name: 'Infantaria',
    cost: { wood: 0, food: 60, gold: 20, stone: 0 },
    trainTime: 20,
    stats: { health: 40, maxHealth: 40, attack: 6, defense: 2, speed: 1, range: 1 },
    populationCost: 1,
  },
  archer: {
    name: 'Arqueiro',
    cost: { wood: 25, food: 45, gold: 0, stone: 0 },
    trainTime: 30,
    stats: { health: 30, maxHealth: 30, attack: 5, defense: 0, speed: 1.1, range: 5 },
    populationCost: 1,
  },
  cavalry: {
    name: 'Cavaleiro',
    cost: { wood: 0, food: 80, gold: 60, stone: 0 },
    trainTime: 35,
    stats: { health: 60, maxHealth: 60, attack: 10, defense: 3, speed: 1.5, range: 1 },
    populationCost: 2,
  },
};

// Building Definitions
export const BUILDING_DEFINITIONS: Record<BuildingType, {
  name: string;
  cost: Resources;
  buildTime: number;
  stats: BuildingStats;
  populationProvided: number;
  produces?: UnitType[];
}> = {
  townCenter: {
    name: 'Centro Principal',
    cost: { wood: 275, food: 0, gold: 0, stone: 100 },
    buildTime: 150,
    stats: { health: 2400, maxHealth: 2400, armor: 5 },
    populationProvided: 5,
    produces: ['villager'],
  },
  house: {
    name: 'Casa',
    cost: { wood: 25, food: 0, gold: 0, stone: 0 },
    buildTime: 25,
    stats: { health: 550, maxHealth: 550, armor: 0 },
    populationProvided: 5,
  },
  barracks: {
    name: 'Quartel',
    cost: { wood: 175, food: 0, gold: 0, stone: 0 },
    buildTime: 50,
    stats: { health: 1200, maxHealth: 1200, armor: 2 },
    populationProvided: 0,
    produces: ['infantry'],
  },
  archeryRange: {
    name: 'Campo de Arqueiros',
    cost: { wood: 175, food: 0, gold: 0, stone: 0 },
    buildTime: 50,
    stats: { health: 1000, maxHealth: 1000, armor: 2 },
    populationProvided: 0,
    produces: ['archer'],
  },
  stable: {
    name: 'Estábulo',
    cost: { wood: 175, food: 0, gold: 0, stone: 0 },
    buildTime: 50,
    stats: { health: 1200, maxHealth: 1200, armor: 2 },
    populationProvided: 0,
    produces: ['cavalry'],
  },
  tower: {
    name: 'Torre',
    cost: { wood: 0, food: 0, gold: 0, stone: 125 },
    buildTime: 80,
    stats: { health: 1500, maxHealth: 1500, armor: 6 },
    populationProvided: 0,
  },
  lumberCamp: {
    name: 'Acampamento de Madeira',
    cost: { wood: 100, food: 0, gold: 0, stone: 0 },
    buildTime: 35,
    stats: { health: 600, maxHealth: 600, armor: 0 },
    populationProvided: 0,
  },
  mill: {
    name: 'Moinho',
    cost: { wood: 100, food: 0, gold: 0, stone: 0 },
    buildTime: 35,
    stats: { health: 600, maxHealth: 600, armor: 0 },
    populationProvided: 0,
  },
  miningCamp: {
    name: 'Acampamento de Mineração',
    cost: { wood: 100, food: 0, gold: 0, stone: 0 },
    buildTime: 35,
    stats: { health: 600, maxHealth: 600, armor: 0 },
    populationProvided: 0,
  },
};
