import { useGameStore } from '@/store/gameStore';
import { CROPS } from '@/data/crops';
import { ANIMAL_DEFS } from '@/data/animals';
import { useCrops } from '@/hooks/useCrops';
import { useAnimals } from '@/hooks/useAnimals';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export const Shop = () => {
  const { shopOpen, setShopOpen, coins, setSelectedCrop, setActiveTool } = useGameStore();
  const { buyAnimal } = useAnimals();
  const [tab, setTab] = useState<'seeds' | 'animals'>('seeds');

  if (!shopOpen) return null;

  const handleBuySeed = (key: string, cost: number) => {
    if (coins < cost) return;
    setSelectedCrop(key);
    setActiveTool('plant');
    setShopOpen(false);
  };

  const handleBuyAnimal = (defId: string) => {
    buyAnimal(defId);
    setShopOpen(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShopOpen(false)} />

        {/* Panel */}
        <motion.div
          className="relative w-full max-w-lg max-h-[75vh] overflow-y-auto rounded-t-3xl"
          style={{
            background: 'rgba(20, 10, 5, 0.95)',
            border: '3px solid #7a5c2e',
            borderBottom: 'none',
          }}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-4"
            style={{ background: 'rgba(20, 10, 5, 0.98)', borderBottom: '2px solid #5a4220' }}>
            <span className="text-white text-sm" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              🛒 Loja
            </span>
            <span className="text-yellow-300 text-xs" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              🪙 {coins}
            </span>
            <button onClick={() => setShopOpen(false)} className="text-white/60 hover:text-white text-lg">✕</button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 p-3">
            {(['seeds', 'animals'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition-all ${
                  tab === t ? 'bg-amber-600 text-white' : 'bg-white/10 text-white/50'
                }`} style={{ fontFamily: "'Press Start 2P', monospace" }}>
                {t === 'seeds' ? '🌱 Sementes' : '🐄 Animais'}
              </button>
            ))}
          </div>

          {/* Items */}
          <div className="grid grid-cols-2 gap-3 p-3 pb-8">
            {tab === 'seeds' && Object.entries(CROPS).map(([key, crop]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleBuySeed(key, crop.cost)}
                disabled={coins < crop.cost}
                className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 border-2 transition-all ${
                  coins >= crop.cost
                    ? 'border-amber-600/50 bg-amber-900/30 hover:bg-amber-800/40'
                    : 'border-white/10 bg-white/5 opacity-40'
                }`}
              >
                <span className="text-3xl">{crop.stages[2]}</span>
                <span className="text-white text-[9px]" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                  {crop.name}
                </span>
                <span className="text-yellow-300 text-[8px]" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                  🪙 {crop.cost}  →  +{crop.reward}
                </span>
              </motion.button>
            ))}
            {tab === 'animals' && ANIMAL_DEFS.map(def => (
              <motion.button
                key={def.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleBuyAnimal(def.id)}
                disabled={coins < def.cost}
                className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 border-2 transition-all ${
                  coins >= def.cost
                    ? 'border-amber-600/50 bg-amber-900/30 hover:bg-amber-800/40'
                    : 'border-white/10 bg-white/5 opacity-40'
                }`}
              >
                <span className="text-3xl">{def.emoji}</span>
                <span className="text-white text-[9px]" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                  {def.name}
                </span>
                <span className="text-yellow-300 text-[8px]" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                  🪙 {def.cost}
                </span>
                <span className="text-white/50 text-[7px]" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                  {def.produce} cada {def.produceEvery / 1000}s
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
