import React from 'react';

export const parseMessageWithFinalFive = (message: string, colors: { primary: string }, righteous: { className: string }) => {
  return message.split('FINAL 5').map((part, i, arr) => (
    React.createElement(React.Fragment, { key: i }, 
      part,
      i < arr.length - 1 && React.createElement(
        'span', 
        { 
          style: { color: `var(--color-${colors.primary})` }, 
          className: righteous.className 
        }, 
        'FINAL 5'
      )
    )
  ));
};