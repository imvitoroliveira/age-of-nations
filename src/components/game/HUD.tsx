import { useGameStore } from '@/store/gameStore';
import { useDayCycle } from '@/hooks/useDayCycle';
import { motion, AnimatePresence } from 'framer-motion';

interface Props { onBack: () => void; }

const TOOLS = [
  { key: 'plant' as const, icon: '🌱', label: 'Plantar' },
  { key: 'water' as const, icon: '💧', label: 'Regar' },
  { key: 'harvest' as const, icon: '🔪', label: 'Colher' },
  { key: 'clear' as const, icon: '🪓', label: 'Limpar' },
];

export const HUD = ({ onBack }: Props) => {
  const coins = useGameStore(s => s.coins);
  const weather = useGameStore(s => s.weather);
  const activeTool = useGameStore(s => s.activeTool);
  const setActiveTool = useGameStore(s => s.setActiveTool);
  const setShopOpen = useGameStore(s => s.setShopOpen);
  const { day, getTimeLabel } = useDayCycle();

  return (
    <div className="relative z-30">
      {/* Main bar */}
      <div className="flex items-center justify-between px-3 py-2 gap-2 flex-wrap"
        style={{
          background: 'rgba(20, 10, 5, 0.85)',
          borderBottom: '3px solid #7a5c2e',
          fontFamily: "'Press Start 2P', monospace",
        }}>
        <button onClick={onBack} className="text-white/80 hover:text-white text-xs px-2 py-1">
          ← Voltar
        </button>
        <span className="text-white text-[10px] hidden sm:block">🏡 Fazendinha</span>
        <span className="text-yellow-200 text-[9px]">☀️ Dia {day} | {getTimeLabel()}</span>
        <span className="text-[9px]">
          {weather === 'sunny' ? '☀️' : '🌧️'}
          <span className="text-white/70 ml-1">{weather === 'sunny' ? 'Sol' : 'Chuva'}</span>
        </span>
        <div className="flex items-center">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={coins}
              className="text-yellow-300 text-[10px] font-bold"
              initial={{ scale: 1.5, color: '#fff' }}
              animate={{ scale: 1, color: '#fde047' }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              🪙 {coins}
            </motion.span>
          </AnimatePresence>
        </div>
        <button
          onClick={() => setShopOpen(true)}
          className="text-white bg-amber-800/60 hover:bg-amber-700/80 px-2 py-1 rounded text-[9px] border border-amber-600/50"
        >
          🛒 Loja
        </button>
      </div>

      {/* Tools bar */}
      <div className="flex justify-center gap-1 py-1.5 px-2"
        style={{ background: 'rgba(20, 10, 5, 0.7)', borderBottom: '2px solid #5a4220' }}>
        {TOOLS.map(tool => (
          <button
            key={tool.key}
            onClick={() => setActiveTool(tool.key)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] transition-all ${
              activeTool === tool.key
                ? 'bg-amber-600/80 text-white shadow-lg shadow-amber-500/30 scale-105'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            <span>{tool.icon}</span>
            <span className="hidden sm:inline">{tool.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
