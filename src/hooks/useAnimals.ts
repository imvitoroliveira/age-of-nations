import { useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { ANIMAL_DEFS } from '@/data/animals';
import { AnimalState } from '@/types/game';

const FARM_W = 640;
const FARM_H = 480;

export function useAnimals() {
  const { animals, addAnimal, addCoins, addNotification, coins, setAnimals } = useGameStore();

  const buyAnimal = useCallback((defId: string) => {
    const def = ANIMAL_DEFS.find(a => a.id === defId);
    if (!def || coins < def.cost) return false;

    const animal: AnimalState = {
      id: crypto.randomUUID(),
      defId,
      x: 60 + Math.random() * 80,
      y: 60 + Math.random() * 80,
      targetX: 100 + Math.random() * 200,
      targetY: 100 + Math.random() * 200,
      state: 'idle',
      lastProduce: Date.now(),
      nextMoveAt: Date.now() + 2000,
      facingLeft: false,
    };

    addAnimal(animal);
    useGameStore.getState().addCoins(-def.cost);
    addNotification(`${def.emoji} ${def.name} comprado(a)!`, 'info');
    return true;
  }, [coins]);

  const updateAnimalPositions = useCallback((deltaTime: number) => {
    const store = useGameStore.getState();
    const now = Date.now();
    const isNight = store.timeOfDay >= 0.85 || store.timeOfDay < 0.05;
    const speedMult = isNight ? 0.5 : 1;
    const isRainy = store.weather === 'rainy';

    const updated = store.animals.map(animal => {
      const def = ANIMAL_DEFS.find(a => a.id === animal.defId);
      if (!def) return animal;

      let { x, y, targetX, targetY, state, nextMoveAt, facingLeft, lastProduce } = animal;

      // Check produce
      if (now - lastProduce >= def.produceEvery) {
        store.addCoins(def.reward);
        store.addNotification(`${def.produce} +${def.reward} 🪙`, 'produce');
        lastProduce = now;
      }

      // Movement
      if (now >= nextMoveAt && state === 'idle') {
        const centerX = isNight ? FARM_W * 0.15 : FARM_W * 0.5;
        const centerY = isNight ? FARM_H * 0.15 : FARM_H * 0.5;
        const range = isNight ? 80 : FARM_W * 0.4;
        targetX = Math.max(20, Math.min(FARM_W - 40, centerX + (Math.random() - 0.5) * range * 2));
        targetY = Math.max(20, Math.min(FARM_H - 40, centerY + (Math.random() - 0.5) * range * 2));
        state = 'walking';
      }

      if (state === 'walking') {
        const dx = targetX - x;
        const dy = targetY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 5) {
          state = 'idle';
          nextMoveAt = now + 2000 + Math.random() * 4000;
        } else {
          const speed = def.speed * speedMult * 60 * (deltaTime / 1000);
          x += (dx / dist) * speed;
          y += (dy / dist) * speed;
          facingLeft = dx < 0;
        }
      }

      // Simple repulsion
      for (const other of store.animals) {
        if (other.id === animal.id) continue;
        const rdx = x - other.x;
        const rdy = y - other.y;
        const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
        if (rdist < 40 && rdist > 0) {
          x += (rdx / rdist) * 1.5;
          y += (rdy / rdist) * 1.5;
        }
      }

      x = Math.max(10, Math.min(FARM_W - 20, x));
      y = Math.max(10, Math.min(FARM_H - 20, y));

      return { ...animal, x, y, targetX, targetY, state, nextMoveAt, facingLeft, lastProduce };
    });

    store.setAnimals(updated);
  }, []);

  return { buyAnimal, updateAnimalPositions, animals };
}
