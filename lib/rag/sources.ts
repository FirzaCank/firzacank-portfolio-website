// Turns all portfolio data into labeled documents ready for chunking.
// Replaces the old single-blob context with per-document sources so retrieval
// can pull only the relevant pieces and cite them.

import { getAllCaseStudySlugs, getCaseStudyBySlug } from "@/lib/mdx";
import { BIO_PARAGRAPHS, EDUCATION, CERTIFICATIONS, LANGUAGES, SKILL_GROUPS, LEADERSHIP, ACHIEVEMENTS } from "@/data/about";
import { ROLES } from "@/data/experience";
import { PROJECTS, CATEGORY_LABEL } from "@/data/projects";

export type Doc = { source: string; text: string };

function stripMdx(s: string): string {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#*_`>|]/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

export function getDocs(): Doc[] {
  const docs: Doc[] = [];

  docs.push({
    source: "About Firza",
    text: [
      BIO_PARAGRAPHS.join("\n").replace(/&rsquo;/g, "'").replace(/&times;/g, "x"),
      "Education: " + EDUCATION.map((e) => `${e.degree}, ${e.faculty}, ${e.institution} (${e.period}). Thesis: ${e.thesis?.title}`).join("; "),
      "Certifications: " + CERTIFICATIONS.map((c) => `${c.name} (${c.issuer})`).join("; "),
      "Languages: " + LANGUAGES.map((l) => `${l.name}: ${l.level}`).join("; "),
      "Skills: " + SKILL_GROUPS.map((g) => `${g.group}: ${g.items.join(", ")}`).join(". "),
      "Leadership: " + LEADERSHIP.map((l) => `${l.role} at ${l.organization} (${l.context}): ${l.highlights.join(" ")}`).join(" "),
      "Achievements: " + ACHIEVEMENTS.map((a) => `${a.title}, ${a.context} (${a.issuer})`).join("; "),
    ].join("\n\n"),
  });

  for (const r of ROLES) {
    const header = `${r.title} at ${r.company}${r.placement ? ` (${r.placement})` : ""}, ${r.period}${r.current ? " (current role)" : ""}. Location: ${r.location}.`;
    // One doc per highlight so retrieval can pinpoint a specific achievement.
    for (const highlight of r.highlights) {
      docs.push({
        source: `Experience: ${r.title} at ${r.company}`,
        text: `${header}\n${r.summary}\n${highlight}\nStack: ${r.stack.join(", ")}.`,
      });
    }
    // Overview doc covers summary + full stack for broad queries ("companies", "career start").
    docs.push({
      source: `Experience: ${r.title} at ${r.company}`,
      text: `${header}\n${r.summary}\nStack: ${r.stack.join(", ")}.`,
    });
  }

  for (const p of PROJECTS) {
    const cs = getCaseStudyBySlug(p.slug);
    docs.push({
      source: `Project: ${p.title}`,
      text: [
        `${p.title} (${p.year}) for ${p.client}. ${p.subtitle}`,
        `Categories: ${p.categories.map((c) => CATEGORY_LABEL[c]).join(", ")}. Stack: ${p.stack.join(", ")}.`,
        cs ? stripMdx(cs.content) : "",
      ].filter(Boolean).join("\n\n"),
    });
  }

  // safety: ensure every case study slug is covered even if not in PROJECTS
  const covered = new Set(PROJECTS.map((p) => p.slug));
  for (const slug of getAllCaseStudySlugs()) {
    if (covered.has(slug)) continue;
    const cs = getCaseStudyBySlug(slug);
    if (cs) docs.push({ source: `Project: ${cs.frontmatter.title}`, text: stripMdx(cs.content) });
  }

  return docs;
}
