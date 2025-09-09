import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';

interface UseGameTutorialEventsProps {
  isOpen: boolean;
  setCurrentStep: (step: number) => void;
  updatePositions: () => void;
  currentStep: number;
}

export const useGameTutorialEvents = ({
  isOpen,
  setCurrentStep,
  updatePositions,
  currentStep
}: UseGameTutorialEventsProps) => {
  const setTutorialOpen = useGameStore(state => state.setTutorialOpen);

  // Handle tutorial open/close state
  useEffect(() => {
    setTutorialOpen(isOpen);
    
    if (!isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen, setTutorialOpen, setCurrentStep]);

  // Handle position updates with delay
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      updatePositions();
    }, 50);
    
    return () => {
      clearTimeout(timer);
    };
  }, [currentStep, isOpen, updatePositions]);
};