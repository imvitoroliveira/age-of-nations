import { AnimalState } from '@/types/game';
import { ANIMAL_DEFS } from '@/data/animals';
import { motion } from 'framer-motion';

interface Props {
  animal: AnimalState;
  onClick: () => void;
  containerWidth: number;
  containerHeight: number;
}

export const Animal = ({ animal, onClick, containerWidth, containerHeight }: Props) => {
  const def = ANIMAL_DEFS.find(a => a.id === animal.defId);
  if (!def) return null;

  const xPercent = (animal.x / 700) * 100;
  const yPercent = (animal.y / 120) * 100;

  return (
    <motion.button
      onClick={onClick}
      className="absolute cursor-pointer z-20"
      style={{
        left: `${xPercent}%`,
        top: `${yPercent}%`,
        fontSize: 'clamp(18px, 2.5vw, 32px)',
        transform: `scaleX(${animal.facingLeft ? -1 : 1})`,
      }}
      animate={{ y: [0, -3, 0, 3, 0] }}
      transition={{ repeat: Infinity, duration: 2 / def.speed, ease: 'easeInOut' }}
      whileHover={{ scale: 1.2 }}
    >
      <span className="drop-shadow-lg">{def.emoji}</span>
    </motion.button>
  );
};
