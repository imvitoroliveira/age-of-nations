import { useState } from 'react';
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

// SVG grass blades for grass tiles
const GrassBlades = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 40 40" preserveAspectRatio="none">
    <path d="M8 38 Q7 32 9 28" stroke="#388E3C" strokeWidth="1" fill="none" opacity={0.6} />
    <path d="M15 38 Q14 30 16 26" stroke="#2E7D32" strokeWidth="1" fill="none" opacity={0.5} />
    <path d="M25 38 Q26 33 24 29" stroke="#388E3C" strokeWidth="1" fill="none" opacity={0.5} />
    <path d="M33 38 Q32 34 34 30" stroke="#43A047" strokeWidth="1" fill="none" opacity={0.4} />
    <circle cx="30" cy="34" r="2" fill="#FFEB3B" opacity={0.3} />
  </svg>
);

// SVG furrow lines for soil tiles
const SoilTexture = ({ watered }: { watered?: boolean }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 40 40" preserveAspectRatio="none">
    <line x1="4" y1="10" x2="36" y2="14" stroke="#4E342E" strokeWidth="1" opacity={0.5} />
    <line x1="4" y1="18" x2="36" y2="22" stroke="#4E342E" strokeWidth="1" opacity={0.4} />
    <line x1="4" y1="26" x2="36" y2="30" stroke="#4E342E" strokeWidth="1" opacity={0.5} />
    <line x1="4" y1="34" x2="36" y2="38" stroke="#4E342E" strokeWidth="1" opacity={0.4} />
    {/* Highlight top-left */}
    <rect x="0" y="0" width="15" height="15" fill="white" opacity={0.06} />
    {watered && (
      <>
        <rect x="0" y="0" width="40" height="40" fill="#1565C0" opacity={0.08} />
        {/* Water droplet */}
        <path d="M34 6 Q36 2 38 6 Q38 9 36 9 Q34 9 34 6" fill="#42A5F5" opacity={0.4} />
        {/* Moisture shine */}
        <rect x="0" y="16" width="40" height="2" fill="white" opacity={0.08} rx="1" />
      </>
    )}
  </svg>
);

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
        style={{ background: 'linear-gradient(135deg, #66BB6A22, #43A04722)' }}
        title={`🪙 ${cost} para desbloquear`}
      >
        <div className="absolute inset-0 bg-black/45 group-hover:bg-black/25 transition-colors duration-200" />
        <span className="relative text-sm opacity-60 group-hover:opacity-100 transition-opacity">🔒</span>
        <span className="absolute bottom-0.5 text-[6px] text-yellow-300/0 group-hover:text-yellow-300/90 transition-colors"
          style={{ fontFamily: "'Fredoka One', cursive" }}>
          {cost}🪙
        </span>
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#FFD700]/40 transition-colors pointer-events-none rounded-sm" />
        {/* Depth effect */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/15" />
        <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-black/10" />
      </button>
    );
  }

  // Deco tile (barn, well, trees)
  if (tile.type === 'deco') {
    const isBarn = tile.decoEmoji === '🏠';
    const isWell = tile.decoEmoji === '💧';
    return (
      <div className="relative flex items-center justify-center select-none cursor-default overflow-hidden"
        onClick={() => onTileClick(index)}
        style={{ background: 'radial-gradient(circle, #81C784, #4CAF50)' }}>
        <GrassBlades />
        {isBarn && tile.decoLabel && <BarnSVG size={Math.min(56, 48)} />}
        {isBarn && !tile.decoLabel && <div />}
        {isWell && <WellSVG size={36} />}
        {!isBarn && !isWell && tile.decoEmoji && (
          <TreeSVG size={32} hasApples={false} />
        )}
        {tile.decoLabel && (
          <span className="absolute bottom-0 text-[7px] font-bold text-white/90 drop-shadow"
            style={{ fontFamily: "'Fredoka One', cursive" }}>
            {tile.decoLabel}
          </span>
        )}
        {/* Depth effect */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/15" />
        <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-black/08" />
      </div>
    );
  }

  // Grass / Soil / Planted tiles
  const bgGrass = 'radial-gradient(circle, #81C784, #4CAF50)';
  const bgSoil = tile.watered
    ? 'radial-gradient(circle, #5D4037, #4E342E)'
    : 'radial-gradient(circle, #8D6E63, #5D4037)';

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.04, filter: 'brightness(1.15)' }}
      whileTap={{ scale: 0.96 }}
      className="relative flex flex-col items-center justify-center transition-all duration-150 cursor-pointer group overflow-hidden"
      style={{
        background: tile.type === 'grass' ? bgGrass : bgSoil,
        boxShadow: isReady ? '0 0 12px #FFD700, inset 0 0 8px rgba(255,215,0,0.3)' : 'none',
      }}
    >
      {/* Depth effect on every tile */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/15 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-black/08 pointer-events-none" />

      {tile.type === 'grass' && (
        <>
          <GrassBlades />
          <span className="text-white/0 group-hover:text-white/50 transition-colors font-bold z-10"
            style={{ fontSize: 'clamp(10px, 1.5vw, 16px)', fontFamily: "'Fredoka One', cursive" }}>+</span>
        </>
      )}

      {tile.type === 'soil' && (
        <>
          <SoilTexture watered={tile.watered} />
          <span className="text-white/20 text-[8px] select-none z-10">···</span>
        </>
      )}

      {tile.type === 'planted' && crop && (
        <>
          <SoilTexture watered={tile.watered} />
          <motion.div className="z-10"
            animate={isReady ? { scale: [1, 1.1, 1], rotate: [0, 3, -3, 0] } : {}}
            transition={isReady ? { repeat: Infinity, duration: 1 } : {}}
          >
            <CropSVG cropKey={tile.cropKey!} stage={stage} size={Math.min(28, 24)} />
          </motion.div>
          {/* Progress bar */}
          <div className="absolute bottom-[3px] left-[10%] right-[10%] h-[3px] rounded-sm bg-black/30 overflow-hidden z-10">
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
                <motion.div key={`s-${i}`} className="absolute w-2 h-2 rounded-full z-20"
                  style={{ background: isLeaf ? '#66BB6A' : '#FFD700', left: '50%', top: '50%' }}
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{ x: Math.cos(angle) * 30, y: Math.sin(angle) * 30 + (isLeaf ? 0 : -15), scale: 0, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              );
            })}
            {/* Smoke puff */}
            {[0, 1, 2].map(i => (
              <motion.div key={`smoke-${i}`} className="absolute rounded-full z-20"
                style={{ width: 8, height: 8, background: '#9E9E9E', left: `${40 + i * 10}%`, top: '40%', opacity: 0.5 }}
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: [0, 1.5, 0], opacity: [0.5, 0.3, 0], y: -10 }}
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
