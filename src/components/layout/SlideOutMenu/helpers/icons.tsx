import React from 'react';

interface IconProps {
  color: string;
  size?: number;
}

export const SettingsIcon = ({ color, size = 20 }: IconProps) => (
  <svg
    width={size}
    height={size}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
    />
  </svg>
);

export const HelpIcon = ({ color, size = 20 }: IconProps) => (
  <svg
    width={size}
    height={size}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
);

export const FeedbackIcon = ({ color, size = 20 }: IconProps) => (
  <svg
    width={size}
    height={size}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
    />
  </svg>
);

export const BugIcon = ({ color, size = 20 }: IconProps) => (
  <svg
    width={size}
    height={size}
    fill="none"
    stroke={color}
    viewBox="0 0 24 24"
    strokeWidth={2}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M12 5V3m0 0H10M12 3h2m-2 2c-3 0-5 2-5 5v4c0 3 2 5 5 5s5-2 5-5v-4c0-3-2-5-5-5z" 
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M7 10h2M15 10h2M7 14h2M15 14h2M5 8l2 2M19 8l-2 2M5 16l2-2M19 16l-2-2" 
    />
  </svg>
);

export const getMenuItemIcon = (iconType: string | undefined, color: string, size?: number) => {
  switch (iconType) {
    case 'settings':
      return <SettingsIcon color={color} size={size} />;
    case 'help':
      return <HelpIcon color={color} size={size} />;
    case 'feedback':
      return <FeedbackIcon color={color} size={size} />;
    case 'bug':
      return <BugIcon color={color} size={size} />;
    default:
      return null;
  }
};