'use client';

import React from 'react';
import { Righteous } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { useFAQ } from '../../hooks/components/support';
import { faqSectionStyles } from '../../styles/faqSectionStyles';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

const FAQSection: React.FC = () => {
  const { colors, expandedIndex, faqItems, toggleItem } = useFAQ();

  return (
    <div className="flex flex-col w-full items-center h-full support-section">
      {/* FAQ Header */}
      <div className="w-full text-center">
        <h2 
          className={`${faqSectionStyles.header} ${righteous.className}`}
          style={faqSectionStyles.headerStyle(colors.primary)}
        >
          F.A.Q.
        </h2>
      </div>
      
      {/* Accordion container with fixed width - no overflow except in scrollContainer */}
      <div className="flex justify-center w-full flex-grow overflow-hidden">
        <div className="w-full max-w-[560px] overflow-hidden">
          <div className={faqSectionStyles.contentWrapper}>
            <div className={`${faqSectionStyles.scrollContainer} scrollable-accordion`}>
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
    </div>
  );
};

export default FAQSection; 