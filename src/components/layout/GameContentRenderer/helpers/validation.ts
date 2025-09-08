import { GameState } from '@/types';

/**
 * Check if game content should be rendered based on game state
 */
export const shouldRenderGameContent = (gameState: GameState): boolean => {
  return !!gameState.challenge;
};