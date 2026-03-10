import { useState, useEffect } from 'react';
import { TileState } from '@/types/game';
import { CROPS } from '@/data/crops';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  tile: TileState;
  index: number;
  onTileClick: (index: number) => void;
  tick: number; // external tick to force progress re-calc
}

export const Tile = ({ tile, index, onTileClick, tick }: Props) => {
  const [harvesting, setHarvesting] = useState(false);
  const crop = tile.cropKey ? CROPS[tile.cropKey] : null;

  // Compute progress live
  let progress = 0;
  let stage = 0;
  if (tile.type === 'planted' && crop && tile.plantedAt) {
    progress = Math.min(1, (Date.now() - tile.plantedAt) / crop.growTime);
    stage = progress < 0.4 ? 0 : progress < 0.9 ? 1 : 2;
  }
  const isReady = tile.type === 'planted' && progress >= 1;

  const handleClick = () => {
    if (isReady) {
      setHarvesting(true);
      setTimeout(() => {
        setHarvesting(false);
        onTileClick(index);
      }, 400);
    } else {
      onTileClick(index);
    }
  };

  if (tile.type === 'deco') {
    return (
      <div className="relative flex items-center justify-center select-none cursor-default"
        onClick={() => onTileClick(index)}
        style={{
          background: 'radial-gradient(circle, hsl(120 40% 50% / 0.3), hsl(120 40% 40% / 0.2))',
        }}>
        <span className="text-2xl md:text-3xl drop-shadow-md">{tile.decoEmoji}</span>
        {tile.decoLabel && (
          <span className="absolute bottom-0 text-[7px] font-bold text-white/80 drop-shadow"
            style={{ fontFamily: "'Press Start 2P', monospace" }}>
            {tile.decoLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.03, filter: 'brightness(1.25)' }}
      whileTap={{ scale: 0.97 }}
      className="relative flex flex-col items-center justify-center transition-all duration-150 cursor-pointer group overflow-hidden"
      style={{
        background: tile.type === 'grass'
          ? 'radial-gradient(circle, hsl(120 50% 55%), hsl(120 45% 45%))'
          : 'radial-gradient(circle, hsl(30 40% 45%), hsl(30 35% 35%))',
        boxShadow: isReady ? '0 0 14px #FFD700, inset 0 0 10px rgba(255,215,0,0.4)' : 'none',
      }}
    >
      {/* Grass hover */}
      {tile.type === 'grass' && (
        <span className="text-white/0 group-hover:text-white/60 text-xl transition-colors font-bold">+</span>
      )}

      {/* Soil dots */}
      {tile.type === 'soil' && (
        <span className="text-white/30 text-xs select-none">···</span>
      )}

      {/* Planted crop */}
      {tile.type === 'planted' && crop && (
        <>
          <motion.span
            className="text-xl md:text-2xl drop-shadow"
            animate={isReady ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
            transition={isReady ? { repeat: Infinity, duration: 0.8 } : {}}
          >
            {crop.stages[stage]}
          </motion.span>
          {/* Progress bar */}
          <div className="absolute bottom-0.5 left-1 right-1 h-1.5 rounded-full bg-black/30 overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-300"
              style={{
                width: `${Math.min(100, progress * 100)}%`,
                background: progress < 0.4
                  ? 'linear-gradient(90deg, #f97316, #fb923c)'
                  : progress < 0.9
                    ? 'linear-gradient(90deg, #eab308, #facc15)'
                    : 'linear-gradient(90deg, #22c55e, #4ade80)',
              }}
            />
          </div>
        </>
      )}

      {/* Ready glow pulse */}
      {isReady && !harvesting && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          style={{ boxShadow: 'inset 0 0 24px rgba(255,215,0,0.6)' }}
        />
      )}

      {/* Harvest sparkle burst */}
      <AnimatePresence>
        {harvesting && (
          <>
            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
              const angle = (i / 8) * Math.PI * 2;
              return (
                <motion.div
                  key={`spark-${i}`}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: i % 2 === 0 ? '#FFD700' : '#FFA500',
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{
                    x: Math.cos(angle) * 35,
                    y: Math.sin(angle) * 35,
                    scale: 0,
                    opacity: 0,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              );
            })}
            <motion.div
              className="absolute inset-0 rounded pointer-events-none"
              initial={{ opacity: 1, scale: 0.5 }}
              animate={{ opacity: 0, scale: 2 }}
              transition={{ duration: 0.4 }}
              style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.8), transparent 70%)' }}
            />
          </>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
