import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";
import { Magnetic, RoundButton } from "./Magnetic";
import { useTransitionNav } from "./Transition";

const NAV = [
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function NavLink({ to, children, className = "" }: { to: string; children: ReactNode; className?: string }) {
  const { go } = useTransitionNav();
  return (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault();
        go(to);
      }}
      className={className}
    >
      {children}
    </a>
  );
}

export function Header({ light = false }: { light?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 300);
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  const color = light ? "text-ink-foreground" : "text-foreground";

  return (
    <>
      <header className={`absolute top-0 z-40 flex w-full items-center justify-between p-6 md:p-9 ${color}`}>
        <NavLink to="/" className="group flex cursor-pointer text-base">
          <span className="transition-transform duration-500 group-hover:rotate-[360deg]">©</span>
          <span className="relative ml-1 flex overflow-hidden whitespace-nowrap">
            <span className="transition-transform duration-500 [transition-timing-function:var(--ease-expo)] group-hover:-translate-x-[65px]">Code by</span>
            <span className="pl-1 transition-transform duration-500 [transition-timing-function:var(--ease-expo)] group-hover:-translate-x-[65px]">Studio</span>
            <span className="absolute left-[120px] pl-1 transition-transform duration-500 [transition-timing-function:var(--ease-expo)] group-hover:-translate-x-[65px]">Nova</span>
          </span>
        </NavLink>
        <nav className="hidden items-center gap-2 md:flex">
          {NAV.map((n) => (
            <Magnetic key={n.to}>
              <NavLink to={n.to} className="group relative flex flex-col items-center px-4 py-2">
                {n.label}
                <span
                  className={`absolute top-[110%] h-1.5 w-1.5 rounded-full bg-current transition-transform duration-200 ${
                    pathname === n.to ? "scale-100" : "scale-0 group-hover:scale-100"
                  }`}
                />
              </NavLink>
            </Magnetic>
          ))}
        </nav>
        <button className="md:hidden" onClick={() => setOpen(true)}>Menu</button>
      </header>

      <AnimatePresence>
        {(scrolled || open) && (
          <motion.div
            className="fixed right-6 top-6 z-[60] md:right-9 md:top-9"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Magnetic>
              <button
                onClick={() => setOpen(!open)}
                className={`flex h-20 w-20 items-center justify-center rounded-full ${open ? "bg-primary" : "bg-ink"}`}
              >
                <span className="relative block h-4 w-8">
                  <span className={`absolute left-0 h-px w-full bg-ink-foreground transition-transform duration-300 ${open ? "top-2 rotate-45" : "top-0.5"}`} />
                  <span className={`absolute left-0 h-px w-full bg-ink-foreground transition-transform duration-300 ${open ? "top-2 -rotate-45" : "top-3"}`} />
                </span>
              </button>
            </Magnetic>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-ink/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-[480px] flex-col justify-between bg-ink p-12 pt-28 text-ink-foreground md:p-24"
              initial={{ x: "calc(100% + 100px)" }}
              animate={{ x: 0 }}
              exit={{ x: "calc(100% + 100px)" }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            >
              <div>
                <p className="mb-10 border-b border-ink-foreground/20 pb-6 text-xs uppercase text-ink-foreground/50">Navigation</p>
                <ul className="flex flex-col gap-3">
                  {[{ to: "/", label: "Home" }, ...NAV].map((n, i) => (
                    <motion.li
                      key={n.to}
                      initial={{ x: 80 }}
                      animate={{ x: 0, transition: { delay: 0.05 * i, duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
                    >
                      <NavLink to={n.to} className="flex items-center gap-4 text-5xl md:text-6xl">
                        <span className={`h-2.5 w-2.5 rounded-full bg-ink-foreground ${pathname === n.to ? "" : "opacity-0"}`} />
                        {n.label}
                      </NavLink>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-3 text-xs uppercase text-ink-foreground/50">Socials</p>
                <div className="flex gap-6 text-sm">
                  <a href="#">Awwwards</a><a href="#">Instagram</a><a href="#">Twitter</a><a href="#">LinkedIn</a>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function Clock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const u = () => setT(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
    u();
    const id = setInterval(u, 30000);
    return () => clearInterval(id);
  }, []);
  return <>{t}</>;
}

export function Footer() {
  const { go } = useTransitionNav();
  return (
    <footer className="relative bg-ink pt-40 text-ink-foreground">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <div className="relative border-b border-ink-foreground/20 pb-24">
          <h2 className="text-5xl leading-tight md:text-8xl">
            Let's work
            <br />
            together
          </h2>
          <div className="absolute bottom-0 right-6 translate-y-1/2 md:right-24">
            <RoundButton onClick={() => go("/contact")}>Get in touch</RoundButton>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 pb-24 pt-20">
          <RoundButton variant="outline" size="md">hello@studionova.dev</RoundButton>
          <RoundButton variant="outline" size="md">+00 000 000 000</RoundButton>
        </div>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-6 px-6 pb-8 text-sm md:px-9">
        <div className="flex gap-10">
          <div><p className="mb-3 text-xs uppercase text-ink-foreground/50">Version</p>2026 © Edition</div>
          <div><p className="mb-3 text-xs uppercase text-ink-foreground/50">Local time</p><Clock /></div>
        </div>
        <div><p className="mb-3 text-xs uppercase text-ink-foreground/50">Socials</p>
          <div className="flex gap-6"><a href="#">Awwwards</a><a href="#">Instagram</a><a href="#">Twitter</a><a href="#">LinkedIn</a></div>
        </div>
      </div>
    </footer>
  );
}

export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, delay, ease: [0.215, 0.61, 0.355, 1] }}
    >
      {children}
    </motion.div>
  );
}
