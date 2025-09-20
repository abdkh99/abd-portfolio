"use client";

import * as React from "react";
import {
  motion,
  useInView,
  type HTMLMotionProps,
  type Transition,
  type UseInViewOptions,
} from "framer-motion";

import { cn } from "@/lib/utils";

type HighlightTextProps = HTMLMotionProps<"span"> & {
  text: string;
  inViewMargin?: UseInViewOptions["margin"];
  transition?: Transition;
};

function HighlightText({
  ref,
  text,
  className,
  inViewMargin = "0px",
  transition = { duration: 1.2, ease: "easeInOut" },
  ...props
}: HighlightTextProps) {
  const localRef = React.useRef<HTMLSpanElement>(null);
  React.useImperativeHandle(ref, () => localRef.current as HTMLSpanElement);

  // يحدد إذا العنصر ظاهر بالشاشة
  const isInView = useInView(localRef, {
    once: true,
    margin: inViewMargin,
  });

  return (
    <motion.span
      ref={localRef}
      data-slot="highlight-text"
      initial={{ backgroundSize: "0% 100%" }}
      animate={isInView ? { backgroundSize: "100% 100%" } : undefined}
      transition={transition}
      style={{
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        display: "inline",
      }}
      className={cn(
        `relative inline-block px-2 py-1 rounded-lg bg-gradient-to-r 
         from-blue-100 to-purple-100 
         dark:from-indigo-500 dark:to-purple-600`,
        className
      )}
      {...props}
    >
      {text}
    </motion.span>
  );
}

export { HighlightText, type HighlightTextProps };
