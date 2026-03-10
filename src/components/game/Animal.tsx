import { AnimalState } from '@/types/game';
import { ANIMAL_DEFS } from '@/data/animals';
import { motion } from 'framer-motion';

interface Props {
  animal: AnimalState;
  onClick: () => void;
  farmWidth: number;
  farmHeight: number;
}

export const Animal = ({ animal, onClick, farmWidth, farmHeight }: Props) => {
  const def = ANIMAL_DEFS.find(a => a.id === animal.defId);
  if (!def) return null;

  const xPercent = (animal.x / 640) * 100;
  const yPercent = (animal.y / 480) * 100;
  const now = Date.now();
  const produceProgress = (now - animal.lastProduce) / def.produceEvery;
  const aboutToProduce = produceProgress > 0.9;

  return (
    <motion.button
      onClick={onClick}
      className="absolute cursor-pointer z-20"
      style={{
        left: `${xPercent}%`,
        top: `${yPercent}%`,
        fontSize: `clamp(20px, ${def.size * 0.6}px, ${def.size}px)`,
        transform: `scaleX(${animal.facingLeft ? -1 : 1})`,
      }}
      animate={{
        y: [0, -3, 0, 3, 0],
      }}
      transition={{
        repeat: Infinity,
        duration: 2 / def.speed,
        ease: 'easeInOut',
      }}
      whileHover={{ scale: 1.2 }}
    >
      <span className="drop-shadow-lg">{def.emoji}</span>
      {aboutToProduce && (
        <motion.span
          className="absolute -top-5 left-1/2 -translate-x-1/2 text-sm"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
          transition={{ duration: 0.5 }}
        >
          💫
        </motion.span>
      )}
    </motion.button>
  );
};
