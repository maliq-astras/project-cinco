import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { calculateBubbleSizes, getDifficultyButtonStyle } from '../helpers';

interface DifficultySelectorProps {
  value: number;
  onChange: (value: number) => void;
  hovered: number | null;
  setHovered: (v: number | null) => void;
  isMobile: boolean;
  difficultyOptions: string[];
  primaryColor: string;
}

export const DifficultySelector = React.memo<DifficultySelectorProps>(({
  value,
  onChange,
  hovered,
  setHovered,
  isMobile,
  difficultyOptions,
  primaryColor
}) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  
  const sizes = calculateBubbleSizes();
  const labelColor = darkMode ? '#fff' : '#111';

  if (isMobile) {
    return (
      <div className="flex flex-col items-center mb-6 w-full">
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
                  style={getDifficultyButtonStyle(idx, isActive, primaryColor, sizes)}
                >
                  <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(1px, 1px, 1px, 1px)' }}>
                    {t(`feedback.difficulty.options.${difficultyOptions[idx - 1]}`)}
                  </span>
                </button>
                {idx === 1 && (
                  <span className="text-base font-semibold" style={{ color: labelColor, textAlign: 'center', width: sizes[0], position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: sizes[0] + 6 }}>
                    {t('feedback.difficulty.easy')}
                  </span>
                )}
                {idx === 5 && (
                  <span className="text-base font-semibold" style={{ color: labelColor, textAlign: 'center', width: sizes[4], position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: sizes[4] + 6 }}>
                    {t('feedback.difficulty.hard')}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-8 w-full max-w-2xl">
      <span className="text-base md:text-lg font-semibold flex items-center" style={{ color: labelColor, minWidth: 70, textAlign: 'right', lineHeight: '44px', height: 48 }}>
        {t('feedback.difficulty.easy')}
      </span>
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
              style={getDifficultyButtonStyle(idx, isActive, primaryColor, sizes)}
            >
              <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(1px, 1px, 1px, 1px)' }}>
                {t(`feedback.difficulty.options.${difficultyOptions[idx - 1]}`)}
              </span>
            </button>
          );
        })}
      </div>
      <span className="text-base md:text-lg font-semibold flex items-center" style={{ color: labelColor, minWidth: 70, textAlign: 'left', lineHeight: '44px', height: 48 }}>
        {t('feedback.difficulty.hard')}
      </span>
    </div>
  );
});

DifficultySelector.displayName = 'DifficultySelector';