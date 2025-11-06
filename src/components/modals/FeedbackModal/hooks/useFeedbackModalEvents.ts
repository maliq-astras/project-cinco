import { useCallback } from 'react';

interface FeedbackModalEventsProps {
  onClose: () => void;
  setSubmitted: (submitted: boolean) => void;
}

export const useFeedbackModalEvents = (props: FeedbackModalEventsProps) => {
  const handleSubmit = useCallback(async (formData: { rating?: number; difficulty?: number; favoriteCategory?: string[]; leastFavoriteCategory?: string[] }) => {
    try {
      // Send to API
      const response = await fetch('/api/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: formData.rating || 0,
          difficulty: formData.difficulty || 0,
          favoriteCategory: formData.favoriteCategory || [],
          leastFavoriteCategory: formData.leastFavoriteCategory || [],
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit feedback');
      }

      // Success - show confirmation
      props.setSubmitted(true);
      setTimeout(() => {
        props.onClose();
      }, 2000);

    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Don't show success state on error - let user know it failed
      alert('Failed to submit feedback. Please try again.');
      // Close modal without showing success
      props.onClose();
    }
  }, [props]);

  return {
    handleSubmit,
  };
};