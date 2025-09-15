interface FeedbackFormData {
  rating?: number;
  difficulty?: number;
  favoriteCategory?: string[];
  leastFavoriteCategory?: string[];
}

export const validateStep = (stepType: string, formData: FeedbackFormData): boolean => {
  switch (stepType) {
    case 'rating':
      return (formData.rating ?? 0) > 0;
    case 'difficulty':
      return (formData.difficulty ?? 0) > 0;
    case 'favoriteCategory':
      return (formData.favoriteCategory ?? []).length > 0;
    case 'leastFavoriteCategory':
      return (formData.leastFavoriteCategory ?? []).length > 0;
    default:
      return false;
  }
};