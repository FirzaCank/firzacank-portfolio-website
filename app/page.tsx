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
      <div className="mx-auto max-w-container px-6 md:px-10 pb-10 md:pb-14 text-center">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-ink-muted/70">
          Firza Chandra Sandjaya Putra · Jakarta, Indonesia
        </p>
      </div>
    </>
  );
}
