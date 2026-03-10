import { useCallback, useRef } from 'react';
import { HUD } from './HUD';
import { FarmGrid } from './FarmGrid';
import { Shop } from './Shop';
import { Notifications } from './Notifications';
import { useDayCycle } from '@/hooks/useDayCycle';
import { useAnimals } from '@/hooks/useAnimals';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';

interface Props { onBack: () => void; }

export const FarmGame = ({ onBack }: Props) => {
  const { isNight, getSkyGradient, timeOfDay } = useDayCycle();
  const { updateAnimalPositions } = useAnimals();
  const weather = useGameStore(s => s.weather);
  const selectedCrop = useGameStore(s => s.selectedCrop);
  const tickRef = useRef(0);

  const onTick = useCallback((delta: number) => {
    tickRef.current += delta;
    updateAnimalPositions(delta);
  }, [updateAnimalPositions]);

  useGameLoop(onTick);

  const celestialX = timeOfDay * 100;
  const celestialY = Math.sin(timeOfDay * Math.PI) * -40 + 20;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Sky */}
      <div className="absolute inset-0 transition-all duration-[3000ms]"
        style={{ background: getSkyGradient() }} />

      {/* Clouds */}
      <div className="absolute top-[5%] left-0 w-full h-20 pointer-events-none overflow-hidden z-[1]">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="absolute text-2xl md:text-3xl opacity-60"
            style={{ top: `${i * 25}%` }}
            animate={{ x: ['-10%', '110%'] }}
            transition={{ repeat: Infinity, duration: 60 + i * 30, ease: 'linear', delay: i * 10 }}
          >
            ☁️
          </motion.span>
        ))}
      </div>

      {/* Sun / Moon */}
      <div className="absolute top-4 z-[2] pointer-events-none transition-all duration-1000"
        style={{ left: `${celestialX}%`, transform: `translateY(${celestialY}px)` }}>
        <span className="text-3xl drop-shadow-lg" style={{
          filter: isNight ? 'none' : 'drop-shadow(0 0 12px #FFD700)',
        }}>
          {isNight ? '🌙' : '☀️'}
        </span>
      </div>

      {/* Night overlay */}
      {isNight && (
        <div className="absolute inset-0 bg-[rgba(0,0,20,0.45)] pointer-events-none z-[3] transition-opacity duration-[3000ms]">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{ left: `${10 + i * 9}%`, top: `${5 + (i * 7) % 30}%` }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.5 + i * 0.3, delay: i * 0.2 }}
            />
          ))}
        </div>
      )}

      {/* Rain */}
      {weather === 'rainy' && !isNight && (
        <div className="absolute inset-0 pointer-events-none z-[3] overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px bg-blue-300/40"
              style={{ left: `${i * 5}%`, height: '20px' }}
              animate={{ y: ['-10%', '110%'] }}
              transition={{ repeat: Infinity, duration: 0.6 + i * 0.02, delay: i * 0.03 }}
            />
          ))}
        </div>
      )}

      {/* Hills */}
      <div className="absolute z-[1] pointer-events-none" style={{ bottom: '55%', left: 0, right: 0 }}>
        <svg viewBox="0 0 1200 120" className="w-full" preserveAspectRatio="none" style={{ height: '60px' }}>
          <path d="M0,60 Q150,10 300,50 T600,30 T900,55 T1200,40 V120 H0 Z" fill="#4a8a2e" opacity="0.6" />
        </svg>
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-[55%] z-[1]" style={{ background: '#5a9e3a' }}>
        <svg viewBox="0 0 1200 30" className="absolute -top-4 w-full" preserveAspectRatio="none" style={{ height: '20px' }}>
          <path d="M0,20 Q100,5 200,18 T400,10 T600,20 T800,8 T1000,18 T1200,15 V30 H0 Z" fill="#4ea832" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1">
        <HUD onBack={onBack} />
        <div className="flex-1 flex items-center justify-center p-2 md:p-4">
          <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
            style={{ border: '4px solid #7a5c2e' }}>
            <FarmGrid />
          </div>
        </div>

        {/* Selected crop indicator */}
        {selectedCrop && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-xl"
            style={{
              background: 'rgba(20, 10, 5, 0.9)',
              border: '2px solid #7a5c2e',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '9px',
              color: '#FFD700',
            }}
          >
            🌱 Clique num solo para plantar!
          </motion.div>
        )}
      </div>

      <Shop />
      <Notifications />
    </div>
  );
};
