import { useGameStore, GRID_COLS } from '@/store/gameStore';
import { CROPS } from '@/data/crops';
import { ANIMAL_DEFS } from '@/data/animals';
import { useAnimals } from '@/hooks/useAnimals';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const SELL_PRICES: Record<string, { emoji: string; name: string; price: number }> = {
  wheat: { emoji: '🌾', name: 'Trigo', price: 3 },
  carrot: { emoji: '🥕', name: 'Cenoura', price: 3 },
  tomato: { emoji: '🍅', name: 'Tomate', price: 6 },
  corn: { emoji: '🌽', name: 'Milho', price: 8 },
  berry: { emoji: '🍓', name: 'Morango', price: 9 },
  pumpkin: { emoji: '🎃', name: 'Abóbora', price: 14 },
  milk: { emoji: '🥛', name: 'Leite', price: 10 },
  egg: { emoji: '🥚', name: 'Ovo', price: 4 },
  wool: { emoji: '🧶', name: 'Lã', price: 12 },
  meat: { emoji: '🥩', name: 'Carne', price: 18 },
  duck_feather: { emoji: '🪶', name: 'Pena', price: 6 },
  rabbit_meat: { emoji: '🍖', name: 'Carne de Coelho', price: 11 },
};

type Tab = 'buy_seeds' | 'buy_animals' | 'sell_products' | 'sell_animals';

