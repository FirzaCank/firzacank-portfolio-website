"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Msg = { role: "user" | "assistant"; content: string; time: string };

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const SUGGESTIONS = [
  "What does Firza do?",
  "Tell me about his Data Engineering projects",
  "What's his experience at Hypefast?",
];

const THROTTLE_SECS = 10;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [nudge, setNudge] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const accRef = useRef("");
  const rafRef = useRef<number | null>(null);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startCooldown() {
    setCooldown(THROTTLE_SECS);
    cooldownRef.current = setInterval(() => {
      setCooldown((s) => {
        if (s <= 1) {
          clearInterval(cooldownRef.current!);
          cooldownRef.current = null;
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  // one-time attention nudge on the launcher, first visit per tab session
  useEffect(() => {
    if (sessionStorage.getItem("chat-nudged")) return;
    const show = setTimeout(() => setNudge(true), 1500);
    const hide = setTimeout(() => {
      setNudge(false);
      sessionStorage.setItem("chat-nudged", "1");
    }, 6500);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, []);

  useEffect(() => {
    if (open && nudge) {
      setNudge(false);
      sessionStorage.setItem("chat-nudged", "1");
    }
  }, [open, nudge]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy || cooldown > 0) return;
    setInput("");
    const t = now();
    const next: Msg[] = [...messages, { role: "user", content: q, time: t }];
    setMessages([...next, { role: "assistant", content: "", time: t }]);
    setBusy(true);
    accRef.current = "";

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 60_000);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // only the last 12 turns reach the model anyway (server MAX_HISTORY);
        // slicing here keeps long sessions under the server's 40-message cap
        body: JSON.stringify({ messages: next.slice(-12) }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) {
        const { error } = await res.json().catch(() => ({ error: "" }));
        throw new Error(error || "The assistant is temporarily unavailable. Please try again in a moment.");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let firstChunk = true;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        accRef.current += decoder.decode(value, { stream: true });
        if (firstChunk) { setBusy(false); firstChunk = false; }
        // throttle re-renders to one per animation frame
        if (!rafRef.current) {
          rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null;
            setMessages([...next, { role: "assistant", content: accRef.current, time: t }]);
          });
        }
      }
      // flush any remaining content after stream ends
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      setMessages([...next, { role: "assistant", content: accRef.current, time: now() }]);
    } catch (err) {
      setMessages([
        ...next,
        { role: "assistant", content: err instanceof Error ? err.message : "Something went wrong on my end. Please try again in a moment.", time: now() },
      ]);
    } finally {
      clearTimeout(timer);
      setBusy(false);
      startCooldown();
    }
  }

  return (
    <>
      {/* Nudge bubble */}
      <AnimatePresence>
        {nudge && !open && (
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-20 right-5 z-50 rounded-2xl rounded-br-sm border border-sage/30 bg-beige-card px-4 py-2.5 text-left shadow-xl shadow-sage/10"
          >
            <span className="font-sans text-sm text-ink">Hi! Curious about Firza&rsquo;s work?</span>
            <span className="block font-sans text-xs text-ink-muted mt-0.5">Ask me anything here</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Ask about Firza"}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full bg-ink px-4 py-3 text-beige-card shadow-lg transition-colors hover:bg-sage focus:outline-none focus:ring-2 focus:ring-sage/40"
      >
        {nudge && !open && (
          <span aria-hidden="true" className="absolute inset-0 rounded-full bg-sage/60 animate-ping" />
        )}
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
            <div className="relative border-b border-ink/10 px-5 py-4 pr-12">
              <p className="font-display text-xl font-semibold text-ink">Ask about Firza</p>
              <p className="font-sans text-xs text-ink-muted/60">AI-generated · may not be fully accurate. For detailed or specific information, reach out via the <a href="/contact" className="underline hover:text-sage">Contact</a> page.</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-ink-muted/50 transition-colors hover:bg-ink/8 hover:text-ink"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-3">
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
                <div key={i} className={m.role === "user" ? "flex flex-col items-end gap-0.5" : "flex flex-col items-start gap-0.5"}>
                  {m.role === "user" ? (
                    <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-ink px-3 py-2 font-sans text-[13px] leading-snug text-beige-card">
                      {m.content}
                    </div>
                  ) : (
                    <div className="max-w-[85%] rounded-2xl border border-ink/10 bg-beige px-3 py-2 font-sans text-[13px] leading-snug text-ink">
                      {m.content ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="mb-1.5 ml-4 list-disc space-y-0.5 last:mb-0">{children}</ul>,
                            ol: ({ children }) => <ol className="mb-1.5 ml-4 list-decimal space-y-0.5 last:mb-0">{children}</ol>,
                            li: ({ children }) => <li className="leading-snug">{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
                            em: ({ children }) => <em className="italic">{children}</em>,
                            code: ({ children }) => <code className="rounded bg-beige-deep px-1 py-0.5 font-mono text-xs">{children}</code>,
                            a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="underline text-sage hover:text-sage/70 transition-colors">{children}</a>,
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      ) : busy && i === messages.length - 1 ? (
                        <Dots />
                      ) : null}
                    </div>
                  )}
                  {m.time && (!busy || i < messages.length - 1) && (
                    <span className="px-1 font-sans text-[10px] text-ink-muted/40">{m.time}</span>
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
              <div className="flex flex-col gap-1.5 w-full">
                {cooldown > 0 && (
                  <p className="font-sans text-[11px] text-ink-muted/60 text-center">
                    Wait {cooldown}s before sending another message
                  </p>
                )}
                <div className="flex items-end gap-2">
                  <textarea
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        setTimeout(() => send(input), 0);
                      }
                    }}
                    placeholder="Ask a question…"
                    className="max-h-28 flex-1 resize-none rounded-lg border border-ink/20 bg-beige-card px-3 py-2 font-sans text-sm text-ink placeholder:text-ink-muted/60 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
                  />
                  <button
                    type="submit"
                    disabled={busy || !input.trim() || cooldown > 0}
                    aria-label="Send"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-beige-card transition-colors hover:bg-sage disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {cooldown > 0 ? (
                      <span className="font-sans text-[11px] font-medium tabular-nums">{cooldown}</span>
                    ) : (
                      <svg className="h-4 w-4" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </div>
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
