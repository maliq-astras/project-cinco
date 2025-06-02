import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import BaseModal from './BaseModal';
import { useModalForm } from '../../hooks/components/modals/useModalForm';
import { Righteous } from 'next/font/google';

interface BugReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

const bugReportModalStyles = {
  // Content
  content: "flex flex-col items-center justify-center min-h-[400px]",
  
  // Steps
  stepContainer: "w-full max-w-md mx-auto",
  stepLabel: "text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 text-center",
  
  // Dropdown
  dropdownContainer: "relative w-full mb-6",
  dropdownButton: "w-full px-4 py-2 text-left border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-800/50 dark:text-white cursor-pointer flex items-center justify-between",
  dropdownList: "absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto",
  dropdownItem: "px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer",
  
  // File Upload
  fileUploadContainer: "w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer transition-colors",
  fileUploadContainerDragging: "border-blue-500 bg-blue-50 dark:bg-blue-900/20",
  fileUploadIcon: "w-12 h-12 mx-auto mb-2 text-gray-400",
  fileUploadText: "text-gray-600 dark:text-gray-400 mb-1",
  fileUploadOptional: "text-sm text-gray-500 dark:text-gray-500",
  filePreviewContainer: "w-full border border-gray-300 dark:border-gray-600 rounded-lg p-4 flex items-center gap-3",
  filePreviewIcon: "w-8 h-8 text-gray-400",
  filePreviewText: "flex-1 text-gray-700 dark:text-gray-300 truncate",
  filePreviewRemoveButton: "p-1 text-gray-500 hover:text-red-500 transition-colors",
  
  // Navigation
  buttonContainer: "flex justify-center gap-4 mt-6",
  button: "px-6 py-2 rounded-md font-medium transition-colors",
  primaryButton: (primaryColor: string): React.CSSProperties => ({
    backgroundColor: `var(--color-${primaryColor})`,
    color: 'white'
  }),
  primaryButtonHover: (primaryColor: string): React.CSSProperties => ({
    backgroundColor: `var(--color-${primaryColor}-dark)`
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

const ALL_BUG_TAGS = [
  'App crashed',
  'UI glitch',
  "Fact card didn't reveal",
  'Bubble didn\'t respond',
  'Guess input not working',
  'Progress bar issue',
  'Timer issue',
  'Skip button not working',
  'Final Five round problem',
  "Victory animation didn't play",
  'Wrong answer marked correct/incorrect',
  'Category not loading',
  'Loading screen stuck',
  'Settings not saving',
  'Theme/color issue',
  'Language not switching',
  'Tutorial not working',
  'Mobile/landscape layout issue',
  'Accessibility issue',
  'Other',
];
const INITIAL_TAGS_SHOWN = 6;

const deviceOptions = [
  'iPhone',
  'Android phone',
  'iPad',
  'Android tablet',
  'Windows PC',
  'Mac',
  'Chromebook',
  'Other',
];

const BugReportModal: React.FC<BugReportModalProps> = ({ isOpen, onClose }) => {
  const { colors } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Fix: Add dark mode detection and text segment background here
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const textSegmentBg = isDarkMode ? '#18181b' : 'white';

  const [showAllTags, setShowAllTags] = useState(false);
  const [tagSearch, setTagSearch] = useState('');

  const filteredTags = ALL_BUG_TAGS.filter(tag => tag.toLowerCase().includes(tagSearch.toLowerCase()));
  const tagsToShow = showAllTags ? filteredTags : filteredTags.slice(0, INITIAL_TAGS_SHOWN);
  const canShowMore = !showAllTags && filteredTags.length > INITIAL_TAGS_SHOWN;
  const canShowLess = showAllTags && filteredTags.length > INITIAL_TAGS_SHOWN;

  const steps = [
    {
      label: 'What did you experience?',
      type: 'bugType'
    },
    {
      label: 'What device are you using?',
      type: 'deviceType'
    },
    {
      label: 'Can you provide more details?',
      type: 'details'
    },
    {
      label: 'Would you like to upload a screenshot or photo?',
      type: 'file'
    }
  ];

  const initialFormData = {
    bugType: [],
    deviceType: '',
    bugDetails: '',
    file: null as File | null
  };

  const handleSubmit = async (formData: any) => {
    // Here you would typically send the bug report to your backend
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
    isStepValid: originalIsStepValid
  } = useModalForm({
    steps,
    initialFormData,
    onSubmit: handleSubmit
  });

  // Override isStepValid for bugType step to require at least one tag
  const isStepValid = (stepIdx: number) => {
    const currentStep = steps[stepIdx];
    if (currentStep.type === 'bugType') {
      return Array.isArray(formData.bugType) && formData.bugType.length > 0;
    }
    if (currentStep.type === 'deviceType') {
      return !!formData.deviceType;
    }
    if (currentStep.type === 'details') {
      return typeof formData.bugDetails === 'string' && formData.bugDetails.trim().length > 0;
    }
    return originalIsStepValid(stepIdx);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleInputChange(file, 'file');
    }
  };

  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    handleInputChange(null, 'file');
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
            <svg className={bugReportModalStyles.successIcon + ' mb-4'} fill="none" stroke={`var(--color-${colors.primary})`} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h3 className={bugReportModalStyles.successTitle}>Thank You!</h3>
            <p className={bugReportModalStyles.successMessage}>
              Your bug report has been submitted successfully.
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
        className={bugReportModalStyles.stepContainer}
      >
        {/* Visually hidden label for accessibility only */}
        <label htmlFor={`bug-step-input-${step}`} style={{position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0}}>
          {currentStep.label}
        </label>
        {/* No visible label here, only at the top of the modal */}
        {currentStep.type === 'bugType' && (
          <div className="flex flex-col items-center mb-6 mx-auto bug-tag-scrollbar searchbar-fixed"
             style={{ height: 320, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}
          >
            {/* Search bar */}
            <input
              type="text"
              placeholder="Search..."
              value={tagSearch}
              onChange={e => setTagSearch(e.target.value)}
              className="px-2 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#18181b] text-base focus:outline-none focus:ring-2 focus:ring-primary mx-auto searchbar-fixed"
              style={{ color: isDarkMode ? 'white' : undefined, marginBottom: 32 }}
            />
            {/* Tag list */}
            <div
              className="flex flex-wrap gap-3 justify-center w-full bug-tag-scrollbar searchbar-fixed"
              style={{ height: 220, overflowY: 'auto', alignContent: 'flex-start' }}
            >
              {filteredTags.length === 0 && (
                <span
                  className="text-gray-400"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    width: '100%',
                  }}
                >No tags found</span>
              )}
              {filteredTags.map((option) => {
                const selected = formData.bugType.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      let newSelected;
                      if (selected) {
                        newSelected = formData.bugType.filter((o: string) => o !== option);
                      } else {
                        newSelected = [...formData.bugType, option];
                      }
                      handleInputChange(newSelected, 'bugType');
                    }}
                    className="border-2 font-semibold transition-all outline-none px-3 py-1.5 rounded-md text-xs sm:px-4 sm:py-2 sm:rounded-xl sm:text-sm"
                    style={{
                      border: `2px solid var(--color-${colors.primary})`,
                      background: selected ? `var(--color-${colors.primary})` : textSegmentBg,
                      color: selected ? 'white' : `var(--color-${colors.primary})`,
                      margin: '2px',
                    }}
                    aria-pressed={selected}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {currentStep.type === 'deviceType' && (
          <div className="flex flex-wrap gap-3 justify-center w-full mt-2">
            {deviceOptions.map((option) => {
              const selected = formData.deviceType === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleInputChange(selected ? '' : option, 'deviceType')}
                  className="border-2 font-semibold transition-all outline-none px-3 py-1.5 rounded-md text-xs sm:px-4 sm:py-2 sm:rounded-xl sm:text-sm"
                  style={{
                    border: `2px solid var(--color-${colors.primary})`,
                    background: selected ? `var(--color-${colors.primary})` : textSegmentBg,
                    color: selected ? 'white' : `var(--color-${colors.primary})`,
                    margin: '2px',
                  }}
                  aria-pressed={selected}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}
        {currentStep.type === 'details' && (
          <>
            <textarea
              id={`bug-step-input-${step}`}
              value={formData.bugDetails}
              onChange={(e) => handleInputChange(e.target.value.slice(0, 400), 'bugDetails')}
              maxLength={400}
              className="block mx-auto w-[95vw] h-48 md:h-64 resize-none px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-800/50 dark:text-white"
              style={{ maxWidth: 'calc(100% - 3rem)' }}
              placeholder="What were you doing when it happened? What did you expect?"
            />
            <div className="text-xs text-gray-400 mt-2 w-full max-w-2xl md:max-w-3xl mx-auto text-right">
              {formData.bugDetails.length}/400
            </div>
          </>
        )}
        {currentStep.type === 'file' && (
          <>
            <input
              type="file"
              id={`bug-step-input-${step}`}
              ref={fileInputRef}
              onChange={(e) => handleInputChange(e.target.files?.[0] || null, 'file')}
              className="hidden"
              accept="image/*"
            />
            {!formData.file ? (
              <div
                className={`${bugReportModalStyles.fileUploadContainer} ${isDragging ? bugReportModalStyles.fileUploadContainerDragging : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <svg className={bugReportModalStyles.fileUploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className={bugReportModalStyles.fileUploadText}>
                  {isDragging ? 'Drop your file here' : 'Click or drag and drop to upload'}
                </p>
                <p className={bugReportModalStyles.fileUploadOptional}>(Optional)</p>
              </div>
            ) : (
              <div className={bugReportModalStyles.filePreviewContainer}>
                <svg className={bugReportModalStyles.filePreviewIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className={bugReportModalStyles.filePreviewText}>{formData.file.name}</span>
                <button
                  onClick={handleRemoveFile}
                  className={bugReportModalStyles.filePreviewRemoveButton}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
    );
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={<span className={righteous.className + ' uppercase'}>BUG REPORT</span>}
      colors={colors}
      className="max-w-2xl"
    >
      <div
        className={bugReportModalStyles.content}
        style={{
          height: 540,
          minHeight: 540,
          maxHeight: 540,
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
              <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0}}>
                {renderStepContent()}
              </div>
              <div className="w-full flex justify-between items-end mt-8" style={{minHeight: 48}}>
                {step > 0 ? (
                  <button
                    onClick={handleBack}
                    className="flex items-center font-bold transition-colors focus:outline-none"
                    style={{
                      minWidth: 100,
                      height: 36,
                      borderRadius: 10,
                      background: textSegmentBg,
                      color: `var(--color-${colors.primary})`,
                      border: `2px solid var(--color-${colors.primary})`,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                      display: 'flex',
                      padding: 0,
                      overflow: 'hidden',
                    }}
                  >
                    {/* Arrow segment */}
                    <span style={{
                      background: `var(--color-${colors.primary})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      width: 36,
                      borderTopLeftRadius: 8,
                      borderBottomLeftRadius: 8,
                      marginRight: 2,
                    }}>
                      <svg width="18" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M14 5L8 11L14 17" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    {/* Text segment */}
                    <span style={{
                      flex: 1,
                      textAlign: 'center',
                      fontWeight: 700,
                      letterSpacing: 1,
                      fontSize: 14,
                      color: `var(--color-${colors.primary})`,
                      background: textSegmentBg,
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderTopRightRadius: 8,
                      borderBottomRightRadius: 8,
                    }}>Prev</span>
                  </button>
                ) : <span />}
                <button
                  onClick={handleNext}
                  className="flex items-center font-bold transition-colors focus:outline-none"
                  style={{
                    minWidth: 100,
                    height: 36,
                    borderRadius: 10,
                    background: textSegmentBg,
                    color: `var(--color-${colors.primary})`,
                    border: `2px solid var(--color-${colors.primary})`,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    display: 'flex',
                    padding: 0,
                    overflow: 'hidden',
                    opacity: steps[step].type === 'file' ? 1 : (!isStepValid(step) ? 0.5 : 1),
                    cursor: steps[step].type === 'file' ? 'pointer' : (!isStepValid(step) ? 'not-allowed' : 'pointer'),
                  }}
                  disabled={steps[step].type === 'file' ? false : !isStepValid(step)}
                >
                  {/* Text segment */}
                  <span style={{
                    flex: 1,
                    textAlign: 'center',
                    fontWeight: 700,
                    letterSpacing: 1,
                    fontSize: 14,
                    color: `var(--color-${colors.primary})`,
                    background: textSegmentBg,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopLeftRadius: 8,
                    borderBottomLeftRadius: 8,
                    marginRight: 2,
                  }}>{(steps[step].type === 'file' && !formData.file) ? 'Skip' : 'Next'}</span>
                  {/* Arrow segment */}
                  <span style={{
                    background: `var(--color-${colors.primary})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    width: 36,
                    borderTopRightRadius: 8,
                    borderBottomRightRadius: 8,
                  }}>
                    <svg width="18" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M8 5L14 11L8 17" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>
              </div>
              <div className={bugReportModalStyles.progressContainer} style={{marginTop: 16}}>
                <div style={bugReportModalStyles.progressBar(colors.primary, progress)} />
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
      <style jsx global>{`
        .bug-tag-scrollbar {
          scrollbar-width: auto;
        }
        .bug-tag-scrollbar::-webkit-scrollbar {
          width: 4px;
          background: ${isDarkMode ? '#222' : 'white'};
        }
        .bug-tag-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-${colors.primary});
          border-radius: 4px;
        }
        @media (max-width: 359px) {
          .searchbar-fixed {
            width: calc(100vw - 2rem) !important;
            min-width: calc(100vw - 2rem) !important;
            max-width: calc(100vw - 2rem) !important;
          }
        }
        @media (min-width: 360px) {
          .searchbar-fixed {
            width: 320px !important;
            min-width: 320px !important;
            max-width: 320px !important;
          }
        }
        @media (min-width: 640px) {
          .searchbar-fixed {
            width: 480px !important;
            min-width: 480px !important;
            max-width: 480px !important;
          }
        }
      `}</style>
    </BaseModal>
  );
};

export default BugReportModal; 