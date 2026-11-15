"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./AboutTimeline.module.css";

/* ---------- Edit your copy here ---------- */
const COPY = {
  title: "What it's like to",
  titleAccent: "work with me",
  sub: "A few things you can count on when we work together.",
  labels: ["Time zones", "Communication", "Stack", "Full-stack", "Contact"],
  time: {
    title: "My day overlaps with yours",
    text: "I'm in Syria and I shift my hours to match your time zone, so you get replies while you're still at your desk.",
    pick: "Check your time zone",
    me: "Me, Syria",
  },
  talk: {
    title: "You always know where things stand",
    text: "Short updates, live previews, straight answers.",
    steps: [
      ["Scope agreed", "Done"],
      ["Preview shared", "Done"],
      ["Feedback applied", "Now"],
      ["Launched", "Next"],
    ],
  },
  stack: {
    title: "Next.js first, curious about the rest",
    text: "My daily tools, and whatever I'm learning to make them better.",
    items: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Framer Motion",
      "GSAP",
      "Three.js",
    ],
    learning: "Always learning",
  },
  full: {
    title: "Full-stack, front to back",
    text: "I'm building We-DELIVER-, a delivery platform, so I know what it takes to connect screens, APIs and real operations.",
    nodes: ["Your idea", "Interface", "API and data", "Live product"],
  },
  cta: {
    title: "Got an idea? Let's make it real.",
    text: "Tell me what you're building. I'll tell you honestly how I'd build it.",
    button: "Let's talk",
    href: "#contact",
  },
};

const SYRIA = "Asia/Damascus";
const PRESETS = [
  { id: "dubai", label: "Dubai", tz: "Asia/Dubai" },
  { id: "london", label: "London", tz: "Europe/London" },
  { id: "ny", label: "New York", tz: "America/New_York" },
];
/* ----------------------------------------- */

type Zone = { id: string; label: string; tz: string; d: number }; // d = minutes ahead of Syria

const mod = (m: number) => ((m % 1440) + 1440) % 1440;
const hhmm = (m: number) => {
  const v = mod(Math.round(m));
  return `${String(Math.floor(v / 60)).padStart(2, "0")}:${String(v % 60).padStart(2, "0")}`;
};
const dur = (m: number) => {
  const a = Math.abs(m);
  return `${Math.floor(a / 60)}h${a % 60 ? ` ${a % 60}m` : ""}`;
};
const cityOf = (tz: string) => (tz.split("/").pop() ?? tz).replace(/_/g, " ");

function minutesIn(tz: string, date: Date) {
  const p = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const h = parseInt(p.find((x) => x.type === "hour")?.value ?? "0", 10) % 24;
  const m = parseInt(p.find((x) => x.type === "minute")?.value ?? "0", 10);
  return h * 60 + m;
}

/* Live Syria time, plus the visitor's own time zone (detected in the browser) */
function useDial() {
  const [state, setState] = useState<{ now: number | null; zones: Zone[] }>({
    now: null,
    zones: PRESETS.map((p) => ({ ...p, d: 0 })),
  });
  useEffect(() => {
    let you = "";
    try {
      you = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    } catch {
      /* keep presets only */
    }
    const tick = () => {
      const date = new Date();
      const sy = minutesIn(SYRIA, date);
      const base = [
        ...(you ? [{ id: "you", label: `You (${cityOf(you)})`, tz: you }] : []),
        ...PRESETS.filter((p) => p.tz !== you),
      ];
      const zones = base.map((z) => {
        let d = 0;
        try {
          d = ((minutesIn(z.tz, date) - sy + 2160) % 1440) - 720;
        } catch {
          /* unknown zone */
        }
        return { ...z, d };
      });
      setState({ now: sy, zones });
    };
    tick();
    const id = setInterval(tick, 20000);
    return () => clearInterval(id);
  }, []);
  return state;
}

/* One timeline entry: a short label, a dot on the rail, and the content */
const Row = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <li className={styles.row} data-row>
    <span className={styles.label}>{label}</span>
    <span className={styles.node} data-node aria-hidden="true" />
    {children}
  </li>
);

const Check = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

