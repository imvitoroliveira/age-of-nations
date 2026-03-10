import { useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { ANIMAL_DEFS } from '@/data/animals';
import { AnimalState } from '@/types/game';

const PASTURE_W = 680;
const PASTURE_H = 130;
const MAX_ANIMALS = 8;

export function useAnimals() {
  const { animals, addAnimal, addNotification, coins } = useGameStore();

  const buyAnimal = useCallback((defId: string) => {
    const store = useGameStore.getState();
    const def = ANIMAL_DEFS.find(a => a.id === defId);
    if (!def || store.coins < def.cost) return false;
    if (store.animals.length >= MAX_ANIMALS) {
      addNotification('Máximo de 8 animais!', 'info');
      return false;
    }

    const animal: AnimalState = {
      id: crypto.randomUUID(),
      defId,
      x: 50 + Math.random() * (PASTURE_W - 100),
      y: 20 + Math.random() * (PASTURE_H - 50),
      targetX: 100 + Math.random() * (PASTURE_W - 200),
      targetY: 20 + Math.random() * 70,
      state: 'idle',
      lastProduce: Date.now(),
      nextMoveAt: Date.now() + 2000,
      facingLeft: false,
      boughtAt: Date.now(),
    };

    addAnimal(animal);
    store.addCoins(-def.cost);
    addNotification(`${def.emoji} ${def.name} comprado(a)!`, 'info');
    return true;
  }, [coins]);

  const updateAnimalPositions = useCallback((deltaTime: number) => {
    const store = useGameStore.getState();
    const now = Date.now();
    const isNight = store.timeOfDay >= 0.75;
    const speedMult = isNight ? 0.5 : 1;

    const updated = store.animals.map(animal => {
      const def = ANIMAL_DEFS.find(a => a.id === animal.defId);
      if (!def) return animal;

      let { x, y, targetX, targetY, state, nextMoveAt, facingLeft, lastProduce } = animal;

      // Check produce
      if (now - lastProduce >= def.produceEvery) {
        store.addFloatingProduce({
          id: crypto.randomUUID(),
          animalId: animal.id,
          emoji: def.inventoryEmoji,
          inventoryKey: def.inventoryKey,
          x: x,
          createdAt: now,
        });
        addNotification(`${def.produce} pronto!`, 'produce');
        lastProduce = now;
      }

      // Movement
      if (now >= nextMoveAt && state === 'idle') {
        targetX = Math.max(20, Math.min(PASTURE_W - 60, 50 + Math.random() * (PASTURE_W - 100)));
        targetY = Math.max(15, Math.min(PASTURE_H - 40, 15 + Math.random() * 80));
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

      // Repulsion
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

      x = Math.max(10, Math.min(PASTURE_W - 30, x));
      y = Math.max(15, Math.min(PASTURE_H - 30, y));

      return { ...animal, x, y, targetX, targetY, state, nextMoveAt, facingLeft, lastProduce };
    });

    // Clean expired floating produce (30s)
    store.floatingProduce.filter(f => now - f.createdAt >= 30000).forEach(f => store.removeFloatingProduce(f.id));

    store.setAnimals(updated);
  }, []);

  return { buyAnimal, updateAnimalPositions, animals, maxAnimals: MAX_ANIMALS };
}
