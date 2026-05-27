// Tailwind-styled overrides for MDX-rendered HTML elements.
// Used by the case study template to apply our typography system to MDX content.

import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-14 font-display text-3xl md:text-4xl tracking-tighter text-ink"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-10 font-display text-xl md:text-2xl tracking-tighter text-ink"
      {...props}
    />
  ),
  p: (props) => (
    <p
      className="mt-5 font-sans text-base md:text-lg text-ink-muted leading-[1.75] max-w-prose"
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className="mt-5 space-y-2 font-sans text-base text-ink-muted leading-relaxed max-w-prose [&_li]:pl-2 [&_li]:relative [&_li]:before:content-['·'] [&_li]:before:absolute [&_li]:before:-left-3 [&_li]:before:text-terracotta"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mt-5 list-decimal space-y-2 pl-5 font-sans text-base text-ink-muted leading-relaxed max-w-prose"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="mt-8 border-l-2 border-sage pl-5 font-display text-xl md:text-2xl tracking-tight text-ink italic"
      {...props}
    />
  ),
  strong: (props) => <strong className="font-medium text-ink" {...props} />,
  code: (props) => (
    <code
      className="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-[0.9em] text-ink"
      {...props}
    />
  ),
  hr: () => <hr className="my-12 border-ink/25" />,
  a: ({ href, ...rest }) => (
    <a
      href={href}
      className="text-terracotta underline underline-offset-4 hover:text-terracotta-deep"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...rest}
    />
  ),
};
