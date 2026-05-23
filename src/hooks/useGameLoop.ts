import { useEffect, useRef } from 'react';

export function useGameLoop(onTick: (deltaTime: number) => void) {
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    const loop = (time: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = time;
      const delta = Math.min(time - lastTimeRef.current, 100); 
      lastTimeRef.current = time;
      onTickRef.current(delta);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []); // Only start once
}
