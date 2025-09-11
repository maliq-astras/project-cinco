interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  colors: {
    primary: string;
  };
  dismissible?: boolean;
  mobileHeight?: string;
}

export const useBaseModalState = (props: BaseModalProps) => {
  const { isOpen, title, colors, dismissible = true, mobileHeight = '75vh' } = props;

  return {
    isOpen,
    title,
    colors,
    dismissible,
    mobileHeight,
  };
};