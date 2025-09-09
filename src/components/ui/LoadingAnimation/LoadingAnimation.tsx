'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Righteous } from 'next/font/google';
import { useTheme } from '@/contexts/ThemeContext';
import { useLoadingAnimation } from './hooks';
import { loadingAnimations, loadingAnimationStyles, getCategoryStyle, getAnimatedLineStyle, getLoadingSpinnerStyle } from './helpers';
import Logo from '../../layout/Logo';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

interface LoadingAnimationProps {
  finalCategory: string;
  onComplete: () => void;
  isChallengeFetched: boolean;
}

export default function LoadingAnimation({ 
  finalCategory, 
  onComplete, 
  isChallengeFetched 
}: LoadingAnimationProps) {
  const {
    mounted,
    currentCategory,
    isShowingFinalCategory,
    isAnimationComplete,
    colorInfo,
    translatedCategory,
    isPlaceholder,
    isHighContrast,
    darkMode,
    challengeFetched,
    getCSSProperty,
    onComplete: completeAnimation,
    t
  } = useLoadingAnimation({
    finalCategory,
    onComplete,
    isChallengeFetched
  });

  const { highContrastMode } = useTheme();

  return (
    <div className={loadingAnimationStyles.container}>
      <div className={loadingAnimationStyles.innerContainer}>
        {/* Top half - Logo */}
        <div className={loadingAnimationStyles.logoContainer}>
          <motion.div
            {...loadingAnimations.logo}
            className={loadingAnimationStyles.logoWrapper}
          >
            <Logo height="100%" />
          </motion.div>
        </div>
        
        {/* Center line */}
        <div className={loadingAnimationStyles.centerLine}>
          {/* Line in the middle - appears when showing final category */}
          {mounted && isShowingFinalCategory && !isPlaceholder && (
            <motion.div
              {...loadingAnimations.line}
              style={getAnimatedLineStyle(colorInfo.rgb)}
              className={`${highContrastMode ? 'high-contrast-line' : ''}`}
            />
          )}
        </div>
        
        {/* Bottom half - Category slot animation */}
        <div className={loadingAnimationStyles.categoryContainer}>
          {/* Category container */}
          <div className={loadingAnimationStyles.categoryWrapper}>
            {mounted && currentCategory ? (
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentCategory}
                  initial={loadingAnimations.category.initial}
                  animate={loadingAnimations.category.animate(isShowingFinalCategory)}
                  exit={loadingAnimations.category.exit}
                  transition={loadingAnimations.category.transition(isShowingFinalCategory)}
                  className={`m-0 ${righteous.className} ${isShowingFinalCategory ? 'font-bold' : ''} ${isPlaceholder ? 'text-gray-500 dark:text-gray-400' : ''}`}
                  style={getCategoryStyle(
                    isShowingFinalCategory,
                    colorInfo.rgb,
                    colorInfo.colorClass,
                    darkMode,
                    translatedCategory,
                    isHighContrast,
                    getCSSProperty
                  )}
                  data-category={currentCategory}
                >
                  {translatedCategory}
                </motion.h1>
              </AnimatePresence>
            ) : (
              <div className={loadingAnimationStyles.categoryPlaceholder}></div>
            )}
          </div>
          
          {/* Loading indicator */}
          {mounted && isAnimationComplete && !challengeFetched && (
            <motion.div
              {...loadingAnimations.loading}
              className={loadingAnimationStyles.loadingIndicatorContainer}
            >
              <div 
                style={getLoadingSpinnerStyle(colorInfo.rgb)}
              ></div>
              <p className={loadingAnimationStyles.loadingText}>{t('loading.message', 'Please wait, loading challenge...')}</p>
            </motion.div>
          )}
        </div>

        {challengeFetched && (
          <motion.button
            {...loadingAnimations.skipButton}
            onClick={completeAnimation}
            className={`${loadingAnimationStyles.skipButton} ${righteous.className}`}
          >
            {t('loading.skip', 'SKIP')} &gt;&gt;
          </motion.button>
        )}
      </div>
    </div>
  );
} 