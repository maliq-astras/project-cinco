import React from 'react';

interface ModalNavButtonProps {
  direction: 'next' | 'prev';
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const ModalNavButton: React.FC<ModalNavButtonProps> = ({
  direction,
  label,
  onClick,
  disabled = false,
}) => {
  const isNext = direction === 'next';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ 
        background: 'transparent', 
        border: 'none', 
        padding: 0,
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
      aria-label={label}
    >
      <img 
        src={isNext ? "/icons/next.svg" : "/icons/prev.svg"} 
        width="32" 
        height="32" 
        alt={isNext ? "Next" : "Previous"}
        style={{ opacity: disabled ? 0.5 : 1 }}
      />
    </button>
  );
};

export default ModalNavButton; 