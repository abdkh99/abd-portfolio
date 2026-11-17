"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type PanInfo,
  type Variants,
} from "framer-motion";

/* -------------------------------------------------------------------------
   DATA
   Edit freely. `w` / `h` are the real pixel size of each screenshot in
   /public so the whole image is shown, never cropped.
   The four "summary" lines I wrote for the last four projects are
   placeholders: replace them with what you actually built.
-------------------------------------------------------------------------- */
type Project = {
  name: string;
  kind: string;
  summary: string;
  image: string;
  w: number;
  h: number;
  link: string;
  stack: string[];
};

const projects: Project[] = [
  {
    name: "We Delivery",
    kind: "E-commerce",
    summary:
      "A modern delivery management platform built with Next.js and TypeScript, featuring order tracking, user authentication, and streamlined delivery operations.",
    image: "/we-delivery.png",
    w: 1516,
    h: 852,
    link: "https://we-delivery.vercel.app",
    stack: ["Next.js", "TypeScript", "Firebase"],
  },
  {
    name: "Mini Store",
    kind: "E-commerce",
    summary:
      "A small storefront in Next.js and TypeScript, with Firebase handling the data layer.",
    image: "/E-commerce-Mini-Store-Project.png",
    w: 1516,
    h: 852,
    link: "https://e-commerce5-5cwa.vercel.app/",
    stack: ["Next.js", "TypeScript", "Firebase"],
  },
  {
    name: "Dashboard",
    kind: "Admin panel",
    summary:
      "An admin panel in React where charts and tables make the numbers readable at a glance.",
    image: "/Dashboard-Project.png",
    w: 1907,
    h: 945,
    link: "https://dashboard-ebon-one-52.vercel.app/",
    stack: ["React", "Tailwind", "Charts"],
  },
  {
    name: "Auth Demo",
    kind: "Web app",
    summary:
      "A complete sign-in flow in Next.js, with Firebase Authentication behind it.",
    image: "/Auth-Demo-Project.png",
    w: 1306,
    h: 859,
    link: "https://auth-7ggy.vercel.app/",
    stack: ["Next.js", "Firebase", "Tailwind"],
  },
  {
    name: "API Showcase",
    kind: "Developer tool",
    summary:
      "Pulls data from public APIs with Axios and presents the results in a clean Next.js interface.",
    image: "/API-Showcase-Project.png",
    w: 1507,
    h: 849,
    link: "https://api-show-case-tlno.vercel.app/",
    stack: ["Next.js", "Axios", "Tailwind"],
  },
  {
    name: "XP-Zone Gaming",
    kind: "Website clone",
    summary:
      "A gaming site rebuilt in React, with GSAP handling the motion and scroll effects.",
    image: "/XP-Zone.png",
    w: 1905,
    h: 907,
    link: "https://xp-zone-73njj1hhf-abdkh99s-projects.vercel.app",
    stack: ["React", "Tailwind", "GSAP"],
  },
  {
    name: "Landing Page",
    kind: "Marketing site",
    summary:
      "A responsive marketing page in React and TypeScript, built around one clear call to action.",
    image: "/Landingpage.png",
    w: 1903,
    h: 943,
    link: "https://landing-page-git-main-abdkh99s-projects.vercel.app/",
    stack: ["React", "TypeScript", "Tailwind"],
  },
  {
    name: "Sass Landing",
    kind: "Marketing site",
    summary:
      "A product landing page for a SaaS idea, written in Next.js and styled with Tailwind.",
    image: "/Sass-Landing-page.png",
    w: 1904,
    h: 940,
    link: "https://sass-landing-page-eta.vercel.app/",
    stack: ["Next.js", "Tailwind"],
  },
  {
    name: "Portfolio v1",
    kind: "Personal site",
    summary:
      "The first version of this portfolio, built with Next.js and animated with Framer Motion.",
    image: "/Portfolio-Project.png",
    w: 1900,
    h: 849,
    link: "https://abd-portfolio-nm49.vercel.app/",
    stack: ["Next.js", "Tailwind", "Framer Motion"],
  },
];

