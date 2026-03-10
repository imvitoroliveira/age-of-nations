import { CropDef } from '@/types/game';

export const CROPS: Record<string, CropDef> = {
  wheat:   { name: "Trigo",    stages: ["🌱","🌿","🌾"], growTime: 8000,  reward: 5,  cost: 2  },
  corn:    { name: "Milho",    stages: ["🌱","🌽","🌽"], growTime: 14000, reward: 10, cost: 4  },
  carrot:  { name: "Cenoura",  stages: ["🌱","🥕","🥕"], growTime: 6000,  reward: 4,  cost: 2  },
  tomato:  { name: "Tomate",   stages: ["🌱","🍅","🍅"], growTime: 12000, reward: 8,  cost: 3  },
  pumpkin: { name: "Abóbora",  stages: ["🌱","🎃","🎃"], growTime: 20000, reward: 18, cost: 8  },
  berry:   { name: "Morango",  stages: ["🌱","🍓","🍓"], growTime: 10000, reward: 12, cost: 5  },
};
