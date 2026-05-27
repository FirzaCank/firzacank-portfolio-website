import Hero from "@/components/sections/Hero";
import Snapshot from "@/components/sections/Snapshot";
import FeaturedExperience from "@/components/sections/FeaturedExperience";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Snapshot />
      <FeaturedExperience />
      <FeaturedProjects />
      <CTA />
    </>
  );
}
