import { useGameStore } from '@/store/gameStore';
import { Tile } from './Tile';
import { Animal } from './Animal';
import { useCrops } from '@/hooks/useCrops';
import { ANIMAL_DEFS } from '@/data/animals';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const GRID_COLS = 8;
const GRID_ROWS = 6;

export const FarmGrid = () => {
  const { grid, animals, activeTool, selectedCrop, setTile, addNotification } = useGameStore();
  const { plantCrop, harvestCrop, waterAll } = useCrops();
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  
  // Tick counter to force Tile re-renders for real-time progress bars
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 200);
    return () => clearInterval(interval);
  }, []);

  const handleTileClick = (index: number) => {
    const tile = grid[index];

    if (tile.type === 'deco') {
      if (tile.decoEmoji === '💧') {
        waterAll();
      }
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
      if (!success) {
        addNotification('Ainda crescendo... ⏳', 'info');
      }
      return;
    }

    if (tile.type === 'soil' && !selectedCrop) {
      addNotification('Selecione uma semente na loja primeiro! 🌱', 'info');
    }
  };

  const handleAnimalClick = (animalId: string) => {
    const animal = animals.find(a => a.id === animalId);
    if (!animal) return;
    const def = ANIMAL_DEFS.find(a => a.id === animal.defId);
    if (!def) return;
    const timeLeft = Math.max(0, def.produceEvery - (Date.now() - animal.lastProduce));
    const secs = Math.ceil(timeLeft / 1000);
    setTooltip({
      x: (animal.x / 640) * 100,
      y: (animal.y / 480) * 100 - 10,
      text: `${def.emoji} ${def.name}\n${def.produce}\nPróximo: ${secs}s`,
    });
    setTimeout(() => setTooltip(null), 3000);
  };

  return (
    <div className="relative w-full" style={{ aspectRatio: '8/6' }}>
      {/* Grid */}
      <div className="absolute inset-0 grid gap-px"
        style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`, gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)` }}>
        {grid.map((tile, i) => (
          <Tile key={i} tile={tile} index={i} onTileClick={handleTileClick} tick={tick} />
        ))}
      </div>

      {/* Animals overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {animals.map(animal => (
          <div key={animal.id} className="pointer-events-auto">
            <Animal
              animal={animal}
              onClick={() => handleAnimalClick(animal.id)}
              farmWidth={640}
              farmHeight={480}
            />
          </div>
        ))}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute z-50 px-3 py-2 rounded-xl text-xs font-bold text-white pointer-events-none"
            style={{
              left: `${tooltip.x}%`,
              top: `${tooltip.y}%`,
              background: 'rgba(20, 10, 5, 0.9)',
              border: '2px solid #7a5c2e',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '8px',
              lineHeight: '1.6',
              whiteSpace: 'pre-line',
              transform: 'translateX(-50%)',
            }}
          >
            {tooltip.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
