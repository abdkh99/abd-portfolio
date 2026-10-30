"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import gsap from "gsap";
import styles from "./IntroPreloader.module.css";

const STORAGE_KEY = "intro-seen";

const hasSeen = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
};

const markSeen = () => {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {}
  document.documentElement.dataset.intro = "seen";
};

// Odometer reels: hundreds / tens / units.
// The trailing "0" on tens + units lets 9 -> 10 roll over seamlessly.
const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const REELS = [["0", "1"], DIGITS, DIGITS];

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

// Real glyph bounds (not the font's line box). This is what makes the letter
// truly centred, and lets the liquid fill map 1:1 onto the letter's height.
const measureInk = (cs: CSSStyleDeclaration, text: string) => {
  const size = parseFloat(cs.fontSize) || 200;
  const fallback = { asc: size * 0.72, desc: 0 };
  const g = document.createElement("canvas").getContext("2d");
  if (!g) return fallback;
  g.font = `${cs.fontStyle} ${cs.fontWeight} ${size}px ${cs.fontFamily}`;
  const m = g.measureText(text);
  if (!m.actualBoundingBoxAscent) return fallback;
  return { asc: m.actualBoundingBoxAscent, desc: m.actualBoundingBoxDescent };
};

export interface IntroPreloaderProps {
  /** One to three characters work best. */
  initials?: string;
  tagline?: string;
  /** Seconds the 000 -> 100 count (and the fill) takes. */
  countDuration?: number;
  /** Seconds the letter takes to bloom open and reveal the page. */
  exitDuration?: number;
  /** Play once per browser session (tab). Set false while designing. */
  once?: boolean;
  /** Fires the moment the page starts to show through the letter: start your hero animation here. */
  onReveal?: () => void;
  onComplete?: () => void;
}

