import { v4 as uuidv4 } from 'uuid';
import { CategoryType } from '../../src/types';

// Base interface for all category generators
export interface ChallengeGenerator {
  generate(count: number, startDate: Date): any[];
  getData(): any[];
}

// Helper function to create date strings using Eastern timezone
export function getDateString(baseDate: Date, daysFromBase: number): string {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + daysFromBase);
  
  // Format using Eastern timezone
  const easternFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  return easternFormatter.format(date);
}

// Helper to shuffle arrays (for alternatives)
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Base class for challenge generation
export abstract class BaseChallengeGenerator implements ChallengeGenerator {
  protected category: CategoryType;
  protected factTypes: string[];
  protected subjectPool: { 
    answer: string;
    facts: Record<string, string>;
    expanded?: Record<string, string>;
    alternatives: string[];
    imageUrl?: string;
    youtubeUrl?: string;
    citation?: string;
    translations?: {
      es?: {
        facts: Record<string, string>;
        answer: string;
        alternatives: string[];
      }
    }
  }[];

  constructor(
    category: CategoryType, 
    factTypes: string[],
    subjectPool: any[]
  ) {
    this.category = category;
    this.factTypes = factTypes;
    this.subjectPool = subjectPool;
  }

  getData(): any[] {
    return this.subjectPool;
  }

  generate(count: number, startDate: Date): any[] {
    const challenges = [];
    
    // Make sure we don't try to generate more challenges than we have subjects
    const actualCount = Math.min(count, this.subjectPool.length);
    
    // Shuffle the subject pool to get random subjects
    const shuffledSubjects = shuffleArray(this.subjectPool);
    
    for (let i = 0; i < actualCount; i++) {
      const subject = shuffledSubjects[i];
      
      challenges.push({
        challengeId: uuidv4(),
        date: getDateString(startDate, i),
        category: this.category,
        facts: this.factTypes.map(factType => ({
          factType,
          content: subject.facts[factType] || `No fact available for ${factType}`,
          category: this.category
        })),
        expanded: subject.expanded,
        answer: subject.answer,
        imageUrl: subject.imageUrl,
        youtubeUrl: subject.youtubeUrl,
        citation: subject.citation,
        alternatives: subject.alternatives || []
      });
    }
    
    return challenges;
  }
}