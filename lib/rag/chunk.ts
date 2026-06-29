// Splits portfolio content into overlapping chunks for embedding.
// Each chunk carries a source label so retrieved results can cite where they came from.

export type Chunk = {
  id: string;
  source: string; // human-readable origin, e.g. "Project: Telco Churn Prediction"
  text: string;
};

const TARGET_CHARS = 1200; // ~300 tokens
const OVERLAP_CHARS = 180; // ~15% overlap so context isn't cut mid-thought

// Split one document into overlapping windows, preferring paragraph boundaries.
export function chunkText(source: string, raw: string): Chunk[] {
  const text = raw.replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (text.length <= TARGET_CHARS) {
    return text ? [{ id: `${source}#0`, source, text }] : [];
  }

  const chunks: Chunk[] = [];
  const paras = text.split(/\n\n+/);
  let buf = "";
  let idx = 0;

  const flush = () => {
    const t = buf.trim();
    if (t) chunks.push({ id: `${source}#${idx++}`, source, text: t });
  };

  for (const para of paras) {
    if (buf.length + para.length + 2 > TARGET_CHARS && buf) {
      flush();
      // carry the tail of the previous chunk as overlap
      buf = buf.slice(-OVERLAP_CHARS) + "\n\n" + para;
    } else {
      buf = buf ? buf + "\n\n" + para : para;
    }
    // a single para longer than target: hard-split it
    while (buf.length > TARGET_CHARS) {
      chunks.push({ id: `${source}#${idx++}`, source, text: buf.slice(0, TARGET_CHARS) });
      buf = buf.slice(TARGET_CHARS - OVERLAP_CHARS);
    }
  }
  flush();
  return chunks;
}
