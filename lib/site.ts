// Single source of truth for the deployed site URL.
// Override at deploy time with NEXT_PUBLIC_SITE_URL (Vercel env var).

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://firzacank.vercel.app";

export const SITE_NAME = "Firza Chandra Sandjaya Putra";

export const SITE_TAGLINE = "Data & AI Engineer";

export const SITE_DESCRIPTION =
  "Data Engineer, AI Engineer, and ML Engineer with ~4 years of expertise building end-to-end data pipelines, MLOps frameworks, and scalable AI solutions.";
