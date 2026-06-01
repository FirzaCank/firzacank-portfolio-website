"use client";

import { useState } from "react";

type Topic = "Project Inquiry" | "Collaboration" | "Mentoring" | "Just saying hi";
const TOPICS: Topic[] = ["Project Inquiry", "Collaboration", "Mentoring", "Just saying hi"];

export default function ContactForm({ to }: { to: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<Topic>("Project Inquiry");
  const [message, setMessage] = useState("");

  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedName, setSubmittedName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, topic, message }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmittedName(name);
        setStatus("success");
        // Clear fields
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Failed to send message directly.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage("Network error. Please try one of the alternative methods below.");
    }
  };


  const handleCopyDraft = () => {
    const subjectLine = `[${topic}] from ${name || "website visitor"}`;
    const bodyContent = `${message || "(No message)"}\n\n---\nFrom: ${name || "(No name)"}\nReply to: ${email || "(No email)"}`;
    const fullDraft = `To: ${to}\nSubject: ${subjectLine}\n\n${bodyContent}`;

    navigator.clipboard.writeText(fullDraft).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // silent fallback
    });
  };

  if (status === "success") {
    return (
      <div className="mt-8 rounded-2xl border border-sage/30 bg-sage-soft/10 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage text-beige-card">
          <svg className="h-6 w-6" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M2.5 7.5l3 3 6-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="mt-4 font-display text-2xl text-ink font-semibold">Message Sent!</h3>
        <p className="mt-2 font-sans text-sm text-ink-muted leading-relaxed max-w-prose mx-auto">
          Thank you, {submittedName || "there"}! Your message has been sent directly to Firza&rsquo;s inbox. He will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-sans text-xs font-medium text-beige-card transition-colors hover:bg-sage"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Topic chips */}
        <div>
          <label className="font-sans text-xs uppercase tracking-[0.2em] text-ink-muted">
            Topic
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTopic(t)}
                className={`rounded-full border px-3.5 py-1.5 font-sans text-xs transition-colors ${topic === t
                    ? "border-ink bg-ink text-beige-card"
                    : "border-ink/25 bg-beige-card text-ink hover:border-sage hover:text-sage"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label="Your name"
            id="contact-name"
            value={name}
            onChange={setName}
            placeholder="Jane Doe"
            required
          />
          <Field
            label="Reply-to email"
            id="contact-email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="jane@company.com"
            required
          />
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="font-sans text-xs uppercase tracking-[0.2em] text-ink-muted"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            required
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="A few sentences on the project, timeline, and what you're hoping to get out of it."
            className="mt-3 w-full resize-y rounded-lg border border-ink/25 bg-beige-card px-4 py-3 font-sans text-sm text-ink placeholder:text-ink-muted/60 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
          />
        </div>

        {status === "error" && (
          <div className="rounded-lg border border-terracotta/20 bg-terracotta/5 p-4 text-sm text-terracotta">
            <p className="font-semibold">Direct Sending Failsafe:</p>
            <p className="mt-1 text-xs">{errorMessage}</p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-sans text-sm font-medium text-beige-card transition-colors hover:bg-sage disabled:bg-ink/50 disabled:cursor-not-allowed"
          >
            {status === "sending" ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending...
              </>
            ) : (
              <>
                Send Message Directly
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 border-t border-ink/10 pt-6">
        <p className="font-sans text-xs uppercase tracking-[0.2em] text-ink-muted">
          Alternative methods (Failsafe)
        </p>
        <p className="mt-2 font-sans text-xs text-ink-muted leading-relaxed">
          If direct sending fails or if you prefer to send it manually, you can copy the draft message:
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">

          <button
            type="button"
            onClick={handleCopyDraft}
            className="inline-flex items-center gap-2 rounded-full border border-ink/25 bg-beige-card px-4 py-2.5 font-sans text-xs text-ink transition-colors hover:border-sage hover:text-sage"
          >
            {copied ? (
              <>
                Draft Copied!
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2.5 7.5l3 3 6-7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            ) : (
              <>
                Copy Draft
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="3"
                    width="8"
                    height="8"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M5 3V2a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="font-sans text-xs uppercase tracking-[0.2em] text-ink-muted"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-3 w-full rounded-lg border border-ink/25 bg-beige-card px-4 py-3 font-sans text-sm text-ink placeholder:text-ink-muted/60 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
      />
    </div>
  );
}
