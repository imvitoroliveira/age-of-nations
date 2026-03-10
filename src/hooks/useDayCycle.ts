import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

const DAY_DURATION = 60000; // 60 seconds per day

export function useDayCycle() {
  const { timeOfDay, day, setTimeOfDay, setDay, setWeather, addNotification } = useGameStore();
  const lastTickRef = useRef(Date.now());
  const dayStartRef = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - dayStartRef.current;
      const newTime = (elapsed % DAY_DURATION) / DAY_DURATION;
      
      setTimeOfDay(newTime);

      // New day
      if (elapsed >= DAY_DURATION) {
        dayStartRef.current = now;
        const newDay = day + 1;
        setDay(newDay);
        setWeather(Math.random() > 0.7 ? 'rainy' : 'sunny');
        addNotification(`🌅 Dia ${newDay} começou!`, 'day');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [day]);

  const isNight = timeOfDay >= 0.85 || timeOfDay < 0.05;
  
  const getSkyGradient = () => {
    if (timeOfDay < 0.05) return 'linear-gradient(180deg, #0F2027 0%, #203A43 100%)';
    if (timeOfDay < 0.15) return 'linear-gradient(180deg, #FF9966 0%, #FF5E62 100%)';
    if (timeOfDay < 0.4) return 'linear-gradient(180deg, #87CEEB 0%, #B0E0E6 100%)';
    if (timeOfDay < 0.6) return 'linear-gradient(180deg, #56CCF2 0%, #2F80ED 100%)';
    if (timeOfDay < 0.75) return 'linear-gradient(180deg, #87CEEB 0%, #B0E0E6 100%)';
    if (timeOfDay < 0.85) return 'linear-gradient(180deg, #F7971E 0%, #FFD200 100%)';
    return 'linear-gradient(180deg, #0F2027 0%, #203A43 100%)';
  };

  const getTimeLabel = () => {
    const hours = Math.floor(timeOfDay * 24);
    const mins = Math.floor((timeOfDay * 24 * 60) % 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  return { isNight, getSkyGradient, getTimeLabel, timeOfDay, day };
}
