interface UseAnswerDetailsModalEventsProps {
  selectedFact: number | null;
  setSelectedFact: (fact: number | null) => void;
  onClose: () => void;
}

export const useAnswerDetailsModalEvents = ({ 
  setSelectedFact,
  onClose 
}: UseAnswerDetailsModalEventsProps) => {
  
  const handleFactSelect = (index: number) => {
    setSelectedFact(index);
  };

  const handleBackToGrid = () => {
    setSelectedFact(null);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return {
    handleFactSelect,
    handleBackToGrid,
    handleOverlayClick
  };
};