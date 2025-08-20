import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';
import BaseModal from '../BaseModal/BaseModal';
import { useModalForm } from '../BugReportModal/useModalForm';
import { Righteous } from 'next/font/google';
import ModalNavButton from '../ModalNavButton/ModalNavButton';
import { CategoryType, categoryColorMap, CATEGORY_COLOR_MAPPING } from '../../../types';
import { useTranslation } from 'react-i18next';
import { getCategoryName } from '../../../helpers/i18nHelpers';
import { useThemeDOM } from '@/hooks/useThemeDOM';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

const feedbackModalStyles = {
  // Content
  content: "flex flex-col items-center justify-center min-h-[400px]",
  
  // Steps
  stepContainer: "w-full md:max-w-md mx-auto px-4 md:px-0",
  stepLabel: "text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 text-center",
  
  // Star Rating
  starContainer: "flex justify-center gap-2 mb-6",
  starButton: "text-3xl transition-colors cursor-pointer",
  starFilled: "text-yellow-400",
  starEmpty: "text-gray-300 dark:text-gray-600",
  
  // Dropdown
  dropdownContainer: "relative w-full mb-6",
  dropdownButton: "w-full px-4 py-2 text-left border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-800/50 dark:text-white cursor-pointer flex items-center justify-between",
  dropdownList: "absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto",
  dropdownItem: "px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer",
  
  // Navigation
  buttonContainer: "flex justify-center gap-4 mt-6",
  button: "px-6 py-2 rounded-md font-medium transition-colors",
  primaryButton: (primaryColor: string): React.CSSProperties => ({
    backgroundColor: `var(--color-${primaryColor})`,
    color: 'white'
  }),
  secondaryButton: "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600",
  
  // Progress
  progressContainer: "w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-6",
  progressBar: (primaryColor: string, progress: number): React.CSSProperties => ({
    width: `${progress}%`,
    backgroundColor: `var(--color-${primaryColor})`,
    height: '100%',
    borderRadius: '9999px',
    transition: 'width 0.3s ease-in-out'
  }),
  
  // Success
  successContainer: "flex flex-col items-center justify-center text-center",
  successIcon: "w-16 h-16 text-green-500 mb-4",
  successTitle: "text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2",
  successMessage: "text-gray-600 dark:text-gray-400"
};

const categoryOptions = Object.values(CategoryType);

const difficultyOptions = [
  'tooEasy',
  'somewhatEasy',
  'justRight',
  'somewhatChallenging',
  'tooChallenging',
];

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { colors, darkMode } = useTheme();
  const { hasClass } = useThemeDOM();
  const { t } = useTranslation();

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
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
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

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={<span className={righteous.className + ' uppercase'}>FEEDBACK</span>}
      colors={colors}
      className={isMobile ? undefined : "max-w-2xl"}
      mobileHeight={"auto"}
    >
      <div
        className={feedbackModalStyles.content}
        style={{
          height: isMobile ? 'auto' : 540,
          minHeight: isMobile ? undefined : 540,
          maxHeight: isMobile ? '85vh' : 540,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <AnimatePresence mode="wait">
          {submitted ? renderStepContent() : (
            <>
              <div style={{marginBottom: '2rem', marginTop: '1rem'}}>
                {(() => {
                  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
                  return (
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
                  );
                })()}
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

export default FeedbackModal; 