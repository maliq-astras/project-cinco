import { useState } from 'react';

export const useLogoState = () => {
  const [mounted, setMounted] = useState(false);
  
  return {
    mounted,
    setMounted
  };
};