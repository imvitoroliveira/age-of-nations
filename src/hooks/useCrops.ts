import { useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { CROPS } from '@/data/crops';

export function useCrops() {
  const { grid, setTile, addCoins, addNotification, selectedCrop, setSelectedCrop, coins } = useGameStore();

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

    const progress = tile.plantedAt ? (Date.now() - tile.plantedAt) / crop.growTime : 0;
    if (progress < 1) return false;

    addCoins(crop.reward);
    setTile(index, { type: 'soil', cropKey: undefined, plantedAt: undefined, watered: false });
    addNotification(`+${crop.reward} 🪙`, 'harvest');
    return true;
  }, [grid]);

  const waterAll = useCallback(() => {
    const store = useGameStore.getState();
    const newGrid = store.grid.map(tile => {
      if (tile.type === 'planted' && !tile.watered) {
        // Speed up by 20%: reduce plantedAt
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

  const getCropProgress = (tile: typeof grid[0]) => {
    if (tile.type !== 'planted' || !tile.cropKey || !tile.plantedAt) return 0;
    const crop = CROPS[tile.cropKey];
    if (!crop) return 0;
    const isNight = useGameStore.getState().timeOfDay >= 0.85 || useGameStore.getState().timeOfDay < 0.05;
    if (isNight) return Math.min(1, (Date.now() - tile.plantedAt) / crop.growTime); // frozen display
    return Math.min(1, (Date.now() - tile.plantedAt) / crop.growTime);
  };

  const getCropStage = (progress: number) => {
    if (progress < 0.4) return 0;
    if (progress < 0.9) return 1;
    return 2;
  };

  return { plantCrop, harvestCrop, waterAll, getCropProgress, getCropStage, selectedCrop, setSelectedCrop };
}
