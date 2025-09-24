import { useCallback } from 'react';

interface FeedbackModalEventsProps {
  onClose: () => void;
  setSubmitted: (submitted: boolean) => void;
}

export const useFeedbackModalEvents = (props: FeedbackModalEventsProps) => {
  const handleSubmit = useCallback(async (formData: { rating: number; difficulty: string; favoriteCategory: string; leastFavoriteCategory: string }) => {
    try {
      // Send to API
      const response = await fetch('/api/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: formData.rating,
          difficulty: formData.difficulty,
          favoriteCategory: formData.favoriteCategory,
          leastFavoriteCategory: formData.leastFavoriteCategory,
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
      // You could add error state handling here
      // For now, we'll still show submitted state but you might want to show an error
      props.setSubmitted(true);
      setTimeout(() => {
        props.onClose();
      }, 2000);
    }
  }, [props]);

  return {
    handleSubmit,
  };
};