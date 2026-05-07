"use client";

import * as React from "react";
import { motion, type MotionProps } from "framer-motion";

type FadeInProps = React.ComponentProps<typeof motion.div> & {
  delay?: number;
};

export function FadeIn({ children, delay = 0, ...props }: FadeInProps) {
  const motionProps: MotionProps = {
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <motion.div {...motionProps} {...props}>
      {children}
    </motion.div>
  );
}
