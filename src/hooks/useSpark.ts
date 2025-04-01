import { useMemo } from 'react';

interface UseSparkProps {
  delay: number;
  x: number | string;
  y: number | string;
  color: string;
  size?: number;
  xDelta?: number;
  yDelta?: number;
}

/**
 * Hook that provides optimized spark animation settings
 */
export function useSpark({
  delay,
  x,
  y,
  color,
  size = 1,
  xDelta = 0,
  yDelta = 0
}: UseSparkProps) {
  // Memoize spark style to prevent re-renders
  const sparkStyle = useMemo(() => ({
    backgroundColor: color,
    x, 
    y,
    height: `${size}px`,
    width: `${size}px`,
    filter: "blur(0.5px) brightness(1.5)",
    boxShadow: `0 0 ${size * 3}px ${color}`
  }), [color, x, y, size]);

  // Memoize animation properties
  const animation = useMemo(() => ({
    initial: { opacity: 0, scale: 0 },
    animate: { 
      opacity: [0, 1, 0], 
      scale: [0, 1.8, 0],
      x: typeof x === 'string' ? 
         [x, `calc(${x} + ${xDelta}px)`] : 
         [`${x}px`, `${x + xDelta}px`],
      y: typeof y === 'string' ? 
         [y, `calc(${y} + ${yDelta}px)`] : 
         [`${y}px`, `${y + yDelta}px`],
    },
    transition: { 
      duration: 1.0 + (Math.random() * 0.5), 
      delay,
      ease: [0.36, 0.07, 0.19, 0.97]
    }
  }), [x, y, xDelta, yDelta, delay]);

  return {
    sparkStyle,
    animation
  };
} 