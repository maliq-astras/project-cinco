import { useState, useMemo } from 'react';
import { CategoryType } from '@/types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FeedbackFormData {
  rating: number;
  difficulty: number;
  favoriteCategory: string[];
  leastFavoriteCategory: string[];
  [key: string]: string | string[] | number | File | null | undefined;
}

const categoryOptions = Object.values(CategoryType);

const difficultyOptions = [
  'tooEasy',
  'somewhatEasy',
  'justRight',
  'somewhatChallenging',
  'tooChallenging',
];

export const useFeedbackModalState = (props: FeedbackModalProps) => {
  const [difficultyHovered, setDifficultyHovered] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const steps = useMemo(() => [
    {
      id: 'rating',
      title: 'feedback.steps.rating',
      label: 'feedback.steps.rating',
      type: 'rating'
    },
    {
      id: 'difficulty',
      title: 'feedback.steps.difficulty',
      label: 'feedback.steps.difficulty',
      type: 'difficulty'
    },
    {
      id: 'favoriteCategory',
      title: 'feedback.steps.favoriteCategory',
      label: 'feedback.steps.favoriteCategory',
      type: 'favoriteCategory'
    },
    {
      id: 'leastFavoriteCategory',
      title: 'feedback.steps.leastFavoriteCategory',
      label: 'feedback.steps.leastFavoriteCategory',
      type: 'leastFavoriteCategory'
    }
  ], []);

  const initialFormData: FeedbackFormData = useMemo(() => ({
    rating: 0,
    difficulty: 0,
    favoriteCategory: [],
    leastFavoriteCategory: []
  }), []);

  return {
    // Props
    isOpen: props.isOpen,
    onClose: props.onClose,
    
    // State
    difficultyHovered,
    setDifficultyHovered,
    submitted,
    setSubmitted,
    
    // Constants
    steps,
    initialFormData,
    categoryOptions,
    difficultyOptions,
  };
};