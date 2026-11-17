"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

type Project = {
  name: string;
  kind: string;
  summary: string;
  image: string;
  link: string;
  stack: string[];
};

/* Edit `summary` with what you actually built and decided in each project. */
const featured: Project[] = [
  {
    name: "Mini Store",
    kind: "E-commerce",
    summary:
      "A small storefront in Next.js and TypeScript, with Firebase handling the data layer.",
    image: "/E-commerce-Mini-Store-Project.png",
    link: "https://e-commerce5-5cwa.vercel.app/",
    stack: ["Next.js", "TypeScript", "Firebase"],
  },
  {
    name: "Dashboard",
    kind: "Admin panel",
    summary:
      "An admin panel in React where charts and tables make the numbers readable at a glance.",
    image: "/Dashboard-Project.png",
    link: "https://dashboard-ebon-one-52.vercel.app/",
    stack: ["React", "Tailwind", "Charts"],
  },
  {
    name: "Auth Demo",
    kind: "Web app",
    summary:
      "A complete sign-in flow in Next.js, with Firebase Authentication behind it.",
    image: "/Auth-Demo-Project.png",
    link: "https://auth-7ggy.vercel.app/",
    stack: ["Next.js", "Firebase", "Tailwind"],
  },
  {
    name: "API Showcase",
    kind: "Developer tool",
    summary:
      "Pulls data from public APIs with Axios and presents the results in a clean Next.js interface.",
    image: "/API-Showcase-Project.png",
    link: "https://api-show-case-tlno.vercel.app/",
    stack: ["Next.js", "Axios", "Tailwind"],
  },
];

const more: Project[] = [
  {
    name: "XP-Zone Gaming",
    kind: "Website clone",
    summary: "",
    image: "/XP-Zone.png",
    link: "https://xp-zone-73njj1hhf-abdkh99s-projects.vercel.app",
    stack: ["React", "Tailwind", "GSAP"],
  },
  {
    name: "Landing Page",
    kind: "Marketing site",
    summary: "",
    image: "/Landingpage.png",
    link: "https://landing-page-git-main-abdkh99s-projects.vercel.app/",
    stack: ["React", "TypeScript", "Tailwind"],
  },
  {
    name: "Sass Landing",
    kind: "Marketing site",
    summary: "",
    image: "/Sass-Landing-page.png",
    link: "https://sass-landing-page-eta.vercel.app/",
    stack: ["Next.js", "Tailwind"],
  },
  {
    name: "Portfolio v1",
    kind: "Personal site",
    summary: "",
    image: "/Portfolio-Project.png",
    link: "https://abd-portfolio-nm49.vercel.app/",
    stack: ["Next.js", "Tailwind", "Framer Motion"],
  },
];

const pad = (n: number) => String(n).padStart(2, "0");
const host = (u: string) => {
  try {
    return new URL(u).host;
  } catch {
    return u;
  }
};

