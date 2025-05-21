import React from 'react';

interface ModalNavButtonProps {
  direction: 'next' | 'prev';
  label: string;
  onClick: () => void;
  disabled?: boolean;
  primaryColor: string;
  textSegmentBg: string;
}

const ModalNavButton: React.FC<ModalNavButtonProps> = ({
  direction,
  label,
  onClick,
  disabled = false,
  primaryColor,
  textSegmentBg,
}) => {
  const isNext = direction === 'next';
  return (
    <button
      onClick={onClick}
      className="flex items-center font-bold transition-colors focus:outline-none"
      style={{
        minWidth: 100,
        height: 36,
        borderRadius: 10,
        background: textSegmentBg,
        color: `var(--color-${primaryColor})`,
        border: `2px solid var(--color-${primaryColor})`,
        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
        display: 'flex',
        padding: 0,
        overflow: 'hidden',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      disabled={disabled}
    >
      {/* Arrow segment (left for prev, right for next) */}
      {isNext ? null : (
        <span style={{
          background: `var(--color-${primaryColor})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: 36,
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
          marginRight: 2,
        }}>
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M14 5L8 11L14 17" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      )}
      {/* Text segment */}
      <span style={{
        flex: 1,
        textAlign: 'center',
        fontWeight: 700,
        letterSpacing: 1,
        fontSize: 14,
        color: `var(--color-${primaryColor})`,
        background: textSegmentBg,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: isNext ? 8 : 0,
        borderBottomLeftRadius: isNext ? 8 : 0,
        borderTopRightRadius: !isNext ? 8 : 0,
        borderBottomRightRadius: !isNext ? 8 : 0,
        marginRight: isNext ? 2 : 0,
        marginLeft: !isNext ? 2 : 0,
      }}>{label}</span>
      {/* Arrow segment (right for next) */}
      {isNext ? (
        <span style={{
          background: `var(--color-${primaryColor})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: 36,
          borderTopRightRadius: 8,
          borderBottomRightRadius: 8,
        }}>
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M8 5L14 11L8 17" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      ) : null}
    </button>
  );
};

export default ModalNavButton; 