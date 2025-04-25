"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration = 5000,
  glowColor = "#c084fc",
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  glowColor?: string;
  className?: string;
  [key: string]: any;
}) {
  const brNum = parseFloat(borderRadius);

  return (
    <Component
      className={cn(
        "bg-transparent relative text-xl p-[1px] overflow-hidden md:col-span-2",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `${brNum * 0.96}rem` }}
      >
        <MovingBorder
          duration={duration}
          rx="30%"
          ry="30%"
          glowColor={glowColor}
        >
          <div
            className={cn("h-32 w-32 rounded-full", borderClassName)}
            style={{
              background: `radial-gradient(${glowColor} 30%, transparent 90%)`,
              boxShadow: `0 0 120px 60px ${glowColor}`,
              opacity: 1,
              filter: "blur(2px)",
              backdropFilter: "saturate(200%)",
              animation: "pulse 2s infinite",
            }}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center border-slate-800 bg-slate-900/[0.8] text-sm text-white antialiased backdrop-blur-lg border-2",
          className
        )}
        style={{
          borderRadius: `${brNum * 0.96}rem`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

export const MovingBorder = ({
  children,
  duration = 5000,
  rx,
  ry,
  glowColor = "#c084fc",
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  glowColor?: string;
  [key: string]: any;
}) => {
  const pathRef = useRef<any>(undefined);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).x
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).y
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>

      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          h-52 w-52 rounded-full blur-3xl opacity-40 z-[1] animate-pulse"
          style={{
            backgroundColor: glowColor,
          }}
        />
        {children}
      </motion.div>
    </>
  );
};
