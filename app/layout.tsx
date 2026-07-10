import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import localFont from "next/font/local";
import "@/styles/globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/ui/ChatWidgetLazy";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_TAGLINE } from "@/lib/site";
import { SOCIAL_LINKS } from "@/data/nav";
import { Analytics } from "@vercel/analytics/next";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  axes: ["opsz", "wdth"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const satoshi = localFont({
  src: [
    { path: "../public/fonts/Satoshi-Variable.woff2" },
    { path: "../public/fonts/Satoshi-Variable.woff" },
  ],
  variable: "--font-satoshi",
  display: "swap",
  weight: "300 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
  keywords: [
    "data engineer",
    "AI engineer",
    "machine learning engineer",
    "MLOps engineer",
    "data pipeline",
    "ETL developer",
    "PySpark",
    "data analyst",
    "data scientist",
    "dashboard developer",
    "pitch deck designer",
    "freelance data engineer",
    "freelance data analyst",
    "freelance AI engineer",
    "hire data engineer Jakarta",
    "data consultant Indonesia",
    "Jakarta",
    "Indonesia",
    "Firza Chandra",
    "Firza Chandra Sandjaya Putra",
  ],
};

const SAME_AS = [
  SOCIAL_LINKS.linkedin,
  SOCIAL_LINKS.github,
  SOCIAL_LINKS.tableau,
  SOCIAL_LINKS.hackerrank,
  SOCIAL_LINKS.youtube,
  SOCIAL_LINKS.lynk,
  SOCIAL_LINKS.fastwork,
  SOCIAL_LINKS.projectsCoId,
];

const SKILLS = [
  "Data Engineering",
  "AI Engineering",
  "Machine Learning Engineering",
  "MLOps",
  "ETL Pipeline Development",
  "PySpark",
  "Apache Airflow",
  "Snowflake",
  "BigQuery",
  "Data Analysis",
  "Data Science",
  "Dashboard Development",
  "Pitch Deck Design",
  "Recommendation Systems",
  "Cloud Data Platforms (AWS, GCP)",
];

// Person: who Google should associate with branded + skill queries.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: SITE_NAME,
  url: SITE_URL,
  jobTitle: "Data & AI Engineer",
  description: SITE_DESCRIPTION,
  email: `mailto:${SOCIAL_LINKS.email}`,
  image: `${SITE_URL}/opengraph-image`,
  worksFor: { "@type": "Organization", name: "Hypefast" },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Bandung Institute of Technology (ITB)",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Jakarta",
    addressCountry: "ID",
  },
  knowsAbout: SKILLS,
  sameAs: SAME_AS,
};

// ProfessionalService: signals freelance/hire intent for commercial queries.
const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#service`,
  name: `${SITE_NAME} - Freelance Data & AI Engineering`,
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  description:
    "Freelance data engineering, data analysis, dashboards, pitch decks, and AI/ML engineering for teams that need production-grade data and AI solutions.",
  provider: { "@id": `${SITE_URL}/#person` },
  areaServed: "Worldwide",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Jakarta",
    addressCountry: "ID",
  },
  knowsAbout: SKILLS,
  sameAs: SAME_AS,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable} ${satoshi.variable}`}>
      <body className="font-sans bg-beige text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-beige-card"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main" className="pt-16 md:pt-20">
          {children}
        </main>
        <Footer />
        <ChatWidget />
        <Analytics />
      </body>
    </html>
  );
}
