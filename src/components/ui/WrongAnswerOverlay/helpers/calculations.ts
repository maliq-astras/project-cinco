export const calculateRemainingGuesses = (maxGuesses: number, wrongGuessCount: number): number => {
  return maxGuesses - wrongGuessCount;
};

export const generateXMarkSlots = (maxXMarks: number = 5): number[] => {
  return Array.from({ length: maxXMarks }, (_, i) => i);
};