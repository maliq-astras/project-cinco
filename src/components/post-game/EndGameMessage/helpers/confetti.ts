export interface ConfettiPiece {
  id: number;
  size: number;
  color: string;
  angle: number;
  delay: number;
}

export const generateConfettiPieces = (
  primaryColor: string,
  accentColor: string
): ConfettiPiece[] => {
  return Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    color: i % 2 === 0 ? `var(--color-${primaryColor})` : `var(--color-${accentColor})`,
    angle: (i * 18) % 360,
    delay: i * 0.05
  }));
};