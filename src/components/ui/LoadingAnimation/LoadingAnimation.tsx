'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { useGameStore } from '@/store/gameStore';
import { useLoadingAnimation } from './useLoadingAnimation';
import { loadingAnimationStyles } from './LoadingAnimation.styles';
import { useThemeDOM } from '@/hooks/theme';
import Logo from '../../layout/Logo';
import { Righteous } from 'next/font/google';
import { CategoryType, categoryColorMap, CATEGORY_COLOR_MAPPING } from '../../../types';
import { getCategoryName } from '../../../helpers/i18nHelpers';

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
  const { t } = useTranslation('common');
  const {
    mounted,
    currentCategory,
    isShowingFinalCategory,
    isAnimationComplete,
    isChallengeFetched: challengeFetched,
    getThemeAdjustedPrimaryColor,
    darkMode,
    onComplete: completeAnimation
  } = useLoadingAnimation({
    finalCategory,
    onComplete,
    isChallengeFetched
  });

  const { highContrastMode } = useTheme();
  const { hasClass, getCSSProperty } = useThemeDOM();

  // Get the theme-adjusted color information
  const colorInfo = getThemeAdjustedPrimaryColor();

  // Get translated category name
  const translatedCategory = currentCategory ? getCategoryName(currentCategory, t) : '';

  // Check if we're showing the "Please wait..." placeholder
  const isPlaceholder = currentCategory === "PLEASE WAIT...";

  // Check if high contrast mode is active
  const isHighContrast = hasClass('high-contrast');

  return (
    <div className={loadingAnimationStyles.container}>
      <div className={loadingAnimationStyles.innerContainer}>
        {/* Top half - Logo */}
        <div className={loadingAnimationStyles.logoContainer}>
          <motion.div
            {...loadingAnimationStyles.logoAnimation}
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
              {...loadingAnimationStyles.lineAnimation}
              style={loadingAnimationStyles.animatedLine(colorInfo.rgb)}
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
                  initial={loadingAnimationStyles.categoryAnimation.initial}
                  animate={loadingAnimationStyles.categoryAnimation.animate(isShowingFinalCategory)}
                  exit={loadingAnimationStyles.categoryAnimation.exit}
                  transition={loadingAnimationStyles.categoryAnimation.transition(isShowingFinalCategory)}
                  className={`m-0 ${righteous.className} ${isShowingFinalCategory ? 'font-bold' : ''} ${isPlaceholder ? 'text-gray-500 dark:text-gray-400' : ''}`}
                  style={loadingAnimationStyles.getCategoryStyle(
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
              {...loadingAnimationStyles.loadingAnimation}
              className={loadingAnimationStyles.loadingIndicatorContainer}
            >
              <div 
                style={loadingAnimationStyles.loadingSpinner(colorInfo.rgb)}
              ></div>
              <p className={loadingAnimationStyles.loadingText}>{t('loading.message', 'Please wait, loading challenge...')}</p>
            </motion.div>
          )}
        </div>

        {/* Skip button - only shown when challenge is fetched */}
        {challengeFetched && (
          <motion.button
            {...loadingAnimationStyles.skipButtonAnimation}
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