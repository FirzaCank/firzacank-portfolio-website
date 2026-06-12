import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

export type CaseStudyFrontmatter = {
  slug: string;
  title: string;
  subtitle?: string;
  client?: string;
  year?: string;
  role?: string;
  duration?: string;
  problem?: string;
  outcome?: string;
  stack?: string[];
  tags?: string[];
  liveUrl?: string;
  liveLabel?: string;
  githubUrl?: string;
};

export type CaseStudy = {
  frontmatter: CaseStudyFrontmatter;
  content: string;
};

export function getAllCaseStudySlugs(): string[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getCaseStudyBySlug(slug: string): CaseStudy | null {
  const file = path.join(PROJECTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return {
    frontmatter: { slug, ...(data as Omit<CaseStudyFrontmatter, "slug">) },
    content,
  };
}
