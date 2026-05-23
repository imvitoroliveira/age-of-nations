import React, { useState, useMemo } from 'react';
import { TileState } from '@/types/game';
import { CROPS } from '@/data/crops';
import { useGameStore, getExpansionCost, GRID_COLS } from '@/store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CropSVG } from './svg/CropSVG';
import { BarnSVG, WellSVG, TreeSVG } from './svg/BuildingSVG';

interface Props {
  tile: TileState;
  index: number;
  onTileClick: (index: number) => void;
  tick: number;
}

// Detailed grass SVG with blades and daisy
const GrassTileSVG = React.memo(() => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 72 72" preserveAspectRatio="none">
    <rect width="72" height="72" fill="#5BBD2E" />
    <ellipse cx="20" cy="50" rx="12" ry="8" fill="#4CAF50" opacity={0.4} />
    <ellipse cx="55" cy="30" rx="10" ry="6" fill="#4CAF50" opacity={0.3} />
    {/* Grass blades */}
    <path d="M15,60 Q13,48 16,42" stroke="#388E3C" strokeWidth="2" fill="none" />
    <path d="M18,60 Q20,46 17,40" stroke="#43A047" strokeWidth="2" fill="none" />
    <path d="M52,62 Q50,50 53,44" stroke="#388E3C" strokeWidth="2" fill="none" />
    <path d="M55,62 Q57,48 54,42" stroke="#43A047" strokeWidth="2" fill="none" />
    {/* Small daisy */}
    <circle cx="38" cy="55" r="3" fill="#FFEE58" />
    <circle cx="38" cy="55" r="1.5" fill="#FFA000" />
  </svg>
));

// Detailed soil SVG with diagonal furrow lines
const SoilTileSVG = React.memo(({ watered }: { watered?: boolean }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 72 72" preserveAspectRatio="none">
    <rect width="72" height="72" fill={watered ? '#4E342E' : '#6D4C41'} />
    {/* Diagonal furrow lines */}
    <line x1="0" y1="18" x2="18" y2="0" stroke="#4E342E" strokeWidth="1.5" opacity={0.7} />
    <line x1="0" y1="36" x2="36" y2="0" stroke="#4E342E" strokeWidth="1.5" opacity={0.7} />
    <line x1="0" y1="54" x2="54" y2="0" stroke="#4E342E" strokeWidth="1.5" opacity={0.7} />
    <line x1="0" y1="72" x2="72" y2="0" stroke="#4E342E" strokeWidth="1.5" opacity={0.7} />
    <line x1="18" y1="72" x2="72" y2="18" stroke="#4E342E" strokeWidth="1.5" opacity={0.7} />
    <line x1="36" y1="72" x2="72" y2="36" stroke="#4E342E" strokeWidth="1.5" opacity={0.7} />
    <line x1="54" y1="72" x2="72" y2="54" stroke="#4E342E" strokeWidth="1.5" opacity={0.7} />
    {/* Highlight top-left */}
    <rect width="72" height="72" fill="white" opacity={0.06} rx="0" />
    <rect width="30" height="30" fill="white" opacity={0.04} />
    {watered && (
      <>
        <rect width="72" height="72" fill="#1565C0" opacity={0.1} />
        {/* Moisture shine line */}
        <rect x="0" y="32" width="72" height="3" fill="white" opacity={0.1} rx="1" />
        {/* Water droplet */}
        <path d="M60 8 Q62 4 64 8 Q64 11 62 11 Q60 11 60 8" fill="#42A5F5" opacity={0.5} />
      </>
    )}
  </svg>
));

