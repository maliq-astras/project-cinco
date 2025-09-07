import { CSSProperties } from 'react';


export function getGradientBackground(primaryColor: string, secondaryColor: string): CSSProperties {
  return {
    background: `linear-gradient(to right, var(--color-${primaryColor}), var(--color-${secondaryColor}))`
  };
}


export function getBottomShadowStyle(darkColor: string): CSSProperties {
  return {
    backgroundColor: `var(--color-${darkColor})`
  };
}