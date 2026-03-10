import { TileState } from '@/types/game';
import { CROPS } from '@/data/crops';
import { useCrops } from '@/hooks/useCrops';
import { motion } from 'framer-motion';

interface Props {
  tile: TileState;
  index: number;
  onTileClick: (index: number) => void;
}

export const Tile = ({ tile, index, onTileClick }: Props) => {
  const { getCropProgress, getCropStage } = useCrops();
  const progress = getCropProgress(tile);
  const stage = getCropStage(progress);
  const crop = tile.cropKey ? CROPS[tile.cropKey] : null;
  const isReady = tile.type === 'planted' && progress >= 1;

  if (tile.type === 'deco') {
    return (
      <div className="relative flex items-center justify-center select-none" style={{
        background: 'radial-gradient(circle, hsl(120 40% 50% / 0.3), hsl(120 40% 40% / 0.2))',
      }}>
        <span className="text-2xl md:text-3xl drop-shadow-md">{tile.decoEmoji}</span>
        {tile.decoLabel && (
          <span className="absolute -bottom-0.5 text-[7px] font-bold text-white/80 drop-shadow"
            style={{ fontFamily: "'Press Start 2P', monospace" }}>
            {tile.decoLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <motion.button
      onClick={() => onTileClick(index)}
      whileHover={{ scale: 1.03, filter: 'brightness(1.25)' }}
      whileTap={{ scale: 0.97 }}
      className="relative flex flex-col items-center justify-center transition-all duration-150 cursor-pointer group"
      style={{
        background: tile.type === 'grass'
          ? 'radial-gradient(circle, hsl(120 50% 55%), hsl(120 45% 45%))'
          : tile.type === 'soil' || tile.type === 'planted'
            ? 'radial-gradient(circle, hsl(30 40% 45%), hsl(30 35% 35%))'
            : 'radial-gradient(circle, hsl(120 50% 55%), hsl(120 45% 45%))',
        boxShadow: isReady ? '0 0 12px #FFD700, inset 0 0 8px rgba(255,215,0,0.3)' : 'none',
      }}
    >
      {/* Grass hover indicator */}
      {tile.type === 'grass' && (
        <span className="text-white/0 group-hover:text-white/60 text-xl transition-colors font-bold">+</span>
      )}

      {/* Soil texture */}
      {(tile.type === 'soil') && (
        <span className="text-white/30 text-xs">···</span>
      )}

      {/* Planted crop */}
      {tile.type === 'planted' && crop && (
        <>
          <motion.span
            className="text-xl md:text-2xl drop-shadow"
            animate={isReady ? { scale: [1, 1.15, 1] } : {}}
            transition={isReady ? { repeat: Infinity, duration: 1 } : {}}
          >
            {crop.stages[stage]}
          </motion.span>
          {/* Progress bar */}
          <div className="absolute bottom-0.5 left-1 right-1 h-1.5 rounded-full bg-black/20 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(100, progress * 100)}%`,
                background: progress < 0.4 ? '#f97316' : progress < 0.9 ? '#eab308' : '#22c55e',
              }}
            />
          </div>
        </>
      )}

      {/* Harvest sparkle */}
      {isReady && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ boxShadow: 'inset 0 0 20px rgba(255,215,0,0.5)' }}
        />
      )}
    </motion.button>
  );
};
