"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./AboutTimeline.module.css";

/* ---------- Edit your copy here ---------- */
const COPY = {
  title: "What it's like to",
  titleAccent: "work with me",
  sub: "What to expect when we work together.",
  time: {
    title: "My day overlaps with yours",
    text: "I'm in Syria (UTC+3) and I shift my hours to match your time zone, so you get replies while you're still at your desk.",
    pick: "Pick your time zone",
    shift: "I shift my hours to cover it.",
  },
  talk: {
    title: "You always know where the project stands",
    text: "Short updates, live previews, straight answers. No black box between us.",
    steps: [
      ["Scope agreed", "We align on goals and priorities.", "Done"],
      ["Preview shared", "You see a working version early.", "Done"],
      ["Feedback applied", "Your notes go straight into the build.", "Now"],
      ["Launched", "Live, tested, and ready for real users.", "Next"],
    ],
  },
  stack: {
    title: "Next.js first, curious about the rest",
    text: "My daily stack, plus whatever I'm learning to make it better.",
    layers: [
      ["Next.js", "Framework", "Routing, rendering and the backend in one place."],
      ["React", "Interface", "Components that stay easy to change."],
      ["Tailwind CSS", "Styling", "A consistent look, built fast."],
      ["Framer Motion + GSAP", "Motion", "Animation that explains what changed."],
      ["Three.js", "3D", "Depth, when the idea needs it."],
    ],
    next: "Next up",
    learning: "Always learning",
  },
  full: {
    title: "Full-stack, front to back",
    text: "I'm building We-DELIVER-, a delivery platform, so I know what it takes to connect screens, APIs, and real operations.",
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
  const p = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(date);
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
    try { you = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch { /* keep presets only */ }
    const tick = () => {
      const date = new Date();
      const sy = minutesIn(SYRIA, date);
      const base = [
        ...(you ? [{ id: "you", label: `You (${cityOf(you)})`, tz: you }] : []),
        ...PRESETS.filter((p) => p.tz !== you),
      ];
      const zones = base.map((z) => {
        let d = 0;
        try { d = ((minutesIn(z.tz, date) - sy + 2160) % 1440) - 720; } catch { /* unknown zone */ }
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

/* Sky helpers: sun, moon and sky colour from the minute of the day */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mix = (c1: number[], c2: number[], t: number) => `rgb(${c1.map((v, i) => Math.round(lerp(v, c2[i], t))).join(",")})`;
const arc = (t: number) => ({ x: 50 - Math.cos(Math.PI * t) * 34, y: 64 - Math.sin(Math.PI * t) * 50 });

function skyAt(m: number) {
  const f = Math.pow(0.5 - 0.5 * Math.cos((2 * Math.PI * m) / 1440), 1.4); // 0 at midnight, 1 at noon
  const day = m >= 360 && m < 1080;
  return {
    day,
    f,
    top: mix([6, 4, 28], [52, 44, 150], f),
    bottom: mix([22, 10, 64], [158, 120, 235], f),
    sun: arc(day ? (m - 360) / 720 : 0),
    moon: arc(day ? 0 : mod(m - 1080) / 720),
  };
}

function Sky({ label, time, m }: { label: string; time: string; m: number }) {
  const k = skyAt(mod(m));
  return (
    <div
      className={styles.win}
      role="img"
      aria-label={`${label}, ${time}, ${k.day ? "daytime" : "night"}`}
      style={{ "--top": k.top, "--bot": k.bottom, "--stars": 1 - k.f } as React.CSSProperties}
    >
      <i className={styles.stars} />
      <i className={styles.sun} style={{ left: `${k.sun.x}%`, top: `${k.sun.y}%`, opacity: k.day ? 1 : 0 }} />
      <i className={styles.moon} style={{ left: `${k.moon.x}%`, top: `${k.moon.y}%`, opacity: k.day ? 0 : 1 }} />
      <div className={styles.ground}><small>{label}</small><b>{time}</b></div>
    </div>
  );
}

function Row({
  n, title, text, wide, children,
}: { n: React.ReactNode; title: string; text: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <li className={styles.row} data-row>
      <span className={styles.node} data-node>{n}</span>
      <div className={[styles.body, wide ? styles.wide : ""].join(" ")}>
        <div className={styles.txt}>
          <h3>{title}</h3>
          <p>{text}</p>
        </div>
        <div className={styles.vis}>{children}</div>
      </div>
    </li>
  );
}

const Check = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);

/* Wire paths for the node graph, in a 100x100 box that stretches with the panel */
const WIRES = [
  "M28 50 C 32.5 50, 32.5 24, 37 24",
  "M28 50 C 32.5 50, 32.5 76, 37 76",
  "M63 24 C 67.5 24, 67.5 50, 72 50",
  "M63 76 C 67.5 76, 67.5 50, 72 50",
];
const SPOTS = [[2, 50], [37, 24], [37, 76], [72, 50]];

export default function AboutTimeline() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const dial = useDial();
  const [sel, setSel] = useState("");
  const [active, setActive] = useState(0);
  const zone = dial.zones.find((z) => z.id === sel) ?? dial.zones[0];
  const startMine = 540 - zone.d; // their 9:00 on my clock
  const endMine = 1260 - zone.d; // their 21:00 on my clock
  const nextDay = mod(endMine) < mod(startMine);
  const now = dial.now ?? 720;
  const youLabel = zone.id === "you" ? zone.label.replace(/^You \((.*)\)$/, "You, $1") : zone.label;
  const diff = zone.d === 0 ? "Same time as me" : `${dur(zone.d)} ${zone.d > 0 ? "ahead of" : "behind"} me`;
  const clock = (m: number) => (dial.now === null ? "--:--" : hhmm(m));
  const layers = COPY.stack.layers;

  useEffect(() => {
    const wrap = wrapRef.current;
    const fill = fillRef.current;
    if (!wrap || !fill) return;
    const rows = Array.from(wrap.querySelectorAll<HTMLElement>("[data-row]"));
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight * 0.7;
      const r = wrap.getBoundingClientRect();
      fill.style.height = `${Math.max(0, Math.min(r.height, mid - r.top))}px`;
      let last = -1;
      rows.forEach((row, i) => {
        const n = row.querySelector<HTMLElement>("[data-node]");
        if (!n) return;
        const b = n.getBoundingClientRect();
        const on = b.top + b.height / 2 < mid;
        row.classList.toggle(styles.on, on);
        if (on) last = i;
      });
      rows.forEach((row, i) => row.classList.toggle(styles.cur, i === last));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
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
        <div className={styles.spine} aria-hidden="true" />
        <div className={styles.fill} ref={fillRef} aria-hidden="true" />

        <ol className={styles.rows}>
          {/* 1. Time zones: two skies, one for me and one for you */}
          <Row wide n="1" title={COPY.time.title} text={COPY.time.text}>
            <div className={[styles.panel, styles.skiesPanel].join(" ")}>
              <div className={styles.skies}>
                <Sky label="Me, Syria" time={clock(now)} m={now} />
                <div className={styles.bridge} aria-hidden="true"><span>{diff}</span></div>
                <Sky label={youLabel} time={clock(now + zone.d)} m={now + zone.d} />
              </div>

              <div className={styles.skyInfo}>
                <div>
                  <p className={styles.pick}>{COPY.time.pick}</p>
                  <div className={styles.chips} role="group" aria-label={COPY.time.pick}>
                    {dial.zones.map((z) => (
                      <button key={z.id} type="button" className={styles.chip} aria-pressed={z.id === zone.id} onClick={() => setSel(z.id)}>
                        {z.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div aria-live="polite">
                  <p className={styles.range}>
                    Your 9:00 to 21:00 is my <b>{hhmm(startMine)} to {hhmm(endMine)}</b>{nextDay ? " (next day)" : ""}.
                  </p>
                  <p className={styles.shiftNote}>{COPY.time.shift}</p>
                </div>
              </div>
            </div>
          </Row>

          {/* 2. Communication: a nested activity timeline */}
          <Row n="2" title={COPY.talk.title} text={COPY.talk.text}>
            <div className={styles.panel}>
              <ul className={styles.feed}>
                {COPY.talk.steps.map(([label, desc, state], i) => (
                  <li
                    key={label}
                    className={state === "Done" ? styles.fdone : state === "Now" ? styles.fnow : ""}
                    style={{ "--i": i } as React.CSSProperties}
                  >
                    <span className={styles.dot}>{state === "Done" && <Check />}</span>
                    <div><b>{label}</b><p>{desc}</p></div>
                    <small>{state}</small>
                  </li>
                ))}
              </ul>
            </div>
          </Row>

          {/* 3. Stack: an exploded stack of layers */}
          <Row n="3" title={COPY.stack.title} text={COPY.stack.text}>
            <div className={[styles.panel, styles.stackPanel].join(" ")}>
              <div className={styles.iso} aria-hidden="true">
                <div className={styles.slabs}>
                  {[...layers.map((l) => l[0]), "+"].map((name, i) => (
                    <div
                      key={name}
                      className={[styles.slab, i === 0 ? styles.base : "", i === layers.length ? styles.nextup : "", i === active ? styles.hot : ""].join(" ")}
                      style={{ "--i": i } as React.CSSProperties}
                    >
                      <span>{i === layers.length ? COPY.stack.next : name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <ul className={styles.layerList}>
                {layers.map(([name, role, note], i) => (
                  <li key={name}>
                    <button
                      type="button"
                      aria-pressed={i === active}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                    >
                      <b>{name}</b><small>{role}</small>
                      {i === active && <p>{note}</p>}
                    </button>
                  </li>
                ))}
                <li className={styles.learnRow}>
                  <code><span className={styles.k}>import</span> {"{ growth }"} <span className={styles.k}>from</span> &apos;every-day&apos;;</code>
                  <small>{COPY.stack.learning}</small>
                </li>
              </ul>
            </div>
          </Row>

          {/* 4. Full-stack: a node graph */}
          <Row wide n="4" title={COPY.full.title} text={COPY.full.text}>
            <div className={[styles.panel, styles.graph].join(" ")} role="img" aria-label={COPY.full.nodes.join(", then ")}>
              <svg className={styles.wires} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                {WIRES.map((d) => (
                  <g key={d}><path d={d} className={styles.wire} /><path d={d} className={styles.flow} /></g>
                ))}
              </svg>
              {COPY.full.nodes.map((name, i) => (
                <div
                  key={name}
                  aria-hidden="true"
                  className={[styles.gnode, i === 0 ? styles.src : "", i === 3 ? styles.dst : ""].join(" ")}
                  style={{ left: `${SPOTS[i][0]}%`, top: `${SPOTS[i][1]}%`, "--i": i } as React.CSSProperties}
                >
                  {name}
                  {i === 3 && <small className={styles.live}><i />Live</small>}
                </div>
              ))}
            </div>
          </Row>

          {/* 5. CTA */}
          <Row
            n={<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></svg>}
            title={COPY.cta.title}
            text=""
          >
            <div className={[styles.panel, styles.cta].join(" ")}>
              <p>{COPY.cta.text}</p>
              <a className={styles.btn} href={COPY.cta.href}>{COPY.cta.button}</a>
            </div>
          </Row>
        </ol>
      </div>
    </section>
  );
}
