import { useCallback, useState, useEffect } from 'react';
import { HUD } from './HUD';
import { FarmGrid } from './FarmGrid';
import { Pasture } from './Pasture';
import { Shop } from './Shop';
import { Notifications } from './Notifications';
import { useDayCycle } from '@/hooks/useDayCycle';
import { useAnimals } from '@/hooks/useAnimals';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';
import { CloudSVG, SunSVG, MoonSVG } from './svg/BuildingSVG';

interface Props { onBack: () => void; }

export const FarmGame = ({ onBack }: Props) => {
  const { isNight, getSkyGradient, timeOfDay } = useDayCycle();
  const { updateAnimalPositions } = useAnimals();
  const weather = useGameStore(s => s.weather);
  const selectedCrop = useGameStore(s => s.selectedCrop);
  const [thunderFlash, setThunderFlash] = useState(false);

  const onTick = useCallback((delta: number) => {
    updateAnimalPositions(delta);
  }, [updateAnimalPositions]);

  useGameLoop(onTick);

  // Thunder effect during rain
  useEffect(() => {
    if (weather !== 'rainy') return;
    const interval = setInterval(() => {
      if (Math.random() < 0.15) {
        setThunderFlash(true);
        setTimeout(() => setThunderFlash(false), 150);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [weather]);

  const celestialX = timeOfDay * 100;
  const celestialY = Math.sin(timeOfDay * Math.PI) * -30 + 15;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ maxWidth: 'min(95vw, 680px)', margin: '0 auto', width: '100%' }}>
      
      {/* Sky zone — 180px */}
      <div className="relative w-full" style={{ height: '180px' }}>
        {/* Sky gradient */}
        <div className="absolute inset-0 transition-all duration-[30000ms] ease-linear"
          style={{ background: getSkyGradient() }} />

        {/* SVG Clouds */}
        <div className="absolute top-[5%] left-0 w-full h-16 pointer-events-none overflow-hidden z-[2]">
          {[
            { size: 70, top: '0%', dur: 80, opacity: isNight ? 0.3 : 0.9 },
            { size: 45, top: '30%', dur: 110, opacity: isNight ? 0.25 : 0.8 },
            { size: 55, top: '50%', dur: 140, opacity: isNight ? 0.2 : 0.85 },
          ].map((c, i) => (
            <motion.div key={i} className="absolute" style={{ top: c.top }}
              animate={{ x: ['-10%', '110%'] }}
              transition={{ repeat: Infinity, duration: c.dur, ease: 'linear', delay: i * 15 }}>
              <CloudSVG size={c.size} opacity={c.opacity} />
            </motion.div>
          ))}
        </div>

        {/* Sun / Moon SVG */}
        <div className="absolute top-3 z-[3] pointer-events-none transition-all duration-1000"
          style={{ left: `${celestialX}%`, transform: `translateY(${celestialY}px)` }}>
          {isNight ? <MoonSVG size={28} /> : <SunSVG size={36} />}
        </div>

        {/* Night overlay with stars */}
        {isNight && (
          <div className="absolute inset-0 bg-[rgba(0,0,20,0.4)] pointer-events-none z-[3]">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${8 + i * 7}%`,
                  top: `${5 + (i * 7) % 25}%`,
                  width: `${2 + (i % 3)}px`,
                  height: `${2 + (i % 3)}px`,
                }}
                animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                transition={{ repeat: Infinity, duration: 1.5 + i * 0.2, delay: i * 0.15 }}
              />
            ))}
          </div>
        )}

        {/* Rain */}
        {weather === 'rainy' && (
          <div className="absolute inset-0 pointer-events-none z-[4] overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div key={i} className="absolute bg-blue-300/40"
                style={{
                  left: `${(i / 30) * 100}%`,
                  width: '2px', height: '12px',
                  transform: 'rotate(15deg)',
                }}
                animate={{ y: ['-20px', '200px'] }}
                transition={{ repeat: Infinity, duration: 0.6 + (i % 5) * 0.05, delay: Math.random() * 1.5 }}
              />
            ))}
          </div>
        )}

        {thunderFlash && (
          <div className="absolute inset-0 bg-white/20 pointer-events-none z-[5]" />
        )}

        {/* Hills at bottom of sky */}
        <div className="absolute bottom-0 left-0 right-0 z-[1]">
          <svg viewBox="0 0 680 40" className="w-full" preserveAspectRatio="none" style={{ height: '40px' }}>
            <path d="M0,30 Q80,10 160,25 T320,15 T480,28 T640,18 L680,20 V40 H0 Z" fill="#4CAF50" opacity={0.5} />
            <path d="M0,35 Q100,18 200,30 T400,20 T600,32 L680,28 V40 H0 Z" fill="#388E3C" opacity={0.4} />
          </svg>
        </div>

        {/* Sun ray effect */}
        {weather === 'sunny' && !isNight && (
          <motion.div className="absolute pointer-events-none z-[2]"
            style={{
              top: '10%', right: '15%', width: '120px', height: '120px',
              background: 'radial-gradient(circle, rgba(255,215,0,0.1), transparent 70%)',
            }}
            animate={{ opacity: [0, 0.15, 0], scale: [0.8, 1.2, 0.8] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          />
        )}
      </div>

      {/* HUD */}
      <div className="relative z-30">
        <HUD onBack={onBack} />
      </div>

      {/* Farm area — green background with centered grid */}
      <div className="relative flex-1 flex flex-col items-center"
        style={{ background: 'linear-gradient(180deg, #66BB6A 0%, #4CAF50 50%, #388E3C 100%)' }}>
        
        {/* Decorative grass pattern */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" opacity={0.06}>
          <defs>
            <pattern id="farmGrass" width="32" height="32" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="16" height="32" fill="#43A047" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#farmGrass)" />
        </svg>

        {/* Grid container with fence border */}
        <div className="relative py-4 z-10">
          {/* Fence around grid */}
          <div className="rounded-xl overflow-hidden"
            style={{
              border: '4px solid #8D6E63',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 2px 4px rgba(0,0,0,0.1)',
            }}>
            <FarmGrid />
          </div>
        </div>

        {/* Pasture below grid */}
        <Pasture />
      </div>

      {selectedCrop && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, #5D4037, #795548)',
            border: '2px solid #FFD700',
            fontFamily: "'Fredoka One', cursive",
            fontSize: '12px',
            color: '#FFD700',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          }}>
          🌱 Clique num solo para plantar!
        </motion.div>
      )}

      <Shop />
      <Notifications />
    </div>
  );
};
