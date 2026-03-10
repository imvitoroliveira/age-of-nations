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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Sky gradient */}
      <div className="absolute inset-0 transition-all duration-[30000ms] ease-linear"
        style={{ background: getSkyGradient() }} />

      {/* Distant hills - parallax layer */}
      <div className="absolute z-[1] pointer-events-none" style={{ bottom: '52%', left: 0, right: 0 }}>
        <svg viewBox="0 0 1200 100" className="w-full" preserveAspectRatio="none" style={{ height: '50px' }}>
          <path d="M0,60 Q100,20 200,50 T400,35 T600,45 T800,25 T1000,50 T1200,40 V100 H0 Z" fill="#4CAF50" opacity={0.5} />
        </svg>
      </div>
      <div className="absolute z-[1] pointer-events-none" style={{ bottom: '50%', left: 0, right: 0 }}>
        <svg viewBox="0 0 1200 80" className="w-full" preserveAspectRatio="none" style={{ height: '35px' }}>
          <path d="M0,50 Q150,20 300,40 T600,25 T900,45 T1200,30 V80 H0 Z" fill="#388E3C" opacity={0.35} />
        </svg>
      </div>

      {/* SVG Clouds */}
      <div className="absolute top-[3%] left-0 w-full h-20 pointer-events-none overflow-hidden z-[2]">
        {[
          { size: 80, top: '5%', dur: 80, opacity: isNight ? 0.3 : 0.9 },
          { size: 50, top: '25%', dur: 110, opacity: isNight ? 0.25 : 0.8 },
          { size: 65, top: '40%', dur: 140, opacity: isNight ? 0.2 : 0.85 },
          { size: 45, top: '15%', dur: 95, opacity: isNight ? 0.25 : 0.75 },
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
        {isNight ? <MoonSVG size={32} /> : <SunSVG size={40} />}
      </div>

      {/* Night overlay with stars */}
      {isNight && (
        <div className="absolute inset-0 bg-[rgba(0,0,20,0.4)] pointer-events-none z-[3] transition-opacity duration-[3000ms]">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${8 + i * 6}%`,
                top: `${3 + (i * 7) % 20}%`,
                width: `${3 + (i % 3)}px`,
                height: `${3 + (i % 3)}px`,
              }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.5 + i * 0.2, delay: i * 0.15 }}
            />
          ))}
        </div>
      )}

      {/* Rain effect */}
      {weather === 'rainy' && (
        <div className="absolute inset-0 pointer-events-none z-[4] overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div key={i} className="absolute bg-blue-300/40"
              style={{
                left: `${(i / 40) * 100}%`,
                width: '2px',
                height: '12px',
                transform: 'rotate(15deg)',
              }}
              animate={{ y: ['-20px', '110vh'] }}
              transition={{ repeat: Infinity, duration: 0.6 + (i % 5) * 0.05, delay: Math.random() * 1.5 }}
            />
          ))}
        </div>
      )}

      {/* Thunder flash */}
      {thunderFlash && (
        <div className="absolute inset-0 bg-white/20 pointer-events-none z-[5]" />
      )}

      {/* Sun ray effect (sunny) */}
      {weather === 'sunny' && !isNight && (
        <motion.div className="absolute pointer-events-none z-[2]"
          style={{
            top: '5%', right: '10%', width: '200px', height: '200px',
            background: 'radial-gradient(circle, rgba(255,215,0,0.08), transparent 70%)',
          }}
          animate={{ opacity: [0, 0.1, 0], scale: [0.8, 1.2, 0.8] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        />
      )}

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-[52%] z-[1]"
        style={{
          background: 'linear-gradient(180deg, #66BB6A 0%, #4CAF50 30%, #388E3C 100%)',
        }}>
        {/* Grass stripe pattern */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" opacity={0.06}>
          <defs>
            <pattern id="grassStripes" width="32" height="32" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="16" height="32" fill="#43A047" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grassStripes)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1">
        <HUD onBack={onBack} />
        <div className="flex-1 flex flex-col items-center justify-center p-2 md:p-4">
          <div className="rounded-2xl overflow-hidden"
            style={{
              border: '3px solid #8D6E63',
              maxWidth: 'min(90vw, 700px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}>
            <FarmGrid />
            <Pasture />
          </div>
        </div>

        {selectedCrop && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #5D4037, #795548)',
              border: '2px solid #FFD700',
              fontFamily: "'Fredoka One', cursive",
              fontSize: '11px',
              color: '#FFD700',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            }}>
            🌱 Clique num solo para plantar!
          </motion.div>
        )}
      </div>

      <Shop />
      <Notifications />
    </div>
  );
};
