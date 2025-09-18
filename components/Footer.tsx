"use client";
import { FaLocationArrow } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";
import MagicButton from "@/components/ui/MagicButton";
import RotatingText from "./ui/RotatingText";
import { motion } from "motion/react";
import { TextShimmer } from "./ui/TextShimmerComponent";
import SocialIcons from "./ui/SocialIcons";
const Footer = () => {
  return (
    <>
      <footer className="w-full pt-20 pb-10" id="contact">
        {/* background grid */}
        <div className="w-full absolute left-0 -bottom-72 min-h-96">
          <Image
            width={10000}
            height={10000}
            src="/footer-grid.svg"
            alt="grid"
            className="w-full h-full opacity-50 "
          />
        </div>

        <motion.div layout className="flex flex-col items-center ">
          <h1 className="heading lg:max-w-[45vw]">
            <h1 className="-translate-y-5 inline-block">Ready to take your</h1>{" "}
            <div className="inline-block -translate-y-5">
              <RotatingText
                texts={["professional", "brand", "Web", "Modern"]}
                mainClassName=" sm:px-2 md:px-3 bg-purple-600 text-white overflow-hidden  sm:py-2 md:py-2 justify-center rounded-lg "
                staggerFrom={"last"}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{
                  y: "-120%",
                  opacity: 0,
                  transition: { duration: 0.2, ease: "easeInOut" },
                }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
                auto={true}
                loop={true}
                initialWidth={100}
                widthTransition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 200,
                }}
                fixedWidths={["w-80", "w-40", "w-35", "w-52"]}
              />
            </div>
            <br />
            presence to the next level?
          </h1>

          <p className="text-gray-400 md:mt-10 my-5 text-center">
            Reach out to me today and let&apos;s discuss how I can help you
            achieve your goals.
          </p>
          <Link href=".">
            <MagicButton
              title="Let's get in touch"
              icon={<FaLocationArrow />}
              position="right"
            />
          </Link>
        </motion.div>
        <div className="flex mt-16 md:flex-row flex-col justify-between items-center">
          <p className="md:text-base text-sm md:font-normal font-light ">
            <TextShimmer
              spread={22}
              duration={3}
              className="font-bold [--base-color:var(--color-gray-600)] [--base-gradient-color:var(--color-gray-100)] dark:[--base-color:var(--color-gray-600)] dark:[--base-gradient-color:var(--color-white)] 
              max-sm:-translate-y-6"
            >
              {" "}
              Copyright © 2025 Abdullah Khazna Katbi
            </TextShimmer>
          </p>

          <div className="flex items-center md:gap-3 gap-6">
            <SocialIcons></SocialIcons>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
