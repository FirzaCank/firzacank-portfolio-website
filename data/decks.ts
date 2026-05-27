// Slide gallery + downloadable deck config per project slug.
// Slides are anonymized PNGs at /public/decks/{slug}/slide-XX.png
// PDFs are anonymized full decks at /public/decks/{slug}/{file}.pdf

export type DeckConfig = {
  slides: number[];
  pdfFile?: string;
  pdfLabel?: string;
  title?: string;
};

export const DECKS: Record<string, DeckConfig> = {
  "video-platform-data-analysis": {
    slides: [2, 4, 5, 6, 7, 8, 10, 14],
    pdfFile: "eklipse-deck.pdf",
    pdfLabel: "Download deck (PDF)",
    title: "From the deck",
  },
  "ecommerce-pitch-deck-valuation": {
    slides: [3, 4, 7, 10, 11, 12, 13],
    pdfFile: "blibli-deck.pdf",
    pdfLabel: "Download deck (PDF)",
    title: "From the deck",
  },
  "nuclear-policy-dna-sna": {
    slides: [2, 3, 4, 6, 10],
    pdfFile: "nuclear-deck.pdf",
    pdfLabel: "Download report (PDF)",
    title: "From the report",
  },
  "writer-density-index": {
    slides: [2, 3, 4, 5, 7, 10],
    pdfFile: "writer-deck.pdf",
    pdfLabel: "Download deck (PDF)",
    title: "From the deck",
  },
};

// Map slug → folder name in /public/decks/
export const DECK_SLUG_TO_FOLDER: Record<string, string> = {
  "video-platform-data-analysis": "eklipse",
  "ecommerce-pitch-deck-valuation": "blibli",
  "nuclear-policy-dna-sna": "nuclear",
  "writer-density-index": "writer",
};

// Extra dashboard/screenshot galleries per project slug.
// Images live under /public/screenshots/{folder}/screenshot-XX.png
export type ScreenshotConfig = {
  images: string[];
  title?: string;
  eyebrow?: string;
};

export const SCREENSHOTS: Record<string, ScreenshotConfig> = {
  "nuclear-policy-dna-sna": {
    images: [
      "/screenshots/nuclear-dna/screenshot-01.png",
      "/screenshots/nuclear-dna/screenshot-02.png",
      "/screenshots/nuclear-dna/screenshot-03.png",
      "/screenshots/nuclear-dna/screenshot-04.png",
      "/screenshots/nuclear-dna/screenshot-05.png",
      "/screenshots/nuclear-dna/screenshot-06.png",
      "/screenshots/nuclear-dna/screenshot-07.png",
      "/screenshots/nuclear-dna/screenshot-08.png",
    ],
    title: "Dashboard screenshots",
    eyebrow: "Interactive output",
  },
};
