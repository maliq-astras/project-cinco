import { useResumeGameModalState } from './useResumeGameModalState';

interface UseResumeGameModalProps {
  isOpen: boolean;
  onResume: () => void;
}

export const useResumeGameModal = ({ isOpen, onResume }: UseResumeGameModalProps) => {
  const state = useResumeGameModalState();

  return {
    ...state,
    isOpen,
    onResume,
  };
};