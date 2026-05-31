// Single source of truth for side projects. MDX case study slugs match the `slug` field.
// Client names anonymized per request.

export type ProjectCategory =
  | "data-analyst"
  | "data-engineer"
  | "data-science"
  | "ml-engineer"
  | "ai-engineer"
  | "financial-analyst"
  | "pitch-deck"
  | "dashboard";

export const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  "data-analyst": "Data Analyst",
  "data-engineer": "Data Engineer",
  "data-science": "Data Science",
  "ml-engineer": "ML Engineer",
  "ai-engineer": "AI Engineer",
  "financial-analyst": "Financial Analyst",
  "pitch-deck": "Pitch Deck",
  dashboard: "Dashboard",
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  client: string; // anonymized descriptor
  categories: ProjectCategory[];
  stack: string[];
  year: string;
  featured?: boolean;
  thumbColor?: string; // optional preview color while images are TBD
};

export const PROJECTS: Project[] = [
  {
    slug: "video-platform-data-analysis",
    title: "Video Platform Data Analysis",
    subtitle:
      "Behavior and growth deep dive for an AI gaming clip platform: activation levers that move retention and clip output.",
    client: "AI gaming clip platform",
    categories: ["data-analyst", "dashboard"],
    stack: ["SQL", "Python", "Tableau", "Pitch Deck"],
    year: "2025",
    featured: true,
  },
  {
    slug: "commission-performance-review",
    title: "Affiliate Commission Performance Review & Recovery Plan",
    subtitle:
      "Root-cause analysis of a 34% commission revenue decline: funnel diagnosis, cohort retention, and a two-track recovery playbook for leadership.",
    client: "E-commerce affiliate platform",
    categories: ["data-analyst", "pitch-deck"],
    stack: ["Python", "Excel", "PowerPoint", "Funnel Analysis", "Cohort Analysis"],
    year: "2026",
  },
  {
    slug: "ecommerce-pitch-deck-valuation",
    title: "E-commerce Strategic Valuation & Growth Outlook",
    subtitle:
      "Financial-analyst-led 5-year forecast, DCF, and regional comparable valuation framing the margin re-rating thesis.",
    client: "Indonesian e-commerce platform",
    categories: ["financial-analyst", "pitch-deck"],
    stack: ["Excel", "PowerPoint", "DCF", "Comparable Analysis", "Financial Modeling"],
    year: "2025",
  },
  {
    slug: "nuclear-policy-dna-sna",
    title: "Nuclear Energy Policy Discourse Network Analysis",
    subtitle:
      "Scraping news + social media on Indonesia's nuclear policy, then Gemini-powered DNA + SNA + sentiment analysis dashboard.",
    client: "Policy Research Initiative",
    categories: ["ai-engineer", "data-science", "data-engineer"],
    stack: ["Gemini API", "GCP", "Sentiment Analysis", "MongoDB", "pyvis"],
    year: "2025",
    featured: true,
  },
  {
    slug: "writer-density-index",
    title: "Regional Writing Ecosystem Index (PCA)",
    subtitle:
      "PCA-based composite model (68.2% variance) analyzing regional writing ecosystem strength across Indonesia.",
    client: "Cultural Policy Think Tank",
    categories: ["data-science", "data-analyst"],
    stack: ["scikit-learn", "PCA", "Looker Studio", "Statistical Analysis"],
    year: "2024",
    featured: true,
  },
  {
    slug: "social-media-scraping-integration",
    title: "Social Media Scraping Integration",
    subtitle:
      "Unified scraper for 5 platforms (YouTube, TikTok, Instagram, Facebook, X) on Cloud Run with resumable batches.",
    client: "Marketing research agency",
    categories: ["data-engineer"],
    stack: ["Python", "Cloud Run", "GCS", "APIFY", "Flask", "Docker"],
    year: "2025",
  },
  {
    slug: "google-news-gemini-parser",
    title: "Google News Scraping + Gemini AI Aggregation",
    subtitle:
      "Always-on macro news scraping pipeline on Cloud Run combining Google CSE, APIFY, and Gemini parsing.",
    client: "Macro research desk",
    categories: ["ai-engineer", "data-engineer"],
    stack: ["Python", "Google CSE", "APIFY", "Gemini API", "Cloud Run", "Web Scraping"],
    year: "2025",
    featured: true,
  },
  {
    slug: "debt-collection-analytics",
    title: "Debt Collection Analytics & Agent Productivity",
    subtitle:
      "Ten months of call center data turned into a dashboard + narrative report that reframed a data-quality issue as the real performance lever.",
    client: "Banking collections agency",
    categories: ["data-analyst", "dashboard"],
    stack: ["Python", "Pandas", "Excel", "Looker Studio"],
    year: "2025",
  },
  {
    slug: "heavy-equipment-maintenance-dashboard",
    title: "Heavy Equipment Preventive Maintenance Dashboard",
    subtitle:
      "Cylinder and hose lifecycle dashboard for a mining contractor's Komatsu excavator fleet.",
    client: "Mining contractor",
    categories: ["dashboard", "data-analyst"],
    stack: ["Looker Studio", "Google Sheets", "Excel", "Python"],
    year: "2025",
  },
  {
    slug: "edtech-tableau-course",
    title: "Tableau for Data Analysis 101 Course",
    subtitle:
      "Instructor-built Tableau curriculum with a single retail case study (VoraStore) as the project arc.",
    client: "Indonesian EdTech platform",
    categories: ["data-analyst", "dashboard"],
    stack: ["Tableau", "PowerPoint", "Curriculum Design"],
    year: "2025",
  },
  {
    slug: "govt-statistics-data-platform",
    title: "Government Statistics Data Platform Implementation",
    subtitle:
      "Reference catalog and ingestion layer mapping all 549 BPS office domains for a coordinating ministry.",
    client: "Indonesian coordinating ministry",
    categories: ["data-engineer"],
    stack: ["Python", "BPS Web API", "Javascript", "CSV", "JSON"],
    year: "2025",
  },
  {
    slug: "telco-churn-prediction",
    title: "Telco Customer Churn Prediction (Streamlit)",
    subtitle:
      "End-to-end ML app benchmarking Logistic Regression, Random Forest, and Gradient Boosting on telco subscriber data, deployed live on Streamlit.",
    client: "Self-initiated portfolio project",
    categories: ["data-science", "ml-engineer", "dashboard"],
    stack: ["Python", "Streamlit", "scikit-learn", "Pandas", "Logistic Regression", "Random Forest", "Gradient Boosting"],
    year: "2022",
  },
];

// Order on home: PCA → Nuclear → Video → Google News
const FEATURED_ORDER = [
  "writer-density-index",
  "nuclear-policy-dna-sna",
  "video-platform-data-analysis",
  "google-news-gemini-parser",
];

export const FEATURED_PROJECTS = FEATURED_ORDER.map(
  (slug) => PROJECTS.find((p) => p.slug === slug)!,
);