/* Soft glow that follows the cursor inside a card */
const spot = (e: React.MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

export default function AboutTimeline() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const spineRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const dial = useDial();
  const [sel, setSel] = useState("");
  const zone = dial.zones.find((z) => z.id === sel) ?? dial.zones[0];
  const now = dial.now ?? 720;
  const clock = (m: number) => (dial.now === null ? "--:--" : hhmm(m));
  const startMine = 540 - zone.d; // their 9:00 on my clock
  const endMine = 1260 - zone.d; // their 21:00 on my clock
  const nextDay = mod(endMine) < mod(startMine);
  const youLabel =
    zone.id === "you"
      ? zone.label.replace(/^You \((.*)\)$/, "You, $1")
      : zone.label;
  const diff =
    zone.d === 0
      ? "Same time as me"
      : `${dur(zone.d)} ${zone.d > 0 ? "ahead of" : "behind"} me`;

  /* The rail fills as you scroll; passed nodes light up and the current entry is highlighted */
  useEffect(() => {
    const wrap = wrapRef.current;
    const spine = spineRef.current;
    const fill = fillRef.current;
    if (!wrap || !spine || !fill) return;
    const rows = Array.from(wrap.querySelectorAll<HTMLElement>("[data-row]"));
    const nodes = rows.map((r) => r.querySelector<HTMLElement>("[data-node]"));
    if (!rows.length || nodes.some((n) => !n)) return;
    const mid = (n: HTMLElement | null) => {
      const b = n!.getBoundingClientRect();
      return b.top + b.height / 2;
    };
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.65;
      const wrapTop = wrap.getBoundingClientRect().top;
      const first = mid(nodes[0]);
      const len = mid(nodes[nodes.length - 1]) - first;
      spine.style.top = fill.style.top = `${first - wrapTop}px`;
      spine.style.height = `${len}px`;
      fill.style.height = `${Math.max(0, Math.min(len, line - first))}px`;
      let last = -1;
      rows.forEach((row, i) => {
        const on = mid(nodes[i]) < line;
        row.classList.toggle(styles.on, on);
        if (on) last = i;
      });
      rows.forEach((row, i) => row.classList.toggle(styles.cur, i === last));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="about" className={styles.section}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          {COPY.title} <span>{COPY.titleAccent}</span>
        </h2>
        <p className={styles.sub}>{COPY.sub}</p>
      </header>

      <div className={styles.wrap} ref={wrapRef}>
        <div className={styles.spine} ref={spineRef} aria-hidden="true" />
        <div className={styles.fill} ref={fillRef} aria-hidden="true" />

        <ol className={styles.rows}>
          {/* 1. Time zones */}
          <Row label={COPY.labels[0]}>
            <article className={styles.card} onMouseMove={spot}>
              <div className={styles.text}>
                <h3>{COPY.time.title}</h3>
                <p>{COPY.time.text}</p>
              </div>
              <div className={styles.well}>
                <div className={styles.clocks}>
                  <div>
                    <small>{COPY.time.me}</small>
                    <b>{clock(now)}</b>
                  </div>
                  <span className={styles.diff}>{diff}</span>
                  <div>
                    <small>{youLabel}</small>
                    <b>{clock(now + zone.d)}</b>
                  </div>
                </div>
                <div
                  className={styles.chips}
                  role="group"
                  aria-label={COPY.time.pick}
                >
                  {dial.zones.map((z) => (
                    <button
                      key={z.id}
                      type="button"
                      className={styles.chip}
                      aria-pressed={z.id === zone.id}
                      onClick={() => setSel(z.id)}
                    >
                      {z.label}
                    </button>
                  ))}
                </div>
                <p className={styles.range} aria-live="polite">
                  Your 9:00 to 21:00 is my{" "}
                  <b>
                    {hhmm(startMine)} to {hhmm(endMine)}
                  </b>
                  {nextDay ? " (next day)" : ""}.
                </p>
              </div>
            </article>
          </Row>

          {/* 2. Communication */}
          <Row label={COPY.labels[1]}>
            <article className={styles.card} onMouseMove={spot}>
              <div className={styles.text}>
                <h3>{COPY.talk.title}</h3>
                <p>{COPY.talk.text}</p>
              </div>
              <div className={styles.well}>
                <ul className={styles.steps}>
                  {COPY.talk.steps.map(([label, state]) => (
                    <li
                      key={label}
                      className={
                        state === "Done"
                          ? styles.done
                          : state === "Now"
                            ? styles.now
                            : ""
                      }
                    >
                      <span className={styles.dot}>
                        {state === "Done" && <Check />}
                      </span>
                      <span className={styles.stepLabel}>{label}</span>
                      <small>{state}</small>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Row>

          {/* 3. Stack */}
          <Row label={COPY.labels[2]}>
            <article className={styles.card} onMouseMove={spot}>
              <div className={styles.text}>
                <h3>{COPY.stack.title}</h3>
                <p>{COPY.stack.text}</p>
              </div>
              <div className={styles.well}>
                <ul className={styles.pills}>
                  {COPY.stack.items.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                  <li className={styles.learning}>{COPY.stack.learning}</li>
                </ul>
              </div>
            </article>
          </Row>

          {/* 4. Full-stack */}
          <Row label={COPY.labels[3]}>
            <article className={styles.card} onMouseMove={spot}>
              <div className={styles.text}>
                <h3>{COPY.full.title}</h3>
                <p>{COPY.full.text}</p>
              </div>
              <div className={styles.well}>
                <ol className={styles.flow}>
                  {COPY.full.nodes.map((name, i) => (
                    <li
                      key={name}
                      className={
                        i === COPY.full.nodes.length - 1 ? styles.final : ""
                      }
                    >
                      <i />
                      <span>{name}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </article>
          </Row>

          {/* 5. CTA */}
          <Row label={COPY.labels[4]}>
            <div className={styles.cta}>
              <div>
                <h3>{COPY.cta.title}</h3>
                <p>{COPY.cta.text}</p>
              </div>
              <a className={styles.btn} href={COPY.cta.href}>
                {COPY.cta.button}
              </a>
            </div>
          </Row>
        </ol>
      </div>
    </section>
  );
}
