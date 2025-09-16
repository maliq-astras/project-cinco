import { useAnswerDetailsModalState } from './useAnswerDetailsModalState';
import { useAnswerDetailsModalEvents } from './useAnswerDetailsModalEvents';
import { useAnswerDetailsModalLogic } from './useAnswerDetailsModalLogic';

interface UseAnswerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  answer: string;
}

export const useAnswerDetailsModal = (props: UseAnswerDetailsModalProps) => {
  const state = useAnswerDetailsModalState(props);
  const events = useAnswerDetailsModalEvents(state);
  const logic = useAnswerDetailsModalLogic(state, events);
  
  return { 
    ...state, 
    ...events, 
    ...logic 
  };
};