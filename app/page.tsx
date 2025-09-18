"use client";
import Hero from "@/components/Hero";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { navItems } from "@/data";
import Grid from "@/components/BentoGrid";
import RecentProjects from "@/components/RecentProjects";
import Clients from "@/components/Clients";
import Experience from "@/components/WorkExperience";
import Approach from "@/components/Approach";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";


export default function Home() {
  return (
    <>
      <ScrollProgressBar height="h-1" blur/>
      <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-clip mx-auto sm:px-10 px-5">
        <div className="max-w-[1500px] w-full">
          <FloatingNav navItems={navItems} />
          <Hero />
          <Grid />
          <RecentProjects />
          <Clients />
          <Experience />
          <Approach />
          <Footer />
        </div>
      </main>
    </>
  );
}
