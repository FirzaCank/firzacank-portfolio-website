import type { Metadata } from "next";
import ExperienceIntro from "@/components/sections/ExperienceIntro";
import ExperienceTimeline from "@/components/sections/ExperienceTimeline";
import CTA from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Fulltime data engineering experience across Hypefast, IDstar at XL Axiata, and Telkom Indonesia. Production data systems, ML pipelines, and analytics platforms.",
};

export default function ExperiencePage() {
  return (
    <>
      <ExperienceIntro />
      <ExperienceTimeline />
      <CTA />
    </>
  );
}
