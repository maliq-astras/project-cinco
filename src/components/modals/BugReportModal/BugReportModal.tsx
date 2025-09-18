import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Righteous } from 'next/font/google';
import { useTranslation } from 'react-i18next';
import BaseModal from '../BaseModal/BaseModal';
import IconButton from '@/components/ui/IconButton';
import { useBugReportModal } from './hooks';
import { formatStepLabel } from './helpers';
import styles from './BugReportModal.module.css';

interface BugReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

export default function BugReportModal({ isOpen, onClose }: BugReportModalProps) {
  const { t } = useTranslation();
  
  const {
    // State
    colors,
    isMobile,
    isDarkMode,
    textSegmentBg,
    
    // Form state
    step,
    formData,
    submitted,
    progress,
    steps,
    tagSearch,
    filteredTags,
    
    // Validation
    isStepValid,
    
    // File handling
    fileInputRef,
    isDragging,
    
    // Event handlers
    handleNext,
    handleBack,
    handleInputChange,
    handleTagSearchChange,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleRemoveFile,
    handleFileUpload,
    
    // Height calculations
    getMobileHeight,
    getDesktopMaxHeight,
    contentStyle
  } = useBugReportModal({ isOpen, onClose });

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
            <svg className={`${styles.successIcon} mb-4`} fill="none" stroke={`var(--color-${colors.primary})`} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h3 className={styles.successTitle}>{t('bugReport.success.title')}</h3>
            <p className={styles.successMessage}>
              {t('bugReport.success.message')}
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
        <label htmlFor={`bug-step-input-${step}`} style={{position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0}}>
          {currentStep.label}
        </label>
        {currentStep.type === 'bugType' && (
          <div className="flex flex-col items-center mb-6 mx-auto bug-tag-scrollbar searchbar-fixed"
             style={{ height: 350, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}
          >
            <input
              type="text"
              placeholder="Search..."
              value={tagSearch}
              onChange={handleTagSearchChange}
              className="px-2 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#18181b] text-base focus:outline-none focus:ring-2 focus:ring-primary mx-auto searchbar-fixed"
              style={{ color: isDarkMode ? 'white' : undefined, marginBottom: 32 }}
            />
            <div
              className="flex flex-wrap gap-3 justify-center w-full bug-tag-scrollbar searchbar-fixed"
              style={{ height: 300, overflowY: 'auto', alignContent: 'flex-start' }}
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
                const bugTypeArray = Array.isArray(formData.bugType) ? formData.bugType : [];
                const selected = bugTypeArray.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      let newSelected;
                      if (selected) {
                        newSelected = bugTypeArray.filter((o: string) => o !== option);
                      } else {
                        newSelected = [...bugTypeArray, option];
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
                    {t(`bugReport.tags.${option}`)}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {currentStep.type === 'deviceType' && (
          <div className="flex flex-wrap gap-3 justify-center w-full mt-2">
            {['iphone', 'androidPhone', 'ipad', 'androidTablet', 'windowsPC', 'mac', 'chromebook', 'other'].map((option) => {
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
                  {t(`bugReport.devices.${option}`)}
                </button>
              );
            })}
          </div>
        )}
        {currentStep.type === 'details' && (
          <>
            <textarea
              id={`bug-step-input-${step}`}
              value={typeof formData.bugDetails === 'string' ? formData.bugDetails : ''}
              onChange={(e) => handleInputChange(e.target.value.slice(0, 400), 'bugDetails')}
              maxLength={400}
              className="block mx-auto w-[95vw] h-48 md:h-64 resize-none px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-800/50 dark:text-white"
              style={{ maxWidth: 'calc(100% - 3rem)' }}
              placeholder={t('bugReport.details.placeholder')}
            />
            <div className="text-xs text-gray-400 mt-2 w-full max-w-2xl md:max-w-3xl mx-auto text-right">
              {(formData.bugDetails && typeof formData.bugDetails === 'string' ? formData.bugDetails.length : 0)}/400
            </div>
          </>
        )}
        {currentStep.type === 'file' && (
          <>
            <input
              type="file"
              id={`bug-step-input-${step}`}
              ref={fileInputRef}
              onChange={(e) => handleFileUpload(e, handleInputChange)}
              className="hidden"
              accept="image/*"
            />
            {!formData.file ? (
              <div
                className={`${styles.fileUploadContainer} ${isDragging ? styles.fileUploadContainerDragging : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, handleInputChange)}
              >
                <svg className={styles.fileUploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className={styles.fileUploadText}>
                  {isDragging ? t('bugReport.fileUpload.dropHere') : t('bugReport.fileUpload.clickOrDrag')}
                </p>
                <p className={styles.fileUploadOptional}>{t('bugReport.fileUpload.optional')}</p>
              </div>
            ) : (
              <div className={styles.filePreviewContainer}>
                <svg className={styles.filePreviewIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className={styles.filePreviewText}>{formData.file && typeof formData.file === 'object' && 'name' in formData.file ? (formData.file as File).name : 'File'}</span>
                <button
                  onClick={() => handleRemoveFile(handleInputChange)}
                  className={styles.filePreviewRemoveButton}
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
      className={isMobile ? undefined : "max-w-2xl"}
      mobileHeight={getMobileHeight()}
      desktopMaxHeight={getDesktopMaxHeight()}
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
              <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0}}>
                {renderStepContent()}
              </div>
              <div className="w-full flex justify-between items-end mt-8" style={{minHeight: 48}}>
                {step > 0 ? (
                  <IconButton
                    icon="prev"
                    onClick={handleBack}
                    ariaLabel={t('bugReport.navigation.prev')}
                  />
                ) : <span />}
                <IconButton
                  icon={step === steps.length - 1 ? "done" : "next"}
                  onClick={handleNext}
                  disabled={steps[step].type === 'file' ? false : !isStepValid(step)}
                  ariaLabel={(steps[step].type === 'file' && !formData.file) ? t('bugReport.navigation.skip') : t('bugReport.navigation.next')}
                />
              </div>
              <div className={styles.progressContainer} style={{marginTop: 16}}>
                <div style={{
                  width: `${progress}%`,
                  backgroundColor: `var(--color-${colors.primary})`,
                  height: '100%',
                  borderRadius: '9999px',
                  transition: 'width 0.3s ease-in-out'
                }} />
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