export const Shop = () => {
  const { shopOpen, setShopOpen, coins, setSelectedCrop, setActiveTool, animals, inventory, addCoins, removeFromInventory, removeAnimal, addNotification } = useGameStore();
  const { buyAnimal, maxAnimals } = useAnimals();
  const [tab, setTab] = useState<Tab>('buy_seeds');
  const [confirmSellAnimal, setConfirmSellAnimal] = useState<string | null>(null);

  if (!shopOpen) return null;

  const handleBuySeed = (key: string, cost: number) => {
    if (coins < cost) return;
    setSelectedCrop(key);
    setActiveTool('plant');
    setShopOpen(false);
  };

  const handleBuyAnimal = (defId: string) => {
    buyAnimal(defId);
  };

  const handleSellItem = (key: string, qty: number) => {
    const info = SELL_PRICES[key];
    if (!info) return;
    const owned = inventory[key] || 0;
    const toSell = Math.min(qty, owned);
    if (toSell <= 0) return;
    removeFromInventory(key, toSell);
    addCoins(info.price * toSell);
    addNotification(`+${info.price * toSell} 🪙`, 'harvest');
  };

  const handleSellAnimal = (animalId: string) => {
    const animal = animals.find(a => a.id === animalId);
    if (!animal) return;
    const def = ANIMAL_DEFS.find(d => d.id === animal.defId);
    if (!def) return;
    const price = Math.floor(def.cost * 0.5);
    removeAnimal(animalId);
    addCoins(price);
    addNotification(`${def.emoji} vendido! +${price} 🪙`, 'harvest');
    setConfirmSellAnimal(null);
  };

  const totalInvItems = Object.values(inventory).reduce((a, b) => a + b, 0);
  const tabs: { key: Tab; label: string }[] = [
    { key: 'buy_seeds', label: '🌱 Sementes' },
    { key: 'buy_animals', label: '🐄 Animais' },
    { key: 'sell_products', label: `💰 Vender${totalInvItems > 0 ? ' ●' : ''}` },
    { key: 'sell_animals', label: '🐄 Vender' },
  ];

  const font = { fontFamily: "'Press Start 2P', monospace" };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-end justify-center"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShopOpen(false)} />
        <motion.div className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-t-3xl"
          style={{ background: 'rgba(20, 10, 5, 0.95)', border: '3px solid #7a5c2e', borderBottom: 'none' }}
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}>

          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-3"
            style={{ background: 'rgba(20, 10, 5, 0.98)', borderBottom: '2px solid #5a4220' }}>
            <span className="text-white text-[9px]" style={font}>🛒 Mercado</span>
            <span className="text-yellow-300 text-[8px]" style={font}>🪙 {coins}</span>
            <button onClick={() => setShopOpen(false)} className="text-white/60 hover:text-white text-sm">✕</button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-2 overflow-x-auto">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex-shrink-0 py-1.5 px-2 rounded-lg text-[7px] font-bold transition-all ${
                  tab === t.key ? 'bg-amber-600 text-white' : 'bg-white/10 text-white/50'
                }`} style={font}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-3 pb-8">
            {tab === 'buy_seeds' && (
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(CROPS).map(([key, crop]) => (
                  <motion.button key={key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => handleBuySeed(key, crop.cost)}
                    disabled={coins < crop.cost}
                    className={`p-2.5 rounded-xl flex flex-col items-center gap-1 border-2 transition-all ${
                      coins >= crop.cost ? 'border-amber-600/50 bg-amber-900/30 hover:bg-amber-800/40' : 'border-white/10 bg-white/5 opacity-40'
                    }`}>
                    <span className="text-2xl">{crop.stages[2]}</span>
                    <span className="text-white text-[7px]" style={font}>{crop.name}</span>
                    <span className="text-yellow-300 text-[6px]" style={font}>🪙 {crop.cost} | ⏱{crop.growTime / 1000}s</span>
                  </motion.button>
                ))}
              </div>
            )}

            {tab === 'buy_animals' && (
              <>
                <p className="text-white/50 text-[7px] mb-2 text-center" style={font}>
                  {animals.length}/{maxAnimals} animais
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {ANIMAL_DEFS.map(def => (
                    <motion.button key={def.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={() => handleBuyAnimal(def.id)}
                      disabled={coins < def.cost || animals.length >= maxAnimals}
                      className={`p-2.5 rounded-xl flex flex-col items-center gap-1 border-2 transition-all ${
                        coins >= def.cost && animals.length < maxAnimals ? 'border-amber-600/50 bg-amber-900/30 hover:bg-amber-800/40' : 'border-white/10 bg-white/5 opacity-40'
                      }`}>
                      <span className="text-2xl">{def.emoji}</span>
                      <span className="text-white text-[7px]" style={font}>{def.name}</span>
                      <span className="text-yellow-300 text-[6px]" style={font}>🪙 {def.cost}</span>
                      <span className="text-white/40 text-[5px]" style={font}>{def.produce} / {def.produceEvery / 1000}s</span>
                    </motion.button>
                  ))}
                </div>
              </>
            )}

            {tab === 'sell_products' && (
              <div className="space-y-2">
                {Object.entries(SELL_PRICES).map(([key, info]) => {
                  const qty = inventory[key] || 0;
                  if (qty === 0) return null;
                  return (
                    <div key={key} className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{info.emoji}</span>
                        <div>
                          <p className="text-white text-[7px]" style={font}>{info.name} ×{qty}</p>
                          <p className="text-yellow-300/60 text-[6px]" style={font}>{info.price}🪙 cada</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleSellItem(key, 1)}
                          className="px-2 py-1 rounded-lg bg-amber-600/80 text-white text-[6px] hover:bg-amber-500" style={font}>
                          Vender 1
                        </button>
                        <button onClick={() => handleSellItem(key, qty)}
                          className="px-2 py-1 rounded-lg bg-amber-700/80 text-white text-[6px] hover:bg-amber-600" style={font}>
                          Tudo
                        </button>
                      </div>
                    </div>
                  );
                })}
                {Object.values(inventory).every(v => v === 0) && (
                  <p className="text-white/30 text-[7px] text-center py-4" style={font}>Nenhum produto para vender</p>
                )}
              </div>
            )}

            {tab === 'sell_animals' && (
              <div className="space-y-2">
                {animals.map(animal => {
                  const def = ANIMAL_DEFS.find(d => d.id === animal.defId);
                  if (!def) return null;
                  const sellPrice = Math.floor(def.cost * 0.5);
                  const ownedFor = Math.floor((Date.now() - (animal.boughtAt || Date.now())) / 60000);
                  return (
                    <div key={animal.id} className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{def.emoji}</span>
                        <div>
                          <p className="text-white text-[7px]" style={font}>{def.name}</p>
                          <p className="text-white/40 text-[5px]" style={font}>{ownedFor}min na fazenda</p>
                        </div>
                      </div>
                      {confirmSellAnimal === animal.id ? (
                        <div className="flex gap-1">
                          <button onClick={() => setConfirmSellAnimal(null)}
                            className="px-2 py-1 rounded-lg bg-white/10 text-white/60 text-[6px]" style={font}>Não</button>
                          <button onClick={() => handleSellAnimal(animal.id)}
                            className="px-2 py-1 rounded-lg bg-red-600/80 text-white text-[6px]" style={font}>Sim ({sellPrice}🪙)</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmSellAnimal(animal.id)}
                          className="px-2 py-1 rounded-lg bg-red-700/60 text-white text-[6px] hover:bg-red-600/80" style={font}>
                          Vender
                        </button>
                      )}
                    </div>
                  );
                })}
                {animals.length === 0 && (
                  <p className="text-white/30 text-[7px] text-center py-4" style={font}>Nenhum animal para vender</p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
