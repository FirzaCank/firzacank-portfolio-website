// Central source of truth for navigation items.

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; sublabel?: string; href: string }[];
};

export const NAV_ITEMS: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

export const CV_URL = "/firza-cv.pdf"; // English CV
export const CV_URL_JA = "/firza-cv-ja.xlsx"; // Japanese resume (履歴書・職務経歴書), Excel format

export const SOCIAL_LINKS = {
  email: "firzasandjaya@gmail.com",
  lynk: "https://lynk.id/firzacank",
  linkedin: "https://linkedin.com/in/firzaputra/",
  github: "https://github.com/FirzaCank",
  tableau: "https://public.tableau.com/app/profile/firza.putra/vizzes",
  hackerrank: "https://hackerrank.com/profile/firzasandjaya",
  youtube: "https://www.youtube.com/@firzachandra4169",
  fastwork: "https://fastwork.id/user/firzachan/data-analysis-18839765",
  projectsCoId: "https://projects.co.id/public/browse_users/view/62a95c/cankcimen12",
};

