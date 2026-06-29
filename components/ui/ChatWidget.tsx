"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What does Firza do?",
  "Tell me about his AI/ML projects",
  "What's his experience at Hypefast?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: q }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setBusy(true);

    // Safety net: abort if the stream hangs past 60s so the input never stays locked.
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 60_000);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) {
        const { error } = await res.json().catch(() => ({ error: "" }));
        throw new Error(error || "Chat unavailable.");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: acc }]);
      }
    } catch (err) {
      setMessages([
        ...next,
        { role: "assistant", content: err instanceof Error ? err.message : "Something went wrong. Please try again." },
      ]);
    } finally {
      clearTimeout(timer);
      setBusy(false);
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Ask about Firza"}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full bg-ink px-4 py-3 text-beige-card shadow-lg transition-colors hover:bg-sage focus:outline-none focus:ring-2 focus:ring-sage/40"
      >
        {open ? (
          <>
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="font-sans text-sm font-medium">Close</span>
          </>
        ) : (
          <>
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 5h16v11H8l-4 3V5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
            <span className="font-sans text-sm font-medium">Ask me</span>
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed bottom-24 right-5 z-50 flex h-[min(34rem,calc(100vh-8rem))] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-ink/15 bg-beige-card shadow-2xl"
          >
            {/* Header */}
            <div className="border-b border-ink/10 px-5 py-4">
              <p className="font-display text-base font-semibold text-ink">Ask about Firza</p>
              <p className="font-sans text-xs text-ink-muted">Portfolio assistant · answers from this site</p>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="font-sans text-sm text-ink-muted">
                    Hi! Ask me anything about Firza&rsquo;s work, experience, or projects.
                  </p>
                  <div className="flex flex-col gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="rounded-lg border border-ink/15 bg-beige px-3 py-2 text-left font-sans text-xs text-ink transition-colors hover:border-sage hover:text-sage"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  {m.role === "user" ? (
                    <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-ink px-3.5 py-2.5 font-sans text-sm leading-relaxed text-beige-card">
                      {m.content}
                    </div>
                  ) : (
                    <div className="max-w-[85%] rounded-2xl border border-ink/10 bg-beige px-3.5 py-2.5 font-sans text-sm leading-relaxed text-ink">
                      {m.content ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-1 last:mb-0">{children}</ul>,
                            ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-1 last:mb-0">{children}</ol>,
                            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
                            em: ({ children }) => <em className="italic">{children}</em>,
                            code: ({ children }) => <code className="rounded bg-beige-deep px-1 py-0.5 font-mono text-xs">{children}</code>,
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      ) : busy && i === messages.length - 1 ? (
                        <Dots />
                      ) : null}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-ink/10 p-3"
            >
              <div className="flex items-end gap-2">
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  placeholder="Ask a question…"
                  className="max-h-28 flex-1 resize-none rounded-lg border border-ink/20 bg-beige-card px-3 py-2 font-sans text-sm text-ink placeholder:text-ink-muted/60 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  aria-label="Send"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-beige-card transition-colors hover:bg-sage disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <svg className="h-4 w-4" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Dots() {
  return (
    <span className="inline-flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-ink-muted"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </span>
  );
}
