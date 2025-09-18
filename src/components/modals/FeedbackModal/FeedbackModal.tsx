import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Righteous } from 'next/font/google';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import BaseModal from '@/components/modals/BaseModal/BaseModal';
import IconButton from '@/components/ui/IconButton';
import { useFeedbackModal } from './hooks';
import { formatStepLabel, getProgressBarStyle } from './helpers';
import styles from './FeedbackModal.module.css';
import { StarRating, DifficultySelector, CategorySelector } from './components';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

export default React.memo<FeedbackModalProps>(function FeedbackModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  
  const {
    // State
    steps,
    categoryOptions,
    difficultyOptions,
    difficultyHovered,
    setDifficultyHovered,
    submitted,
    
    // Logic
    isMobile,
    getMobileHeight,
    contentStyle,
    
    // Modal form
    step,
    formData,
    progress,
    handleNext,
    handleBack,
    handleInputChange,
    isStepValid,
  } = useFeedbackModal({ isOpen, onClose });

  const renderStepContent = () => {
    if (submitted) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col justify-center items-center h-full w-full"
          style={{ height: '100%' }}
        >
          <div className="flex flex-col items-center">
            <svg className={styles.successIcon + ' mb-4'} fill="none" stroke={`var(--color-${colors.primary})`} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h3 className={styles.successTitle}>{t('feedback.success.title')}</h3>
            <p className={styles.successMessage}>
              {t('feedback.success.message')}
            </p>
          </div>
        </motion.div>
      );
    }

    const currentStep = steps[step];

    return (
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className={styles.stepContainer}
      >
        {currentStep.type === 'rating' && (
          <StarRating
            value={formData.rating as number}
            onChange={(value) => handleInputChange(value, 'rating')}
            primaryColor={colors.primary}
          />
        )}

        {currentStep.type === 'difficulty' && (
          <DifficultySelector
            value={formData.difficulty as number}
            onChange={(value) => handleInputChange(value, 'difficulty')}
            hovered={difficultyHovered}
            setHovered={setDifficultyHovered}
            isMobile={isMobile}
            difficultyOptions={difficultyOptions}
            primaryColor={colors.primary}
          />
        )}

        {currentStep.type === 'favoriteCategory' && (
          <CategorySelector
            selectedItems={formData.favoriteCategory as string[]}
            onChange={(newSelected) => handleInputChange(newSelected, 'favoriteCategory')}
            categoryOptions={categoryOptions}
            instructionKey="feedback.category.favoriteInstructions"
          />
        )}

        {currentStep.type === 'leastFavoriteCategory' && (
          <CategorySelector
            selectedItems={formData.leastFavoriteCategory as string[]}
            onChange={(newSelected) => handleInputChange(newSelected, 'leastFavoriteCategory')}
            categoryOptions={categoryOptions}
            instructionKey="feedback.category.leastFavoriteInstructions"
          />
        )}
      </motion.div>
    );
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={<span className={righteous.className + ' uppercase'}>FEEDBACK</span>}
      colors={colors}
      className={isMobile ? undefined : "max-w-2xl"}
      mobileHeight={getMobileHeight()}
    >
      <div className={styles.content} style={contentStyle}>
        <AnimatePresence mode="wait">
          {submitted ? renderStepContent() : (
            <>
              <div style={{marginBottom: '2rem', marginTop: '1rem'}}>
                <h3
                  className={
                    righteous.className +
                    ' text-center mb-6 text-gray-800 dark:text-white' +
                    (isMobile ? ' text-base' : ' text-2xl')
                  }
                  style={{ letterSpacing: 1 }}
                >
                  {formatStepLabel(t(steps[step].label))}
                </h3>
              </div>
              <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {renderStepContent()}
              </div>
              <div className="w-full flex justify-between items-end mt-8" style={{minHeight: 48}}>
                {step > 0 ? (
                  <IconButton
                    icon="prev"
                    onClick={handleBack}
                    ariaLabel={t('feedback.navigation.prev')}
                  />
                ) : <span />}
                <IconButton
                  icon={step === steps.length - 1 ? "done" : "next"}
                  onClick={handleNext}
                  disabled={!isStepValid(step)}
                  ariaLabel={step === steps.length - 1 ? t('feedback.navigation.submit') : t('feedback.navigation.next')}
                />
              </div>
              <div className={styles.progressContainer} style={{marginTop: 16}}>
                <div style={getProgressBarStyle(colors.primary, progress)} />
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </BaseModal>
  );
});