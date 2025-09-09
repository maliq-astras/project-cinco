/**
 * Generate responsive container styles
 */
export const getResponsiveContainerStyle = (responsiveValues: { spacing: number }): React.CSSProperties => ({
  padding: `0 ${responsiveValues.spacing}px`,
  paddingTop: `${responsiveValues.spacing}px`,
  paddingBottom: `${responsiveValues.spacing}px`
});