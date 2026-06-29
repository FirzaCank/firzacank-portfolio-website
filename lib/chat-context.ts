// RAG retrieval: embed the user query, find the most similar pre-embedded
// chunks, and return them as context for the chat model.
//
// The embedding index is built at build time (npm run embeddings) and read
// from data/embeddings.json. If the file is missing, we fall back to no
// context rather than crashing.

import fs from "node:fs";
import path from "node:path";
import { embed, cosine } from "@/lib/rag/embed";

type IndexEntry = { source: string; text: string; vector: number[] };

const TOP_K = 5;
const MIN_SCORE = 0.4; // drop weakly-related chunks so we don't pad the prompt with noise

let index: IndexEntry[] | null = null;

function loadIndex(): IndexEntry[] {
  if (index) return index;
  const file = path.join(process.cwd(), "data", "embeddings.json");
  if (!fs.existsSync(file)) {
    console.warn("embeddings.json not found. Run `npm run embeddings`. Chat will have no context.");
    index = [];
    return index;
  }
  index = JSON.parse(fs.readFileSync(file, "utf8"));
  return index!;
}

export type Retrieved = { source: string; text: string; score: number };

// Embed the query, rank all chunks by cosine similarity, return top-K above threshold.
export async function retrieve(query: string, apiKey: string): Promise<Retrieved[]> {
  const idx = loadIndex();
  if (idx.length === 0) return [];

  const qv = await embed(query, "RETRIEVAL_QUERY", apiKey);
  return idx
    .map((e) => ({ source: e.source, text: e.text, score: cosine(qv, e.vector) }))
    .sort((a, b) => b.score - a.score)
    .filter((r) => r.score >= MIN_SCORE)
    .slice(0, TOP_K);
}

// Format retrieved chunks into a context block for the system prompt.
export function formatContext(hits: Retrieved[]): string {
  if (hits.length === 0) return "(No relevant information found in the portfolio.)";
  return hits.map((h) => `[${h.source}]\n${h.text}`).join("\n\n---\n\n");
}
