import React, {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  motion,
  AnimatePresence,
  Transition,
  type VariantLabels,
  type Target,
  type TargetAndTransition,
} from "motion/react";

function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface RotatingTextRef {
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  reset: () => void;
}

export interface RotatingTextProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof motion.span>,
    "children" | "transition" | "initial" | "animate" | "exit"
  > {
  texts: string[];
  transition?: Transition;
  initial?: boolean | Target | VariantLabels;
  animate?: boolean | VariantLabels | TargetAndTransition;
  exit?: any;
  animatePresenceMode?: "sync" | "wait";
  animatePresenceInitial?: boolean;
  rotationInterval?: number;
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | "random" | number;
  loop?: boolean;
  auto?: boolean;
  splitBy?: string;
  onNext?: (index: number) => void;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;

  /** fixed widths per text: number(px) or string like 'w-20', 'w-40', 'w-[120px]', '120px', '7.5rem' */
  fixedWidths?: Array<number | string | null | undefined>;

  initialWidth?: number;
  widthTransition?: Transition;
  /** root font size for rem -> px conversion (default 16) */
  rootFontSize?: number;
}

/* tailwind spacing map (rem values) - common keys */
const TAILWIND_SPACING_REMS: Record<string, number> = {
  "0": 0,
  px: 0.0625,
  "0.5": 0.125,
  "1": 0.25,
  "1.5": 0.375,
  "2": 0.5,
  "2.5": 0.625,
  "3": 0.75,
  "3.5": 0.875,
  "4": 1,
  "5": 1.25,
  "6": 1.5,
  "7": 1.75,
  "8": 2,
  "9": 2.25,
  "10": 2.5,
  "11": 2.75,
  "12": 3,
  "14": 3.5,
  "16": 4,
  "20": 5,
  "24": 6,
  "28": 7,
  "32": 8,
  "35": 8.5,
  "36": 9,
  "40": 10,
  "42": 10.5,
  "44": 11,
  "48": 12,
  "52": 13,
  "54": 13.6,
  "56": 14,
  "60": 15,
  "64": 16,
  "72": 18,
  "80": 20,
  "96": 24,
};

function parseTailwindWidthToken(
  token: string,
  rootFontSize = 16
): number | null {
  if (!token.startsWith("w-")) return null;
  const payload = token.slice(2);
  const bracketMatch = payload.match(/^\[(.+)\]$/);
  if (bracketMatch) {
    const inner = bracketMatch[1].trim();
    const px = parseCssLengthToPx(inner, rootFontSize);
    return px;
  }
  if (TAILWIND_SPACING_REMS.hasOwnProperty(payload)) {
    return Math.round(TAILWIND_SPACING_REMS[payload] * rootFontSize);
  }
  if (/^[0-9.]+$/.test(payload)) {
    if (TAILWIND_SPACING_REMS.hasOwnProperty(payload)) {
      return Math.round(TAILWIND_SPACING_REMS[payload] * rootFontSize);
    }
    return null;
  }
  return null;
}

function parseCssLengthToPx(val: string, rootFontSize = 16): number | null {
  const trimmed = val.trim();
  const pxMatch = trimmed.match(/^(-?[\d.]+)px$/);
  if (pxMatch) return Math.round(Number(pxMatch[1]));
  const remMatch = trimmed.match(/^(-?[\d.]+)rem$/);
  if (remMatch) return Math.round(Number(remMatch[1]) * rootFontSize);
  const numMatch = trimmed.match(/^(-?[\d.]+)$/);
  if (numMatch) return Math.round(Number(numMatch[1]));
  return null;
}

function getStaggerDelay(
  index: number,
  totalChars: number,
  staggerFrom: any,
  staggerDuration: number
): number {
  const total = totalChars;
  if (staggerFrom === "first") return index * staggerDuration;
  if (staggerFrom === "last") return (total - 1 - index) * staggerDuration;
  if (staggerFrom === "center") {
    const center = Math.floor(total / 2);
    return Math.abs(center - index) * staggerDuration;
  }
  if (staggerFrom === "random") {
    const randomIndex = Math.floor(Math.random() * total);
    return Math.abs(randomIndex - index) * staggerDuration;
  }
  return Math.abs((staggerFrom as number) - index) * staggerDuration;
}

