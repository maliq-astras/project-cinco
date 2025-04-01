import { useMemo } from 'react';

export interface SparkProps {
  delay: number;
  x: number | string;
  y: number | string;
  color: string;
  size?: number;
  xDelta?: number;
  yDelta?: number;
}

interface UseSparkAnimationProps {
  primaryColor: string;
  secondaryColor: string;
  count?: number;
  barWidth?: number;
  barHeight?: number;
}

export function useSparkAnimation({
  primaryColor,
  secondaryColor,
  count = 40,
  barWidth = 100, // percent
  barHeight = 10  // height in pixels (approximate)
}: UseSparkAnimationProps) {
  
  // Generate spark configuration
  const sparks = useMemo<SparkProps[]>(() => {
    const sparkConfigs: SparkProps[] = [];
    const whiteColor = "rgba(255, 255, 255, 0.9)";
    
    for (let i = 0; i < count; i++) {
      const x = Math.random() * barWidth; // random position along bar (%)
      const y = (Math.random() * barHeight) - (barHeight / 2); // random position vertically centered on bar
      const delay = Math.random() * 0.8; // longer staggered effect
      const distance = 30 + Math.random() * 60; // Particles travel farther
      const angle = Math.random() * Math.PI * 2; // 360 degree random angle
      const xDelta = Math.cos(angle) * distance;
      const yDelta = Math.sin(angle) * distance;
      
      // Mix in some white sparks for variety
      const sparkColor = Math.random() > 0.7 ? whiteColor : 
                         Math.random() > 0.5 ? primaryColor : secondaryColor;
      
      // Randomize size slightly
      const size = 1 + Math.random() * 1.5;
      
      sparkConfigs.push({
        delay,
        x: `${x}%`,
        y,
        color: sparkColor,
        size,
        xDelta,
        yDelta
      });
    }
    
    return sparkConfigs;
  }, [primaryColor, secondaryColor, count, barWidth, barHeight]);

  // Animation settings for the sparks container
  const containerAnimation = useMemo(() => ({
    initial: { opacity: 1 },
    animate: { opacity: -1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  }), []);

  // Animation settings for the final pulse effect
  const pulseAnimation = useMemo(() => ({
    animate: { 
      opacity: [0, 0.7, 0],
      scale: [1, 1.1, 1]
    },
    transition: { 
      duration: 1, 
      ease: "easeOut"
    }
  }), []);

  // Animation settings for individual sparks
  const getSparkAnimation = (x: string | number, y: number | string, xDelta: number = 0, yDelta: number = 0) => ({
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
      delay: Math.random() * 0.8,
      ease: [0.36, 0.07, 0.19, 0.97]
    }
  });

  return {
    sparks,
    containerAnimation,
    pulseAnimation,
    getSparkAnimation
  };
} 