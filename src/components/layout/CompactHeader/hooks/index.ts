import { useCompactHeaderState } from './useCompactHeaderState';
import { useCompactHeaderEvents } from './useCompactHeaderEvents';
import { useCompactHeaderEffects } from './useCompactHeaderEffects';
import { useCompactHeaderLogic } from './useCompactHeaderLogic';
import { useCompactSizes } from '../helpers';

export const useCompactHeader = () => {
  const state = useCompactHeaderState();
  const events = useCompactHeaderEvents(state);
  useCompactHeaderEffects(state);
  const logic = useCompactHeaderLogic(events);
  const compactSizes = useCompactSizes();
  
  return { 
    ...state,
    ...events, 
    ...logic,
    compactSizes
  };
};