import { useGameTutorialState } from './useGameTutorialState';
import { useGameTutorialEvents } from './useGameTutorialEvents';
import { useGameTutorialLogic } from './useGameTutorialLogic';

interface UseGameTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export const useGameTutorial = ({ isOpen, onClose }: UseGameTutorialProps) => {
  const state = useGameTutorialState();
  
  const logic = useGameTutorialLogic({
    isOpen,
    currentStep: state.currentStep,
    setCurrentStep: state.setCurrentStep,
    setSpotlightStyles: state.setSpotlightStyles,
    setTextBoxStyles: state.setTextBoxStyles,
    onClose
  });

  useGameTutorialEvents({
    isOpen,
    setCurrentStep: state.setCurrentStep,
    updatePositions: logic.updatePositions,
    currentStep: state.currentStep
  });

  return {
    currentStep: state.currentStep,
    spotlightStyles: state.spotlightStyles,
    textBoxStyles: state.textBoxStyles,
    colors: logic.colors,
    tutorialSteps: logic.tutorialSteps,
    handleClick: logic.handleClick,
    continueText: logic.continueText
  };
};