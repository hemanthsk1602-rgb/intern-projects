"use client";

import React, { useEffect, useState } from "react";
import { formatINR } from "@/lib/utils";

interface StatNumberProps {
  value: number;
  duration?: number;
  prefix?: string;
  isCurrency?: boolean;
  className?: string;
}

export default function StatNumber({
  value,
  duration = 1000,
  prefix = "",
  isCurrency = true,
  className = "",
}: StatNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = displayValue;
    const endValue = value;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function (easeOutQuad)
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      const current = Math.floor(startValue + (endValue - startValue) * easeProgress);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
      }
    };

    requestAnimationFrame(step);
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}
      {isCurrency ? formatINR(displayValue) : displayValue.toLocaleString("en-IN")}
    </span>
  );
}
