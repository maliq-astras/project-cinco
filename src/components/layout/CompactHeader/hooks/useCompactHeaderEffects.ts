import { useEffect } from 'react';
import { useDOMRefs } from '@/providers/DOMRefsProvider';

interface UseCompactHeaderEffectsParams {
  logoRef: React.RefObject<HTMLDivElement | null>;
  categoryTitleRef: React.RefObject<HTMLHeadingElement | null>;
}

export const useCompactHeaderEffects = ({ 
  logoRef, 
  categoryTitleRef 
}: UseCompactHeaderEffectsParams) => {
  const { registerElement, unregisterElement } = useDOMRefs();
  
  useEffect(() => {
    if (logoRef.current) {
      registerElement('header-area', logoRef.current);
    }
    
    return () => {
      unregisterElement('header-area');
    };
  }, [registerElement, unregisterElement, logoRef]);

  useEffect(() => {
    if (categoryTitleRef.current) {
      registerElement('category-title', categoryTitleRef.current);
    }
    
    return () => {
      unregisterElement('category-title');
    };
  }, [registerElement, unregisterElement, categoryTitleRef]);
};