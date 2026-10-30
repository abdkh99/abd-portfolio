"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

interface ProjectsCardsProps {
  image?: string;
  name?: string;
  tagline?: string;
  details?: string[];
  badges?: string[];
  buttonText?: string;
  buttonLink?: string;
}

type Destination = {
  name: string;
  tagline: string;
  image: string;
  details: string[];
  badges: string[];
};

const DEFAULT_DESTINATIONS: Destination[] = [];

const ProjectsCards = ({
  image,
  name,
  tagline,
  details,
  badges,
  buttonText = "View Project",
  buttonLink = "#",
}: ProjectsCardsProps): React.ReactElement => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const cardDetailsRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  const provided = useMemo<Destination | null>(() => {
    if (!image || !name || !tagline) return null;
    return {
      image,
      name,
      tagline,
      details: details ?? [],
      badges: badges ?? [],
    };
  }, [image, name, tagline, details, badges]);

  const data = provided ? [provided] : DEFAULT_DESTINATIONS;
  const current = data[0];

  useEffect(() => {
    const safeCard = cardRef.current;
    const safeDetails = cardDetailsRef.current;
    if (!safeCard || !safeDetails || reducedMotion) return;

    let startX = 0;

    function onTouchStart(e: TouchEvent) {
      startX = e.touches[0].clientX;
    }

    function onTouchMove(e: TouchEvent) {
      const moveX = e.touches[0].clientX;
      const diff = startX - moveX;
      if (diff > 50 && safeDetails) {
        safeDetails.style.transform = "translateX(0)";
        safeDetails.style.opacity = "1";
      }
      if (diff < -50 && safeDetails) {
        safeDetails.style.transform = "translateX(100%)";
        safeDetails.style.opacity = "0";
      }
    }

    function onMouseMove(e: MouseEvent) {
      const el = safeCard;
      if (!el) return;
      const cardRect = el.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      const mouseX = e.clientX - cardCenterX;
      const mouseY = e.clientY - cardCenterY;
      const rotateY = mouseX * 0.008;
      const rotateX = -mouseY * 0.008;
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;
    }

    function onMouseLeave() {
      const el = safeCard;
      if (!el) return;
      el.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
    }

    safeCard.addEventListener("touchstart", onTouchStart);
    safeCard.addEventListener("touchmove", onTouchMove);
    safeCard.addEventListener("mousemove", onMouseMove);
    safeCard.addEventListener("mouseleave", onMouseLeave);

    return () => {
      safeCard.removeEventListener("touchstart", onTouchStart);
      safeCard.removeEventListener("touchmove", onTouchMove);
      safeCard.removeEventListener("mousemove", onMouseMove);
      safeCard.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [reducedMotion]);

  function onCtaClick(
    e: React.MouseEvent | React.TouchEvent<HTMLButtonElement>
  ) {
    e.stopPropagation();
    if (buttonLink) {
      window.open(buttonLink, "_blank", "noopener,noreferrer");
    }
  }

  if (!current) {
    return <div className="min-h-[12rem] rounded-xl border border-[var(--border-strong)]/40" />;
  }

  const panelTransition = reducedMotion ? "duration-200" : "duration-300";
  const imageScale = reducedMotion ? "" : "group-hover:scale-[1.03]";

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border-strong)]/60 shadow-lg shadow-purple-900/15">
      <div className="w-full" style={{ perspective: "1000px" }}>
        <motion.div
          ref={cardRef}
          onClick={onCtaClick}
          className="group relative aspect-video h-fit w-full cursor-pointer overflow-hidden rounded-xl shadow-[0_12px_28px_rgba(0,0,0,0.25)] transition-transform duration-300"
        >
          <Image
            fill
            src={current.image}
            alt={current.name}
            className={`absolute inset-0 h-full w-full object-cover opacity-95 transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${imageScale}`}
          />

          <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          <div
            className={`absolute bottom-0 left-0 z-[2] w-full p-6 text-white transition-transform ease-[cubic-bezier(0.23,1,0.32,1)] md:p-8 ${panelTransition} ${reducedMotion ? "translate-y-0" : "translate-y-6 group-hover:translate-y-0"}`}
          >
            <div className="mb-3 flex flex-wrap gap-2">
              {current.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur-[4px] md:text-sm"
                >
                  {badge}
                </span>
              ))}
            </div>
            <h2 className="mb-1 text-xl font-bold text-white drop-shadow-md sm:text-2xl md:text-[1.75rem]">
              {current.name}
            </h2>
            <p className="text-sm text-white/90 drop-shadow-sm sm:text-base md:max-w-[90%]">
              {current.tagline}
            </p>
          </div>

          <motion.div
            ref={cardDetailsRef}
            className={`absolute inset-0 z-[3] flex flex-col justify-center bg-gradient-to-br from-violet-950/95 via-purple-900/95 to-[var(--background-card)] p-6 text-white transition-all ease-[cubic-bezier(0.23,1,0.32,1)] md:p-10 ${panelTransition} ${reducedMotion ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`}
          >
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-purple-200/80">
              Project overview
            </p>
            <h3 className="relative mb-4 text-lg font-bold sm:text-xl md:text-2xl after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-12 after:bg-purple-300/90">
              {current.name}
            </h3>
            {current.details.map((detail, idx) => {
              const spaceIdx = detail.indexOf(" ");
              const icon = spaceIdx > -1 ? detail.substring(0, spaceIdx) : "";
              const text =
                spaceIdx > -1 ? detail.substring(spaceIdx + 1) : detail;
              return (
                <div
                  key={idx}
                  className={`my-2 flex items-start gap-3 text-sm md:text-base ${reducedMotion ? "opacity-100" : "translate-y-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"}`}
                  style={
                    reducedMotion ? undefined : { transitionDelay: `${(idx + 1) * 80}ms` }
                  }
                >
                  {icon ? (
                    <span className="mt-0.5 shrink-0 text-base" aria-hidden>
                      {icon}
                    </span>
                  ) : null}
                  <span className="font-medium leading-snug text-white/95">
                    {text}
                  </span>
                </div>
              );
            })}

            <motion.button
              type="button"
              whileTap={reducedMotion ? undefined : { scale: 0.98 }}
              whileHover={reducedMotion ? undefined : { scale: 1.02 }}
              onClick={onCtaClick}
              className="mt-6 cursor-pointer self-start rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-purple-800 shadow-md transition-colors duration-200 hover:bg-purple-50 md:px-6 md:py-3 md:text-base"
            >
              {buttonText}
            </motion.button>
          </motion.div>

          {!reducedMotion && (
            <div
              aria-hidden
              className="absolute right-5 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="h-5 w-5 text-white"
                animate={{ x: [0, 3, 0] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14M13 6l6 6-6 6"
                />
              </motion.svg>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectsCards;
