export const getToastMessage = (type: 'duplicate' | 'skip', t: (key: string) => string): string => {
  return type === 'duplicate' 
    ? t('game.status.duplicate')
    : t('game.status.skipped');
};