/* Two projects per "spread" */
const PER_PAGE = 2;
const pages: Project[][] = Array.from(
  { length: Math.ceil(projects.length / PER_PAGE) },
  (_, i) => projects.slice(i * PER_PAGE, i * PER_PAGE + PER_PAGE),
);
const PAGES = pages.length;

const pad = (n: number) => String(n).padStart(2, "0");
const host = (u: string) => {
  try {
    return new URL(u).host;
  } catch {
    return u;
  }
};
const range = (page: number) => {
  const a = page * PER_PAGE + 1;
  const b = Math.min(a + PER_PAGE - 1, projects.length);
  return `${pad(a)}–${pad(b)}`;
};

/* -------------------------------------------------------------------------
   MOTION
   Page changes use a restrained directional slide + fade. The outgoing pair
   moves a little in the navigation direction while the next pair enters from
   the opposite side. No curtain / clip-path effect, so the content stays calm
   and the project screenshots remain the visual focus.
-------------------------------------------------------------------------- */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_IN: [number, number, number, number] = [0.64, 0, 0.78, 0];

type Ctx = { d: number; col: number };

const shellV: Variants = {
  hidden: ({ d }: Ctx) => ({
    opacity: 0,
    y: d >= 0 ? 20 : -20,
    scale: 0.985,
  }),
  show: ({ col }: Ctx) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: EASE,
      delay: col * 0.07,
    },
  }),
  exit: ({ d, col }: Ctx) => ({
    opacity: 0,
    y: d >= 0 ? -14 : 14,
    scale: 0.99,
    transition: {
      duration: 0.24,
      ease: EASE_IN,
      delay: col * 0.035,
    },
  }),
};

const mockV: Variants = {
  hidden: ({ d }: Ctx) => ({
    y: d >= 0 ? 12 : -12,
    scale: 0.985,
  }),
  show: ({ col }: Ctx) => ({
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: EASE,
      delay: col * 0.07,
    },
  }),
  exit: ({ d }: Ctx) => ({
    y: d >= 0 ? -6 : 6,
    scale: 0.995,
    transition: {
      duration: 0.2,
      ease: EASE_IN,
    },
  }),
};

const metaV: Variants = {
  hidden: ({ d }: Ctx) => ({
    opacity: 0,
    y: d >= 0 ? 10 : -10,
  }),
  show: ({ col }: Ctx) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASE,
      delay: 0.16 + col * 0.07,
    },
  }),
  exit: ({ d }: Ctx) => ({
    opacity: 0,
    y: d >= 0 ? -8 : 8,
    transition: {
      duration: 0.18,
      ease: EASE_IN,
    },
  }),
};

/* -------------------------------------------------------------------------
   SMALL PIECES
-------------------------------------------------------------------------- */
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ac";

function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
    </svg>
  );
}

function ArrowSide({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={flip ? "-scale-x-100" : ""}
    >
      <path d="M2.5 8h11M9 3.5L13.5 8 9 12.5" />
    </svg>
  );
}

/* -------------------------------------------------------------------------
   CARD
   A compact 4:3 frame gives the screenshots more room and removes excess
   empty space. The full screenshot remains visible without cropping. A subtle
   scroll tilt and soft light sweep keep the cards feeling alive.
-------------------------------------------------------------------------- */
type Anim = "hidden" | "show" | "exit";

