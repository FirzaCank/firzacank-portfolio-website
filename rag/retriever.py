"""Vector similarity search over the pre-built embedding index.

Reads data/embeddings.json (built by `npm run embeddings`), embeds the user
query via Gemini, and returns the top-k most similar chunks by cosine
similarity. numpy handles the math in one vectorized pass, which is instant for
a portfolio-scale index (under a hundred chunks).

ponytail: flat numpy cosine over the whole index. For this size it's instant.
If the index ever grows into the tens of thousands of chunks, swap to FAISS
(faiss.IndexFlatIP on normalized vectors) without changing the interface.
"""

import json
import os
from functools import lru_cache

import numpy as np

from .gemini import embed_query

_INDEX_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "embeddings.json")

TOP_K = 8
MIN_SCORE = 0.4  # drop weakly related chunks so the prompt isn't padded with noise


@lru_cache(maxsize=1)
def _load_index():
    """Load and normalize the embedding index once per warm process."""
    with open(_INDEX_PATH, encoding="utf-8") as f:
        entries = json.load(f)
    sources = [e["source"] for e in entries]
    texts = [e["text"] for e in entries]
    vectors = np.array([e["vector"] for e in entries], dtype=np.float32)
    # Pre-normalize so cosine == dot product.
    norms = np.linalg.norm(vectors, axis=1, keepdims=True)
    norms[norms == 0] = 1.0
    vectors = vectors / norms
    return sources, texts, vectors


def retrieve(query: str, api_key: str):
    """Return the top-k chunks most similar to the query, above MIN_SCORE.

    Each result is a dict with source, text, and score.
    """
    sources, texts, vectors = _load_index()
    if len(texts) == 0:
        return []

    qv = np.array(embed_query(query, api_key), dtype=np.float32)
    qn = np.linalg.norm(qv) or 1.0
    qv = qv / qn

    scores = vectors @ qv  # cosine, since both sides are normalized
    order = np.argsort(scores)[::-1][:TOP_K]
    return [
        {"source": sources[i], "text": texts[i], "score": float(scores[i])}
        for i in order
        if scores[i] >= MIN_SCORE
    ]


def format_context(hits) -> str:
    """Format retrieved chunks into a context block for the system prompt."""
    if not hits:
        return "(No relevant information found in the portfolio.)"
    return "\n\n---\n\n".join(f"[{h['source']}]\n{h['text']}" for h in hits)


if __name__ == "__main__":
    # Self-check: index loads, normalization holds, scores are sane.
    srcs, txts, vecs = _load_index()
    assert len(srcs) == len(txts) == len(vecs), "index arrays out of sync"
    assert vecs.shape[0] > 0, "empty index"
    row_norms = np.linalg.norm(vecs, axis=1)
    assert np.allclose(row_norms, 1.0, atol=1e-4), "vectors not normalized"
    print(f"OK: {len(srcs)} chunks, dim {vecs.shape[1]}, all unit-normalized.")
