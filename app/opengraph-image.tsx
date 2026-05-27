import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const runtime = "edge";
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
        {/* Top: eyebrow */}
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
            {SITE_TAGLINE}
          </div>
        </div>

        {/* Middle: name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 104,
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: -3,
              color: "#1F2419",
            }}
          >
            Firza Chandra
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#4A5145",
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            Data pipelines, MLOps, dashboards, and AI engineering — fulltime
            and freelance.
          </div>
        </div>

        {/* Bottom: bar with tags */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(31,36,25,0.20)",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", gap: 18, fontSize: 22, color: "#4A5145" }}>
            <span>Data Engineer</span>
            <span>·</span>
            <span>AI Engineer</span>
            <span>·</span>
            <span>MLOps</span>
          </div>
          <div style={{ fontSize: 22, color: "#B5552E", fontWeight: 600 }}>
            firzasandjaya.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
