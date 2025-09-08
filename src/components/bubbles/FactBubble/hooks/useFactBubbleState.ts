import { useState, useRef } from 'react';

export const useFactBubbleState = () => {
  const bubbleRef = useRef<HTMLButtonElement>(null);
  const [isPopping, setIsPopping] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [popPosition, setPopPosition] = useState({ x: 0, y: 0 });
  const [isShowingTooltip, setIsShowingTooltip] = useState(false);
  const [tooltipTimeout, setTooltipTimeout] = useState<NodeJS.Timeout | null>(null);

  return {
    bubbleRef,
    isPopping,
    setIsPopping,
    isTouchDevice,
    setIsTouchDevice,
    popPosition,
    setPopPosition,
    isShowingTooltip,
    setIsShowingTooltip,
    tooltipTimeout,
    setTooltipTimeout
  };
};