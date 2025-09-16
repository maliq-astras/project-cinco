import { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGameStore } from '@/store/gameStore';

export const useAnswerDetailsModalData = () => {
  const { colors, darkMode } = useTheme();
  const { language } = useLanguage();
  const challenge = useGameStore(state => state.gameState.challenge);

  const factTypes = challenge?.facts?.map(fact => fact.factType) || [];
  const category = challenge?.category?.toString().toLowerCase() || 'countries';

  const placeholderFacts = useMemo(() => {
    return factTypes.map((factType) => {
      const factTypeMap: { [key: string]: string } = {
        'Language(s)': "Detailed information about the languages spoken in this country, including official languages, dialects, and linguistic diversity.",
        'Flag': "The story behind the flag design, its colors, symbols, and what they represent in the country's history and culture.",
        'Notable City': "Information about major cities, their significance, population, and what makes them important to the country.",
        'Political History': "The political system, government structure, and major historical political events that shaped the nation.",
        'Economy': "Economic data including major industries, exports, GDP information, and what drives the country's economy.",
        'Culture & Tradition': "Cultural practices, festivals, traditions, cuisine, and customs that define the country's identity.",
        'Geography & Border': "Physical geography, neighboring countries, major landforms, climate, and geographical features.",
        'Wildcard': "Unique and interesting facts that don't fit into other categories but are fascinating about this country."
      };
      
      return factTypeMap[factType] || `Detailed information about ${factType.toLowerCase()} related to this answer.`;
    });
  }, [factTypes]);

  return {
    colors,
    darkMode,
    language,
    challenge,
    factTypes,
    category,
    placeholderFacts
  };
};