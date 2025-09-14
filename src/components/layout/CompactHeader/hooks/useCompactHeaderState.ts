import { useRef, useState } from 'react';

export const useCompactHeaderState = () => {
  const logoRef = useRef<HTMLDivElement>(null);
  const categoryTitleRef = useRef<HTMLHeadingElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBugReportModalOpen, setIsBugReportModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  return {
    logoRef,
    categoryTitleRef,
    isMenuOpen,
    setIsMenuOpen,
    isBugReportModalOpen,
    setIsBugReportModalOpen,
    isFeedbackModalOpen,
    setIsFeedbackModalOpen
  };
};