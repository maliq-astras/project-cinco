import { useBaseModalState } from './useBaseModalState';
import { useBaseModalEvents } from './useBaseModalEvents';
import { useBaseModalLogic } from './useBaseModalLogic';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  colors: {
    primary: string;
  };
  className?: string;
  dismissible?: boolean;
  mobileHeight?: string;
  desktopMaxHeight?: string;
}

export const useBaseModal = (props: BaseModalProps) => {
  const state = useBaseModalState(props);
  const logic = useBaseModalLogic();
  const events = useBaseModalEvents({ 
    onClose: props.onClose, 
    isMobile: logic.isMobile, 
    dismissible: state.dismissible 
  });
  
  return { 
    ...state, 
    ...logic, 
    ...events,
    children: props.children,
    className: props.className,
  };
};

export { useBaseModalState } from './useBaseModalState';
export { useBaseModalEvents } from './useBaseModalEvents';
export { useBaseModalLogic } from './useBaseModalLogic';