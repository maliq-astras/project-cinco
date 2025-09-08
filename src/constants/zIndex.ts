export const Z_INDEX = {
  // Base layers
  BASE: 0,
  CONTENT: 1,
  
  // UI layers
  HEADER: 10,
  NAVIGATION: 10,
  SIDEBAR: 15,
  
  // Interactive elements  
  DROPDOWN: 20,
  TOOLTIP: 30,
  
  // Overlays
  LOADING_OVERLAY: 40,
  WRONG_ANSWER_OVERLAY: 45,
  DROP_ZONE_OVERLAY: 15,
  
  // Modals and high-priority UI
  MODAL_BACKDROP: 50,
  MODAL_CONTENT: 51,
  SLIDE_OUT_MENU: 55,
  
  // Absolute top layer
  TOAST: 60,
  DEBUG: 9999
} as const;

// Helper to get z-index values
export const getZIndex = (layer: keyof typeof Z_INDEX): number => {
  return Z_INDEX[layer];
};