import { useMemo } from 'react';

interface AnimationProps {
  primaryColor: string;
}

export function useCardAnimations({ primaryColor }: AnimationProps) {
  const closeButtonAnimations = useMemo(() => ({
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { 
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  }), []);


  const closeButtonIconAnimations = useMemo(() => ({
    initial: { rotate: -90 },
    animate: { rotate: 0 },
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  }), []);


  const colorStyle = useMemo<React.CSSProperties>(() => ({
    color: `var(--color-${primaryColor})`
  }), [primaryColor]);


  const strokeStyle = useMemo(() => 
    `var(--color-${primaryColor})`, 
    [primaryColor]
  );

  return {
    closeButtonAnimations,
    closeButtonIconAnimations,
    colorStyle,
    strokeStyle
  };
} 