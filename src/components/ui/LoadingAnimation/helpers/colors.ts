import { COLOR_MAPPING } from '@/types';

const PLACEHOLDER_TEXT_COLORS = {
  dark: 'rgb(156, 163, 175)',
  light: 'rgb(107, 114, 128)'
} as const;

const COLOR_MAP: Record<string, string> = {
  'blue-600': '37, 99, 235',
  'blue-500': '59, 130, 246',
  'blue-700': '29, 78, 216',
  'blue-400': '96, 165, 250',
  'emerald-600': '5, 150, 105',
  'emerald-500': '16, 185, 129',
  'emerald-700': '4, 120, 87',
  'emerald-400': '52, 211, 153',
  'violet-600': '124, 58, 237',
  'violet-500': '139, 92, 246',
  'violet-700': '109, 40, 217',
  'violet-400': '167, 139, 250',
  'orange-600': '234, 88, 12',
  'orange-500': '249, 115, 22',
  'orange-700': '194, 65, 12',
  'orange-400': '251, 146, 60',
  'fuchsia-600': '192, 38, 211',
  'fuchsia-500': '217, 70, 239',
  'fuchsia-700': '162, 28, 175',
  'fuchsia-400': '232, 121, 249',
  'red-600': '220, 38, 38',
  'red-500': '239, 68, 68',
  'red-700': '185, 28, 28',
  'red-400': '248, 113, 113',
  'amber-500': '245, 158, 11',
  'amber-400': '251, 191, 36',
  'amber-600': '217, 119, 6',
  'amber-300': '252, 211, 77',
  'teal-500': '20, 184, 166',
  'teal-400': '45, 212, 191',
  'teal-600': '13, 148, 136',
  'teal-300': '94, 234, 212',
  'indigo-500': '99, 102, 241',
  'indigo-400': '129, 140, 248',
  'indigo-600': '79, 70, 229',
  'indigo-300': '165, 180, 252',
  'gray-500': '107, 114, 128',
  'gray-400': '156, 163, 175',
  'gray-600': '75, 85, 99',
  'gray-100': '243, 244, 246',
  'gray-900': '17, 24, 39'
} as const;

const SHADOW_COLOR_MAP: Record<string, string> = {
  'blue-600': 'rgba(37, 99, 235, 0.3)',
  'blue-500': 'rgba(59, 130, 246, 0.3)',
  'blue-400': 'rgba(96, 165, 250, 0.3)',
  'emerald-600': 'rgba(5, 150, 105, 0.3)',
  'emerald-500': 'rgba(16, 185, 129, 0.3)',
  'emerald-400': 'rgba(52, 211, 153, 0.3)',
  'violet-600': 'rgba(124, 58, 237, 0.3)',
  'violet-500': 'rgba(139, 92, 246, 0.3)',
  'violet-400': 'rgba(167, 139, 250, 0.3)',
  'orange-600': 'rgba(234, 88, 12, 0.3)',
  'orange-500': 'rgba(249, 115, 22, 0.3)',
  'orange-400': 'rgba(251, 146, 60, 0.3)',
  'fuchsia-600': 'rgba(192, 38, 211, 0.3)',
  'fuchsia-500': 'rgba(217, 70, 239, 0.3)',
  'fuchsia-400': 'rgba(232, 121, 249, 0.3)',
  'red-600': 'rgba(220, 38, 38, 0.3)',
  'red-500': 'rgba(239, 68, 68, 0.3)',
  'red-400': 'rgba(248, 113, 113, 0.3)',
  'amber-600': 'rgba(217, 119, 6, 0.3)',
  'amber-500': 'rgba(245, 158, 11, 0.3)',
  'amber-400': 'rgba(251, 191, 36, 0.3)',
  'teal-600': 'rgba(13, 148, 136, 0.3)',
  'teal-500': 'rgba(20, 184, 166, 0.3)',
  'teal-400': 'rgba(45, 212, 191, 0.3)',
  'indigo-600': 'rgba(79, 70, 229, 0.3)',
  'indigo-500': 'rgba(99, 102, 241, 0.3)',
  'indigo-400': 'rgba(129, 140, 248, 0.3)'
} as const;

export const getColorFromDocument = (colorClass: string, isBrowser: boolean, getCSSProperty: (varName: string) => string): string => {
  if (isBrowser) {
    const varName = `--color-${colorClass}-rgb`;
    const computed = getCSSProperty(varName);
    if (computed) return computed;
  }
  
  return COLOR_MAP[colorClass] || "59, 130, 246";
};

export const getThemeAdjustedPrimaryColor = (
  currentColor: any,
  darkMode: boolean,
  highContrastMode: boolean,
  isBrowser: boolean,
  getCSSProperty: (varName: string) => string,
  getAdjustedColorClass: (color: string) => string
) => {
  const colorClass = darkMode ? 
    getAdjustedColorClass(currentColor.primary) : 
    currentColor.primary;
  
  let rgb;
  
  if (highContrastMode && isBrowser) {
    const matches = colorClass.match(/([a-z]+)-(\d+)/);
    if (matches && matches[1] && matches[2]) {
      const colorFamily = matches[1];
      const colorShade = matches[2];
      
      const highContrastFamily = COLOR_MAPPING[colorFamily as keyof typeof COLOR_MAPPING] || colorFamily;
        
      const hcShade = darkMode ? 
        (parseInt(colorShade) >= 600 ? '300' : 
         parseInt(colorShade) >= 500 ? '300' :
         parseInt(colorShade) >= 400 ? '400' : '300') : 
        (parseInt(colorShade) >= 700 ? '950' : 
         parseInt(colorShade) >= 600 ? '900' :
         parseInt(colorShade) >= 500 ? '800' : '900');
         
      const varName = `--hc-${highContrastFamily}-${hcShade}`;
      const computed = getCSSProperty(varName);
      
      if (computed) {
        rgb = computed;
      } else {
        rgb = getColorFromDocument(colorClass, isBrowser, getCSSProperty);
      }
    } else {
      rgb = getColorFromDocument(colorClass, isBrowser, getCSSProperty);
    }
  } else {
    rgb = getColorFromDocument(colorClass, isBrowser, getCSSProperty);
  }
  
  return {
    colorClass,
    rgb,
    cssVar: `var(--color-${colorClass})`
  };
};

export const getShadowColor = (
  color: string, 
  isHighContrast: boolean = false, 
  isDarkMode: boolean = false,
  getCSSProperty?: (varName: string) => string
): string => {
  if (isHighContrast && getCSSProperty) {
    const matches = color.match(/([a-z]+)-(\d+)/);
    
    if (matches && matches[1] && matches[2]) {
      const colorFamily = matches[1];
      const highContrastFamily = COLOR_MAPPING[colorFamily as keyof typeof COLOR_MAPPING] || colorFamily;
      const hcShade = isDarkMode ? '300' : '900';
      const varName = `--hc-${highContrastFamily}-${hcShade}`;
      const computed = getCSSProperty(varName);
      
      if (computed) {
        return `rgba(${computed}, 0.3)`;
      }
    }
  }
  
  if (!SHADOW_COLOR_MAP[color]) {
    const [colorName] = color.split('-');
    const alternativeShades = ['500', '600', '400'];
    for (const altShade of alternativeShades) {
      const alternative = `${colorName}-${altShade}`;
      if (SHADOW_COLOR_MAP[alternative]) {
        return SHADOW_COLOR_MAP[alternative];
      }
    }
  }
  
  return SHADOW_COLOR_MAP[color] || 'rgba(100, 100, 100, 0.2)';
};

export { PLACEHOLDER_TEXT_COLORS };