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

  // Render navigation dots
  const renderNavDots = () => {
    return (
      <div className={supportPageStyles.navDotsContainer}>
        {Object.keys(sections).map((key) => (
          <button
            key={key}
            onClick={() => navigateToSection(key)}
            className={supportPageStyles.navDot}
            style={supportPageStyles.navDotStyle(colors.primary, activeSection === key)}
            aria-label={t(`Navigate to ${sections[key].label}`)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={supportPageStyles.container}>
      <SupportHeader />
      
      <div className={supportPageStyles.contentContainer}>
        <div className={supportPageStyles.mainContent}>
          <AnimatePresence mode="wait">
            {activeSection && isThemeReady && (
              <motion.div
                key={activeSection}
                initial={animationDirection === 'forward' ? supportPageStyles.sectionAnimation.initial : supportPageStyles.reverseAnimation.initial}
                animate={animationDirection === 'forward' ? supportPageStyles.sectionAnimation.animate : supportPageStyles.reverseAnimation.animate}
                exit={animationDirection === 'forward' ? supportPageStyles.sectionAnimation.exit : supportPageStyles.reverseAnimation.exit}
                transition={animationDirection === 'forward' ? supportPageStyles.sectionAnimation.transition : supportPageStyles.reverseAnimation.transition}
                className={supportPageStyles.section}
              >
                {renderSection()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {!isThemeReady && (
          <motion.div
            className={supportPageStyles.loadingContainer}
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

      {isThemeReady && renderNavLinks()}
      {isThemeReady && renderNavDots()}
    </div>
  );
};

export default SupportPage; 