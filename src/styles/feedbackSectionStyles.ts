import { CSSProperties } from 'react';

/**
 * Styles for the Feedback Section component
 */
export const feedbackSectionStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    width: '100%',
    maxWidth: '560px',
    margin: '0 auto',
    padding: '0 1rem',
    minHeight: 'calc(100vh - 280px)',
  },

  header: (primaryColor: string): CSSProperties => ({
    fontSize: '2.5rem',
    fontWeight: 700,
    textAlign: 'center' as const,
    marginTop: '4rem',
    marginBottom: '2rem',
    color: `var(--color-${primaryColor})`,
    textTransform: 'uppercase' as const,
  }),

  formContainer: {
    width: '100%',
    maxWidth: '32rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '2rem',
    marginBottom: '2rem',
  },

  stepLabel: {
    display: 'block',
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '1.5rem',
    textAlign: 'center' as const,
  },

  formControl: (primaryColor: string): CSSProperties => ({
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid',
    borderColor: `var(--color-${primaryColor})`,
    marginBottom: '1.5rem',
    backgroundColor: 'transparent',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    outline: 'none',
  }),

  select: (primaryColor: string): CSSProperties => ({
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid',
    borderColor: `var(--color-${primaryColor})`,
    marginBottom: '1.5rem',
    outline: 'none',
    cursor: 'pointer',
  }),

  textarea: (primaryColor: string): CSSProperties => ({
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid',
    borderColor: `var(--color-${primaryColor})`,
    marginBottom: '1.5rem',
    minHeight: '120px',
    resize: 'vertical' as const,
    outline: 'none',
  }),

  button: (primaryColor: string, disabled: boolean = false): CSSProperties => ({
    padding: '0.75rem 2rem',
    borderRadius: '0.5rem',
    background: `var(--color-${primaryColor})`,
    color: 'white',
    fontWeight: 600,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease',
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
  }),

  buttonHover: {
    opacity: 0.9,
  },

  successMessage: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minHeight: '200px',
  },

  successTitle: (primaryColor: string): CSSProperties => ({
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    color: `var(--color-${primaryColor})`,
  }),

  successSubtitle: {
    fontSize: '1.125rem',
  },

  progressContainer: {
    width: '100%',
    maxWidth: '32rem',
    marginBottom: '3.5rem',
    marginTop: 'auto',
  },

  progressBar: {
    height: '0.5rem',
    borderRadius: '9999px',
    overflow: 'hidden',
  },

  progressIndicator: (primaryColor: string, progress: number): CSSProperties => ({
    height: '0.5rem',
    borderRadius: '9999px',
    background: `var(--color-${primaryColor})`,
    width: `${progress}%`,
    transition: 'width 0.4s ease',
  }),

  stepAnimation: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
    transition: { duration: 0.35 },
  },

  successAnimation: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.4 },
  },
}; 