/**
 * Custom hook to handle theme DOM manipulation
 * Centralizes all document.documentElement operations for theme management
 */

export function useThemeDOM() {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
  
  // Get document root element
  const getRootElement = () => isBrowser ? document.documentElement : null;
  
  // Check if a class is present on the root element
  const hasClass = (className: string): boolean => {
    const root = getRootElement();
    return root ? root.classList.contains(className) : false;
  };
  
  // Add a class to the root element
  const addClass = (className: string) => {
    const root = getRootElement();
    if (root) {
      root.classList.add(className);
    }
  };
  
  // Remove a class from the root element
  const removeClass = (className: string) => {
    const root = getRootElement();
    if (root) {
      root.classList.remove(className);
    }
  };
  
  // Set a CSS custom property on the root element
  const setCSSProperty = (property: string, value: string) => {
    const root = getRootElement();
    if (root) {
      root.style.setProperty(property, value);
    }
  };
  
  // Get a CSS custom property from the root element
  const getCSSProperty = (property: string): string => {
    const root = getRootElement();
    if (root) {
      return getComputedStyle(root).getPropertyValue(property).trim();
    }
    return '';
  };

  // Update the theme-color meta tag for iOS status bar
  const updateThemeColor = (color: string) => {
    if (isBrowser) {
      let themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (!themeColorMeta) {
        themeColorMeta = document.createElement('meta');
        themeColorMeta.setAttribute('name', 'theme-color');
        document.getElementsByTagName('head')[0].appendChild(themeColorMeta);
      }
      themeColorMeta.setAttribute('content', color);
    }
  };
  
  return {
    isBrowser,
    hasClass,
    addClass,
    removeClass,
    setCSSProperty,
    getCSSProperty,
    updateThemeColor
  };
}
