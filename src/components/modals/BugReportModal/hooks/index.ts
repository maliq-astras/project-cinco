import { useBugReportModalState } from './useBugReportModalState';
import { useBugReportModalEvents } from './useBugReportModalEvents';
import { useBugReportModalLogic } from './useBugReportModalLogic';
import { useModalForm } from '../useModalForm';

interface BugReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const useBugReportModal = (props: BugReportModalProps) => {
  const state = useBugReportModalState(props);
  const events = useBugReportModalEvents({
    onClose: props.onClose,
    setSubmitted: state.setSubmitted,
    fileInputRef: state.fileInputRef,
    setIsDragging: state.setIsDragging,
    setTagSearch: state.setTagSearch,
  });
  const logic = useBugReportModalLogic({
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

  // Custom handleInputChange for proper typing
  const handleInputChange = (value: string | string[] | number | File | null, field: string) => {
    modalForm.handleInputChange(value as string | number | File | null, field);
  };

  return {
    // State
    ...state,
    
    // Events
    ...events,
    
    // Logic (ensuring colors and theme props are properly exposed)
    colors: logic.colors,
    isDarkMode: logic.isDarkMode,
    textSegmentBg: logic.textSegmentBg,
    isMobile: logic.isMobile,
    getMobileHeight: logic.getMobileHeight,
    getDesktopMaxHeight: logic.getDesktopMaxHeight,
    contentStyle: logic.contentStyle,
    
    // Modal form (excluding original handleInputChange)
    step: modalForm.step,
    formData: modalForm.formData,
    submitted: state.submitted, // Use state.submitted instead of modalForm.submitted
    isDropdownOpen: modalForm.isDropdownOpen,
    isSecondDropdownOpen: modalForm.isSecondDropdownOpen,
    progress: modalForm.progress,
    setIsDropdownOpen: modalForm.setIsDropdownOpen,
    setIsSecondDropdownOpen: modalForm.setIsSecondDropdownOpen,
    handleNext: modalForm.handleNext,
    handleBack: modalForm.handleBack,
    handleSelect: modalForm.handleSelect,
    handleSecondSelect: modalForm.handleSecondSelect,
    
    // Custom validation that works with our state
    isStepValid: (stepIdx: number) => {
      const currentStep = state.steps[stepIdx];
      if (currentStep.type === 'bugType') {
        return Array.isArray(modalForm.formData.bugType) && modalForm.formData.bugType.length > 0;
      }
      if (currentStep.type === 'deviceType') {
        return !!modalForm.formData.deviceType;
      }
      if (currentStep.type === 'details') {
        return typeof modalForm.formData.bugDetails === 'string' && modalForm.formData.bugDetails.trim().length > 0;
      }
      return modalForm.isStepValid(stepIdx);
    },
    
    // Custom handleInputChange
    handleInputChange,
  };
};

export { useBugReportModalState } from './useBugReportModalState';
export { useBugReportModalEvents } from './useBugReportModalEvents';
export { useBugReportModalLogic } from './useBugReportModalLogic';