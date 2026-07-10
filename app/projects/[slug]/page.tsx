import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getAllCaseStudySlugs, getCaseStudyBySlug } from "@/lib/mdx";
import { mdxComponents } from "@/components/mdx-components";
import CaseStudyHeader from "@/components/sections/CaseStudyHeader";
import CaseStudyNav from "@/components/sections/CaseStudyNav";
import SlideGallery from "@/components/sections/SlideGallery";
import CTA from "@/components/sections/CTA";
import { DECKS, DECK_SLUG_TO_FOLDER, SCREENSHOTS } from "@/data/decks";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export function generateStaticParams() {
  return getAllCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) return {};
  const { title, subtitle, stack } = study.frontmatter;
  return {
    title,
    description: subtitle,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      title,
      description: subtitle,
      type: "article",
      url: `/projects/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: subtitle,
    },
    keywords: stack,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) notFound();

  const fm = study.frontmatter;
  const caseStudyJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: fm.title,
    headline: fm.title,
    description: fm.subtitle ?? fm.problem ?? undefined,
    url: `${SITE_URL}/projects/${slug}`,
    image: `${SITE_URL}/projects/${slug}/opengraph-image`,
    keywords: [...(fm.stack ?? []), ...(fm.tags ?? [])].join(", ") || undefined,
    dateCreated: fm.year || undefined,
    creator: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: SITE_NAME,
    },
    about: fm.client || undefined,
  };

  // mirrors the visual breadcrumb in CaseStudyHeader
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Projects", item: `${SITE_URL}/projects` },
      { "@type": "ListItem", position: 3, name: fm.title, item: `${SITE_URL}/projects/${slug}` },
    ],
  };

  const deck = DECKS[slug];
  const deckFolder = DECK_SLUG_TO_FOLDER[slug];
  const screenshots = SCREENSHOTS[slug];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudyJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CaseStudyHeader fm={study.frontmatter} />
      <article className="mx-auto max-w-container px-6 md:px-10 pb-12 md:pb-16">
        <div className="border-t border-ink/10 pt-8">
          <MDXRemote
            source={study.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
              },
            }}
          />
        </div>
      </article>
      {deck && deckFolder && (
        <SlideGallery
          slug={deckFolder}
          slides={deck.slides}
          pdfFile={deck.pdfFile}
          pdfLabel={deck.pdfLabel}
          title={deck.title}
        />
      )}
      {screenshots && (
        <SlideGallery
          images={screenshots.images}
          title={screenshots.title}
          eyebrow={screenshots.eyebrow}
        />
      )}
      <CaseStudyNav currentSlug={slug} />
      <CTA />
    </>
  );
}
