export const headerStyles = {
  container: "w-full py-2 sm:py-2",
  compactContainer: "w-full py-1",
  header: "max-w-6xl mx-auto",
  content: "flex items-center justify-center gap-3 sm:gap-5",
  compactContent: "flex items-center justify-center gap-2",
  logoContainer: "h-[90px] sm:h-[120px] md:h-[140px] lg:h-[160px]",
  compactLogoContainer: "h-[60px]",
  title: "m-0",
  compactTitle: "m-0 text-2xl",
  titleText: (colors: { primary: string }) => ({
    fontSize: "clamp(28px, 5vw, 46px)",
    lineHeight: 1,
    color: `var(--color-${colors.primary})`
  }),
  compactTitleText: (colors: { primary: string }) => ({
    fontSize: "clamp(24px, 4vw, 32px)",
    lineHeight: 1,
    color: `var(--color-${colors.primary})`
  })
} as const; 