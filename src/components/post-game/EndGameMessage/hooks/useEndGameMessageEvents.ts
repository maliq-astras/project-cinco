interface UseEndGameMessageEventsProps {
  setIsAnswerModalOpen: (open: boolean) => void;
  correctAnswer: string;
}

export const useEndGameMessageEvents = ({
  setIsAnswerModalOpen,
  correctAnswer: _correctAnswer
}: UseEndGameMessageEventsProps) => {
  const handleAnswerClick = () => {
    setIsAnswerModalOpen(true);
  };

  const handleAnswerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsAnswerModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsAnswerModalOpen(false);
  };

  const getAnswerAriaLabel = (displayAnswer: string) => {
    return `Learn more about ${displayAnswer}`;
  };

  return {
    handleAnswerClick,
    handleAnswerKeyDown,
    handleCloseModal,
    getAnswerAriaLabel
  };
};