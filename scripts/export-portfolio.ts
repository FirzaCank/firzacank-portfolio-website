// Export data/*.ts to data/portfolio.json so Python tool handlers can read it.
// Run with: npm run export-portfolio

import fs from "node:fs";
import path from "node:path";

import { PROJECTS, CATEGORY_LABEL } from "@/data/projects";
import { ROLES } from "@/data/experience";
import {
  BIO_PARAGRAPHS,
  EDUCATION,
  CERTIFICATIONS,
  LANGUAGES,
  SKILL_GROUPS,
  LEADERSHIP,
  ACHIEVEMENTS,
} from "@/data/about";
import { getCaseStudyBySlug } from "@/lib/mdx";

const OUT = path.join(process.cwd(), "data", "portfolio.json");

function clean(s: string): string {
  return s.replace(/&rsquo;/g, "'").replace(/&times;/g, "x");
}

const projects = PROJECTS.map((p) => {
  const cs = getCaseStudyBySlug(p.slug);
  return {
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle,
    client: p.client,
    year: p.year,
    categories: p.categories.map((c) => CATEGORY_LABEL[c]),
    stack: p.stack,
    // Full case study body, if one exists, for get_project_detail.
    detail: cs?.content ?? "",
  };
});

const experience = ROLES.map((r) => ({
  id: r.id,
  company: r.company,
  placement: r.placement ?? null,
  title: r.title,
  period: r.period,
  current: r.current ?? false,
  internship: r.internship ?? false,
  location: r.location,
  summary: clean(r.summary),
  highlights: r.highlights.map(clean),
  stack: r.stack,
}));

const about = {
  bio: BIO_PARAGRAPHS.map(clean),
  education: EDUCATION,
  certifications: CERTIFICATIONS,
  languages: LANGUAGES,
  skills: SKILL_GROUPS,
  leadership: LEADERSHIP,
  achievements: ACHIEVEMENTS,
};

const out = { projects, experience, about };
fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log(
  `Wrote data/portfolio.json: ${projects.length} projects, ${experience.length} roles.`,
);
