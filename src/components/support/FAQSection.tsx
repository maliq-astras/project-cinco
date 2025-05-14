'use client';

import React from 'react';
import { Righteous } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { useFAQ } from '../../hooks/components/support';
import { faqSectionStyles } from '../../styles/faqSectionStyles';
import { supportPageStyles } from '../../styles/supportPageStyles';
import { useTheme } from '../../contexts/ThemeContext';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

const FAQSection: React.FC = () => {
  const { colors, expandedIndex, faqItems, toggleItem } = useFAQ();
  const theme = useTheme();

  return (
    <div className={`${supportPageStyles.card} ${supportPageStyles.cardDimensions}`} style={supportPageStyles.cardStyle(colors.primary)}>
      <div className={supportPageStyles.cardHeader}>
        <h2 
          className={`${supportPageStyles.sectionTitle} ${righteous.className}`}
          style={supportPageStyles.sectionTitleStyle(colors.primary)}
        >
          F.A.Q.
        </h2>
      </div>
      
      <div className={supportPageStyles.cardContent}>
        <div className={supportPageStyles.sectionContentWrapper}>
          <div className={supportPageStyles.sectionContentContainer}>
            <div className={`themed-scrollbar ${faqSectionStyles.scrollContainer}`}>
              <div className={faqSectionStyles.faqList}>
                {faqItems.map((item, index) => (
                  <div
                    key={index}
                    className={faqSectionStyles.faqItem}
                  >
                    <div className={faqSectionStyles.buttonWrapper}>
                      <button
                        onClick={() => toggleItem(index)}
                        className={faqSectionStyles.questionButton}
                        aria-expanded={expandedIndex === index}
                        aria-controls={`faq-answer-${index}`}
                      >
                        <h3 className={faqSectionStyles.questionText}>
                          {item.question}
                        </h3>
                        <div 
                          className={`${faqSectionStyles.iconContainer} ${
                            expandedIndex === index 
                              ? faqSectionStyles.iconContainerActive 
                              : faqSectionStyles.iconContainerInactive
                          }`}
                          style={faqSectionStyles.iconStyle(colors.primary)}
                        >
                          <svg 
                            className={faqSectionStyles.icon}
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </button>
                    </div>
                    <AnimatePresence>
                      {expandedIndex === index && (
                        <motion.div
                          id={`faq-answer-${index}`}
                          initial={faqSectionStyles.answerAnimation.initial}
                          animate={faqSectionStyles.answerAnimation.animate}
                          exit={faqSectionStyles.answerAnimation.exit}
                          transition={faqSectionStyles.answerAnimation.transition}
                          className={faqSectionStyles.answerContainer}
                        >
                          <div className={faqSectionStyles.answerText}>
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Empty footer to maintain consistent layout */}
      <div className={supportPageStyles.cardFooter}></div>
    </div>
  );
};

export default FAQSection; 