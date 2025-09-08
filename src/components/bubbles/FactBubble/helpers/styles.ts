import React from 'react';
import { TFunction } from 'i18next';
import { getFactTypeName } from '@/helpers/i18nHelpers';

export const getBubbleClassNames = (isClickable: boolean): string => {
  return isClickable ? 'bubbleClickable' : 'bubbleNotClickable';
};

export const getIconClassNames = (isClickable: boolean): string => {
  return isClickable ? 'iconClickable' : 'iconNotClickable';
};

export const getResponsiveStyle = (
  style: React.CSSProperties,
  bubbleSize: number,
  bubbleSpacing: number
): React.CSSProperties => {
  return {
    ...style,
    '--bubble-size': `${bubbleSize}px`,
    '--bubble-spacing': `${bubbleSpacing}px`
  } as React.CSSProperties;
};

export const getTranslatedFactType = (factType: string, t: TFunction): string => {
  return getFactTypeName(factType, t);
};