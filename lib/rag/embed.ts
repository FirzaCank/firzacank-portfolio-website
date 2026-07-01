// Gemini embedding wrapper + cosine similarity. Used both at build time
// (embedding all chunks) and at request time (embedding the user query).

const MODEL = "gemini-embedding-001";
const DIM = 768; // smaller dim = faster cosine, plenty for 13 documents
const BASE = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}`;

type TaskType = "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY";

// Embed a single text. taskType makes doc/query embeddings asymmetric, which
// improves retrieval accuracy over treating them the same.
export async function embed(text: string, taskType: TaskType, apiKey: string): Promise<number[]> {
  const res = await fetch(`${BASE}:embedContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      model: `models/${MODEL}`,
      content: { parts: [{ text }] },
      taskType,
      outputDimensionality: DIM,
    }),
  });
  if (!res.ok) {
    throw new Error(`Embed failed: ${res.status} ${await res.text().catch(() => "")}`);
  }
  const json = await res.json();
  const values: number[] = json?.embedding?.values ?? json?.embeddings?.[0]?.values;
  if (!values) throw new Error("Embed response missing values");
  return values;
}

// ponytail: sequential calls (batchEmbedContents rejects API-key auth). Parallelize if chunk count grows large.
export async function embedBatch(texts: string[], taskType: TaskType, apiKey: string): Promise<number[][]> {
  const out: number[][] = [];
  for (const text of texts) {
    out.push(await embed(text, taskType, apiKey));
  }
  return out;
}

// gemini-embedding-001 returns L2-normalized vectors at DIM != 3072, but we
// normalize defensively so cosine == dot product regardless.
function norm(v: number[]): number {
  return Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
}

export function cosine(a: number[], b: number[]): number {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot / (norm(a) * norm(b));
}