const TileComponent = ({ tile, index, onTileClick, tick }: Props) => {
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
        className="relative flex items-center justify-center cursor-pointer group overflow-hidden"
        style={{ width: 72, height: 72 }}
        title={`🪙 ${cost} para desbloquear`}
      >
        {/* Semi-transparent grass underneath */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 72 72">
          <rect width="72" height="72" fill="#5BBD2E" opacity={0.3} />
          <ellipse cx="30" cy="45" rx="10" ry="7" fill="#4CAF50" opacity={0.2} />
        </svg>
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-200" />
        <div className="relative flex flex-col items-center gap-0.5">
          <span className="text-lg opacity-50 group-hover:opacity-80 transition-opacity">🔒</span>
          <span className="text-[8px] text-yellow-300/0 group-hover:text-yellow-300/80 transition-colors"
            style={{ fontFamily: "'Fredoka One', cursive" }}>
            {cost}🪙
          </span>
        </div>
        {/* Depth edges */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/20" />
        <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-black/15" />
      </button>
    );
  }

  // Deco tile (barn, well, trees)
  if (tile.type === 'deco') {
    const isBarn = tile.decoEmoji === '🏠';
    const isWell = tile.decoEmoji === '💧';
    const isTree = tile.decoEmoji === '🌳';
    return (
      <div className="relative flex items-center justify-center select-none cursor-default overflow-hidden"
        onClick={() => onTileClick(index)}
        style={{ width: 72, height: 72 }}>
        <GrassTileSVG />
        {isBarn && tile.decoLabel && <BarnSVG size={68} />}
        {isBarn && !tile.decoLabel && <div />}
        {isWell && <WellSVG size={48} />}
        {isTree && <TreeSVG size={44} hasApples={false} />}
        {!isBarn && !isWell && !isTree && tile.decoEmoji && (
          <span className="text-2xl z-10">{tile.decoEmoji}</span>
        )}
        {tile.decoLabel && (
          <span className="absolute bottom-0.5 text-[7px] font-bold text-white/90 drop-shadow z-10"
            style={{ fontFamily: "'Fredoka One', cursive" }}>
            {tile.decoLabel}
          </span>
        )}
        {/* Depth edges */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/15" />
        <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-black/08" />
      </div>
    );
  }

  // Grass / Soil / Planted tiles
  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.04, filter: 'brightness(1.12)' }}
      whileTap={{ scale: 0.96 }}
      className="relative flex flex-col items-center justify-center transition-all duration-150 cursor-pointer group overflow-hidden"
      style={{
        width: 72,
        height: 72,
        boxShadow: isReady ? '0 0 12px #FFD700, inset 0 0 8px rgba(255,215,0,0.3)' : 'none',
      }}
    >
      {/* Tile background SVG */}
      {tile.type === 'grass' && <GrassTileSVG />}
      {(tile.type === 'soil' || tile.type === 'planted') && <SoilTileSVG watered={tile.watered} />}

      {/* Depth edges */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/15 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-black/08 pointer-events-none" />

      {tile.type === 'grass' && (
        <span className="text-white/0 group-hover:text-white/60 transition-colors font-bold z-10 text-lg"
          style={{ fontFamily: "'Fredoka One', cursive" }}>+</span>
      )}

      {tile.type === 'soil' && (
        <span className="text-white/20 text-sm select-none z-10">···</span>
      )}

      {tile.type === 'planted' && crop && (
        <>
          <motion.div className="z-10"
            animate={isReady ? { scale: [1, 1.15, 1], rotate: [0, 3, -3, 0] } : {}}
            transition={isReady ? { repeat: Infinity, duration: 1 } : {}}
          >
            <CropSVG cropKey={tile.cropKey!} stage={stage} size={36} />
          </motion.div>
          {/* Progress bar */}
          <div className="absolute bottom-[4px] left-[12%] right-[12%] h-[4px] rounded-sm bg-black/30 overflow-hidden z-10">
            <div className="h-full rounded-sm transition-[width] duration-300"
              style={{
                width: `${Math.min(100, progress * 100)}%`,
                background: progress < 0.4 ? 'linear-gradient(90deg, #FF8F00, #FFB300)'
                  : progress < 0.9 ? 'linear-gradient(90deg, #FFD54F, #FFEB3B)'
                  : 'linear-gradient(90deg, #66BB6A, #81C784)',
              }}
            />
          </div>
        </>
      )}

      {/* Ready glow */}
      {isReady && !harvesting && (
        <motion.div className="absolute inset-0 pointer-events-none z-0"
          animate={{ opacity: [0.15, 0.4, 0.15] }}
          transition={{ repeat: Infinity, duration: 1 }}
          style={{ boxShadow: 'inset 0 0 16px rgba(255,215,0,0.5)' }}
        />
      )}

      {/* Harvest particles */}
      <AnimatePresence>
        {harvesting && (
          <>
            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
              const angle = (i / 8) * Math.PI * 2;
              const isLeaf = i % 2 === 0;
              return (
                <motion.div key={`s-${i}`} className="absolute w-2.5 h-2.5 rounded-full z-20"
                  style={{ background: isLeaf ? '#66BB6A' : '#FFD700', left: '50%', top: '50%' }}
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{ x: Math.cos(angle) * 35, y: Math.sin(angle) * 35 + (isLeaf ? 0 : -20), scale: 0, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              );
            })}
            {[0, 1, 2].map(i => (
              <motion.div key={`smoke-${i}`} className="absolute rounded-full z-20"
                style={{ width: 10, height: 10, background: '#9E9E9E', left: `${35 + i * 12}%`, top: '35%', opacity: 0.5 }}
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: [0, 1.5, 0], opacity: [0.5, 0.3, 0], y: -15 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              />
            ))}
          </>
        )}
        {ripple && (
          <motion.div className="absolute inset-0 rounded pointer-events-none z-20"
            initial={{ opacity: 0.5, scale: 0.5 }}
            animate={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.4 }}
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3), transparent 70%)' }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export const Tile = React.memo(TileComponent);
