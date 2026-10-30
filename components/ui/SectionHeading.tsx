"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";

import { HighlightText } from "@/components/animate-ui/text/highlight";
import { SparklesText } from "@/components/ui/SparklesText";
import { TextShimmer } from "@/components/ui/TextShimmerComponent";
import { cn } from "@/lib/utils";

export type SectionHeadingHighlightVariant =
  | "highlight"
  | "shimmer"
  | "sparkle"
  | "animated-gradient";

export type SectionHeadingProps = {
  /** Plain title text shown before the highlighted phrase */
  title: React.ReactNode;
  /** Single highlighted / animated phrase */
  highlighted: string;
  highlightVariant?: SectionHeadingHighlightVariant;
  className?: string;
  as?: "h1" | "h2";
};

function HighlightedPhrase({
  variant,
  text,
  reducedMotion,
}: {
  variant: SectionHeadingHighlightVariant;
  text: string;
  reducedMotion: boolean;
}) {
  if (reducedMotion && variant === "animated-gradient") {
    return <span className="text-purple-500">{text}</span>;
  }

  switch (variant) {
    case "shimmer":
      return (
        <TextShimmer
          spread={5}
          duration={reducedMotion ? 0 : 2.2}
          className="font-bold [--base-color:var(--color-purple-900)] [--base-gradient-color:var(--color-purple-500)]"
        >
          {text}
        </TextShimmer>
      );
    case "sparkle":
      return (
        <SparklesText
          className="text-purple-500 font-bold inline"
          sparklesCount={reducedMotion ? 0 : 8}
        >
          {text}
        </SparklesText>
      );
    case "animated-gradient":
      return <span className="gradient-animated">{text}</span>;
    case "highlight":
    default:
      return (
        <HighlightText
          text={text}
          className="from-violet-500 to-purple-600 dark:from-violet-500 dark:to-purple-600"
          transition={
            reducedMotion ? { duration: 0 } : { duration: 1.2, ease: "easeInOut" }
          }
        />
      );
  }
}

export function SectionHeading({
  title,
  highlighted,
  highlightVariant = "highlight",
  className,
  as: Tag = "h1",
}: SectionHeadingProps) {
  const reducedMotion = useReducedMotion();

  return (
    <Tag className={cn("heading", className)}>
      {title}{" "}
      <HighlightedPhrase
        variant={highlightVariant}
        text={highlighted}
        reducedMotion={!!reducedMotion}
      />
    </Tag>
  );
}
