import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { useGameStore } from '@/store/gameStore';
import { useDOMRefs } from '@/providers/DOMRefsProvider';
import { useResponsive } from '@/hooks/responsive';
import { createTutorialSteps } from '../helpers';
import { useGameTutorialPositioning } from './useGameTutorialPositioning';

interface UseGameTutorialLogicProps {
  isOpen: boolean;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  setSpotlightStyles: (styles: { top: string; left: string; width: string; height: string }) => void;
  setTextBoxStyles: (styles: { top: string; left: string; width: string }) => void;
  onClose: () => void;
}

export const useGameTutorialLogic = ({
  isOpen,
  currentStep,
  setCurrentStep,
  setSpotlightStyles,
  setTextBoxStyles,
  onClose
}: UseGameTutorialLogicProps) => {
  const { t } = useTranslation('common');
  const { colors } = useTheme();
  const hardMode = useGameStore(state => state.hardMode);
  const { getElement } = useDOMRefs();
  const { width, height } = useResponsive();

  const tutorialSteps = createTutorialSteps(hardMode, t);

  const { updatePositions } = useGameTutorialPositioning({
    isOpen,
    currentStep,
    tutorialSteps,
    getElement,
    width,
    height,
    setSpotlightStyles,
    setTextBoxStyles
  });

  const handleClick = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const continueText = currentStep === tutorialSteps.length - 1 
    ? t('tutorial.navigation.finish')
    : t('tutorial.navigation.continue');

  return {
    colors,
    tutorialSteps,
    updatePositions,
    handleClick,
    continueText
  };
};