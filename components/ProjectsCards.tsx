import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
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
  details: string[]; // includes emoji prefix like "🗓️ Best time ..."
  badges: string[];
};

const DEFAULT_DESTINATIONS: Destination[] = [];

const ProjectsCards = ({
  image,
  name,
  tagline,
  details,
  badges,
  buttonText = "Plan Your Journey",
  buttonLink = "#",
}: ProjectsCardsProps): React.ReactElement => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const cardDetailsRef = useRef<HTMLDivElement | null>(null);

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = data[currentIndex];

  useEffect(() => {
    const safeCard = cardRef.current as HTMLDivElement | null;
    const safeDetails = cardDetailsRef.current as HTMLDivElement | null;
    if (!safeCard || !safeDetails) return;

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
        console.log(setCurrentIndex(currentIndex));
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
      const rotateY = mouseX * 0.01;
      const rotateX = -mouseY * 0.01;
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    }

    function onMouseLeave() {
      const el = safeCard;
      if (!el) return;
      el.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
    }

    safeCard?.addEventListener("touchstart", onTouchStart);
    safeCard?.addEventListener("touchmove", onTouchMove);
    safeCard?.addEventListener("mousemove", onMouseMove);
    safeCard?.addEventListener("mouseleave", onMouseLeave);

    return () => {
      safeCard?.removeEventListener("touchstart", onTouchStart);
      safeCard?.removeEventListener("touchmove", onTouchMove);
      safeCard?.removeEventListener("mousemove", onMouseMove);
      safeCard?.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [currentIndex]);

  function onCtaClick(
    e: React.MouseEvent | React.TouchEvent<HTMLButtonElement>
  ) {
    e.stopPropagation();
    if (buttonLink) {
      window.open(buttonLink, "_blank");
    }
  }

  return (
    <div className=" overflow-hidden border border-gray-600/40 shadow-2xl shadow-indigo-500/30 rounded-xl">
      <div className="w-full" style={{ perspective: "1000px" }}>
        <motion.div
          ref={cardRef}
          onClick={onCtaClick}
          className="group relative w-full h-[380px] 
          sm:h-[420px] md:h-[450px] overflow-hidden 
          hover:rounded-xl rounded-xl cursor-pointer transition-transform duration-500 shadow-[0_15px_35px_rgba(0,0,0,0.2)]  "
        >
          <Image
            width={1000}
            height={1000}
            src={current.image}
            alt={current.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-105"
          />

          {/* Top gradient overlay (replaces ::after) */}
          <div className="pointer-events-none absolute inset-0 bg-gradient -to-t from-black/70 to-transparent via-transparent/0 z-[1]" />

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 w-full p-[30px] text-white z-[2] translate-y-10 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-y-0">
            <div className="flex mb-[15px]">
              {current.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="mr-2 rounded-[20px] bg-white/20 px-3 py-1 text-[0.8rem] backdrop-blur-[5px]"
                >
                  {badge}
                </span>
              ))}
            </div>
            <h2 className="mb-[5px] font-bold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.4)] text-[1.7rem] sm:text-[2rem] md:text-[2.5rem]">
              {current.name}
            </h2>
            <p className="mb-[20px] text-[0.9rem] sm:text-[1.1rem] text-white/90 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.4)]">
              {current.tagline}
            </p>
          </div>

          {/* Sliding details panel */}
          <motion.div
            whileHover={{ borderRadius: "0.6rem" }}
            ref={cardDetailsRef}
            className="absolute inset-0 z-[3] flex flex-col justify-center text-white  bg-gradient-to-br from-indigo-700 via-violet-700/95 to-purple-700/65 p-[25px] md:p-[40px] translate-x-full opacity-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0 group-hover:opacity-100 hover:shadow-[0_15px_35px_rgba(0,0,0,0.3)] hover:rounded-2xl"
          >
            <h3 className="relative mb-[15px] font-bold text-[1.5rem] sm:text-[1.8rem] md:text-[2rem] after:absolute after:-bottom-2 after:left-0 after:h-[3px] after:w-[60px] after:bg-white">
              Discover {current.name.split(",")[0]}
            </h3>
            {current.details.map((detail, idx) => {
              const spaceIdx = detail.indexOf(" ");
              const icon = spaceIdx > -1 ? detail.substring(0, spaceIdx) : "";
              const text =
                spaceIdx > -1 ? detail.substring(spaceIdx + 1) : detail;
              return (
                <div
                  key={idx}
                  className="flex items-center my-[12px] translate-y-[20px] opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100"
                  style={{ transitionDelay: `${(idx + 1) * 100}ms` }}
                >
                  <div className="mr-[15px] text-[1.2rem]">{icon}</div>
                  <div className="text-[0.9rem] md:text-[1rem] font-medium">
                    {text}
                  </div>
                </div>
              );
            })}

            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={onCtaClick}
              className="mt-[25px] cursor-pointer self-start rounded-[30px] bg-white px-[20px] md:px-[25px] py-[10px] md:py-[12px] text-[0.9rem] md:text-[1rem] font-semibold uppercase text-indigo-700 shadow-[0_5px_15px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              {buttonText}
            </motion.button>
          </motion.div>

          {/* Swipe indicator */}
          <div className="absolute top-1/2 -translate-y-1/2 right-[20px] z-[4] flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white/20 opacity-0 transition-all duration-100 group-hover:opacity-100 animate-pulse">
            <i className="text-white text-[1.7rem]">→</i>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectsCards;
