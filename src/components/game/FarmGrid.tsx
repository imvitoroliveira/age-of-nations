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
      {/* Path borders between tiles */}
      <div className="grid"
        style={{
          gridTemplateColumns: `repeat(${GRID_COLS}, clamp(40px, 5vw, 64px))`,
          gridTemplateRows: `repeat(${GRID_ROWS}, clamp(40px, 5vw, 64px))`,
          gap: '3px',
          background: '#8D6E63',
          padding: '3px',
        }}>
        {grid.map((tile, i) => (
          <Tile key={i} tile={tile} index={i} onTileClick={handleTileClick} tick={tick} />
        ))}
      </div>

      {/* Path intersection dots */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1]" style={{ opacity: 0.3 }}>
        {/* Render dots at grid intersections would be here, but CSS gap handles the paths */}
      </svg>

      {/* Unlock confirm modal */}
      {confirmUnlock && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmUnlock(null)} />
          <div className="relative rounded-2xl p-6 max-w-xs text-center"
            style={{
              background: 'linear-gradient(180deg, #795548, #5D4037)',
              border: '3px solid #FFD700',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}>
            <p className="text-white text-sm mb-4" style={{ fontFamily: "'Fredoka One', cursive" }}>
              Comprar este terreno por {confirmUnlock.cost} 🪙?
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmUnlock(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white/60 text-xs hover:bg-white/20 transition-colors"
                style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
                Cancelar
              </button>
              <button onClick={handleConfirmUnlock}
                disabled={coins < confirmUnlock.cost}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  coins >= confirmUnlock.cost
                    ? 'text-white hover:brightness-110'
                    : 'bg-white/10 text-white/30'
                }`}
                style={{
                  ...(coins >= confirmUnlock.cost ? {
                    background: 'linear-gradient(135deg, #FFD700, #FFA000)',
                    boxShadow: '0 2px 8px rgba(255,215,0,0.3)',
                  } : {}),
                  fontFamily: "'Fredoka One', cursive",
                }}>
                ✅ Comprar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
