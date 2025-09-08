import { useRef, useState } from 'react';

export const useCompactHeaderState = () => {
  const logoRef = useRef<HTMLDivElement>(null);
  const categoryTitleRef = useRef<HTMLHeadingElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isBugReportModalOpen, setIsBugReportModalOpen] = useState(false);

  return {
    logoRef,
    categoryTitleRef,
    isMenuOpen,
    setIsMenuOpen,
    isFeedbackModalOpen,
    setIsFeedbackModalOpen,
    isBugReportModalOpen,
    setIsBugReportModalOpen
  };
};