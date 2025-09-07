export function getFactBubblePositionFromElement(factBubble: HTMLElement | null): { x: number, y: number } | null {
  if (factBubble) {
    const rect = factBubble.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }
  return null;
}

export function showToastMessageFromElement(toastElement: HTMLElement | null, duration: number = 2000): void {
  if (toastElement) {
    toastElement.classList.remove('hidden');
    setTimeout(() => {
      toastElement.classList.add('animate-fadeOut');
      setTimeout(() => {
        toastElement.classList.remove('animate-fadeIn', 'animate-fadeOut');
        toastElement.classList.add('hidden');
      }, 300);
    }, duration);
  }
}

export function formatTime(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
}