import { useGameStore } from '@/store/gameStore';
import { Animal } from './Animal';
import { ANIMAL_DEFS } from '@/data/animals';
import { motion, AnimatePresence } from 'framer-motion';

export const Pasture = () => {
  const { animals, floatingProduce, addToInventory, removeFloatingProduce, addNotification } = useGameStore();

  const handleCollect = (fpId: string, key: string, emoji: string) => {
    const def = ANIMAL_DEFS.find(a => a.inventoryKey === key);
    addToInventory(key, 1);
    removeFloatingProduce(fpId);
    addNotification(`${emoji} coletado!`, 'produce');
  };

  const handleAnimalClick = (animalId: string) => {
    const animal = animals.find(a => a.id === animalId);
    if (!animal) return;
    const def = ANIMAL_DEFS.find(a => a.id === animal.defId);
    if (!def) return;
    const timeLeft = Math.max(0, def.produceEvery - (Date.now() - animal.lastProduce));
    const secs = Math.ceil(timeLeft / 1000);
    addNotification(`${def.emoji} ${def.name} — ${def.produce} em ${secs}s`, 'info');
  };

  return (
    <div className="relative w-full overflow-hidden rounded-b-2xl" style={{ height: '120px', background: 'linear-gradient(180deg, #5a9e3a, #4a8e2a)' }}>
      {/* Grass texture lines */}
      {[0, 1, 2].map(i => (
        <div key={i} className="absolute w-full" style={{ top: `${30 + i * 30}%`, height: '1px', background: 'rgba(0,0,0,0.08)' }} />
      ))}

      {/* Animals */}
      {animals.map(animal => (
        <Animal key={animal.id} animal={animal} onClick={() => handleAnimalClick(animal.id)} containerWidth={700} containerHeight={120} />
      ))}

      {/* Floating produce collectibles */}
      <AnimatePresence>
        {floatingProduce.map(fp => (
          <motion.button
            key={fp.id}
            className="absolute z-30 cursor-pointer"
            style={{ left: `${(fp.x / 700) * 100}%`, top: '10px' }}
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: [0, 1.3, 1], opacity: 1, y: [20, -10, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => handleCollect(fp.id, fp.inventoryKey, fp.emoji)}
            whileHover={{ scale: 1.3 }}
          >
            <span className="text-xl drop-shadow-lg">{fp.emoji}</span>
            <motion.div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
          </motion.button>
        ))}
      </AnimatePresence>

      {animals.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/30 text-[8px]" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            🐄 Compre animais na loja!
          </span>
        </div>
      )}
    </div>
  );
};
