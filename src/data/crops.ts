import { CropDef } from '@/types/game';

export const CROPS: Record<string, CropDef> = {
  wheat:   { name: "Trigo",    stages: ["🌱","🌿","🌾"], growTime: 8000,  reward: 5,  cost: 2,  sellPrice: 3,  inventoryKey: 'wheat',   inventoryEmoji: '🌾' },
  corn:    { name: "Milho",    stages: ["🌱","🌽","🌽"], growTime: 14000, reward: 10, cost: 4,  sellPrice: 8,  inventoryKey: 'corn',    inventoryEmoji: '🌽' },
  carrot:  { name: "Cenoura",  stages: ["🌱","🥕","🥕"], growTime: 6000,  reward: 4,  cost: 2,  sellPrice: 3,  inventoryKey: 'carrot',  inventoryEmoji: '🥕' },
  tomato:  { name: "Tomate",   stages: ["🌱","🍅","🍅"], growTime: 12000, reward: 8,  cost: 3,  sellPrice: 6,  inventoryKey: 'tomato',  inventoryEmoji: '🍅' },
  pumpkin: { name: "Abóbora",  stages: ["🌱","🎃","🎃"], growTime: 20000, reward: 18, cost: 8,  sellPrice: 14, inventoryKey: 'pumpkin', inventoryEmoji: '🎃' },
  berry:   { name: "Morango",  stages: ["🌱","🍓","🍓"], growTime: 10000, reward: 12, cost: 5,  sellPrice: 9,  inventoryKey: 'berry',   inventoryEmoji: '🍓' },
};
