"use client";

import * as React from "react";
import { animate, motion, useInView, useMotionValue } from "framer-motion";

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
};

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 1.4,
}: AnimatedCounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    if (!isInView) return;

    const controls = animate(motionValue, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });

    return controls.stop;
  }, [duration, isInView, motionValue, value]);

  return (
    <motion.span ref={ref}>
      {prefix}
      {new Intl.NumberFormat("en-IN").format(displayValue)}
      {suffix}
    </motion.span>
  );
}
