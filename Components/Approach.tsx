"use client";
import React from "react";

import { AnimatePresence, motion } from "motion/react";
import { CanvasRevealEffect } from "@/Components/ui/CanvasRevealEffect";

const Approuch = () => {
  return (
    <>
      <section className="w-full py-20">
        <h1 className="heading">
          My <span className="text-purple-500">approach</span>
        </h1>
        <div className="my-20 flex flex-col lg:flex-row items-center justify-center gap-4">
          <Card
            title="Planning & Strategy"
            icon={<AceternityIcon order="phase 1" />}
            description="We'll collaborate to map out your website's goals, target audience, and key functionalities. We'll discuss things like site structure, navigation, and content requirements."
          >
            <CanvasRevealEffect
              animationSpeed={5.1}
              containerClassName="bg-emerald-900"
            />
          </Card>
          <Card
            title="Development & Progress Update"
            icon={<AceternityIcon order="phase 2" />}
            description="Once we agree on the plan, I cue my lofi playlist and dive into coding. From initial sketches to polished code, I keep you updated every step of the way."
          >
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-black"
              colors={[
                [236, 72, 153],
                [232, 121, 249],
              ]}
              dotSize={2}
            />
            {/* Radial gradient for the cute fade */}
            <div className="absolute inset-0 [mask-image:radial-gradient(400px_at_center,white,transparent)] bg-black/50 dark:bg-black/90" />
          </Card>
          <Card
            title="Development & Launch"
            icon={<AceternityIcon order="phase 3" />}
            description="This is where the magic happens! Based on the approved design, I'll translate everything into functional code, building your website from the ground up."
          >
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-sky-600"
              colors={[[125, 211, 252]]}
            />
          </Card>
        </div>
      </section>
    </>
  );
};

const Card = ({
  title,
  icon,
  children,
  description,
}: {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  description?: string;
}) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered(!hovered)}
      className="border border-black/[0.2] group/canvas-card flex items-center justify-center dark:border-white/[0.2] max-w-sm w-full mx-auto p-4 relative lg:h-[35rem] h-[25rem] rounded-3xl cursor-pointer"
    >
      <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full absolute inset-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center">
        <motion.div
          className="text-center w-full mx-auto flex items-center justify-center"
          animate={{
            opacity: hovered ? 0 : 1,
            y: hovered ? -20 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
        <motion.h2
          className="dark:text-white relative z-10 text-black mt-4 font-bold text-white text-center text-xl sm:text-2xl md:text-3xl px-4"
          animate={{
            opacity: hovered ? 1 : 0,
            y: hovered ? 0 : 20,
          }}
          transition={{ duration: 0.2 }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="text-sm dark:text-white relative z-10 text-black mt-4 font-medium text-white text-center px-4"
          style={{ color: "#e4ecff" }}
          animate={{
            opacity: hovered ? 1 : 0,
            y: hovered ? 0 : 20,
          }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          {description}
        </motion.p>
      </div>
    </div>
  );
};

const AceternityIcon = ({ order }: { order: string }) => {
  return (
    <div>
      <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 ">
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] " />
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-5 py-4 font-bold  text-white backdrop-blur-3xl text-2xl">
          {order}
        </span>
      </button>
    </div>
  );
};

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
export default Approuch;
