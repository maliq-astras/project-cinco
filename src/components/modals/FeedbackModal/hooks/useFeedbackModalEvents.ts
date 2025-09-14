import { useCallback } from 'react';

interface FeedbackModalEventsProps {
  onClose: () => void;
  setSubmitted: (submitted: boolean) => void;
}

export const useFeedbackModalEvents = (props: FeedbackModalEventsProps) => {
  const handleSubmit = useCallback(async (formData: any) => {
    // Here you would typically send the feedback to your backend
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    props.setSubmitted(true);
    setTimeout(() => {
      props.onClose();
    }, 2000);
  }, [props]);

  return {
    handleSubmit,
  };
};