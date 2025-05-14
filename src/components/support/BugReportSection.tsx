'use client';

import React from 'react';
import { Righteous } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { useBugReport } from '../../hooks/components/support';
import { bugReportSectionStyles } from '../../styles/bugReportSectionStyles';
import { supportPageStyles } from '../../styles/supportPageStyles';
import { feedbackSectionStyles } from '../../styles/feedbackSectionStyles';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

export const steps = [
  {
    label: 'What did you experience?',
    placeholder: 'e.g. The timer stopped counting down...'
  },
  {
    label: 'What device are you using?',
    placeholder: ''
  },
  {
    label: 'Can you provide more details?',
    placeholder: 'e.g. What were you doing when it happened? What did you expect?'
  },
  {
    label: 'Would you like to upload a screenshot or photo?',
    placeholder: ''
  }
];

const bugOptions = [
  'App crashed',
  'UI glitch',
  'Performance issue',
  'Audio problem',
  'Other',
];

const deviceOptions = [
  'Computer',
  'Mobile phone',
  'Tablet',
  'Other device'
];

const BugReportSection: React.FC = () => {
  const {
    colors,
    step,
    bugType,
    deviceType,
    otherBug,
    bugDetails,
    file,
    isDragging,
    fileInputRef,
    submitted,
    isDropdownOpen,
    isDeviceDropdownOpen,
    dropdownRef,
    deviceDropdownRef,
    setIsDropdownOpen,
    setIsDeviceDropdownOpen,
    setOtherBug,
    setBugDetails,
    handleFileChange,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    selectBugType,
    selectDeviceType,
    handleNext,
    handleSubmit
  } = useBugReport();

  const progress = ((step + (submitted ? 1 : 0)) / steps.length) * 100;

  // Handle file removal
  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    handleFileChange(null as any);
  };

  return (
    <div className={`${supportPageStyles.card} ${supportPageStyles.cardDimensions}`} style={supportPageStyles.cardStyle(colors.primary)}>
      <div className={supportPageStyles.cardHeader}>
        <h2 
          className={`${supportPageStyles.sectionTitle} ${righteous.className}`}
          style={supportPageStyles.sectionTitleStyle(colors.primary)}
        >
          BUG REPORT
        </h2>
      </div>
      
      <div className={supportPageStyles.cardContent}>
        <div className={supportPageStyles.sectionContentWrapper}>
          <div className={supportPageStyles.sectionContentContainer}>
            <div className="h-full flex items-center justify-center -mt-16 md:portrait:-mt-20">
              <AnimatePresence mode="wait">
                {step === 0 && !submitted && (
                  <motion.div
                    key="step1"
                    initial={bugReportSectionStyles.stepAnimation.initial}
                    animate={bugReportSectionStyles.stepAnimation.animate}
                    exit={bugReportSectionStyles.stepAnimation.exit}
                    transition={bugReportSectionStyles.stepAnimation.transition}
                    className={bugReportSectionStyles.stepContainer}
                  >
                    <label className={`${supportPageStyles.supportFormLabel} mb-1 -mt-8`}>
                      {steps[0].label}
                    </label>
                    <div className={bugReportSectionStyles.dropdownWrapper}>
                      <div className={bugReportSectionStyles.dropdownRelativeContainer}>
                        <div 
                          ref={dropdownRef}
                          className={bugReportSectionStyles.dropdownTrigger}
                          style={feedbackSectionStyles.formFieldBorderStyle(colors.primary)}
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                          <span>{bugType || 'Select an option...'}</span>
                          <div className={bugReportSectionStyles.dropdownIconContainer}>
                            <svg className={bugReportSectionStyles.dropdownIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        {isDropdownOpen && (
                          <div 
                            className={bugReportSectionStyles.dropdownContainer}
                            style={feedbackSectionStyles.formFieldBorderStyle(colors.primary)}
                          >
                            {bugOptions.map((option) => (
                              <div
                                key={option}
                                className={bugReportSectionStyles.dropdownOption}
                                style={bugType === option 
                                  ? bugReportSectionStyles.dropdownOptionSelected(colors.primary)
                                  : bugReportSectionStyles.dropdownOptionUnselected
                                }
                                onClick={() => selectBugType(option)}
                              >
                                {option}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {bugType === 'Other' && (
                      <>
                        <input
                          type="text"
                          maxLength={50}
                          className={supportPageStyles.supportFormInput}
                          style={feedbackSectionStyles.formFieldBorderStyle(colors.primary)}
                          placeholder="Briefly describe (max 50 chars)"
                          value={otherBug}
                          onChange={e => setOtherBug(e.target.value)}
                          autoFocus
                        />
                        <button
                          className={supportPageStyles.supportFormButton}
                          style={feedbackSectionStyles.buttonPrimaryStyle(colors.primary)}
                          onClick={handleNext}
                          disabled={otherBug.trim() === ''}
                        >
                          Next
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
                {step === 1 && !submitted && (
                  <motion.div
                    key="step2"
                    initial={bugReportSectionStyles.stepAnimation.initial}
                    animate={bugReportSectionStyles.stepAnimation.animate}
                    exit={bugReportSectionStyles.stepAnimation.exit}
                    transition={bugReportSectionStyles.stepAnimation.transition}
                    className={bugReportSectionStyles.stepContainer}
                  >
                    <label className={`${supportPageStyles.supportFormLabel} mb-1`}>
                      {steps[1].label}
                    </label>
                    <div className={bugReportSectionStyles.dropdownWrapper}>
                      <div className={bugReportSectionStyles.dropdownRelativeContainer}>
                        <div 
                          ref={deviceDropdownRef}
                          className={bugReportSectionStyles.dropdownTrigger}
                          style={feedbackSectionStyles.formFieldBorderStyle(colors.primary)}
                          onClick={() => setIsDeviceDropdownOpen(!isDeviceDropdownOpen)}
                        >
                          <span>{deviceType || 'Select your device...'}</span>
                          <div className={bugReportSectionStyles.dropdownIconContainer}>
                            <svg className={bugReportSectionStyles.dropdownIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        {isDeviceDropdownOpen && (
                          <div 
                            className={bugReportSectionStyles.dropdownContainer}
                            style={feedbackSectionStyles.formFieldBorderStyle(colors.primary)}
                          >
                            {deviceOptions.map((option) => (
                              <div
                                key={option}
                                className={bugReportSectionStyles.dropdownOption}
                                style={deviceType === option 
                                  ? bugReportSectionStyles.dropdownOptionSelected(colors.primary)
                                  : bugReportSectionStyles.dropdownOptionUnselected
                                }
                                onClick={() => selectDeviceType(option)}
                              >
                                {option}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
                {step === 2 && !submitted && (
                  <motion.div
                    key="step3"
                    initial={bugReportSectionStyles.stepAnimation.initial}
                    animate={bugReportSectionStyles.stepAnimation.animate}
                    exit={bugReportSectionStyles.stepAnimation.exit}
                    transition={bugReportSectionStyles.stepAnimation.transition}
                    className={bugReportSectionStyles.stepContainer}
                  >
                    <label className={`${supportPageStyles.supportFormLabel} mb-1`}>
                      {steps[2].label}
                    </label>
                    <textarea
                      className={supportPageStyles.supportFormTextarea}
                      style={feedbackSectionStyles.formFieldBorderStyle(colors.primary)}
                      placeholder={steps[2].placeholder}
                      value={bugDetails}
                      onChange={e => setBugDetails(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleNext()}
                      autoFocus
                    />
                    <button
                      className={supportPageStyles.supportFormButton}
                      style={feedbackSectionStyles.buttonPrimaryStyle(colors.primary)}
                      onClick={handleNext}
                      disabled={bugDetails.trim() === ''}
                    >
                      Next
                    </button>
                  </motion.div>
                )}
                {step === 3 && !submitted && (
                  <motion.div
                    key="step4"
                    initial={bugReportSectionStyles.stepAnimation.initial}
                    animate={bugReportSectionStyles.stepAnimation.animate}
                    exit={bugReportSectionStyles.stepAnimation.exit}
                    transition={bugReportSectionStyles.stepAnimation.transition}
                    className={bugReportSectionStyles.stepContainer}
                  >
                    <label className={`${supportPageStyles.supportFormLabel} mb-1`}>
                      {steps[3].label}
                    </label>
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                    
                    {!file ? (
                      <div
                        className={bugReportSectionStyles.fileUploadContainer}
                        style={isDragging
                          ? bugReportSectionStyles.fileUploadDraggingStyle(colors.primary)
                          : bugReportSectionStyles.fileUploadDefaultStyle
                        }
                        onClick={() => fileInputRef.current?.click()}
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <svg className={bugReportSectionStyles.fileUploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className={bugReportSectionStyles.fileUploadText}>
                          {isDragging ? 'Drop your file here' : 'Click or drag and drop to upload'}
                        </p>
                        <p className={bugReportSectionStyles.fileUploadOptional}>(Optional)</p>
                      </div>
                    ) : (
                      <div className={bugReportSectionStyles.filePreviewContainer}>
                        <svg className={bugReportSectionStyles.filePreviewIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className={bugReportSectionStyles.filePreviewText}>{file.name}</span>
                        <button
                          onClick={handleRemoveFile}
                          className={bugReportSectionStyles.filePreviewRemoveButton}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                    
                    <button
                      className={supportPageStyles.supportFormButton}
                      style={feedbackSectionStyles.buttonPrimaryStyle(colors.primary)}
                      onClick={handleSubmit}
                    >
                      Submit Report
                    </button>
                  </motion.div>
                )}
                
                {submitted && (
                  <motion.div
                    key="success"
                    initial={bugReportSectionStyles.stepAnimation.initial}
                    animate={bugReportSectionStyles.stepAnimation.animate}
                    exit={bugReportSectionStyles.stepAnimation.exit}
                    transition={bugReportSectionStyles.stepAnimation.transition}
                    className={bugReportSectionStyles.successContainer}
                  >
                    <div className={bugReportSectionStyles.successIconContainer}>
                      <svg className={bugReportSectionStyles.successIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className={bugReportSectionStyles.successTitle}>Thank You!</h3>
                    <p className={bugReportSectionStyles.successMessage}>
                      Your bug report has been submitted successfully.
                    </p>
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

export default BugReportSection; 