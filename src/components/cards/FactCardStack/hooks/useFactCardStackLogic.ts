import { useGameStore } from '@/store/gameStore';
import { useCardStack } from './useCardStack';
import { useDOMRefs } from '@/providers/DOMRefsProvider';
import { useResponsive } from '@/hooks/responsive';
import { useFactCardStackEffects } from './useFactCardStackEffects';
import { useFactCardStackActions } from './useFactCardStackActions';
import { useFactCardStackComputations } from './useFactCardStackComputations';

export function useFactCardStack() {
  // External dependencies
  const revealedFacts = useGameStore(state => state.gameState.revealedFacts);
  const facts = useGameStore(state => state.gameState.challenge?.facts || []);
  const handleCardClick = useGameStore(state => state.handleCardClick);
  const viewingFact = useGameStore(state => state.viewingFact);
  const isReturningToStack = useGameStore(state => state.isReturningToStack);
  const isCardAnimatingOut = useGameStore(state => state.isCardAnimatingOut);
  const canRevealNewClue = useGameStore(state => state.canRevealNewClue);
  const isVictoryAnimationActive = useGameStore(state => state.isVictoryAnimationActive);
  const victoryAnimationStep = useGameStore(state => state.victoryAnimationStep);
  
  const { 
    responsiveValues,
    breakpoint,
    getResponsiveValue
  } = useResponsive();
  
  const { registerElement, unregisterElement } = useDOMRefs();
  
  // Actions
  const { onCardClicked, isCardClickable } = useFactCardStackActions({
    canRevealNewClue,
    revealedFacts,
    handleCardClick
  });

  // Card stack hook with computed visible facts
  const cardStackHook = useCardStack(revealedFacts.filter(factIndex => 
    factIndex !== viewingFact || (isReturningToStack && !isCardAnimatingOut)
  ), onCardClicked);
  
  // Computations
  const {
    visibleStackFacts,
    cardSize,
    getContainerHeight,
    getCardVariants
  } = useFactCardStackComputations({
    revealedFacts,
    viewingFact,
    isReturningToStack,
    isCardAnimatingOut,
    responsiveValues,
    hoveredCardIndex: cardStackHook.hoveredCardIndex,
    isCardReturning: cardStackHook.isCardReturning,
    isInitialRender: cardStackHook.isInitialRender,
    breakpoint,
    isVictoryAnimationActive,
    victoryAnimationStep: victoryAnimationStep || '',
    getResponsiveValue,
    isCardClickable
  });

  // Side effects
  useFactCardStackEffects({
    stackRef: cardStackHook.stackRef,
    cardRefs: cardStackHook.cardRefs,
    registerElement,
    unregisterElement
  });

  const containerStyles = {
    main: {
      minHeight: `${getContainerHeight()}px`, 
      paddingTop: `${responsiveValues.spacing}px`, 
      paddingBottom: `${responsiveValues.spacing}px`
    },
    inner: {
      perspective: '1000px',
      transform: `rotateX(${cardStackHook.handPosition.y * -3}deg) rotateY(${cardStackHook.handPosition.x * 5}deg)`,
      width: '100%',
      height: `${getContainerHeight() - (responsiveValues.spacing * 2)}px`
    }
  };

  return {
    facts,
    visibleStackFacts,
    isVictoryAnimationActive,
    ...cardStackHook,
    cardSize,
    containerStyles,
    onCardClicked,
    isCardClickable,
    getCardVariants,
    responsiveValues,
    breakpoint
  };
} 