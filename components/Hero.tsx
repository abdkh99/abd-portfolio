"use client";
import * as React from "react";
import CVButton from "./ui/CVButton";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Spotlight } from "./ui/spotlight-new";
import { GradualSpacing } from "./ui/Gradual-spacing";

const Hero = () => {
  return (
    <>
      <div className="pb-20 pt-36 relative">
        <div className="absolute inset-0 z-10">
          <Spotlight
            gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(286, 79.50%, 67.50%, 0.08) 0, hsla(288, 100.00%, 55.10%, 0.02) 50%, hsla(210, 100%, 45%, 0) 80%)"
            gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(0, 100.00%, 85.10%, 0.06) 0, hsla(325, 100.00%, 55.10%, 0.02) 80%, transparent 100%)"
            gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(249, 100.00%, 85.10%, 0.04) 0, hsla(249, 100.00%, 45.10%, 0.02) 80%, transparent 100%)"
          />
        </div>

        <div className="absolute top-0 left-0 flex h-screen w-full items-center justify-center bg-white/[0.03] dark:bg-[#000319]">
          <div
            className={cn(
              "absolute inset-0 left-0 top-0 w-[full] ",
              "[background-size:25px_20px]",
              "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
              "dark:[background-image:radial-gradient(#404040_0.8px,transparent_1px)]"
            )}
          />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-[#000319]" />
        </div>
        <div className="flex justify-center relative my-20 z-10">
          <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
            <GradualSpacing
              duration={0.8}
              mainClassName="uppercase mb-2 text-xs text-center  text-blue-100 max-w-80"
              text="Dynamic Web Magic with Next.js"
            />
            <GradualSpacing
              duration={0.8}
              mainClassName="text-3xl md:text-5xl  font-bold tracking-tighter lg:text-6xl text-white  text-center"
              text="Transforming Concepts into Seamless"
            />
            <motion.div
              initial="hidden"
              animate="visible"
              className="text-center mb-5"
            >
              <div className="text-transparent  bg-clip-text bg-gradient-to-r   from-violet-500     to-indigo-400  block text-3xl md:text-5xl lg:text-6xl font-bold">
                <GradualSpacing
                  duration={0.8}
                  text="User Experience"
                  mainClassName=""
                ></GradualSpacing>
              </div>
            </motion.div>
            <GradualSpacing
              duration={0.7}
              mainClassName="text-md  text-center md:text-lg lg:text-xl text-white mb-10 tracking-tighter"
              text="Hi, I'm Abd Kh, a Next.js Developer based in Syria."
            />
            <CVButton />
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
