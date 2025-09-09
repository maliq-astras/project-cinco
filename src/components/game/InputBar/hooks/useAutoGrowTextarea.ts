import { useEffect, useLayoutEffect, useRef } from 'react';

type RefEl = HTMLTextAreaElement | null;

interface UseAutoGrowTextareaOptions {
  maxHeightPx?: number; // cap growth height
}

/**
 * Locks a fixed baseline height for the shell so the textarea baseline never moves,
 * and grows the textarea upward by anchoring it to the bottom of the shell.
 */
export function useAutoGrowTextarea(
  textareaRef: React.RefObject<HTMLTextAreaElement | null>,
  shellRef: React.RefObject<HTMLDivElement | null>,
  value: string,
  { maxHeightPx = 120 }: UseAutoGrowTextareaOptions = {}
) {
  const baseHeightRef = useRef<number>(44); // fallback baseline

  // Measure baseline height once after mount and on resize (font/viewport changes)
  useLayoutEffect(() => {
    const measure = () => {
      const el = textareaRef.current as RefEl;
      const shell = shellRef.current;
      if (!el || !shell) return;
      // Temporarily reset to a single line to read offsetHeight
      const prev = el.value;
      const prevH = el.style.height;
      el.style.height = 'auto';
      el.value = '';
      // Force layout
      const baseline = Math.max(40, el.scrollHeight || el.offsetHeight || 44);
      baseHeightRef.current = baseline;
      // Lock shell to baseline so layout never shifts
      shell.style.height = `${baseline}px`;
      // Restore value and height
      el.value = prev;
      el.style.height = prevH;
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [textareaRef, shellRef]);

  // Apply growth on value changes
  useEffect(() => {
    const el = textareaRef.current as RefEl;
    const shell = shellRef.current;
    if (!el || !shell) return;

    const baseline = baseHeightRef.current;
    // Measure current rendered height to create a smooth transition, especially on shrink
    const currentH = Math.round(el.getBoundingClientRect().height);
    el.style.height = 'auto';
    const needed = Math.min(el.scrollHeight, maxHeightPx);
    const finalH = Math.max(baseline, needed);
    el.style.height = `${currentH || baseline}px`;
    requestAnimationFrame(() => {
      el.style.height = `${finalH}px`;
      const delta = baseline - finalH; // negative when growing
      el.style.transform = `translateY(${Math.round(delta)}px)`;
    });
  }, [value, textareaRef, shellRef, maxHeightPx]);
}


