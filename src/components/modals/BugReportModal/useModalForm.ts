import { useState } from 'react';

interface Step {
  label: string;
  type: string;
}

interface FormData {
  [key: string]: any;
}

interface UseModalFormProps {
  steps: Step[];
  initialFormData: FormData;
  onSubmit: (formData: FormData) => Promise<void>;
}

export const useModalForm = ({ steps, initialFormData, onSubmit }: UseModalFormProps) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSecondDropdownOpen, setIsSecondDropdownOpen] = useState(false);

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(prev => prev + 1);
    } else {
      try {
        await onSubmit(formData);
        setSubmitted(true);
      } catch (error) {
        console.error('Error submitting form:', error);
        // You might want to show an error message to the user here
      }
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSelect = (value: string, field: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDropdownOpen(false);
  };

  const handleSecondSelect = (value: string, field: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsSecondDropdownOpen(false);
  };

  const handleInputChange = (value: string | File | number | null, field: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const progress = ((step + (submitted ? 1 : 0)) / steps.length) * 100;

  const isStepValid = (currentStep: number): boolean => {
    const currentStepType = steps[currentStep].type;
    const value = formData[currentStepType];

    if (currentStepType === 'details') {
      return typeof value === 'string' && value.trim().length > 0;
    }

    return !!value;
  };

  return {
    step,
    formData,
    submitted,
    isDropdownOpen,
    isSecondDropdownOpen,
    progress,
    setSubmitted,
    setIsDropdownOpen,
    setIsSecondDropdownOpen,
    handleNext,
    handleBack,
    handleSelect,
    handleSecondSelect,
    handleInputChange,
    isStepValid
  };
}; 