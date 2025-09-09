import { CSSProperties } from 'react';

export const getContainerStyle = (spacing: number): CSSProperties => ({
  gap: `${spacing * 0.5}px`
});

export const getTextareaStyle = (primaryColor: string): CSSProperties => ({
  "--theme-color": `var(--color-${primaryColor})`,
  transitionProperty: "height, transform",
  transitionDuration: "200ms", 
  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  willChange: "height, transform",
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  transform: "translateY(0)",
  overflowY: "hidden"
} as CSSProperties);

export const getSubmitButtonStyle = (primaryColor: string, isDisabled: boolean): CSSProperties => ({
  color: `var(--color-${primaryColor})`,
  backgroundColor: `var(--color-${primaryColor}10)`,
  opacity: isDisabled ? 0.5 : 1
});