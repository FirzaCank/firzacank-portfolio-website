import type { Metadata } from "next";
import ExperienceIntro from "@/components/sections/ExperienceIntro";
import ExperienceTimeline from "@/components/sections/ExperienceTimeline";
import CTA from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Data engineering experience across Hypefast, IDstar at XL Axiata, and Telkom Indonesia - production data pipelines, ML systems, and telco-scale analytics platforms processing 1B+ daily records.",
  keywords: [
    "data engineer experience",
    "PySpark ETL",
    "Medallion architecture",
    "Snowflake",
    "BigQuery",
    "MLOps",
    "telco data engineering",
    "recommendation systems",
    "Firza Chandra data engineer",
  ],
  alternates: { canonical: "/experience" },
  openGraph: {
    title: "Experience | Firza Chandra Sandjaya Putra",
    description:
      "Production data systems, ML pipelines, and analytics platforms across Hypefast, XL Axiata, and Telkom Indonesia.",
    type: "profile",
    url: "/experience",
  },
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
