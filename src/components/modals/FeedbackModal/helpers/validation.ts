export const validateStep = (stepType: string, formData: any): boolean => {
  switch (stepType) {
    case 'rating':
      return formData.rating > 0;
    case 'difficulty':
      return formData.difficulty > 0;
    case 'favoriteCategory':
      return formData.favoriteCategory.length > 0;
    case 'leastFavoriteCategory':
      return formData.leastFavoriteCategory.length > 0;
    default:
      return false;
  }
};