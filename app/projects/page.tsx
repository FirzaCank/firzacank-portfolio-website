import type { Metadata } from "next";
import ProjectsIntro from "@/components/sections/ProjectsIntro";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import CTA from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Freelance and client projects across data analysis, dashboards, pitch decks, data science, and AI engineering — production-grade deliverables for startups and enterprises.",
  keywords: [
    "freelance data analyst projects",
    "freelance pitch deck designer",
    "dashboard development",
    "data science portfolio",
    "AI engineering projects",
    "hire freelance data engineer",
    "data consultant Indonesia",
    "Firza Chandra projects",
  ],
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | Firza Chandra Sandjaya Putra",
    description:
      "Freelance and client work across data analysis, dashboards, pitch decks, and AI engineering.",
    type: "website",
    url: "/projects",
  },
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
