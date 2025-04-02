export const headerStyles = {
  container: "w-full py-3 sm:py-4",
  header: "max-w-6xl mx-auto",
  content: "flex items-center justify-center gap-3 sm:gap-6",
  logoContainer: "h-[99px] sm:h-[132px] md:h-[165px] lg:h-[187px]",
  title: "m-0",
  titleText: (colors: { primary: string }) => ({
    fontSize: "clamp(28px, 5vw, 46px)",
    lineHeight: 1,
    color: `var(--color-${colors.primary})`
  })
} as const; 