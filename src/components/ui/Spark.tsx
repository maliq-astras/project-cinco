'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useSpark } from '@/hooks';

interface SparkProps {
  delay: number;
  x: number | string;
  y: number | string;
  color: string;
  size?: number;
  xDelta?: number;
  yDelta?: number;
}

export default function Spark({ 
  delay, 
  x, 
  y, 
  color, 
  size = 1, 
  xDelta = 0, 
  yDelta = 0 
}: SparkProps) {
  // Use the hook to get memoized styles and animations
  const { sparkStyle, animation } = useSpark({
    delay,
    x,
    y,
    color,
    size,
    xDelta,
    yDelta
  });

  return (
    <motion.div
      className="absolute rounded-full"
      style={sparkStyle}
      {...animation}
    />
  );
} 