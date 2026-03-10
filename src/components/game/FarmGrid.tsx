import { useGameStore, GRID_COLS, GRID_ROWS, getExpansionCost } from '@/store/gameStore';
import { Tile } from './Tile';
import { useCrops } from '@/hooks/useCrops';
import { useState, useEffect } from 'react';

export const FarmGrid = () => {
  const { grid, activeTool, selectedCrop, setTile, addNotification, unlockTile, coins } = useGameStore();
  const { plantCrop, harvestCrop, waterAll } = useCrops();
  const [tick, setTick] = useState(0);
  const [confirmUnlock, setConfirmUnlock] = useState<{ index: number; cost: number } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 200);
    return () => clearInterval(interval);
  }, []);

  const handleTileClick = (index: number) => {
    const tile = grid[index];

    if (tile.type === 'locked') {
      const col = index % GRID_COLS;
      const row = Math.floor(index / GRID_COLS);
      const cost = getExpansionCost(col, row);
      setConfirmUnlock({ index, cost });
      return;
    }

    if (tile.type === 'deco') {
      if (tile.decoEmoji === '💧') waterAll();
      return;
    }

    if (tile.type === 'grass') {
      setTile(index, { type: 'soil' });
      return;
    }

    if (tile.type === 'soil' && activeTool === 'plant' && selectedCrop) {
      plantCrop(index);
      return;
    }

    if (tile.type === 'planted') {
      const success = harvestCrop(index);
      if (!success) addNotification('Ainda crescendo... ⏳', 'info');
      return;
    }

    if (tile.type === 'soil' && !selectedCrop) {
      addNotification('Selecione uma semente na loja! 🌱', 'info');
    }
  };

  const handleConfirmUnlock = () => {
    if (!confirmUnlock) return;
    if (coins < confirmUnlock.cost) {
      addNotification('Moedas insuficientes! 💰', 'info');
    } else {
      unlockTile(confirmUnlock.index);
      addNotification('🎉 Novo terreno!', 'info');
    }
    setConfirmUnlock(null);
  };

  return (
    <div className="relative">
      <div className="grid gap-px"
        style={{
          gridTemplateColumns: `repeat(${GRID_COLS}, clamp(32px, 5vw, 64px))`,
          gridTemplateRows: `repeat(${GRID_ROWS}, clamp(32px, 5vw, 64px))`,
        }}>
        {grid.map((tile, i) => (
          <Tile key={i} tile={tile} index={i} onTileClick={handleTileClick} tick={tick} />
        ))}
      </div>

      {/* Unlock confirm modal */}
      {confirmUnlock && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmUnlock(null)} />
          <div className="relative rounded-2xl p-5 max-w-xs text-center"
            style={{
              background: 'rgba(20, 10, 5, 0.95)',
              border: '3px solid #7a5c2e',
              fontFamily: "'Press Start 2P', monospace",
            }}>
            <p className="text-white text-[9px] mb-4">
              Comprar este terreno por {confirmUnlock.cost} 🪙?
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmUnlock(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white/60 text-[8px] hover:bg-white/20">
                Cancelar
              </button>
              <button onClick={handleConfirmUnlock}
                disabled={coins < confirmUnlock.cost}
                className={`px-4 py-2 rounded-xl text-[8px] font-bold ${
                  coins >= confirmUnlock.cost ? 'bg-amber-600 text-white hover:bg-amber-500' : 'bg-white/10 text-white/30'
                }`}>
                ✅ Comprar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
