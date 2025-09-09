export const getScreenSizeMessage = (isMobile: boolean): string => {
  return isMobile 
    ? "Please increase your screen size or rotate your device to play the game."
    : "Please increase your browser window height to continue.";
};

export const getMinimumRequirements = (isMobile: boolean): string => {
  return isMobile 
    ? "650px height × 320px width"
    : "600px height";
};