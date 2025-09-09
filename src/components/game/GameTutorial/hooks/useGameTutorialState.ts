import { useState } from 'react';

export const useGameTutorialState = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [spotlightStyles, setSpotlightStyles] = useState({
    top: '0px',
    left: '0px',
    width: '0px',
    height: '0px'
  });
  const [textBoxStyles, setTextBoxStyles] = useState({
    top: '0px',
    left: '0px',
    width: '0px'
  });

  return {
    currentStep,
    setCurrentStep,
    spotlightStyles,
    setSpotlightStyles,
    textBoxStyles,
    setTextBoxStyles
  };
};