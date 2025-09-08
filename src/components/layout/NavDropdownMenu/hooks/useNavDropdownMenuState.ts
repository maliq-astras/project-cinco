import React from 'react';
import { useTranslation } from 'react-i18next';

export const useNavDropdownMenuState = () => {
  const { t } = useTranslation();
  const menuRef = React.useRef<HTMLDivElement>(null);

  return {
    t,
    menuRef
  };
};