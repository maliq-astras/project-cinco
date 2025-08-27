import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Righteous } from 'next/font/google';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { feedbackModalStyles } from './FeedbackModal.styles';
import BaseModal from '@/components/modals/BaseModal/BaseModal';
import ModalNavButton from '@/components/modals/ModalNavButton/ModalNavButton';
import { useResponsive } from '@/hooks/responsive';
import { useThemeDOM } from '@/hooks/theme';
import { useModalForm } from '../BugReportModal/useModalForm';
import { CategoryType, categoryColorMap, CATEGORY_COLOR_MAPPING } from '../../../types';
import { getCategoryName } from '../../../helpers/i18nHelpers';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const righteous = Righteous({ weight: '400', subsets: ['latin'] });



const categoryOptions = Object.values(CategoryType);

const difficultyOptions = [
  'tooEasy',
  'somewhatEasy',
  'justRight',
  'somewhatChallenging',
  'tooChallenging',
];

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { t } = useTranslation();
  const { colors, darkMode } = useTheme();
  const { hasClass } = useThemeDOM();
  
  // Use our new responsive system
  const { 
    breakpoint, 
    responsiveValues 
  } = useResponsive();
  
  // Use responsive breakpoint for mobile detection
  const isMobile = breakpoint === 'xs' || breakpoint === 'sm';

  const steps = [
    {
      label: t('feedback.steps.rating'),
      type: 'rating'
    },
    {
      label: t('feedback.steps.difficulty'),
      type: 'difficulty'
    },
    {
      label: t('feedback.steps.favoriteCategory'),
      type: 'favoriteCategory'
    },
    {
      label: t('feedback.steps.leastFavoriteCategory'),
      type: 'leastFavoriteCategory'
    }
  ];

  const initialFormData = {
    rating: 0,
    difficulty: 0,
    favoriteCategory: '',
    leastFavoriteCategory: ''
  };

  const handleSubmit = async (formData: any) => {
    // Here you would typically send the feedback to your backend
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const {
    step,
    formData,
    submitted,
    isDropdownOpen,
    isSecondDropdownOpen,
    progress,
    setIsDropdownOpen,
    setIsSecondDropdownOpen,
    handleNext,
    handleBack,
    handleSelect,
    handleSecondSelect,
    handleInputChange,
    isStepValid
  } = useModalForm({
    steps,
    initialFormData,
    onSubmit: handleSubmit
  });

  const [difficultyHovered, setDifficultyHovered] = React.useState<number | null>(null);

  const renderStarRating = (value: number, onChange: (value: number) => void) => (
    <div className="flex justify-center gap-2 mb-6">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          className="transition-transform duration-150 cursor-pointer focus:outline-none"
          style={{
            color: star <= value ? `var(--color-${colors.primary})` : (hasClass('dark') ? '#444' : '#ccc'),
            fontSize: '2.4rem',
            transform: 'scale(1)',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          ★
        </button>
      ))}
    </div>
  );

  const renderDifficultySelector = (value: number, onChange: (value: number) => void, hovered: number | null, setHovered: (v: number | null) => void) => {
    // Bubble sizes: [large, medium, small, medium, large]
    const sizes = [48, 40, 32, 40, 48];
    const labelColor = darkMode ? '#fff' : '#111';
    return (
      <div className="flex flex-col items-center mb-6 w-full">
        {isMobile ? (
          <div className="relative w-full max-w-2xl flex items-center justify-center" style={{paddingBottom: 32}}>
            {[1, 2, 3, 4, 5].map((idx) => {
              const isActive = (hovered ? idx === hovered : idx === value);
              return (
                <div key={idx} className="flex flex-col items-center relative" style={{marginLeft: idx === 1 ? 0 : 12, marginRight: idx === 5 ? 0 : 12}}>
                  <button
                    type="button"
                    onClick={() => onChange(idx)}
                    onMouseEnter={() => setHovered(idx)}
                    onMouseLeave={() => setHovered(null)}
                    aria-label={t(`feedback.difficulty.options.${difficultyOptions[idx - 1]}`)}
                    className="transition-all duration-150 focus:outline-none"
                    style={{
                      width: sizes[idx - 1],
                      height: sizes[idx - 1],
                      borderRadius: '50%',
                      border: `3px solid var(--color-${colors.primary})`,
                      background: isActive ? `var(--color-${colors.primary})` : 'transparent',
                      boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: 'none',
                      cursor: 'pointer',
                      transition: 'background 0.15s, box-shadow 0.15s',
                    }}
                  >
                    {/* For accessibility, visually hidden label */}
                    <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(1px, 1px, 1px, 1px)' }}>{t(`feedback.difficulty.options.${difficultyOptions[idx - 1]}`)}</span>
                  </button>
                  {/* Absolutely position Easy/Hard below first/last bubble */}
                  {idx === 1 && (
                    <span className="text-base font-semibold" style={{ color: labelColor, textAlign: 'center', width: sizes[0], position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: sizes[0] + 6 }}>{t('feedback.difficulty.easy')}</span>
                  )}
                  {idx === 5 && (
                    <span className="text-base font-semibold" style={{ color: labelColor, textAlign: 'center', width: sizes[4], position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: sizes[4] + 6 }}>{t('feedback.difficulty.hard')}</span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-8 w-full max-w-2xl">
            <span className="text-base md:text-lg font-semibold flex items-center" style={{ color: labelColor, minWidth: 70, textAlign: 'right', lineHeight: '44px', height: 48 }}>{t('feedback.difficulty.easy')}</span>
            <div className="flex gap-6 items-center">
              {[1, 2, 3, 4, 5].map((idx) => {
                const isActive = (hovered ? idx === hovered : idx === value);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onChange(idx)}
                    onMouseEnter={() => setHovered(idx)}
                    onMouseLeave={() => setHovered(null)}
                    aria-label={t(`feedback.difficulty.options.${difficultyOptions[idx - 1]}`)}
                    className="transition-all duration-150 focus:outline-none"
                    style={{
                      width: sizes[idx - 1],
                      height: sizes[idx - 1],
                      borderRadius: '50%',
                      border: `3px solid var(--color-${colors.primary})`,
                      background: isActive ? `var(--color-${colors.primary})` : 'transparent',
                      boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: 'none',
                      cursor: 'pointer',
                      transition: 'background 0.15s, box-shadow 0.15s',
                    }}
                  >
                    {/* For accessibility, visually hidden label */}
                    <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(1px, 1px, 1px, 1px)' }}>{t(`feedback.difficulty.options.${difficultyOptions[idx - 1]}`)}</span>
                  </button>
                );
              })}
            </div>
            <span className="text-base md:text-lg font-semibold flex items-center" style={{ color: labelColor, minWidth: 70, textAlign: 'left', lineHeight: '44px', height: 48 }}>{t('feedback.difficulty.hard')}</span>
          </div>
        )}
      </div>
    );
  };

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
            <svg className={feedbackModalStyles.successIcon + ' mb-4'} fill="none" stroke={`var(--color-${colors.primary})`} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h3 className={feedbackModalStyles.successTitle}>{t('feedback.success.title')}</h3>
            <p className={feedbackModalStyles.successMessage}>
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
        className={feedbackModalStyles.stepContainer}
      >
        {currentStep.type === 'rating' && (
          renderStarRating(formData.rating, (value) => handleInputChange(value, 'rating'))
        )}

        {currentStep.type === 'difficulty' && (
          renderDifficultySelector(
            formData.difficulty,
            (value) => handleInputChange(value, 'difficulty'),
            difficultyHovered,
            setDifficultyHovered
          )
        )}

        {currentStep.type === 'favoriteCategory' && (
          <div className="flex flex-col items-center w-full mb-6">
            <div className="mb-4 text-center text-base font-medium opacity-80">{t('feedback.category.favoriteInstructions')}</div>
            <div className="flex flex-wrap gap-3 justify-center w-full max-w-2xl">
              {categoryOptions.map((option) => {
                const selected = Array.isArray(formData.favoriteCategory)
                  ? formData.favoriteCategory.includes(option)
                  : formData.favoriteCategory === option;
                const selectedCount = Array.isArray(formData.favoriteCategory)
                  ? formData.favoriteCategory.length
                  : formData.favoriteCategory ? 1 : 0;
                const disabled = !selected && selectedCount >= 3;
                const colorFamily = CATEGORY_COLOR_MAPPING[option]?.tailwind || 'gray';
                const colorShade = categoryColorMap[option]?.primary?.split('-')[1] || '400';
                const borderClass = `border-${colorFamily}-${colorShade}`;
                const textClass = selected ? 'text-white' : `text-${colorFamily}-${colorShade}`;
                const bgClass = selected ? `bg-${colorFamily}-${colorShade}` : 'bg-transparent';
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      let newSelected;
                      if (selected) {
                        newSelected = formData.favoriteCategory.filter((o: string) => o !== option);
                      } else {
                        newSelected = Array.isArray(formData.favoriteCategory)
                          ? [...formData.favoriteCategory, option]
                          : [option];
                      }
                      handleInputChange(newSelected, 'favoriteCategory');
                    }}
                    className={`border-2 font-semibold transition-all outline-none px-4 py-2 rounded-xl text-sm md:text-base ${borderClass} ${textClass} ${bgClass}`}
                    style={{
                      opacity: disabled ? 0.5 : 1,
                      cursor: disabled ? 'not-allowed' : 'pointer',
                    }}
                    aria-pressed={selected}
                    disabled={disabled}
                  >
                    {getCategoryName(option, t)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentStep.type === 'leastFavoriteCategory' && (
          <div className="flex flex-col items-center w-full mb-6">
            <div className="mb-4 text-center text-base font-medium opacity-80">{t('feedback.category.leastFavoriteInstructions')}</div>
            <div className="flex flex-wrap gap-3 justify-center w-full max-w-2xl">
              {categoryOptions.map((option) => {
                const selected = Array.isArray(formData.leastFavoriteCategory)
                  ? formData.leastFavoriteCategory.includes(option)
                  : formData.leastFavoriteCategory === option;
                const selectedCount = Array.isArray(formData.leastFavoriteCategory)
                  ? formData.leastFavoriteCategory.length
                  : formData.leastFavoriteCategory ? 1 : 0;
                const disabled = !selected && selectedCount >= 3;
                const colorFamily = CATEGORY_COLOR_MAPPING[option]?.tailwind || 'gray';
                const colorShade = categoryColorMap[option]?.primary?.split('-')[1] || '400';
                const borderClass = `border-${colorFamily}-${colorShade}`;
                const textClass = selected ? 'text-white' : `text-${colorFamily}-${colorShade}`;
                const bgClass = selected ? `bg-${colorFamily}-${colorShade}` : 'bg-transparent';
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      let newSelected;
                      if (selected) {
                        newSelected = formData.leastFavoriteCategory.filter((o: string) => o !== option);
                      } else {
                        newSelected = Array.isArray(formData.leastFavoriteCategory)
                          ? [...formData.leastFavoriteCategory, option]
                          : [option];
                      }
                      handleInputChange(newSelected, 'leastFavoriteCategory');
                    }}
                    className={`border-2 font-semibold transition-all outline-none px-4 py-2 rounded-xl text-sm md:text-base ${borderClass} ${textClass} ${bgClass}`}
                    style={{
                      opacity: disabled ? 0.5 : 1,
                      cursor: disabled ? 'not-allowed' : 'pointer',
                    }}
                    aria-pressed={selected}
                    disabled={disabled}
                  >
                    {getCategoryName(option, t)}
                  </button>
                );
              })}
            </div>
          </div>
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
      mobileHeight={"90vh"}
    >
      <div
        className={feedbackModalStyles.content}
        style={{
          height: isMobile ? '70vh' : 540,
          minHeight: isMobile ? '70vh' : 540,
          maxHeight: isMobile ? '70vh' : 540,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
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
                  {steps[step].label.toUpperCase()}
                </h3>
              </div>
              <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {renderStepContent()}
              </div>
              <div className="w-full flex justify-between items-end mt-8" style={{minHeight: 48}}>
                {step > 0 ? (
                  <ModalNavButton
                    direction="prev"
                    label={t('feedback.navigation.prev')}
                    onClick={handleBack}
                    disabled={false}
                    primaryColor={colors.primary}
                    textSegmentBg={hasClass('dark') ? '#18181b' : 'white'}
                  />
                ) : <span />}
                <ModalNavButton
                  direction="next"
                  label={step === steps.length - 1 ? t('feedback.navigation.submit') : t('feedback.navigation.next')}
                  onClick={handleNext}
                  disabled={!isStepValid(step)}
                  primaryColor={colors.primary}
                  textSegmentBg={hasClass('dark') ? '#18181b' : 'white'}
                />
              </div>
              <div className={feedbackModalStyles.progressContainer} style={{marginTop: 16}}>
                <div style={feedbackModalStyles.progressBar(colors.primary, progress)} />
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </BaseModal>
  );
}; 