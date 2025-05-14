'use client';

import React from 'react';
import { Righteous } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { useFeedback, ratingOptions } from '../../hooks/components/support';
import { feedbackSectionStyles } from '../../styles/feedbackSectionStyles';
import { supportPageStyles } from '../../styles/supportPageStyles';
import { bugReportSectionStyles } from '../../styles/bugReportSectionStyles';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

export const steps = [
  {
    label: 'How would you rate your experience with Fact 5?',
    placeholder: ''
  },
  {
    label: 'What did you enjoy most about Fact 5?',
    placeholder: 'e.g. I really enjoyed playing with my friends...'
  },
  {
    label: 'Is there anything we could improve?',
    placeholder: 'e.g. I would like to see more game options...'
  }
];

const FeedbackSection: React.FC = () => {
  const {
    colors,
    step,
    formData,
    submitted,
    progress,
    steps,
    isRatingDropdownOpen,
    ratingDropdownRef,
    setIsRatingDropdownOpen,
    selectRating,
    handleChange,
    handleNext,
    handleSubmit
  } = useFeedback();

  return (
    <div className={`${supportPageStyles.card} ${supportPageStyles.cardDimensions}`} style={supportPageStyles.cardStyle(colors.primary)}>
      <div className={supportPageStyles.cardHeader}>
        <h2 
          className={`${supportPageStyles.sectionTitle} ${righteous.className}`}
          style={supportPageStyles.sectionTitleStyle(colors.primary)}
        >
          FEEDBACK
        </h2>
      </div>
      
      <div className={supportPageStyles.cardContent}>
        <div className={supportPageStyles.sectionContentWrapper}>
          <div className={supportPageStyles.sectionContentContainer}>
            <div className="h-full flex items-center justify-center -mt-16 md:portrait:-mt-20">
              <AnimatePresence mode="wait">
                {!submitted && (
                  <motion.div
                    key={step}
                    initial={feedbackSectionStyles.stepAnimation.initial}
                    animate={feedbackSectionStyles.stepAnimation.animate}
                    exit={feedbackSectionStyles.stepAnimation.exit}
                    transition={feedbackSectionStyles.stepAnimation.transition}
                    className="flex flex-col items-center w-full"
                  >
                    {step === 0 && (
                      <label className={`${supportPageStyles.supportFormLabel} mb-1 -mt-8`}>
                        {steps[step].label}
                      </label>
                    )}
                    {step > 0 && (
                      <label className={`${supportPageStyles.supportFormLabel} mb-1`}>
                        {steps[step].label}
                      </label>
                    )}
                    
                    {step === 0 && (
                      <div className={bugReportSectionStyles.dropdownWrapper}>
                        <div className={bugReportSectionStyles.dropdownRelativeContainer}>
                          <div 
                            ref={ratingDropdownRef}
                            className={bugReportSectionStyles.dropdownTrigger}
                            style={feedbackSectionStyles.formFieldBorderStyle(colors.primary)}
                            onClick={() => setIsRatingDropdownOpen(!isRatingDropdownOpen)}
                          >
                            <span>{formData.rating || 'Select a rating...'}</span>
                            <div className={bugReportSectionStyles.dropdownIconContainer}>
                              <svg className={bugReportSectionStyles.dropdownIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                          {isRatingDropdownOpen && (
                            <div 
                              className={bugReportSectionStyles.dropdownContainer}
                              style={feedbackSectionStyles.formFieldBorderStyle(colors.primary)}
                            >
                              {ratingOptions.map((option: string) => (
                                <div
                                  key={option}
                                  className={bugReportSectionStyles.dropdownOption}
                                  style={formData.rating === option 
                                    ? bugReportSectionStyles.dropdownOptionSelected(colors.primary)
                                    : bugReportSectionStyles.dropdownOptionUnselected
                                  }
                                  onClick={() => selectRating(option)}
                                >
                                  {option}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {step === 1 && (
                      <textarea
                        name="feedback"
                        required
                        value={formData.feedback}
                        onChange={handleChange}
                        className={supportPageStyles.supportFormTextarea}
                        style={feedbackSectionStyles.formFieldBorderStyle(colors.primary)}
                        placeholder={steps[step].placeholder}
                      />
                    )}
                    
                    {step === 2 && (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={supportPageStyles.supportFormInput}
                        style={feedbackSectionStyles.formFieldBorderStyle(colors.primary)}
                        placeholder={steps[step].placeholder}
                      />
                    )}
                    
                    <button
                      className={supportPageStyles.supportFormButton}
                      style={
                        step === 1 && formData.feedback.trim() === '' 
                          ? feedbackSectionStyles.buttonDisabledStyle(colors.primary)
                          : feedbackSectionStyles.buttonPrimaryStyle(colors.primary)
                      }
                      onClick={handleNext}
                      disabled={step === 1 && formData.feedback.trim() === ''}
                    >
                      {step === steps.length - 1 ? 'Submit' : 'Next'}
                    </button>
                  </motion.div>
                )}
                
                {submitted && (
                  <motion.div
                    key="submitted"
                    initial={feedbackSectionStyles.successAnimation.initial}
                    animate={feedbackSectionStyles.successAnimation.animate}
                    exit={feedbackSectionStyles.successAnimation.exit}
                    transition={feedbackSectionStyles.successAnimation.transition}
                    className={feedbackSectionStyles.successContainer}
                  >
                    <span className={feedbackSectionStyles.thankYouText} style={feedbackSectionStyles.thankYouTextStyle(colors.primary)}>Thank you!</span>
                    <span className={feedbackSectionStyles.feedbackMessage}>Your feedback has been submitted.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress bar in footer */}
      <div className={supportPageStyles.cardFooter}>
        <div className={supportPageStyles.supportProgressBar}>
          <div 
            className={supportPageStyles.supportProgressBarFill}
            style={supportPageStyles.supportProgressBarFillStyle(colors.primary, progress)}
          />
        </div>
      </div>
    </div>
  );
};

export default FeedbackSection; 