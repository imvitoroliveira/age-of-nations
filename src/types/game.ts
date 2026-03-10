export interface CropDef {
  name: string;
  stages: string[];
  growTime: number;
  reward: number;
  cost: number;
  sellPrice: number;
  inventoryKey: string;
  inventoryEmoji: string;
}

export type TileType = 'grass' | 'soil' | 'planted' | 'ready' | 'deco' | 'locked';

export interface TileState {
  type: TileType;
  cropKey?: string;
  plantedAt?: number;
  decoEmoji?: string;
  decoLabel?: string;
  watered?: boolean;
}

export interface AnimalState {
  id: string;
  defId: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  state: 'idle' | 'walking' | 'eating';
  lastProduce: number;
  nextMoveAt: number;
  facingLeft: boolean;
  boughtAt: number;
}

export interface AnimalDef {
  id: string;
  emoji: string;
  name: string;
  speed: number;
  size: number;
  produce: string;
  produceEvery: number;
  reward: number;
  cost: number;
  inventoryKey: string;
  inventoryEmoji: string;
  sellPrice: number;
}

export interface FloatingProduce {
  id: string;
  animalId: string;
  emoji: string;
  inventoryKey: string;
  x: number;
  createdAt: number;
}

export interface GameNotification {
  id: string;
  message: string;
  type: 'harvest' | 'produce' | 'day' | 'info';
  createdAt: number;
}
