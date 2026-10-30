import React from "react";
import CVButton from "./ui/CVButton";
import styles from "./Hero.module.css";

/* ---------- Edit your copy here ---------- */
const COPY = {
  line1: "I design and build",
  line2: "web experiences",
  sub: "Hi, I'm Abdullah, a Next.js developer based in Syria.",
  link: { label: "See how I work", href: "#about" },
  url: "localhost:3000/order",
  status: "On the way",
  eta: "12 min",
};

/* The code that "types itself" in the window: [className, text] */
type Tok = [string, string];
const CODE: Tok[][] = [
  [["kw", "export default function "], ["fn", "Order"], ["p", "() {"]],
  [["p", "  "], ["kw", "return"], ["p", " ("]],
  [["p", "    <"], ["tag", "Card"], ["at", " status"], ["p", "="], ["str", '"on the way"'], ["p", ">"]],
  [["p", "      <"], ["tag", "Route"], ["at", " from"], ["p", "={store} "], ["at", "to"], ["p", "={you} />"]],
  [["p", "      <"], ["tag", "ETA"], ["at", " minutes"], ["p", "={12} />"]],
  [["p", "    </"], ["tag", "Card"], ["p", ">"]],
  [["p", "  );"]],
  [["p", "}"]],
];
/* ----------------------------------------- */

const ROUTE = "M24 92 C 70 92, 80 40, 130 44 S 210 80, 252 28";

const Hero = () => {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.bg} aria-hidden="true" />

      <div className={styles.copy}>
        <h1 id="hero-title" className={styles.title}>
          <span className={styles.line}>
            <span className={styles.inner}>{COPY.line1}</span>
          </span>
          <span className={[styles.line, styles.accent].join(" ")}>
            <span className={styles.inner}>{COPY.line2}</span>
          </span>
        </h1>
        <p className={styles.sub}>{COPY.sub}</p>
        <div className={styles.actions}>
          <CVButton />
          <a className={styles.link} href={COPY.link.href}>{COPY.link.label}</a>
        </div>
      </div>

      <div className={styles.win} role="img" aria-label="A delivery tracking card being built live in Next.js">
        <div className={styles.bar} aria-hidden="true">
          <i /><i /><i />
          <span className={styles.url}>{COPY.url}</span>
        </div>
        <div className={styles.panes} aria-hidden="true">
          <pre className={styles.code}>
            {CODE.map((line, i) => {
              const n = line.reduce((a, t) => a + t[1].length, 0);
              return (
                <span key={i} className={styles.ln} style={{ "--n": n, "--i": i } as React.CSSProperties}>
                  {line.map(([c, t], j) => (
                    <span key={j} className={styles[c]}>{t}</span>
                  ))}
                </span>
              );
            })}
          </pre>

          <div className={styles.prev}>
            <div className={styles.order}>
              <div className={styles.head}>
                <b>Order #1042</b>
                <em>{COPY.status}</em>
              </div>
              <svg viewBox="0 0 280 120" className={styles.map}>
                <path d="M0 30H280M0 70H280M0 104H280M60 0V120M130 0V120M200 0V120" className={styles.streets} />
                <path d={ROUTE} className={styles.path} pathLength={1} />
                <circle cx="24" cy="92" r="5" fill="#fff" />
                <circle cx="252" cy="28" r="7" fill="#a63fe8" />
                <circle cx="252" cy="28" r="2.5" fill="#fff" />
                <circle r="5" className={styles.courier} style={{ offsetPath: `path("${ROUTE}")` }} />
              </svg>
              <div className={styles.eta}>
                <span>Arriving in</span>
                <b>{COPY.eta}</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
