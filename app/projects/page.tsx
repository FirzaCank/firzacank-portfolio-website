import type { Metadata } from "next";
import ProjectsIntro from "@/components/sections/ProjectsIntro";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import CTA from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Freelance and client projects across data analysis, dashboards, pitch decks, and AI engineering.",
};

export default function ProjectsPage() {
  return (
    <>
      <ProjectsIntro />
      <ProjectsGrid />
      <CTA />
    </>
  );
}
