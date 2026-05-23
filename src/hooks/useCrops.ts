import { useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { CROPS } from '@/data/crops';

export function useCrops() {
  const { grid, setTile, addCoins, addXP, addNotification, addToInventory, selectedCrop, setSelectedCrop, coins } = useGameStore();

  const plantCrop = useCallback((index: number) => {
    if (!selectedCrop) return false;
    const crop = CROPS[selectedCrop];
    if (!crop || coins < crop.cost) return false;
    const tile = grid[index];
    if (tile.type !== 'soil') return false;

    addCoins(-crop.cost);
    setTile(index, { type: 'planted', cropKey: selectedCrop, plantedAt: Date.now(), watered: false });
    return true;
  }, [selectedCrop, grid, coins]);

  const harvestCrop = useCallback((index: number) => {
    const tile = grid[index];
    if (!tile.cropKey) return false;
    const crop = CROPS[tile.cropKey];
    if (!crop) return false;

    const timeOfDay = useGameStore.getState().timeOfDay;
    const weather = useGameStore.getState().weather;
    const isNight = timeOfDay >= 0.75;
    
    let effectiveGrowTime = crop.growTime;
    if (weather === 'rainy' && !isNight) effectiveGrowTime /= 2;
    
    const progress = tile.plantedAt ? (Date.now() - tile.plantedAt) / effectiveGrowTime : 0;
    if (progress < 1) return false;

    // Add to inventory instead of coins directly
    addToInventory(crop.inventoryKey, 1);
    addXP(Math.ceil(crop.reward / 2));
    setTile(index, { type: 'soil', cropKey: undefined, plantedAt: undefined, watered: false });
    addNotification(`${crop.inventoryEmoji} ${crop.name} colhido! (+XP)`, 'harvest');
    return true;
  }, [grid]);

  const waterAll = useCallback(() => {
    const store = useGameStore.getState();
    const newGrid = store.grid.map(tile => {
      if (tile.type === 'planted' && !tile.watered) {
        const cropDef = tile.cropKey ? CROPS[tile.cropKey] : null;
        if (cropDef && tile.plantedAt) {
          const boost = cropDef.growTime * 0.2;
          return { ...tile, watered: true, plantedAt: tile.plantedAt - boost };
        }
      }
      return tile;
    });
    store.setGrid(newGrid);
    addNotification('💧 Plantações regadas!', 'info');
  }, []);

  return { plantCrop, harvestCrop, waterAll, selectedCrop, setSelectedCrop };
}
