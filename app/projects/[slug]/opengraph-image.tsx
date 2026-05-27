import { ImageResponse } from "next/og";
import { getCaseStudyBySlug } from "@/lib/mdx";
import { SITE_NAME } from "@/lib/site";

export const runtime = "nodejs";
export const alt = "Case study preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const study = getCaseStudyBySlug(params.slug);
  const title = study?.frontmatter.title ?? "Case study";
  const subtitle = study?.frontmatter.subtitle ?? "";
  const stack = study?.frontmatter.stack ?? [];
  const client = study?.frontmatter.client ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#F5EFE4",
          color: "#1F2419",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: eyebrow with client */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 2, background: "#5A7058" }} />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#5A7058",
              fontWeight: 600,
            }}
          >
            Case Study {client ? `· ${client}` : ""}
          </div>
        </div>

        {/* Middle: title + subtitle */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              fontSize: 68,
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: -2,
              color: "#1F2419",
              maxWidth: 1056,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: 26,
                color: "#4A5145",
                maxWidth: 1056,
                lineHeight: 1.45,
              }}
            >
              {subtitle.length > 200 ? subtitle.slice(0, 200) + "…" : subtitle}
            </div>
          )}
        </div>

        {/* Bottom: stack + author */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(31,36,25,0.20)",
            paddingTop: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 12,
              fontSize: 20,
              color: "#4A5145",
              flexWrap: "wrap",
              maxWidth: 800,
            }}
          >
            {stack.slice(0, 6).map((s, i) => (
              <span key={s}>
                {s}
                {i < Math.min(stack.length, 6) - 1 ? " · " : ""}
              </span>
            ))}
          </div>
          <div style={{ fontSize: 22, color: "#B5552E", fontWeight: 600 }}>
            {SITE_NAME.split(" ").slice(0, 2).join(" ")}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
