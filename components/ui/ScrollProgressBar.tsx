"use client"
import React, { useEffect, useRef, useState } from "react";
type Props = {
  height?: string; 
  blur?: boolean;
  zIndex?: number;
  className?: string;
};

export default function ScrollProgressBar({
  height = "h-1",
  blur = true,
  zIndex = 50,
  className = "",
}: Props) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function update() {
      const scrollTop = window.scrollY || window.pageYOffset;
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        document.documentElement.clientHeight
      );
      const winHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const total = docHeight - winHeight;
      const pct = total > 0 ? Math.min(100, (scrollTop / total) * 100) : 0;
      setProgress(pct);
      rafRef.current = prefersReduced ? null : requestAnimationFrame(update);
    }
    update();

   
    const onScroll = () => {
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(() => {
          const scrollTop = window.scrollY || window.pageYOffset;
          const docHeight = Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight,
            document.documentElement.clientHeight
          );
          const winHeight =
            window.innerHeight || document.documentElement.clientHeight;
          const total = docHeight - winHeight;
          const pct = total > 0 ? Math.min(100, (scrollTop / total) * 100) : 0;
          setProgress(pct);
          rafRef.current = null;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);


  const fillStyle: React.CSSProperties = {
    transform: `scaleX(${progress / 100})`,
    transformOrigin: "left center",
    transition: "transform 180ms linear",
    background:
      "linear-gradient(90deg, rgba(128,0,128,0) 0%, rgba(124,58,237,0.95) 100%)",
    height: "100%",
  };

  const containerStyle: React.CSSProperties =
    typeof height === "string" && height.endsWith("px") ? { height } : {};

  return (
    <div
      aria-hidden
      className={`fixed left-0 top-0 w-full pointer-events-none ${className}`}
      style={{ zIndex }}
    >
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        className={`w-full ${height} ${
          blur ? "backdrop-blur-sm" : ""
        } bg-transparent`}
        style={containerStyle}
      >
        <div className="h-full origin-left" style={fillStyle} />
      </div>
      <div
        className="w-full"
        style={{ height: 1, marginTop: -1, opacity: 0.25 }}
      >
        <div className="w-full h-px bg-gradient-to-r from-transparent to-transparent" />
      </div>
    </div>
  );
}