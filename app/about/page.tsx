import type { Metadata } from "next";
import AboutIntro from "@/components/sections/AboutIntro";
import EducationLanguages from "@/components/sections/EducationLanguages";
import Leadership from "@/components/sections/Leadership";
import SkillsOverview from "@/components/sections/SkillsOverview";
import CTA from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "About",
  description:
    "Firza Chandra Sandjaya Putra is a Data & AI Engineer based in Jakarta. Background in Industrial Engineering at ITB, with parallel freelance practice across analytics, dashboards, pitch decks, and AI.",
};

export default function AboutPage() {
  return (
    <>
      <AboutIntro />
      <EducationLanguages />
      <Leadership />
      <SkillsOverview />
      <CTA />
    </>
  );
}
