/**
 * Generate SVG mask style for tutorial overlay
 * @param spotlightStyles Position and dimensions of the spotlight area
 * @param isLogo Whether highlighting the logo (uses rounded rectangle)
 * @returns CSS properties for the overlay mask
 */
export function getOverlayMaskStyle(
  spotlightStyles: { left: string; top: string; width: string; height: string }, 
  isLogo: boolean = false
): React.CSSProperties {
  const x = parseFloat(spotlightStyles.left);
  const y = parseFloat(spotlightStyles.top);
  const width = parseFloat(spotlightStyles.width);
  const height = parseFloat(spotlightStyles.height);
  
  const maskShape = isLogo
    ? `<rect x='${x}' y='${y}' width='${width}' height='${height}' rx='12' fill='black'/>`
    : `<rect x='${x}' y='${y}' width='${width}' height='${height}' rx='8' fill='black'/>`;
  
  return {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3Cmask id='mask'%3E%3Crect width='100%25' height='100%25' fill='white'/%3E${encodeURIComponent(maskShape)}%3C/mask%3E%3C/defs%3E%3Crect width='100%25' height='100%25' mask='url(%23mask)' fill='black'/%3E%3C/svg%3E")`,
    maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3Cmask id='mask'%3E%3Crect width='100%25' height='100%25' fill='white'/%3E${encodeURIComponent(maskShape)}%3C/mask%3E%3C/defs%3E%3Crect width='100%25' height='100%25' mask='url(%23mask)' fill='black'/%3E%3C/svg%3E")`,
  };
}

/**
 * Generate spotlight outline style for tutorial
 * @param spotlightStyles Position and dimensions of the spotlight area
 * @param isLogo Whether highlighting the logo (uses rounded corners)
 * @param isDarkMode Whether dark mode is active
 * @returns CSS properties for the spotlight outline
 */
export function getSpotlightStyle(
  spotlightStyles: { top: string; left: string; width: string; height: string }, 
  isLogo: boolean = false, 
  isDarkMode: boolean = false
): React.CSSProperties {
  const y = parseFloat(spotlightStyles.top);
  const width = parseFloat(spotlightStyles.width);
  const height = parseFloat(spotlightStyles.height);
  const x = parseFloat(spotlightStyles.left);
  
  return {
    top: y + 'px',
    left: x + 'px',
    width: width + 'px',
    height: height + 'px',
    borderRadius: isLogo ? '12px' : '10px',
    pointerEvents: 'none' as const,
    border: 'none',
    outline: isDarkMode 
      ? '3px solid rgba(255, 255, 255, 0.8)' 
      : '3px solid white',
    outlineOffset: '0px',
    boxShadow: isDarkMode 
      ? '0 0 20px 5px rgba(255, 255, 255, 0.5)' 
      : '0 0 20px 5px rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
  };
}

/**
 * Get text box styles for tutorial modal
 */
export const getTextBoxStyle = (
  primaryColor: string,
  darkMode: boolean,
  _textBoxStyles: { left: string; top: string; width: string }
) => ({
  borderColor: `var(--color-${primaryColor})`,
  boxShadow: darkMode 
    ? '0 10px 25px -5px rgba(0, 0, 0, 0.8), 0 10px 10px -5px rgba(0, 0, 0, 0.5)' 
    : '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
} as React.CSSProperties);

/**
 * Get title color style
 */
export const getTitleStyle = (primaryColor: string) => ({
  color: `var(--color-${primaryColor})`
});

/**
 * Get progress dot style
 */
export const getProgressDotStyle = (primaryColor: string, isActive: boolean) => ({
  backgroundColor: isActive 
    ? `var(--color-${primaryColor})`
    : `var(--color-${primaryColor}30)`
});