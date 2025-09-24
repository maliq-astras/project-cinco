export const ANIMATIONS = {
  // MainContainer
  FADE_IN: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8, delay: 2.4 }
  },

  // GameContent
  CARD_STACK: {
    initial: { opacity: 0, scale: 0.95, x: -20 },
    animate: { opacity: 1, scale: 1, x: 0 },
    transition: { duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  MIDDLE_SECTION: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  BOTTOM_SECTION: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  },

  // MobileGameContent
  MOBILE_CARD_STACK: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  MOBILE_TOP_SECTION: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  MOBILE_MIDDLE_SECTION: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  MOBILE_BOTTOM_SECTION: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  },

  // Resize transitions
  RESIZE_FADE_OUT: {
    animate: { opacity: 0 },
    transition: { duration: 0.15, ease: [0.4, 0, 1, 1] }
  },
  RESIZE_FADE_IN: {
    animate: { opacity: 1 },
    transition: { duration: 0.15, delay: 0.05, ease: [0, 0, 0.2, 1] }
  },

  // Navigation
  NAVIGATION: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.4, delay: 0.1, ease: [0.4, 0, 0.2, 1] }
  },

  // CompactHeader
  LOGO: {
    initial: { opacity: 0, scale: 0.8, x: -20 },
    animate: { opacity: 1, scale: 1, x: 0 },
    transition: { duration: 0.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  CATEGORY_TITLE: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  HARD_MODE_BADGE: {
    initial: { opacity: 0, scale: 0.8, x: 10 },
    animate: { opacity: 1, scale: 1, x: 0 },
    transition: { duration: 0.4, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  HAMBURGER_BUTTON: {
    initial: { opacity: 0, scale: 0.8, x: 20 },
    animate: { opacity: 1, scale: 1, x: 0 },
    transition: { duration: 0.5, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  HAMBURGER_ICON: {
    rotate: {
      open: 180,
      closed: 0
    },
    transition: { duration: 0.3 }
  }
} as const;

export const EASING = {
  SMOOTH: [0.25, 0.46, 0.45, 0.94] as const,
  DEFAULT: [0.4, 0, 0.2, 1] as const
} as const;