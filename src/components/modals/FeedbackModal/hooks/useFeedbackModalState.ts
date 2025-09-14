import { useState, useMemo } from 'react';
import { CategoryType } from '@/types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  rating: number;
  difficulty: number;
  favoriteCategory: string[];
  leastFavoriteCategory: string[];
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
      label: 'feedback.steps.rating',
      type: 'rating'
    },
    {
      label: 'feedback.steps.difficulty',
      type: 'difficulty'
    },
    {
      label: 'feedback.steps.favoriteCategory',
      type: 'favoriteCategory'
    },
    {
      label: 'feedback.steps.leastFavoriteCategory',
      type: 'leastFavoriteCategory'
    }
  ], []);

  const initialFormData: FormData = useMemo(() => ({
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