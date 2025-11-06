export const getModalStyle = (modalSize: { width: number; height: string | number }) => ({
  width: `${modalSize.width}px`,
  height: modalSize.height,
});

export const getButtonStyle = (color: string, padding: number, fontSize: number) => ({
  backgroundColor: `var(--color-${color})`,
  padding: `${padding}px ${padding * 2}px`,
  fontSize: `${fontSize}px`,
});

export const getTextStyle = (color: string, fontSize: number) => ({
  fontSize: `${fontSize}px`,
});
