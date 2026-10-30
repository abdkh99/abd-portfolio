"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

type Project = {
  name: string;
  kind: string;
  image: string;
  link: string;
  stack: string[];
};

const projects: Project[] = [
  { name: "Landing Page", kind: "Marketing site", image: "/Landingpage.png", link: "https://landing-page-git-main-abdkh99s-projects.vercel.app/", stack: ["React", "TypeScript", "Tailwind"] },
  { name: "Dashboard", kind: "Admin panel", image: "/Dashboard-Project.png", link: "https://dashboard-ebon-one-52.vercel.app/", stack: ["React", "Tailwind", "Charts"] },
  { name: "Portfolio", kind: "Personal site", image: "/Portfolio-Project.png", link: "https://abd-portfolio-nm49.vercel.app/", stack: ["Next.js", "Tailwind", "Framer Motion"] },
  { name: "XP-Zone Gaming", kind: "Website clone", image: "/XP-Zone.png", link: "https://xp-zone-73njj1hhf-abdkh99s-projects.vercel.app", stack: ["React", "Tailwind", "GSAP"] },
  { name: "API Showcase", kind: "Developer tool", image: "/API-Showcase-Project.png", link: "https://api-show-case-tlno.vercel.app/", stack: ["Next.js", "Axios", "Tailwind"] },
  { name: "Auth Demo", kind: "Web app", image: "/Auth-Demo-Project.png", link: "https://auth-7ggy.vercel.app/", stack: ["Next.js", "Firebase", "Tailwind"] },
  { name: "Mini Store", kind: "E-commerce", image: "/E-commerce-Mini-Store-Project.png", link: "https://e-commerce5-5cwa.vercel.app/", stack: ["Next.js", "TypeScript", "Firebase"] },
  { name: "Sass Landing", kind: "Marketing site", image: "/Sass-Landing-page.png", link: "https://sass-landing-page-eta.vercel.app/", stack: ["Next.js", "Tailwind"] },
];

const ease = "ease-[cubic-bezier(.22,1,.36,1)]";

export default function RecentProjects() {
  const [active, setActive] = useState(-1);
  const [view, setView] = useState<"list" | "grid">("list");
  const preview = useRef<HTMLDivElement>(null);
  const xTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const yTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useEffect(() => {
    const el = preview.current;
    if (!el) return;
    gsap.set(el, { xPercent: -50, yPercent: -50 });
    xTo.current = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3" });
    yTo.current = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3" });
  }, []);

  const follow = (e: React.MouseEvent) => {
    xTo.current?.(e.clientX);
    yTo.current?.(e.clientY);
  };

  return (
    <section
      id="projects"
      className="py-24 md:py-40 font-[family-name:var(--font-display)] text-[#EDEBE6]"
    >
      <div className="mb-14 flex flex-col gap-8 md:mb-24 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-[clamp(3rem,9vw,8rem)] font-medium leading-[0.92] tracking-[-0.04em]">
            Recent projects
          </h2>
          <p className="mt-6 max-w-md text-base text-[#EDEBE6]/55">
            <span className="hidden lg:inline">Hover a project to preview it, click to open the live site.</span>
            <span className="lg:hidden">Tap a project to open the live site.</span>
          </p>
        </div>

        <div className="hidden gap-6 text-sm lg:flex" role="group" aria-label="Layout">
          {(["list", "grid"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={`cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B6C0FF] ${
                view === v ? "text-[#EDEBE6]" : "text-[#EDEBE6]/40 hover:text-[#EDEBE6]/70"
              }`}
            >
              {v === "list" ? "List" : "Grid"}
            </button>
          ))}
        </div>
      </div>

      {/* List view (desktop): rows with a cursor-following preview */}
      <div
        className={view === "list" ? "hidden lg:block" : "hidden"}
        onMouseMove={follow}
        onMouseLeave={() => setActive(-1)}
      >
        <ul className="border-b border-[#EDEBE6]/15">
          {projects.map((p, i) => (
            <li key={p.name} className="border-t border-[#EDEBE6]/15">
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => setActive(i)}
                className={`group flex items-baseline justify-between gap-10 py-9 transition-opacity duration-500 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#B6C0FF] ${
                  active !== -1 && active !== i ? "opacity-25" : "opacity-100"
                }`}
              >
                <span
                  className={`text-[clamp(2.75rem,6.5vw,6rem)] font-medium leading-none tracking-[-0.035em] transition-[transform,color] duration-500 ${ease} motion-reduce:transition-none group-hover:translate-x-6 group-hover:text-[#B6C0FF]`}
                >
                  {p.name}
                </span>
                <span className="shrink-0 text-right text-sm leading-relaxed text-[#EDEBE6]/50">
                  {p.kind}
                  <br />
                  {p.stack.join(", ")}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Grid view (always on tablet and mobile) */}
      <div
        className={`grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 ${
          view === "list" ? "lg:hidden" : "lg:grid-cols-3"
        }`}
      >
        {projects.map((p) => (
          <a
            key={p.name}
            href={p.link}
            target="_blank"
            rel="noreferrer"
            className="group block focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#B6C0FF]"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-[#EDEBE6]/5">
              <Image
                src={p.image}
                alt={`${p.name} screenshot`}
                fill
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                className={`object-cover transition-transform duration-[900ms] ${ease} motion-reduce:transition-none group-hover:scale-[1.04]`}
              />
            </div>
            <div className="mt-5 flex items-baseline justify-between gap-4">
              <h3 className="text-2xl font-medium tracking-[-0.02em]">{p.name}</h3>
              <span className="shrink-0 text-sm text-[#EDEBE6]/50">{p.kind}</span>
            </div>
            <p className="mt-1 text-sm text-[#EDEBE6]/40">{p.stack.join(", ")}</p>
          </a>
        ))}
      </div>

      {/* Preview that follows the cursor; images sit in a vertical strip */}
      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-50 hidden lg:block"
      >
        <div
          className={`h-[300px] w-[440px] overflow-hidden rounded-md ring-1 ring-[#EDEBE6]/15 transition-[transform,opacity] duration-500 ${ease} motion-reduce:transition-none ${
            active >= 0 ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        >
          <div
            className="h-full transition-transform duration-700 ease-[cubic-bezier(.76,0,.24,1)] motion-reduce:transition-none"
            style={{ transform: `translateY(-${Math.max(active, 0) * 100}%)` }}
          >
            {projects.map((p) => (
              <div key={p.name} className="relative h-[300px] w-full">
                <Image src={p.image} alt="" fill sizes="440px" loading="eager" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
