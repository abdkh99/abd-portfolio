'use client';
 
import { AnimatePresence, motion, useInView } from 'framer-motion';
import * as React from 'react';
 export interface GradualProps {
 mainClassName?: string;
 duration ?: number;
 text: string;
 }
export function GradualSpacing({ text = 'Gradual Spacing', mainClassName, duration = 1 }: { text: string; mainClassName?: string; duration?: number }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <div className="flex space-x-[0.150rem] justify-center">
      <AnimatePresence>
        {text.split("").map((char, i) => (
          <motion.p
            ref={ref}
            key={i}
            initial={{ opacity: 0, x: -18 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            exit="hidden"
            transition={{ duration: duration, delay: i * 0.025 }}
            className={` ${mainClassName ?? ""}`}
          >
            {char === " " ? <span>&nbsp;</span> : char}
          </motion.p>
        ))}
      </AnimatePresence>
    </div>
  );
}