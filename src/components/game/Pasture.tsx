import { useGameStore } from '@/store/gameStore';
import { Animal } from './Animal';
import { ANIMAL_DEFS } from '@/data/animals';
import { motion, AnimatePresence } from 'framer-motion';
import { FenceSegment } from './svg/BuildingSVG';

export const Pasture = () => {
  const { animals, floatingProduce, addToInventory, removeFloatingProduce, addNotification } = useGameStore();

  const handleCollect = (fpId: string, key: string, emoji: string) => {
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
    addNotification(`${def.name} — ${def.produce} em ${secs}s`, 'info');
  };

  return (
    <div className="relative w-full overflow-hidden"
      style={{
        height: '130px',
        background: 'linear-gradient(180deg, #5BBD2E, #4CAF50)',
      }}>

      {/* Wavy grass tuft border at top */}
      <svg className="absolute top-[-8px] left-0 right-0 w-full pointer-events-none z-[1]" viewBox="0 0 680 16" preserveAspectRatio="none" style={{ height: '16px' }}>
        <path d="M0,16 Q10,4 20,12 Q30,2 40,12 Q50,4 60,12 Q70,2 80,12 Q90,4 100,12 Q110,2 120,12 Q130,4 140,12 Q150,2 160,12 Q170,4 180,12 Q190,2 200,12 Q210,4 220,12 Q230,2 240,12 Q250,4 260,12 Q270,2 280,12 Q290,4 300,12 Q310,2 320,12 Q330,4 340,12 Q350,2 360,12 Q370,4 380,12 Q390,2 400,12 Q410,4 420,12 Q430,2 440,12 Q450,4 460,12 Q470,2 480,12 Q490,4 500,12 Q510,2 520,12 Q530,4 540,12 Q550,2 560,12 Q570,4 580,12 Q590,2 600,12 Q610,4 620,12 Q630,2 640,12 Q650,4 660,12 Q670,2 680,12 V16 H0 Z" fill="#5BBD2E" />
      </svg>

      {/* Grass texture */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" opacity={0.1}>
        <defs>
          <pattern id="pastureGrass2" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M6 20 Q5 14 7 10" stroke="#2E7D32" strokeWidth="1" fill="none" />
            <path d="M18 20 Q17 16 19 12" stroke="#388E3C" strokeWidth="1" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pastureGrass2)" />
      </svg>

      {/* Fence at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-[2]" style={{ height: '20px' }}>
        {/* Horizontal brown planks */}
        <div className="absolute bottom-8 left-0 right-0 h-[3px] bg-[#8D6E63]" />
        <div className="absolute bottom-4 left-0 right-0 h-[3px] bg-[#795548]" />
        {/* Vertical posts */}
        <div className="flex justify-between px-2">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="w-[6px] h-[20px] rounded-t-sm"
              style={{ background: 'linear-gradient(180deg, #A1887F, #8D6E63)', boxShadow: '1px 1px 2px rgba(0,0,0,0.2)' }} />
          ))}
        </div>
      </div>

      {/* Animals */}
      {animals.map(animal => (
        <Animal key={animal.id} animal={animal} onClick={() => handleAnimalClick(animal.id)} containerWidth={680} containerHeight={130} />
      ))}

      {/* Floating produce collectibles */}
      <AnimatePresence>
        {floatingProduce.map(fp => (
          <motion.button
            key={fp.id}
            className="absolute z-30 cursor-pointer"
            style={{ left: `${(fp.x / 680) * 100}%`, top: '25px' }}
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: [0, 1.3, 1], opacity: 1, y: [20, -10, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => handleCollect(fp.id, fp.inventoryKey, fp.emoji)}
            whileHover={{ scale: 1.3 }}
          >
            <span className="text-xl drop-shadow-lg">{fp.emoji}</span>
            <motion.div className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
              style={{ background: '#FFD700' }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
          </motion.button>
        ))}
      </AnimatePresence>

      {animals.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/30 text-xs"
            style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
            🐄 Compre animais na loja!
          </span>
        </div>
      )}
    </div>
  );
};
