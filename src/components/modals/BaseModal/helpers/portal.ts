import { createPortal } from 'react-dom';

export const createModalPortal = (content: React.ReactNode): React.ReactPortal | null => {
  // Render using portal to document.body, bypassing any parent transforms
  if (typeof window !== 'undefined') {
    return createPortal(content, document.body);
  }

  // Fallback for SSR
  return null;
};