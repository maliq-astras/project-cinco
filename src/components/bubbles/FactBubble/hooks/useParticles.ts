import { useMemo } from 'react';

export const useParticles = (count = 8) => {
  return useMemo(() => 
    Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return {
        x: Math.cos(angle) * 50,
        y: Math.sin(angle) * 50,
        opacity: 0,
        scale: 0,
        rotate: Math.random() * 360
      };
    }), 
  [count]);
};