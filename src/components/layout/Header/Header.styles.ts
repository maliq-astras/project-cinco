export const headerStyles = {
  // Container styles
  container: "w-full py-2 sm:py-2",
  header: "max-w-6xl mx-auto",
  
  // XS → XL Container variants
  containerXs: "w-full py-1",
  containerSm: "w-full py-1.5",
  containerMd: "w-full py-2",
  containerLg: "w-full py-2.5",
  containerXl: "w-full py-3",
  
  // Content styles
  content: "flex items-center justify-center gap-3 sm:gap-5",
  
  // XS → XL Content variants
  contentXs: "flex items-center justify-center gap-1.5",
  contentSm: "flex items-center justify-center gap-2",
  contentMd: "flex items-center justify-center gap-3",
  contentLg: "flex items-center justify-center gap-4",
  contentXl: "flex items-center justify-center gap-5",
  
  // Logo container styles - synchronized XS → XL with VERTICAL breakpoints (INCREASED +5%)
  logoContainerXs: "h-[74px] max-w-[263px]", // Increased from 70px/250px
  logoContainerSm: "h-[89px] max-w-[315px]", // Increased from 85px/300px
  logoContainerMd: "h-[105px] max-w-[368px]", // Increased from 100px/350px
  logoContainerLg: "h-[126px] max-w-[420px]", // Increased from 120px/400px
  logoContainerXl: "h-[147px] max-w-[473px]", // Increased from 140px/450px
  
  // Title styles
  title: "m-0",
  
  // XS → XL Title variants
  titleXs: "m-0 text-lg",
  titleSm: "m-0 text-xl",
  titleMd: "m-0 text-2xl",
  titleLg: "m-0 text-3xl",
  titleXl: "m-0 text-4xl",
  
  // Title text styles - synchronized XS → XL with VERTICAL breakpoints (INCREASED +5%)
  titleTextXs: (colors: { primary: string }) => ({
    fontSize: "clamp(21px, 3.15vh, 27px)", // Increased from 20px/3vh/26px
    lineHeight: 1,
    color: `var(--color-${colors.primary})`,
    maxWidth: "263px", // Increased from 250px
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }),
  titleTextSm: (colors: { primary: string }) => ({
    fontSize: "clamp(25px, 3.68vh, 32px)", // Increased from 24px/3.5vh/30px
    lineHeight: 1,
    color: `var(--color-${colors.primary})`,
    maxWidth: "315px", // Increased from 300px
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }),
  titleTextMd: (colors: { primary: string }) => ({
    fontSize: "clamp(29px, 4.2vh, 38px)", // Increased from 28px/4vh/36px
    lineHeight: 1,
    color: `var(--color-${colors.primary})`,
    maxWidth: "368px", // Increased from 350px
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }),
  titleTextLg: (colors: { primary: string }) => ({
    fontSize: "clamp(34px, 4.73vh, 44px)", // Increased from 32px/4.5vh/42px
    lineHeight: 1,
    color: `var(--color-${colors.primary})`,
    maxWidth: "420px", // Increased from 400px
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }),
  titleTextXl: (colors: { primary: string }) => ({
    fontSize: "clamp(38px, 5.25vh, 50px)", // Increased from 36px/5vh/48px
    lineHeight: 1,
    color: `var(--color-${colors.primary})`,
    maxWidth: "473px", // Increased from 450px
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }),
  
  // Legacy support for backward compatibility
  compactContainer: "w-full py-1",
  compactContent: "flex items-center justify-center gap-2",
  compactLogoContainer: "h-[60px]",
  compactTitle: "m-0 text-2xl",
  compactTitleText: (colors: { primary: string }) => ({
    fontSize: "clamp(24px, 4vw, 32px)",
    lineHeight: 1,
    color: `var(--color-${colors.primary})`
  })
} as const; 