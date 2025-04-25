import Hero from "@/Components/Hero";
import { FloatingNav } from "@/Components/ui/floating-navbar";
import { navItems } from "@/data";
import Grid from "@/Components/Grid"
import RecentProjects from "@/Components/RecentProjects";
import Clients from "@/Components/Clients";
import Experience from "@/Components/Experience";
import Approach from "@/Components/Approach";
import Footer from "@/Components/Footer";
export default function Home() {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-clip mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems} />
        <Hero />
        <Grid />
          <RecentProjects />
        <Clients />
        <Experience/>
        <Approach/>
        <Footer/>
      </div>
    </main>
  );
}