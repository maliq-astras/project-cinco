import { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

// FAQ items data
export const faqItems = [
  {
    question: 'How do I play?',
    answer: 'Each day, you\'ll be presented with a new set of facts. Drag and drop the facts to match them with the correct categories. You have a limited time to complete as many matches as possible.'
  },
  {
    question: 'What is Hard Mode?',
    answer: 'Hard Mode adds an extra challenge with more difficult facts and less time per match. Try it if you\'re confident in your trivia knowledge!'
  },
  {
    question: 'Why are the daily themes different colors?',
    answer: 'The theme color changes daily based on the category. This helps create a unique visual experience for each day\'s challenge.'
  },
  {
    question: 'How does scoring work?',
    answer: 'You earn points for each correct match. The faster you match facts, the higher your score multiplier. Your final score is based on total correct matches and your average speed.'
  },
  {
    question: 'What is Final Five?',
    answer: 'Final Five is a special bonus round that unlocks after you complete the main challenge. It gives you five extra-challenging facts to test your knowledge.'
  }
];

export const useFAQ = () => {
  const { colors } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Toggle accordion item
  const toggleItem = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return {
    colors,
    expandedIndex,
    faqItems,
    toggleItem
  };
}; 