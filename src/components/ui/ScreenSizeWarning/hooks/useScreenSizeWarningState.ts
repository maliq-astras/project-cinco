import { useState, useEffect } from 'react';

export const useScreenSizeWarningState = () => {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only showing conditional icon after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  return { mounted };
};