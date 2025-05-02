'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SupportHeader from './SupportHeader';
import FAQSection from './FAQSection';
import BugReportSection from './BugReportSection';
import FeedbackSection from './FeedbackSection';
import { useSupportPage } from '../../hooks/components/support/useSupportPage';
import { supportPageStyles } from '../../styles/supportPageStyles';

interface SupportPageProps {
  initialSection: string;
}

const SupportPage: React.FC<SupportPageProps> = ({ initialSection }) => {
  const { t } = useTranslation();
  const {
    activeSection,
    navigateToSection,
    animationDirection,
    sections,
    colors,
    isThemeReady,
    spinnerStyle
  } = useSupportPage(initialSection);

  // Render the active section
  const renderSection = () => {
    switch (activeSection) {
      case 'faq':
        return <FAQSection key="faq" />;
      case 'bug':
        return <BugReportSection key="bug" />;
      case 'feedback':
        return <FeedbackSection key="feedback" />;
      default:
        return <FAQSection key="faq" />;
    }
  };

  // Render navigation links
  const renderNavLinks = () => {
    const currentSection = sections[activeSection];
    
    return (
      <div className={supportPageStyles.navLinksContainer}>
        {/* Previous link - always shown in cyclical navigation */}
        <button
          onClick={() => navigateToSection(currentSection.prev)}
          className={supportPageStyles.navLink}
          style={supportPageStyles.navLinkStyle(colors.primary)}
          aria-label={t(`Previous: ${sections[currentSection.prev].label}`)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            className={supportPageStyles.navIcon}
            style={supportPageStyles.navIconStyle(colors.primary)}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>{sections[currentSection.prev].shortLabel}</span>
        </button>
        
        {/* Next link - always shown in cyclical navigation */}
        <button
          onClick={() => navigateToSection(currentSection.next)}
          className={supportPageStyles.navLink}
          style={supportPageStyles.navLinkStyle(colors.primary)}
          aria-label={t(`Next: ${sections[currentSection.next].label}`)}
        >
          <span>{sections[currentSection.next].shortLabel}</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            className={supportPageStyles.navIcon}
            style={supportPageStyles.navIconStyle(colors.primary)}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  };

  // Render section indicator dots
  const renderSectionDots = () => {
    const sectionIds = Object.keys(sections);
    
    return (
      <div className={supportPageStyles.navDotsContainer}>
        {sectionIds.map(id => (
          <button
            key={id}
            onClick={() => navigateToSection(id)}
            className={supportPageStyles.navDot}
            style={supportPageStyles.navDotStyle(colors.primary, id === activeSection)}
            aria-label={t(`Go to ${sections[id].label}`)}
            aria-current={id === activeSection ? 'true' : 'false'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={supportPageStyles.container}>
      <SupportHeader />
      
      <AnimatePresence>
        {!isThemeReady && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-40 bg-white dark:bg-gray-950"
            initial={supportPageStyles.loadingAnimation.initial}
            exit={supportPageStyles.loadingAnimation.exit}
            transition={supportPageStyles.loadingAnimation.transition}
          >
            <div 
              className="w-12 h-12 rounded-full animate-spin"
              style={spinnerStyle}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isThemeReady && (
          <motion.div
            className="w-full flex-1 flex flex-col"
            initial={supportPageStyles.pageAnimation.initial}
            animate={supportPageStyles.pageAnimation.animate}
            transition={supportPageStyles.pageAnimation.transition}
          >
            <div className={supportPageStyles.contentContainer}>
              {/* Main content with section animations */}
              <div className={supportPageStyles.mainContent}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    initial={
                      animationDirection === 'forward' 
                        ? supportPageStyles.sectionAnimation.initial 
                        : supportPageStyles.reverseAnimation.initial
                    }
                    animate={
                      animationDirection === 'forward'
                        ? supportPageStyles.sectionAnimation.animate
                        : supportPageStyles.reverseAnimation.animate
                    }
                    exit={
                      animationDirection === 'forward'
                        ? supportPageStyles.sectionAnimation.exit
                        : supportPageStyles.reverseAnimation.exit
                    }
                    transition={supportPageStyles.sectionAnimation.transition}
                    className={supportPageStyles.section}
                  >
                    {renderSection()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            
            {/* Navigation links */}
            {renderNavLinks()}
            
            {/* Section indicator dots */}
            {renderSectionDots()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupportPage; 