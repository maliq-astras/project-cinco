import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

export const steps = [
  {
    label: 'How would you rate your experience?',
    placeholder: 'Select a rating from 1 to 5'
  },
  {
    label: 'What feedback would you like to share?',
    placeholder: 'Tell us what you like or how we can improve'
  },
  {
    label: 'Would you like to share your email?',
    placeholder: 'We may reach out to discuss your ideas'
  }
];

export const ratingOptions = [
  '1 - Poor',
  '2 - Below Average',
  '3 - Average',
  '4 - Good',
  '5 - Excellent'
];

export const useFeedback = () => {
  const { colors } = useTheme();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    feedback: '',
    rating: '3 - Average',
    email: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isRatingDropdownOpen, setIsRatingDropdownOpen] = useState(false);
  const ratingDropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ratingDropdownRef.current && !ratingDropdownRef.current.contains(event.target as Node)) {
        setIsRatingDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ratingDropdownRef]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const selectRating = (rating: string) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
    setIsRatingDropdownOpen(false);
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    // In a real implementation, this would send the feedback to a server
    console.log('Feedback submitted:', formData);
    setSubmitted(true);
  };

  const progress = ((step + (submitted ? 1 : 0)) / steps.length) * 100;
  
  return {
    colors,
    step,
    formData,
    submitted,
    progress,
    steps,
    isRatingDropdownOpen,
    ratingDropdownRef,
    setIsRatingDropdownOpen,
    selectRating,
    handleChange,
    handleNext,
    handleSubmit
  };
}; 