const RotatingText = forwardRef<RotatingTextRef, RotatingTextProps>(
  (props, ref) => {
    const {
      texts,
      transition = { type: "spring", damping: 25, stiffness: 300 },
      initial = { y: "100%", opacity: 0 },
      animate = { y: 0, opacity: 1 },
      exit = { y: "-120%", opacity: 0 },
      animatePresenceMode = "wait",
      animatePresenceInitial = false,
      rotationInterval = 2000,
      staggerDuration = 0,
      staggerFrom = "first",
      loop = true,
      auto = true,
      splitBy = "characters",
      onNext,
      mainClassName,
      splitLevelClassName,
      elementLevelClassName,
      fixedWidths,
      initialWidth = 80,
      widthTransition,
      rootFontSize = 16,
      ...rest
    } = props;

    const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);
    const contentRef = useRef<HTMLSpanElement | null>(null);
    const [measuredWidth, setMeasuredWidth] = useState<number>(initialWidth);

    const splitIntoCharacters = (text: string): string[] => {
      if (typeof Intl !== "undefined" && (Intl as any).Segmenter) {
        const segmenter = new (Intl as any).Segmenter("en", {
          granularity: "grapheme",
        });
        return Array.from(segmenter.segment(text), (s: any) => s.segment);
      }
      return Array.from(text);
    };

    // helper to generate "elements-like" structure for any index (so we can measure by index)
    const buildElementsForIndex = useCallback(
      (idx: number) => {
        const currentText: string = texts[idx] ?? "";
        if (splitBy === "characters") {
          const words = currentText.split(" ");
          return words.map((word, i) => ({
            characters: splitIntoCharacters(word),
            needsSpace: i !== words.length - 1,
          }));
        }
        if (splitBy === "words")
          return currentText.split(" ").map((word, i, arr) => ({
            characters: [word],
            needsSpace: i !== arr.length - 1,
          }));
        if (splitBy === "lines")
          return currentText.split("\n").map((line, i, arr) => ({
            characters: [line],
            needsSpace: i !== arr.length - 1,
          }));
        return currentText.split(splitBy).map((part, i, arr) => ({
          characters: [part],
          needsSpace: i !== arr.length - 1,
        }));
      },
      [texts, splitBy]
    );

    const elements = useMemo(
      () => buildElementsForIndex(currentTextIndex),
      [currentTextIndex, buildElementsForIndex]
    );

    const resolveFixedWidthForIndex = useCallback(
      (index: number): number | null => {
        if (!fixedWidths) return null;
        const v = fixedWidths[index];
        if (v == null) return null;
        if (typeof v === "number") return Math.max(0, Math.round(v));
        if (typeof v === "string") {
          const fromTailwind = parseTailwindWidthToken(v, rootFontSize);
          if (typeof fromTailwind === "number")
            return Math.max(0, fromTailwind);
          const fromCss = parseCssLengthToPx(v, rootFontSize);
          if (typeof fromCss === "number") return Math.max(0, fromCss);
          return null;
        }
        return null;
      },
      [fixedWidths, rootFontSize]
    );

    // synchronous DOM-measure helper: create an offscreen wrapper, render the same structure, measure and remove
    const measureWidthForIndex = useCallback(
      (index: number): number => {
        // 1) check fixed first
        const fixed = resolveFixedWidthForIndex(index);
        if (typeof fixed === "number") return fixed;

        // 2) if no document (SSR) fallback to initialWidth
        if (typeof document === "undefined") return initialWidth;

        const elems = buildElementsForIndex(index);
        const wrapper = document.createElement("span");
        wrapper.style.position = "absolute";
        wrapper.style.left = "-99999px";
        wrapper.style.top = "-99999px";
        wrapper.style.visibility = "hidden";
        wrapper.style.whiteSpace = "pre-wrap";
        wrapper.style.pointerEvents = "none";
        // apply similar class so tailwind styles are applied (if any)
        wrapper.className = cn(
          splitBy === "lines"
            ? "flex flex-col"
            : "flex flex-wrap whitespace-pre-wrap relative",
          splitLevelClassName
        );

        // build DOM content similar to render (no motion spans)
        elems.forEach((wordObj) => {
          const wordWrap = document.createElement("span");
          wordWrap.className = cn("inline-flex", splitLevelClassName);
          wordObj.characters.forEach((char) => {
            const ch = document.createElement("span");
            ch.className = cn("inline-block", elementLevelClassName);
            // set text content directly
            ch.textContent = char;
            wordWrap.appendChild(ch);
          });
          if (wordObj.needsSpace) {
            const sp = document.createElement("span");
            sp.className = "whitespace-pre";
            sp.textContent = " ";
            wordWrap.appendChild(sp);
          }
          wrapper.appendChild(wordWrap);
        });

        document.body.appendChild(wrapper);
        const w = Math.ceil(wrapper.offsetWidth || wrapper.scrollWidth || 0);
        document.body.removeChild(wrapper);
        return w || initialWidth;
      },
      [
        buildElementsForIndex,
        resolveFixedWidthForIndex,
        splitLevelClassName,
        elementLevelClassName,
        splitBy,
        initialWidth,
      ]
    );

    // measure initial content on mount (synchronously)
    useLayoutEffect(() => {
      const fixed = resolveFixedWidthForIndex(currentTextIndex);
      if (typeof fixed === "number") {
        setMeasuredWidth(fixed);
        return;
      }
      // measure visible content if available else use DOM-measure
      const el = contentRef.current;
      if (el) {
        const w = Math.ceil(el.offsetWidth || el.scrollWidth || 0);
        setMeasuredWidth(w || initialWidth);
      } else {
        // fallback DOM measure
        const w = measureWidthForIndex(currentTextIndex);
        setMeasuredWidth(w || initialWidth);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleIndexChange = useCallback(
      (newIndex: number) => {
        setCurrentTextIndex(newIndex);
        if (onNext) onNext(newIndex);
      },
      [onNext]
    );

    // updated next/previous/jumpTo: measure upcoming index synchronously, set measuredWidth, then update index
    const next = useCallback(() => {
      const nextIndex =
        currentTextIndex === texts.length - 1
          ? loop
            ? 0
            : currentTextIndex
          : currentTextIndex + 1;
      if (nextIndex === currentTextIndex) return;
      const w = measureWidthForIndex(nextIndex);
      setMeasuredWidth(w);
      handleIndexChange(nextIndex);
    }, [
      currentTextIndex,
      texts.length,
      loop,
      measureWidthForIndex,
      handleIndexChange,
    ]);

    const previous = useCallback(() => {
      const prevIndex =
        currentTextIndex === 0
          ? loop
            ? texts.length - 1
            : currentTextIndex
          : currentTextIndex - 1;
      if (prevIndex === currentTextIndex) return;
      const w = measureWidthForIndex(prevIndex);
      setMeasuredWidth(w);
      handleIndexChange(prevIndex);
    }, [
      currentTextIndex,
      texts.length,
      loop,
      measureWidthForIndex,
      handleIndexChange,
    ]);

    const jumpTo = useCallback(
      (index: number) => {
        const validIndex = Math.max(0, Math.min(index, texts.length - 1));
        if (validIndex === currentTextIndex) return;
        const w = measureWidthForIndex(validIndex);
        setMeasuredWidth(w);
        handleIndexChange(validIndex);
      },
      [texts.length, currentTextIndex, measureWidthForIndex, handleIndexChange]
    );

    const reset = useCallback(() => {
      if (currentTextIndex !== 0) {
        const w = measureWidthForIndex(0);
        setMeasuredWidth(w);
        handleIndexChange(0);
      }
    }, [currentTextIndex, measureWidthForIndex, handleIndexChange]);

    useImperativeHandle(ref, () => ({ next, previous, jumpTo, reset }), [
      next,
      previous,
      jumpTo,
      reset,
    ]);

    useEffect(() => {
      if (!auto) return;
      const id = setInterval(next, rotationInterval);
      return () => clearInterval(id);
    }, [next, rotationInterval, auto]);

    const widthTrans = widthTransition ?? {
      type: "spring",
      damping: 20,
      stiffness: 300,
    };

    return (
      // outer container animates width (px)
      <motion.span
        className={cn(
          "inline-block align-middle overflow-hidden relative text-center max-w-full",
          mainClassName
        )}
        {...rest}
        animate={{ width: `${measuredWidth}px` }}
        initial={false}
        transition={widthTrans}
      >
        {/* screen-reader text */}
        <span className="sr-only">{texts[currentTextIndex]}</span>

        <AnimatePresence
          mode={animatePresenceMode}
          initial={animatePresenceInitial}
        >
          <motion.span
            key={currentTextIndex}
            ref={contentRef}
            className={cn(
              splitBy === "lines"
                ? "flex flex-col w-full items-center"
                : "flex flex-wrap justify-center whitespace-pre-wrap relative"
            )}
            layout
            aria-hidden="true"
            initial={initial}
            animate={animate}
            exit={exit}
            transition={transition}
          >
            {elements.map((wordObj, wordIndex, array) => {
              const previousCharsCount = array
                .slice(0, wordIndex)
                .reduce((sum, word) => sum + word.characters.length, 0);
              return (
                <span
                  key={wordIndex}
                  className={cn("inline-flex", splitLevelClassName)}
                >
                  {wordObj.characters.map((char, charIndex) => (
                    <motion.span
                      key={charIndex}
                      initial={initial}
                      animate={animate}
                      exit={exit}
                      transition={{
                        ...transition,
                        delay: getStaggerDelay(
                          previousCharsCount + charIndex,
                          array.reduce(
                            (sum, word) => sum + word.characters.length,
                            0
                          ),
                          staggerFrom,
                          staggerDuration
                        ),
                      }}
                      className={cn("inline-block", elementLevelClassName)}
                    >
                      {char}
                    </motion.span>
                  ))}
                  {wordObj.needsSpace && (
                    <span className="whitespace-pre"> </span>
                  )}
                </span>
              );
            })}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    );
  }
);

RotatingText.displayName = "RotatingText";
export default RotatingText;
