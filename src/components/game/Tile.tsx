import { useState } from 'react';
import { TileState } from '@/types/game';
import { CROPS } from '@/data/crops';
import { useGameStore, getExpansionCost, GRID_COLS } from '@/store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  tile: TileState;
  index: number;
  onTileClick: (index: number) => void;
  tick: number;
}

export const Tile = ({ tile, index, onTileClick, tick }: Props) => {
  const [harvesting, setHarvesting] = useState(false);
  const [ripple, setRipple] = useState(false);
  const weather = useGameStore(s => s.weather);
  const timeOfDay = useGameStore(s => s.timeOfDay);
  const crop = tile.cropKey ? CROPS[tile.cropKey] : null;

  const isNight = timeOfDay >= 0.75;
  let progress = 0;
  let stage = 0;
  if (tile.type === 'planted' && crop && tile.plantedAt) {
    let effectiveGrowTime = crop.growTime;
    if (weather === 'rainy' && !isNight) effectiveGrowTime /= 2;
    // Pause at night: don't count night time
    progress = Math.min(1, (Date.now() - tile.plantedAt) / effectiveGrowTime);
    stage = progress < 0.4 ? 0 : progress < 0.9 ? 1 : 2;
  }
  const isReady = tile.type === 'planted' && progress >= 1;

  const handleClick = () => {
    setRipple(true);
    setTimeout(() => setRipple(false), 400);
    if (isReady) {
      setHarvesting(true);
      setTimeout(() => { setHarvesting(false); onTileClick(index); }, 400);
    } else {
      onTileClick(index);
    }
  };

  // Locked tile
  if (tile.type === 'locked') {
    const col = index % GRID_COLS;
    const row = Math.floor(index / GRID_COLS);
    const cost = getExpansionCost(col, row);
    return (
      <button
        onClick={handleClick}
        className="relative flex items-center justify-center cursor-pointer group"
        style={{ background: 'rgba(90, 120, 60, 0.4)' }}
        title={`🪙 ${cost} para desbloquear`}
      >
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
        <span className="relative text-sm opacity-70 group-hover:opacity-100 transition-opacity">🔒</span>
        <span className="absolute bottom-0 text-[6px] text-yellow-300/0 group-hover:text-yellow-300/90 transition-colors"
          style={{ fontFamily: "'Press Start 2P', monospace" }}>
          {cost}🪙
        </span>
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-400/50 transition-colors pointer-events-none" />
      </button>
    );
  }

  if (tile.type === 'deco') {
    const isBarn = tile.decoEmoji === '🏠';
    return (
      <div className="relative flex items-center justify-center select-none cursor-default"
        onClick={() => onTileClick(index)}
        style={{ background: 'radial-gradient(circle, hsl(120 40% 50% / 0.3), hsl(120 40% 40% / 0.2))', fontSize: isBarn ? 'clamp(20px, 2.5vw, 36px)' : 'clamp(18px, 2vw, 28px)' }}>
        <span className="drop-shadow-md">{tile.decoEmoji}</span>
        {tile.decoLabel && (
          <span className="absolute bottom-0 text-[6px] font-bold text-white/80 drop-shadow"
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
        boxShadow: isReady ? '0 0 10px #FFD700, inset 0 0 8px rgba(255,215,0,0.4)' : 'none',
      }}
    >
      {tile.type === 'grass' && (
        <span className="text-white/0 group-hover:text-white/60 transition-colors font-bold" style={{ fontSize: 'clamp(12px, 1.5vw, 18px)' }}>+</span>
      )}
      {tile.type === 'soil' && (
        <span className="text-white/30 text-[8px] select-none">···</span>
      )}
      {tile.type === 'planted' && crop && (
        <>
          <motion.span
            style={{ fontSize: 'clamp(14px, 1.8vw, 22px)' }}
            className="drop-shadow"
            animate={isReady ? { scale: [1, 1.15, 1], rotate: [0, 4, -4, 0] } : {}}
            transition={isReady ? { repeat: Infinity, duration: 0.8 } : {}}
          >
            {crop.stages[stage]}
          </motion.span>
          <div className="absolute bottom-0.5 left-[10%] right-[10%] h-[3px] rounded-sm bg-black/30 overflow-hidden">
            <div className="h-full rounded-sm transition-[width] duration-300"
              style={{
                width: `${Math.min(100, progress * 100)}%`,
                background: progress < 0.4 ? 'linear-gradient(90deg, #f97316, #fb923c)'
                  : progress < 0.9 ? 'linear-gradient(90deg, #eab308, #facc15)'
                  : 'linear-gradient(90deg, #22c55e, #4ade80)',
              }}
            />
          </div>
        </>
      )}
      {isReady && !harvesting && (
        <motion.div className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          style={{ boxShadow: 'inset 0 0 16px rgba(255,215,0,0.5)' }}
        />
      )}
      <AnimatePresence>
        {harvesting && (
          <>
            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
              const angle = (i / 8) * Math.PI * 2;
              return (
                <motion.div key={`s-${i}`} className="absolute w-1.5 h-1.5 rounded-full"
                  style={{ background: i % 2 === 0 ? '#FFD700' : '#FFA500', left: '50%', top: '50%' }}
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{ x: Math.cos(angle) * 25, y: Math.sin(angle) * 25, scale: 0, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              );
            })}
          </>
        )}
        {ripple && (
          <motion.div className="absolute inset-0 rounded pointer-events-none"
            initial={{ opacity: 0.6, scale: 0.5 }}
            animate={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.4 }}
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4), transparent 70%)' }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};
