import { AnimalDef } from '@/types/game';

export const ANIMAL_DEFS: AnimalDef[] = [
  { id: "cow",     emoji: "🐄", name: "Vaca",    speed: 0.5,  size: 52, produce: "🥛 Leite",   produceEvery: 15000, reward: 12, cost: 80,  inventoryKey: 'milk',         inventoryEmoji: '🥛', sellPrice: 10 },
  { id: "chicken", emoji: "🐔", name: "Galinha", speed: 0.9,  size: 36, produce: "🥚 Ovo",     produceEvery: 8000,  reward: 5,  cost: 30,  inventoryKey: 'egg',          inventoryEmoji: '🥚', sellPrice: 4  },
  { id: "sheep",   emoji: "🐑", name: "Ovelha",  speed: 0.45, size: 42, produce: "🧶 Lã",      produceEvery: 20000, reward: 15, cost: 60,  inventoryKey: 'wool',         inventoryEmoji: '🧶', sellPrice: 12 },
  { id: "pig",     emoji: "🐷", name: "Porco",   speed: 0.6,  size: 42, produce: "🥩 Carne",   produceEvery: 25000, reward: 20, cost: 100, inventoryKey: 'meat',         inventoryEmoji: '🥩', sellPrice: 18 },
  { id: "duck",    emoji: "🦆", name: "Pato",    speed: 0.7,  size: 34, produce: "🪶 Pena",    produceEvery: 12000, reward: 8,  cost: 40,  inventoryKey: 'duck_feather', inventoryEmoji: '🪶', sellPrice: 6  },
  { id: "rabbit",  emoji: "🐇", name: "Coelho",  speed: 1.2,  size: 32, produce: "🍖 Coelho",  produceEvery: 18000, reward: 14, cost: 55,  inventoryKey: 'rabbit_meat',  inventoryEmoji: '🍖', sellPrice: 11 },
];
