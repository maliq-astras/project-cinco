import { useFeedbackModalState } from './useFeedbackModalState';
import { useFeedbackModalEvents } from './useFeedbackModalEvents';
import { useFeedbackModalLogic } from './useFeedbackModalLogic';
import { useModalForm } from '../../BugReportModal/useModalForm';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const useFeedbackModal = (props: FeedbackModalProps) => {
  const state = useFeedbackModalState(props);
  const events = useFeedbackModalEvents({
    onClose: props.onClose,
    setSubmitted: state.setSubmitted,
  });
  const logic = useFeedbackModalLogic({
    steps: state.steps,
    initialFormData: state.initialFormData,
    handleSubmit: events.handleSubmit,
  });

  // Modal form state management
  const modalForm = useModalForm({
    steps: state.steps,
    initialFormData: state.initialFormData,
    onSubmit: events.handleSubmit,
  });

  // Custom handleInputChange that supports arrays for categories
  const handleInputChange = (value: string | string[] | number, field: string) => {
    modalForm.handleInputChange(value as string | number | File | null, field);
  };

  return {
    // State
    ...state,
    
    // Events
    ...events,
    
    // Logic
    ...logic,
    
    // Modal form (excluding original handleInputChange)
    step: modalForm.step,
    formData: modalForm.formData,
    submitted: modalForm.submitted,
    isDropdownOpen: modalForm.isDropdownOpen,
    isSecondDropdownOpen: modalForm.isSecondDropdownOpen,
    progress: modalForm.progress,
    setSubmitted: modalForm.setSubmitted,
    setIsDropdownOpen: modalForm.setIsDropdownOpen,
    setIsSecondDropdownOpen: modalForm.setIsSecondDropdownOpen,
    handleNext: modalForm.handleNext,
    handleBack: modalForm.handleBack,
    handleSelect: modalForm.handleSelect,
    handleSecondSelect: modalForm.handleSecondSelect,
    isStepValid: modalForm.isStepValid,
    
    // Custom handleInputChange
    handleInputChange,
  };
};

export { useFeedbackModalState } from './useFeedbackModalState';
export { useFeedbackModalEvents } from './useFeedbackModalEvents';
export { useFeedbackModalLogic } from './useFeedbackModalLogic';