function Arrow({ className = "" }: { className?: string }) {
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

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ac";

function Card({
  p,
  i,
  total,
  progress,
  reduce,
}: {
  p: Project;
  i: number;
  total: number;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["-6%", "6%"],
  );
  // Each card settles a little smaller as the next one covers it; the last one stays full size.
  const scale = useTransform(
    progress,
    [i / total, 1],
    [1, reduce ? 1 : 1 - (total - 1 - i) * 0.04],
  );

  return (
    <div
      ref={ref}
      className="sticky pb-6 md:pb-[12vh]"
      style={{ top: `calc(5rem + ${i * 1.25}rem)` }}
    >
      <motion.article
        style={{ scale }}
        className="grid origin-top overflow-hidden rounded-lg border border-line bg-panel lg:h-[min(32rem,calc(100svh-10.5rem))] lg:grid-cols-[5fr_7fr]"
      >
        <div className="order-2 flex flex-col justify-between gap-10 p-6 sm:p-8 lg:order-1 lg:p-10">
          <div>
            <div className="flex items-center justify-between font-mono text-xs tracking-wider text-fg/40">
              <span>
                {pad(i + 1)} / {pad(total)}
              </span>
              <span className="uppercase">{p.kind}</span>
            </div>
            <h3 className="font-display mt-6 text-[clamp(2.5rem,4.6vw,4.5rem)] font-normal leading-[0.95] tracking-[-0.025em] text-fg">
              {p.name}
            </h3>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-fg/60">
              {p.summary}
            </p>
          </div>

          <div>
            <p className="font-mono text-xs leading-relaxed text-fg/40">
              {p.stack.join("  /  ")}
            </p>
            <a
              href={p.link}
              target="_blank"
              rel="noreferrer"
              className={`group/cta mt-5 inline-flex items-center gap-2 border-b border-fg/30 pb-1 text-sm font-medium text-fg transition-colors hover:border-ac hover:text-ac ${focusRing}`}
            >
              View live site
              <Arrow className="transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 motion-reduce:transition-none" />
            </a>
          </div>
        </div>

        <div className="order-1 p-3 sm:p-4 lg:order-2 lg:pl-0">
          <a
            href={p.link}
            target="_blank"
            rel="noreferrer"
            tabIndex={-1}
            aria-hidden
            className="group flex flex-col overflow-hidden rounded-md border border-line bg-page lg:h-full"
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
              <span className="flex gap-1.5" aria-hidden>
                <i className="size-2 rounded-full bg-fg/15" />
                <i className="size-2 rounded-full bg-fg/15" />
                <i className="size-2 rounded-full bg-fg/15" />
              </span>
              <span className="min-w-0 flex-1 truncate rounded bg-fg/[0.04] px-3 py-1 font-mono text-[11px] text-fg/45">
                {host(p.link)}
              </span>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-0 lg:flex-1">
              <motion.div
                style={{ y: imgY }}
                className="absolute inset-x-0 -top-[7%] h-[114%]"
              >
                <Image
                  src={p.image}
                  alt={`${p.name} screenshot`}
                  fill
                  sizes="(min-width:1024px) 58vw, 100vw"
                  className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
                />
              </motion.div>
            </div>
          </a>
        </div>
      </motion.article>
    </div>
  );
}

export default function RecentProjects() {
  const reduce = !!useReducedMotion();
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="projects"
      className="py-20 text-fg md:py-32"
    >
      <div className="mb-12 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
        <h2 className="heading !m-0 !text-left">
          Recent <span className="accent-text">projects</span>
        </h2>
        <p className="max-w-xs text-sm leading-relaxed text-fg/50">
          The four builds I&apos;d put first, then the rest of the shelf. Every
          project opens as a live site.
        </p>
      </div>

      <div ref={stackRef}>
        {featured.map((p, i) => (
          <Card
            key={p.name}
            p={p}
            i={i}
            total={featured.length}
            progress={scrollYProgress}
            reduce={reduce}
          />
        ))}
      </div>

      <div className="mt-16 md:mt-24">
        <div className="flex items-baseline justify-between border-b border-line pb-4">
          <h3 className="font-display text-2xl font-normal tracking-tight">More builds</h3>
          <span className="font-mono text-xs text-fg/40">
            {pad(more.length)} projects
          </span>
        </div>
        <ul>
          {more.map((p, i) => (
            <li key={p.name} className="border-b border-line">
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className={`group grid grid-cols-[auto_1fr_auto] items-center gap-4 px-2 py-4 transition-colors hover:bg-fg/[0.03] sm:grid-cols-[2rem_auto_1fr_auto] sm:gap-6 ${focusRing} focus-visible:outline-offset-[-2px]`}
              >
                <span className="hidden font-mono text-xs text-fg/35 sm:block">
                  {pad(featured.length + i + 1)}
                </span>
                <span className="relative block h-12 w-20 overflow-hidden rounded-sm bg-fg/5 sm:h-14 sm:w-24">
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover object-top"
                  />
                </span>
                <span className="min-w-0">
                  <span className="font-display block truncate text-2xl font-normal tracking-tight transition-colors group-hover:text-ac sm:text-[1.75rem]">
                    {p.name}
                  </span>
                  <span className="block truncate text-sm text-fg/45">
                    {p.kind}
                    <span className="hidden sm:inline">
                      {" "}
                      · {p.stack.join(", ")}
                    </span>
                  </span>
                </span>
                <Arrow className="text-fg/40 transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ac motion-reduce:transition-none" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
