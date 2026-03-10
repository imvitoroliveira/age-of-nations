import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

const DAY_DURATION = 10_800_000; // 180 minutes

export function useDayCycle() {
  const { timeOfDay, day, setTimeOfDay, setDay, setWeather, addNotification } = useGameStore();
  const dayStartRef = useRef(Date.now() - timeOfDay * DAY_DURATION);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - dayStartRef.current;
      const newTime = (elapsed % DAY_DURATION) / DAY_DURATION;
      setTimeOfDay(newTime);

      if (elapsed >= DAY_DURATION) {
        dayStartRef.current = Date.now();
        const newDay = day + 1;
        setDay(newDay);
        setWeather(Math.random() > 0.8 ? 'rainy' : 'sunny');
        addNotification(`🌅 Dia ${newDay} começou!`, 'day');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [day]);

  const isNight = timeOfDay >= 0.75;

  const getSkyGradient = () => {
    // Map timeOfDay 0→1 to 06:00→06:00 (next day)
    // 0.0=06:00, 0.125=08:00, 0.6875=17:00, 0.875=20:00, 1.0=06:00
    const h = timeOfDay * 24 + 6; // hours since midnight (wrapping)
    const hour = h % 24;
    if (hour >= 6 && hour < 8) return 'linear-gradient(180deg, #FF9966 0%, #FFD89B 100%)';
    if (hour >= 8 && hour < 17) return 'linear-gradient(180deg, #56CCF2 0%, #87CEEB 100%)';
    if (hour >= 17 && hour < 20) return 'linear-gradient(180deg, #F7971E 0%, #FFD200 100%)';
    if (hour >= 20 && hour < 22) return 'linear-gradient(180deg, #2C3E50 0%, #FD746C 100%)';
    return 'linear-gradient(180deg, #0F2027 0%, #203A43 100%)';
  };

  const getTimeLabel = () => {
    // timeOfDay 0→1 maps to 06:00→06:00
    const totalMinutes = Math.floor(timeOfDay * 24 * 60);
    const h = (Math.floor(totalMinutes / 60) + 6) % 24;
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return { isNight, getSkyGradient, getTimeLabel, timeOfDay, day };
}
