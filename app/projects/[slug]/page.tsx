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
  return {
    title: study.frontmatter.title,
    description: study.frontmatter.subtitle,
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

  const deck = DECKS[slug];
  const deckFolder = DECK_SLUG_TO_FOLDER[slug];
  const screenshots = SCREENSHOTS[slug];

  return (
    <>
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
