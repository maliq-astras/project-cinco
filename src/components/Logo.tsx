import React from 'react';

interface LogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  className = "",
  width,
  height
}) => {
  return (
    <img 
      src="/icons/logo.svg" 
      alt="Fact 5"
      className={className}
      style={{
        width: width || 'auto',
        height: height || 'auto',
        display: 'block',
        objectFit: 'contain'
      }}
    />
  );
};

export default Logo; 