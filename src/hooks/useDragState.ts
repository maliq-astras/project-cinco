import { create } from 'zustand';

interface DragState {
  isDragging: boolean;
  wasFactRevealed: boolean;
  setIsDragging: (isDragging: boolean) => void;
  setWasFactRevealed: (wasRevealed: boolean) => void;
}

/**
 * Hook for managing the global drag state
 * Used to show/hide the drop zone indicator when a bubble is being dragged
 */
export const useDragState = create<DragState>((set) => ({
  isDragging: false,
  wasFactRevealed: false,
  setIsDragging: (isDragging) => set({ isDragging }),
  setWasFactRevealed: (wasRevealed) => set({ wasFactRevealed: wasRevealed })
})); 