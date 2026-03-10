import { useEffect, useRef } from 'react';

export function useGameLoop(onTick: (deltaTime: number) => void) {
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const loop = (time: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = time;
      const delta = Math.min(time - lastTimeRef.current, 100); // cap at 100ms
      lastTimeRef.current = time;
      onTick(delta);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onTick]);
}
