import { useGameStore, GRID_COLS, GRID_ROWS } from '@/store/gameStore';
import { useDayCycle } from '@/hooks/useDayCycle';
import { motion, AnimatePresence } from 'framer-motion';

interface Props { onBack: () => void; }

const TOOLS = [
  { key: 'plant' as const, icon: '🌱', label: 'Plantar' },
  { key: 'water' as const, icon: '💧', label: 'Regar' },
  { key: 'harvest' as const, icon: '🔪', label: 'Colher' },
  { key: 'clear' as const, icon: '🪓', label: 'Limpar' },
];

// Wood grain SVG pattern
const WoodGrain = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" opacity={0.08}>
    <defs>
      <pattern id="woodgrain" width="60" height="8" patternUnits="userSpaceOnUse">
        <path d="M0 4 Q15 2 30 4 T60 4" stroke="white" strokeWidth="0.5" fill="none" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#woodgrain)" />
  </svg>
);

export const HUD = ({ onBack }: Props) => {
  const coins = useGameStore(s => s.coins);
  const weather = useGameStore(s => s.weather);
  const activeTool = useGameStore(s => s.activeTool);
  const setActiveTool = useGameStore(s => s.setActiveTool);
  const setShopOpen = useGameStore(s => s.setShopOpen);
  const ownedTiles = useGameStore(s => s.ownedTiles);
  const inventory = useGameStore(s => s.inventory);
  const { day, getTimeLabel, isNight } = useDayCycle();

  const totalTiles = GRID_COLS * GRID_ROWS;
  const totalInvItems = Object.values(inventory).reduce((a, b) => a + b, 0);

  return (
    <div className="relative z-30">
      {/* Main bar - wood style */}
      <div className="relative flex items-center justify-between px-3 py-2.5 gap-2 flex-wrap"
        style={{
          background: 'linear-gradient(180deg, #795548, #5D4037)',
          borderBottom: '3px solid #4E342E',
          borderRadius: '0 0 12px 12px',
        }}>
        <WoodGrain />

        <button onClick={onBack}
          className="relative text-white/80 hover:text-white text-xs px-2 py-1 z-10"
          style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
          ← Voltar
        </button>

        <span className="relative text-[#FFF9C4] text-xs hidden sm:block z-10"
          style={{ fontFamily: "'Fredoka One', cursive" }}>
          🏡 Fazendinha
        </span>

        <span className="relative text-white/90 text-[11px] z-10"
          style={{ fontFamily: "'Fredoka One', cursive" }}>
          {isNight ? '🌙' : '☀️'} Dia {day} | {getTimeLabel()}
        </span>

        <span className="relative text-[11px] z-10" style={{ fontFamily: "'Nunito', sans-serif" }}>
          {weather === 'sunny' ? '☀️' : '🌧️'}
          <span className="text-white/80 ml-1 font-semibold">{weather === 'sunny' ? 'Sol' : 'Chuva'}</span>
        </span>

        <span className="relative text-white/60 text-[10px] z-10"
          style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
          🏡 {ownedTiles.length}/{totalTiles}
        </span>

        <div className="relative flex items-center z-10">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={coins}
              className="text-[#FFD700] text-sm font-bold"
              style={{ fontFamily: "'Fredoka One', cursive" }}
              initial={{ scale: 1.5, color: '#fff' }}
              animate={{ scale: 1, color: '#FFD700' }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              🪙 {coins}
            </motion.span>
          </AnimatePresence>
        </div>

        <button
          onClick={() => setShopOpen(true)}
          className="relative text-white px-3 py-1.5 rounded-full text-[11px] font-bold z-10 hover:brightness-110 transition-all"
          style={{
            background: 'linear-gradient(135deg, #43A047, #388E3C)',
            boxShadow: '0 2px 8px rgba(67,160,71,0.4)',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800,
          }}
        >
          🛒 Loja
          {totalInvItems > 0 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>
      </div>

      {/* Tools bar - wooden plank style */}
      <div className="flex justify-center gap-1.5 py-2 px-2"
        style={{
          background: 'linear-gradient(180deg, #5D4037cc, #4E342Ecc)',
          borderBottom: '2px solid #3E2723',
        }}>
        {TOOLS.map(tool => (
          <button
            key={tool.key}
            onClick={() => setActiveTool(tool.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-all ${
              activeTool === tool.key
                ? 'text-white shadow-lg scale-105'
                : 'text-white/60 hover:text-white/80 hover:bg-white/10'
            }`}
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              ...(activeTool === tool.key ? {
                background: 'linear-gradient(135deg, #8D6E63, #795548)',
                border: '2px solid #FFD700',
                boxShadow: '0 0 10px rgba(255,215,0,0.3)',
              } : {
                background: 'rgba(255,255,255,0.05)',
                border: '2px solid transparent',
              }),
            }}
          >
            <span>{tool.icon}</span>
            <span className="hidden sm:inline">{tool.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
