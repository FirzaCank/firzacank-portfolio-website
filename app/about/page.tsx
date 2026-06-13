import type { Metadata } from "next";
import AboutIntro from "@/components/sections/AboutIntro";
import EducationLanguages from "@/components/sections/EducationLanguages";
import Leadership from "@/components/sections/Leadership";
import Achievements from "@/components/sections/Achievements";
import SkillsOverview from "@/components/sections/SkillsOverview";
import CTA from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "About",
  description:
    "Firza Chandra Sandjaya Putra is a Data & AI Engineer based in Jakarta. Industrial Engineering at ITB, with a parallel freelance practice across analytics, dashboards, pitch decks, and AI engineering.",
  keywords: [
    "Firza Chandra Sandjaya Putra",
    "data engineer Jakarta",
    "AI engineer Indonesia",
    "ITB Industrial Engineering",
    "freelance data and AI engineer",
    "MLOps engineer",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About | Firza Chandra Sandjaya Putra",
    description:
      "Data & AI Engineer based in Jakarta with a freelance practice across analytics, dashboards, pitch decks, and AI.",
    type: "profile",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutIntro />
      <EducationLanguages />
      <Leadership />
      <Achievements />
      <SkillsOverview />
      <CTA />
    </>
  );
}
