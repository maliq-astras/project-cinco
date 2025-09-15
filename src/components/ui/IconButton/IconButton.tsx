import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import styles from './IconButton.module.css';

interface IconButtonProps {
  icon: 'prev' | 'next' | 'done';
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  disabled = false,
  ariaLabel
}) => {
  const { colors } = useTheme();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={styles.iconButton}
      aria-label={ariaLabel}
    >
      <div 
        className={styles.iconButtonImage}
        style={{ 
          WebkitMask: `url(/icons/${icon}.svg) no-repeat center/${icon === 'done' ? 'contain' : '105%'}`,
          mask: `url(/icons/${icon}.svg) no-repeat center/${icon === 'done' ? 'contain' : '105%'}`,
          backgroundColor: `var(--color-${colors.primary})`
        }}
        aria-hidden="true"
      />
    </button>
  );
};

export default IconButton;