import { useMemo } from 'react';
import { useAnswerDetailsModalData } from './useAnswerDetailsModalData';
import { createRenderingHelpers } from '../helpers';

interface UseAnswerDetailsModalLogicProps {
  isMobileLayout: boolean;
  width: number;
  viewportHeight: number;
  isOpen: boolean;
  answer: string;
}

interface UseAnswerDetailsModalLogicEvents {
  handleFactSelect: (index: number) => void;
  handleBackToGrid: () => void;
  handleOverlayClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const useAnswerDetailsModalLogic = (
  { isMobileLayout, width, viewportHeight, isOpen, answer }: UseAnswerDetailsModalLogicProps,
  events: UseAnswerDetailsModalLogicEvents
) => {
  const data = useAnswerDetailsModalData();
  
  // Use responsive layout detection - same as rest of app
  const useTopDownLayout = isMobileLayout;

  // Calculate exact dimensions for video/photo and 8 squares grid
  const dimensions = useMemo(() => {
    const viewportWidth = window.innerWidth;
    
    if (useTopDownLayout) {
      // Top/down layout: ALWAYS 2x4 rectangles, video horizontal
      const padding = 32;
      const gap = 16;
      const textMinHeight = 120;
      
      const availableWidth = viewportWidth - padding;
      const availableHeight = viewportHeight - padding - textMinHeight;
      
      // Calculate rectangle dimensions to fit 2 across
      const gridGap = 16; // Increased gap for better spacing
      const rectWidth = Math.round((availableWidth - gridGap) / 2);
      const rectHeight = Math.round(rectWidth * 0.65); // Rectangle aspect ratio
      
      // Grid dimensions: 2x4 rectangles
      const gridWidth = (2 * rectWidth) + gridGap;
      const gridHeight = (4 * rectHeight) + (3 * gridGap);
      
      // Video: horizontal, matches grid width, 16:9 ratio
      const videoWidth = gridWidth;
      const videoHeight = Math.round(videoWidth * 9/16);
      
      // Check if everything fits, scale down if needed
      const totalContentHeight = videoHeight + gap + gridHeight;
      if (totalContentHeight > availableHeight) {
        const scale = availableHeight / totalContentHeight;
        return {
          videoWidth: Math.round(videoWidth * scale),
          videoHeight: Math.round(videoHeight * scale),
          squareSize: Math.round(rectWidth * scale),
          rectHeight: Math.round(rectHeight * scale),
          gridGap: Math.round(gridGap * scale),
          gridWidth: Math.round(gridWidth * scale),
          gridHeight: Math.round(gridHeight * scale),
          isMobileLayout: true
        };
      }
      
      return {
        videoWidth,
        videoHeight,
        squareSize: rectWidth,
        rectHeight,
        gridGap,
        gridWidth,
        gridHeight,
        isMobileLayout: true
      };
    } else {
      // Side-by-side layout: video left, squares right, SAME SIZE
      const padding = 80;
      const middleGap = 32; // Gap between video and squares
      
      const availableWidth = viewportWidth - padding - middleGap;
      const availableHeight = viewportHeight - padding;
      
      // Split width equally between video and squares
      const sectionWidth = availableWidth / 2;
      
      const gridGap = 16;
      const squareSize = Math.round((sectionWidth - (3 * gridGap)) / 4);
      
      // Grid dimensions: 4x2 squares
      const gridWidth = (4 * squareSize) + (3 * gridGap);
      const gridHeight = (2 * squareSize) + gridGap;
      
      // Video EXACTLY matches grid size
      const videoWidth = gridWidth;
      const videoHeight = gridHeight;
      
      // Check if height fits, scale down if needed
      if (gridHeight > availableHeight) {
        const scale = availableHeight / gridHeight;
        return {
          videoWidth: Math.round(videoWidth * scale),
          videoHeight: Math.round(videoHeight * scale),
          squareSize: Math.round(squareSize * scale),
          rectHeight: Math.round(squareSize * scale),
          gridGap: Math.round(gridGap * scale),
          gridWidth: Math.round(gridWidth * scale),
          gridHeight: Math.round(gridHeight * scale),
          isMobileLayout: false
        };
      }
      
      return {
        videoWidth,
        videoHeight,
        squareSize,
        rectHeight: squareSize,
        gridGap,
        gridWidth,
        gridHeight,
        isMobileLayout: false
      };
    }
  }, [useTopDownLayout, width, viewportHeight, isOpen]);

  const renderingHelpers = createRenderingHelpers({
    answer,
    challenge: data.challenge!,
    dimensions,
    factTypes: data.factTypes,
    category: data.category,
    colors: data.colors,
    placeholderFacts: data.placeholderFacts,
    language: data.language,
    useTopDownLayout,
    darkMode: data.darkMode,
    handleFactSelect: events.handleFactSelect,
    handleBackToGrid: events.handleBackToGrid
  });

  return {
    useTopDownLayout,
    dimensions,
    ...data,
    ...renderingHelpers
  };
};