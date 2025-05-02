'use client';

import React from 'react';
import { Righteous } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { useFeedback } from '../../hooks/components/support';
import { feedbackSectionStyles } from '../../styles/feedbackSectionStyles';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

const FeedbackSection: React.FC = () => {
  const {
    colors,
    step,
    formData,
    submitted,
    progress,
    steps,
    handleChange,
    handleNext,
    handleSubmit
  } = useFeedback();

  return (
    <div style={feedbackSectionStyles.container}>
      <h2 
        className={righteous.className}
        style={{
          ...feedbackSectionStyles.header(colors.primary),
          fontFamily: righteous.style.fontFamily
        }}
      >
        FEEDBACK
      </h2>
      
      <div style={feedbackSectionStyles.formContainer}>
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
              <label style={feedbackSectionStyles.stepLabel} className="text-black dark:text-white">
                {steps[step].label}
              </label>
              
              {step === 0 && (
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  style={feedbackSectionStyles.select(colors.primary)}
                  className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Below Average</option>
                  <option value="3">3 - Average</option>
                  <option value="4">4 - Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              )}
              
              {step === 1 && (
                <textarea
                  name="feedback"
                  required
                  value={formData.feedback}
                  onChange={handleChange}
                  style={feedbackSectionStyles.textarea(colors.primary)}
                  placeholder={steps[step].placeholder}
                  className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              )}
              
              {step === 2 && (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={feedbackSectionStyles.formControl(colors.primary)}
                  placeholder={steps[step].placeholder}
                  className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              )}
              
              <button
                style={feedbackSectionStyles.button(colors.primary, step === 1 && formData.feedback.trim() === '')}
                onClick={handleNext}
                disabled={step === 1 && formData.feedback.trim() === ''}
                className="hover:opacity-90"
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
              style={feedbackSectionStyles.successMessage}
            >
              <span style={feedbackSectionStyles.successTitle(colors.primary)}>Thank you!</span>
              <span style={feedbackSectionStyles.successSubtitle} className="text-gray-700 dark:text-gray-300">Your feedback has been submitted.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Progress bar at the bottom */}
      <div style={feedbackSectionStyles.progressContainer}>
        <div style={feedbackSectionStyles.progressBar} className="bg-gray-200 dark:bg-gray-800">
          <motion.div
            style={feedbackSectionStyles.progressIndicator(colors.primary, progress)}
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>
    </div>
  );
};

export default FeedbackSection; 