function Card({
  p,
  number,
  col,
  d,
  anim,
  reduce,
  onExited,
}: {
  p: Project;
  number: number;
  col: number;
  d: number;
  anim: Anim;
  reduce: boolean;
  onExited?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const s = col === 0 ? 1 : -1;
  const rotateY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduce ? [0, 0, 0] : [s * 16, s * 4, s * -3],
  );
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduce ? [0, 0, 0] : [12, 3, -5],
  );
  const sweepX = useTransform(scrollYProgress, [0, 1], ["-130%", "130%"]);

  const ctx: Ctx = { d, col };
  const initial = reduce ? false : "hidden";

  return (
    <div
      ref={ref}
      className={col === 1 ? "md:mt-[clamp(1.5rem,3vw,3rem)]" : undefined}
    >
      <motion.div
        custom={ctx}
        variants={shellV}
        initial={initial}
        animate={anim}
        onAnimationComplete={
          onExited
            ? (def) => {
                if (def === "exit") onExited();
              }
            : undefined
        }
        className="group/card relative aspect-[4/3] overflow-hidden rounded-[22px] border border-line"
        style={{
          background:
            "radial-gradient(120% 90% at 88% 0%, color-mix(in srgb, var(--color-ac) 12%, transparent), transparent 62%), radial-gradient(rgb(255 255 255 / 0.045) 1px, transparent 1px) 0 0 / 22px 22px, var(--color-panel)",
        }}
      >
        {/* Labels, same placement as the reference */}
        <div className="absolute inset-x-6 top-5 z-[1] flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-fg/45 sm:inset-x-7">
          <span className="truncate">
            {p.name} — {p.kind}
          </span>
          <span className="shrink-0 pl-4">{pad(number)}</span>
        </div>

        {/* Mockup */}
        <div
          className="absolute inset-0 flex items-center justify-center px-[6%] pb-[5%] pt-[12%]"
          style={{ perspective: 1400 }}
        >
          <motion.div
            style={{ rotateX, rotateY }}
            className="w-full will-change-transform"
          >
            <motion.div
              custom={ctx}
              variants={mockV}
              className="mx-auto"
              style={{ width: p.w / p.h < 1.6 ? "76%" : "92%" }}
            >
              <div className="overflow-hidden rounded-lg border border-line-strong bg-page shadow-[0_30px_60px_-24px_rgba(0,0,0,0.75)] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover/card:-translate-y-1 motion-reduce:transition-none">
                <div className="flex items-center gap-3 border-b border-line px-3 py-2 sm:px-4 sm:py-2.5">
                  <span className="flex gap-1.5" aria-hidden>
                    <i className="size-1.5 rounded-full bg-fg/15 sm:size-2" />
                    <i className="size-1.5 rounded-full bg-fg/15 sm:size-2" />
                    <i className="size-1.5 rounded-full bg-fg/15 sm:size-2" />
                  </span>
                  <span className="min-w-0 flex-1 truncate rounded bg-fg/[0.04] px-3 py-0.5 font-mono text-[10px] text-fg/45 sm:text-[11px]">
                    {host(p.link)}
                  </span>
                </div>
                <div className="relative">
                  <Image
                    src={p.image}
                    alt={`${p.name} screenshot`}
                    width={p.w}
                    height={p.h}
                    sizes="(min-width:768px) 40vw, 90vw"
                    className="block h-auto w-full"
                  />
                  {!reduce && (
                    <motion.span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 left-0 w-1/2"
                      style={{
                        x: sweepX,
                        skewX: -20,
                        background:
                          "linear-gradient(90deg, transparent, rgb(236 235 230 / 0.09), transparent)",
                      }}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <a
          href={p.link}
          target="_blank"
          rel="noreferrer"
          tabIndex={-1}
          aria-hidden
          className="absolute inset-0 z-10"
        />
      </motion.div>

      {/* Caption */}
      <motion.div
        custom={ctx}
        variants={metaV}
        initial={initial}
        animate={anim}
        className="flex items-start justify-between gap-6 pt-5"
      >
        <div className="min-w-0">
          <h3 className="font-display text-[1.75rem] font-normal leading-tight tracking-[-0.02em] text-fg md:text-[2rem]">
            {p.name}
          </h3>
          <p className="mt-2 line-clamp-2 min-h-[2.8em] max-w-md text-[14px] leading-[1.4] text-mute">
            {p.summary}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-3 pt-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg/40">
            {p.stack[0]} / {p.kind}
          </span>
          <a
            href={p.link}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${p.name} live site`}
            className={`group/cta grid size-10 place-items-center rounded-full border border-line-strong text-fg/70 transition-colors duration-300 hover:border-ac hover:bg-ac hover:text-page ${focusRing}`}
          >
            <ArrowUpRight className="transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 motion-reduce:transition-none" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   SECTION
-------------------------------------------------------------------------- */
export default function RecentProjects() {
  const reduce = !!useReducedMotion();

  const [index, setIndex] = useState(0); // spread on screen
  const [target, setTarget] = useState(0); // spread the visitor asked for
  const [dir, setDir] = useState(1);
  const [leaving, setLeaving] = useState(false);

  const targetRef = useRef(0);
  const suppressClick = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { once: true, amount: 0.2 });

  const go = useCallback(
    (to: number, d?: number) => {
      const n = ((to % PAGES) + PAGES) % PAGES;
      if (n === targetRef.current) return;
      const direction = d ?? (n > targetRef.current ? 1 : -1);
      targetRef.current = n;
      setTarget(n);
      if (reduce) {
        setIndex(n);
        return;
      }
      setDir(direction);
      setLeaving(true);
    },
    [reduce],
  );

  // Called when the outgoing pair has fully left: swap in the requested one.
  const commit = useCallback(() => {
    setIndex(targetRef.current);
    setLeaving(false);
  }, []);

  const next = () => go(targetRef.current + 1, 1);
  const prev = () => go(targetRef.current - 1, -1);

  const onPanEnd = (_: unknown, info: PanInfo) => {
    const { x, y } = info.offset;
    if (Math.abs(x) > 70 && Math.abs(x) > Math.abs(y) * 1.4) {
      if (x < 0) next();
      else prev();
    }
    window.setTimeout(() => (suppressClick.current = false), 80);
  };

  const anim: Anim = leaving ? "exit" : inView ? "show" : "hidden";
  const pair = pages[index];

  return (
    <section
      id="projects"
      className="py-20 text-fg md:py-32"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }}
    >
      {/* Header */}
      <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ac">
            Selected work / {pad(projects.length)}
          </p>
          <h2 className="heading !m-0 !text-left">
            Recent <span className="accent-text">projects</span>
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-fg/50">
          A selection of interfaces and experiments I&apos;ve enjoyed bringing
          to life. Every project opens as a live site.
        </p>
      </div>

      {/* Stage: two compact, slightly staggered cards at a time */}
      <motion.div
        ref={stageRef}
        onPanStart={() => (suppressClick.current = true)}
        onPanEnd={onPanEnd}
        onClickCapture={(e) => {
          if (suppressClick.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        style={{ touchAction: "pan-y" }}
        className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2"
      >
        {pair.map((p, col) => (
          <Card
            key={p.name}
            p={p}
            number={index * PER_PAGE + col + 1}
            col={col}
            d={dir}
            anim={anim}
            reduce={reduce}
            onExited={col === pair.length - 1 ? commit : undefined}
          />
        ))}
      </motion.div>

      {/* Minimal project navigation */}
      <div className="mt-12 flex items-center gap-4 md:mt-16 md:gap-7">
        {/* Counter */}
        <div className="shrink-0 font-mono text-xs tracking-wider">
          <span className="sr-only" aria-live="polite">
            Showing projects {range(target)} of {projects.length}
          </span>
          <span aria-hidden className="text-fg">
            {range(target)}
          </span>
          <span aria-hidden className="text-fg/35">
            {" "}
            / {pad(projects.length)}
          </span>
        </div>

        {/* Segmented progress navigation */}
        <div
          role="group"
          aria-label="Project navigation"
          className="flex flex-1 items-center justify-center gap-2"
        >
          {pages.map((_, pi) => {
            const active = pi === target;

            return (
              <button
                key={pi}
                type="button"
                onClick={() => go(pi)}
                aria-label={`Show projects ${range(pi)}`}
                aria-pressed={active}
                className={`group flex h-8 items-center ${focusRing}`}
              >
                <span
                  className={`h-[2px] rounded-full transition-all duration-500 ${
                    active
                      ? "w-10 bg-ac"
                      : "w-3 bg-line-strong group-hover:w-6 group-hover:bg-fg/50"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Previous / next */}
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous projects"
            className={`grid size-10 place-items-center rounded-full border border-line-strong text-fg/70 transition-all duration-300 hover:border-ac hover:bg-ac hover:text-page active:scale-95 ${focusRing}`}
          >
            <ArrowSide flip />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next projects"
            className={`grid size-10 place-items-center rounded-full border border-line-strong text-fg/70 transition-all duration-300 hover:border-ac hover:bg-ac hover:text-page active:scale-95 ${focusRing}`}
          >
            <ArrowSide />
          </button>
        </div>
      </div>
    </section>
  );
}