export default function IntroPreloader({
  initials = "A",
  tagline = "Crafting Digital Experiences",
  countDuration = 2.6,
  exitDuration = 1.2,
  once = true,
  onReveal,
  onComplete,
}: IntroPreloaderProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cbRef = useRef({ onReveal, onComplete });
  const [done, setDone] = useState(false);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    cbRef.current = { onReveal, onComplete };
  }, [onReveal, onComplete]);

  // A. Skip for returning visitors.
  useEffect(() => {
    if (once && hasSeen()) {
      setDone(true);
      return;
    }
    setPlay(true);
  }, [once]);

  // B. Scroll lock + the whole GSAP timeline.
  useEffect(() => {
    if (!play) return;

    const html = document.documentElement;
    const body = document.body;
    const prev = { html: html.style.overflow, body: body.style.overflow };
    const unlock = () => {
      html.style.overflow = prev.html;
      body.style.overflow = prev.body;
    };
    window.scrollTo(0, 0);
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.dataset.intro = "playing";

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let cancelled = false;
    let ctx: gsap.Context | undefined;

    const run = () => {
      const wrap = wrapRef.current;
      if (cancelled || !wrap) return;

      ctx = gsap.context(() => {
        const q = gsap.utils.selector(wrap);
        const content = q("[data-content]");
        const art = q("[data-art]");
        const inks = q("[data-ink]");
        const outline = q("[data-outline]");
        // querySelector<T> types the SVG elements properly (the GSAP selector types everything as HTMLElement).
        const holeEl = wrap.querySelector<SVGTextElement>(
          "[data-hole]",
        ) as SVGTextElement;
        const glowEl = wrap.querySelector<SVGCircleElement>(
          "[data-glow]",
        ) as SVGCircleElement;
        const liquidEl = wrap.querySelector<SVGRectElement>(
          "[data-liquid]",
        ) as SVGRectElement;
        const beamEl = wrap.querySelector<SVGRectElement>(
          "[data-beam]",
        ) as SVGRectElement;
        const rampEl = wrap.querySelector<SVGLinearGradientElement>(
          "[data-ramp]",
        ) as SVGLinearGradientElement;
        const counterWrap = q("[data-counter]");
        const reels = q("[data-reel]") as HTMLElement[];
        const tag = q("[data-tagline]");
        const counter = { val: 0 };
        const bloom = { r: 0 };

        const finish = () => {
          unlock();
          markSeen();
          setDone(true);
          cbRef.current.onComplete?.();
        };
        const tl = gsap.timeline({ onComplete: finish });

        // --- Geometry: centre the real glyph, then place everything relative to it.
        const w = wrap.clientWidth;
        const h = wrap.clientHeight;
        const { asc, desc } = measureInk(
          getComputedStyle(outline[0]),
          initials,
        );
        const baseline = h / 2 + (asc - desc) / 2;
        const top = baseline - asc;
        const bottom = baseline + desc;
        const span = bottom - top;

        inks.forEach((el) => {
          el.setAttribute("x", String(w / 2));
          el.setAttribute("y", String(baseline));
        });
        rampEl.setAttribute("y1", String(bottom));
        rampEl.setAttribute("y2", String(top));
        liquidEl.setAttribute("height", String(span + 4));
        glowEl.setAttribute("cx", String(w / 2));
        glowEl.setAttribute("cy", String(h / 2));
        glowEl.setAttribute("r", String(Math.max(w, h) * 0.4));

        // One function drives the odometer, the liquid, the beam and the glow,
        // so they can never drift apart.
        const render = (v: number) => {
          // Odometer: units roll continuously, tens roll on the last unit of each decade,
          // and at 99 -> 100 all three reels roll together.
          const pos = [
            clamp01(v - 99),
            Math.floor(v / 10) + clamp01((v % 10) - 9),
            v % 10,
          ];
          reels.forEach((reel, i) => {
            reel.style.transform = `translateY(${-(pos[i] / REELS[i].length) * 100}%)`;
          });
          // Liquid level inside the letter + the beam that rides on its surface.
          const p = v / 100;
          const y = bottom - (span + 2) * p;
          liquidEl.setAttribute("y", String(y));
          beamEl.setAttribute("y", String(y - 1));
          glowEl.style.opacity = String(0.2 + 0.8 * p);
        };

        gsap.set(content, { opacity: 1 });
        gsap.set(art, { opacity: 1 });
        render(0);

        // Reduced motion: static composition, short fade, no counter / beam / bloom.
        if (reduce) {
          render(100);
          gsap.set(outline, { opacity: 1 });
          gsap.set(tag, { yPercent: 0 });
          gsap.set([...counterWrap, beamEl], { display: "none" });
          tl.to({}, { duration: 0.9 }).to(wrap, {
            opacity: 0,
            duration: 0.3,
            ease: "none",
          });
          return;
        }

        // How far the letter's edge has to travel to uncover the whole screen.
        const reach = Math.hypot(w, h) * 0.75;

        tl.fromTo(
          outline,
          { opacity: 0 },
          { opacity: 1, duration: 1, ease: "power2.out" },
          0,
        )
          .fromTo(
            beamEl,
            { opacity: 0 },
            { opacity: 1, duration: 0.6, ease: "power1.out" },
            0.2,
          )
          .fromTo(
            counterWrap,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
            0.2,
          )
          .fromTo(
            tag,
            { yPercent: 120 },
            { yPercent: 0, duration: 0.8, ease: "power4.out" },
            0.45,
          )
          .to(
            counter,
            {
              val: 100,
              duration: countDuration,
              ease: "power2.inOut",
              onUpdate: () => render(counter.val),
            },
            0,
          )
          // Exit: the letter is full. UI drops away, the filled letter fades to reveal a
          // window onto the page, and that window blooms outward until the screen is open.
          .addLabel("exit", "+=0.3")
          .set(wrap, { pointerEvents: "none" }, "exit")
          .set(holeEl, { opacity: 1 }, "exit")
          .to(
            counterWrap,
            { y: -20, opacity: 0, duration: 0.35, ease: "power2.in" },
            "exit",
          )
          .to(tag, { yPercent: 120, duration: 0.4, ease: "power3.in" }, "exit")
          .add(() => cbRef.current.onReveal?.(), "exit+=0.25")
          .to(
            art,
            { opacity: 0, duration: 0.45, ease: "power1.inOut" },
            "exit+=0.1",
          )
          .to(
            bloom,
            {
              r: reach,
              duration: exitDuration,
              ease: "power3.in",
              onUpdate: () => {
                holeEl.style.strokeWidth = `${bloom.r * 2}px`;
              },
            },
            "exit+=0.25",
          );
      }, wrap);
    };

    // Wait for the font (max 1.5s) so the letter and digits never swap mid-animation.
    const fontsReady = (async () => {
      try {
        await document.fonts?.ready;
        const probe = wrapRef.current?.querySelector("[data-outline]");
        if (probe) {
          const cs = getComputedStyle(probe);
          await document.fonts.load(
            `${cs.fontStyle} ${cs.fontWeight} 100px ${cs.fontFamily}`,
            initials,
          );
        }
      } catch {}
    })();
    const cap = new Promise<void>((resolve) =>
      window.setTimeout(resolve, 1500),
    );
    Promise.race([fontsReady, cap]).then(run);

    return () => {
      cancelled = true;
      ctx?.revert();
      unlock();
    };
  }, [play, initials, countDuration, exitDuration]);

  if (done) return null;

  return (
    <div
      ref={wrapRef}
      className={styles.wrap}
      role="status"
      aria-label="Loading"
    >
      <svg
        className={styles.svg}
        style={{ "--chars": Array.from(initials).length || 1 } as CSSProperties}
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="intro-ramp"
            data-ramp
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0" className={styles.rampFrom} />
            <stop offset="0.6" className={styles.rampMid} />
            <stop offset="1" className={styles.rampTo} />
          </linearGradient>
          <linearGradient id="intro-beam">
            <stop offset="0" className={styles.beamEdge} />
            <stop offset="0.5" className={styles.beamCore} />
            <stop offset="1" className={styles.beamEdge} />
          </linearGradient>
          <radialGradient id="intro-glow">
            <stop offset="0" className={styles.glowCore} />
            <stop offset="1" className={styles.glowEdge} />
          </radialGradient>

          {/* The letter's shape, used to clip the rising liquid. */}
          <clipPath id="intro-glyph">
            <text data-ink className={styles.ink}>
              {initials}
            </text>
          </clipPath>

          {/* The same letter, knocked out of the cover. It blooms at the exit. */}
          <mask id="intro-hole">
            <rect width="100%" height="100%" fill="#fff" />
            <text data-ink data-hole className={`${styles.ink} ${styles.hole}`}>
              {initials}
            </text>
          </mask>
        </defs>

        {/* Solid cover (also what you see before hydration). */}
        <rect
          className={styles.cover}
          width="100%"
          height="100%"
          mask="url(#intro-hole)"
        />

        <g data-art className={styles.art}>
          <circle data-glow className={styles.glow} fill="url(#intro-glow)" />
          <text
            data-ink
            data-outline
            className={`${styles.ink} ${styles.outline}`}
          >
            {initials}
          </text>
          <g clipPath="url(#intro-glyph)">
            <rect data-liquid x="0" width="100%" fill="url(#intro-ramp)" />
          </g>
          <rect
            data-beam
            x="0"
            width="100%"
            height="2"
            fill="url(#intro-beam)"
          />
        </g>
      </svg>

      <div data-content className={styles.content}>
        <div data-counter className={styles.counter} aria-hidden="true">
          {REELS.map((digits, i) => (
            <span key={i} className={styles.reel}>
              <span data-reel className={styles.stack}>
                {digits.map((d, j) => (
                  <span key={j} className={styles.digit}>
                    {d}
                  </span>
                ))}
              </span>
            </span>
          ))}
          <span className={styles.percent}>%</span>
        </div>

        <p className={styles.tagline}>
          <span data-tagline className={styles.taglineInner}>
            {tagline}
          </span>
        </p>
      </div>
    </div>
  );
}
