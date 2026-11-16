"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./Hero.module.css";

const STORAGE_KEY = "intro-seen";
const GREETING = "Hello, I’m Abdullah";

/* ---------- Edit your copy here ---------- */
const COPY = {
  eyebrow: "Available for new projects",
  line1: "Clean, fast websites,",
  line2: "built with care.",
  sub: "I’m Abdullah, a Next.js developer based in Syria. I turn ideas into interfaces that feel simple to use.",
  cv: { label: "Download CV", href: "/Abdullah-Khazana-Katbi-CV.pdf" },
  link: { label: "View selected work", href: "#projects" },
  name: "Abdullah Khazana",
  role: "Next.js developer",
  initials: "AK",
  place: "Syria",
  timeZone: "Asia/Damascus",
};
const ROWS: [string, string][] = [
  ["Stack", "Next.js, React, TypeScript"],
  ["Motion", "GSAP"],
  ["Working", "Remote, flexible hours"],
];
/* ----------------------------------------- */

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

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const [time, setTime] = useState("");

  // Live local time in the card.
  useEffect(() => {
    const tick = () => {
      try {
        setTime(
          new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: COPY.timeZone,
          }).format(new Date()),
        );
      } catch {}
    };
    tick();
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, []);

  // Intro: the real card starts small in the centre, then flies into its slot.
  useEffect(() => {
    if (hasSeen()) return; // returning visitor: layout.tsx already hid the cover
    const root = rootRef.current;
    if (!root) return;

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

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      unlock();
      markSeen();
      return;
    }

    let cancelled = false;
    let ctx: gsap.Context | undefined;

    const run = () => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const q = gsap.utils.selector(root);
        const pick = (s: string) => root.querySelector<HTMLElement>(s)!;
        const card = pick("[data-card]");
        const cover = pick("[data-cover]");
        const fb = pick("[data-fb]");
        const tx = pick("[data-tx]");

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        gsap.set(card, { clearProps: "transform" });
        const r = card.getBoundingClientRect();
        // Desktop: the real card travels. Mobile: the card sits below the fold, so use a simple loader.
        const fly = vw >= 900 && r.top + r.height / 2 < vh;
        const s = Math.min(1, 280 / r.width);
        const prog = { p: 0 };
        const typed = { n: 0 };

        gsap.set(q("[data-l]"), { yPercent: 105 });
        gsap.set(q("[data-fade]"), { autoAlpha: 0, y: 14 });
        gsap.set(q("[data-cin]"), { autoAlpha: 0 });
        gsap.set(q("[data-in]"), { y: 10 });
        gsap.set(q("[data-ld]"), { autoAlpha: 0 });
        gsap.set(fb, { autoAlpha: 0 });
        card.style.setProperty("--s", String(fly ? s : 1));
        gsap.set(
          card,
          fly
            ? {
                x: vw / 2 - (r.left + r.width / 2),
                y: vh / 2 - (r.top + r.height / 2),
                scale: s,
                autoAlpha: 0,
                "--p": 0,
                "--po": 1,
              }
            : { autoAlpha: 0, "--p": 0, "--po": 1 },
        );

        const update = () => {
          card.style.setProperty("--p", String(prog.p));
          fb.style.setProperty("--p", String(prog.p));
        };

        const tl = gsap.timeline({
          onComplete: () => {
            unlock();
            markSeen();
            gsap.set(cover, { display: "none" });
          },
        });

        if (fly) {
          tl.to(
            card,
            { autoAlpha: 1, duration: 0.6, ease: "power2.out" },
            0,
          ).to(q("[data-ld]"), { autoAlpha: 1, duration: 0.3 }, 0.3);
        } else {
          tl.to(fb, { autoAlpha: 1, duration: 0.5 }, 0);
        }

        tl.to(
          typed,
          {
            n: GREETING.length,
            duration: 0.9,
            ease: "none",
            onUpdate: () => {
              tx.textContent = GREETING.slice(0, Math.round(typed.n));
            },
          },
          0.3,
        )
          .to(
            prog,
            { p: 1, duration: 1.6, ease: "power2.inOut", onUpdate: update },
            0.2,
          )

          // Handoff: the loader card flies into its Hero slot while the cover fades.
          .addLabel("go", 1.95)
          .to([...q("[data-ld]"), fb], { autoAlpha: 0, duration: 0.25 }, "go")
          .to(
            cover,
            { autoAlpha: 0, duration: 0.9, ease: "power1.inOut" },
            "go+=0.1",
          )
          .to(
            card,
            {
              x: 0,
              y: 0,
              scale: 1,
              autoAlpha: 1,
              "--po": 0,
              duration: 1.1,
              ease: "power3.inOut",
            },
            "go",
          )
          .to(
            q("[data-cin]"),
            { autoAlpha: 1, duration: 0.5, ease: "power1.out" },
            "go+=0.5",
          )
          .to(
            q("[data-in]"),
            { y: 0, duration: 0.7, ease: "power2.out", stagger: 0.07 },
            "go+=0.5",
          )

          // The Hero's content, started only now.
          .to(
            q("[data-l]"),
            { yPercent: 0, duration: 0.95, ease: "expo.out", stagger: 0.12 },
            "go+=0.45",
          )
          .to(
            q("[data-fade]"),
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              stagger: 0.1,
            },
            "go+=0.8",
          );
      }, root);
    };

    // Wait for the fonts (max 1.2s) so the card is measured at its final size.
    Promise.race([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise<void>((resolve) => window.setTimeout(resolve, 1200)),
    ]).then(run);

    return () => {
      cancelled = true;
      ctx?.revert();
      unlock();
    };
  }, []);

  return (
    <section ref={rootRef} className={styles.hero} aria-labelledby="hero-title">
      <div data-cover className={styles.cover} aria-hidden="true" />
      <div data-fb className={styles.fb} aria-hidden="true">
        {GREETING}
        <b />
      </div>
      <div className={styles.bg} aria-hidden="true" />

      <div className={styles.copy}>
        <div data-fade className={styles.eyebrow}>
          <i />
          {COPY.eyebrow}
        </div>
        <h1 id="hero-title" className={styles.title}>
          <span className={styles.line}>
            <span data-l>{COPY.line1}</span>
          </span>
          <span className={`${styles.line} ${styles.muted}`}>
            <span data-l>{COPY.line2}</span>
          </span>
        </h1>
        <p data-fade className={styles.sub}>
          {COPY.sub}
        </p>
        <div data-fade className={styles.actions}>
          <a className={styles.btn} href={COPY.cv.href} download>
            {COPY.cv.label}
          </a>
          <a className={styles.link} href={COPY.link.href}>
            {COPY.link.label}
          </a>
        </div>
      </div>

      <div data-card className={styles.card}>
        <div data-ld className={styles.ld} aria-hidden="true">
          <p>
            <span data-tx />
            <i className={styles.caret} />
          </p>
        </div>
        <div data-cin className={styles.cin}>
          <div data-in className={styles.id}>
            <div className={styles.mono}>{COPY.initials}</div>
            <div>
              <b>{COPY.name}</b>
              <span>{COPY.role}</span>
            </div>
          </div>
          <div data-in className={styles.row}>
            <span>Based in</span>
            <b>
              {COPY.place}
              {time && `, ${time}`}
            </b>
          </div>
          {ROWS.map(([label, value]) => (
            <div data-in key={label} className={styles.row}>
              <span>{label}</span>
              <b>{value}</b>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
