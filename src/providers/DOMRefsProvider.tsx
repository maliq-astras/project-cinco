import React, { createContext, useContext, useRef, useCallback, ReactNode } from 'react';

interface DOMRefsContextType {
  registerElement: (targetId: string, element: HTMLElement | null) => void;
  unregisterElement: (targetId: string) => void;
  getElement: (targetId: string) => HTMLElement | null;
}

const DOMRefsContext = createContext<DOMRefsContextType | null>(null);

interface DOMRefsProviderProps {
  children: ReactNode;
}

export const DOMRefsProvider: React.FC<DOMRefsProviderProps> = ({ children }) => {
  const elementRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const registerElement = useCallback((targetId: string, element: HTMLElement | null) => {
    elementRefs.current[targetId] = element;
  }, []);

  const unregisterElement = useCallback((targetId: string) => {
    delete elementRefs.current[targetId];
  }, []);

  const getElement = useCallback((targetId: string): HTMLElement | null => {
    return elementRefs.current[targetId] || null;
  }, []);

  return (
    <DOMRefsContext.Provider value={{ registerElement, unregisterElement, getElement }}>
      {children}
    </DOMRefsContext.Provider>
  );
};

export const useDOMRefs = () => {
  const context = useContext(DOMRefsContext);
  if (!context) {
    throw new Error('useDOMRefs must be used within a DOMRefsProvider');
  }
  return context;
};
