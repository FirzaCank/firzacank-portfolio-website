// Chunk all portfolio docs, embed via Gemini, write data/embeddings.json.
// Run with: npm run embeddings. Re-run whenever content changes.

import fs from "node:fs";
import path from "node:path";

// Load .env.local so GEMINI_API_KEY is available regardless of how the script
// is launched (npx/tsx don't reliably forward --env-file).
try {
  process.loadEnvFile(path.join(process.cwd(), ".env.local"));
} catch {
  // file missing or already loaded — the apiKey check below handles it
}

import { getDocs } from "@/lib/rag/sources";
import { chunkText } from "@/lib/rag/chunk";
import { embedBatch } from "@/lib/rag/embed";

const OUT = path.join(process.cwd(), "data", "embeddings.json");

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set. Add it to .env.local first.");

  const docs = getDocs();
  const chunks = docs.flatMap((d) => chunkText(d.source, d.text));
  console.log(`Chunked ${docs.length} docs into ${chunks.length} chunks. Embedding...`);

  const vectors = await embedBatch(chunks.map((c) => c.text), "RETRIEVAL_DOCUMENT", apiKey);
  if (vectors.length !== chunks.length) {
    throw new Error(`Embedding count mismatch: ${vectors.length} vs ${chunks.length} chunks`);
  }

  const index = chunks.map((c, i) => ({ source: c.source, text: c.text, vector: vectors[i] }));
  fs.writeFileSync(OUT, JSON.stringify(index));
  const kb = (fs.statSync(OUT).size / 1024).toFixed(0);
  console.log(`Wrote ${index.length} embedded chunks to data/embeddings.json (${kb}KB).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
