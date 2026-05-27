"use client";

import { useState } from "react";

type Topic = "Project Inquiry" | "Collaboration" | "Mentoring" | "Just saying hi";
const TOPICS: Topic[] = ["Project Inquiry", "Collaboration", "Mentoring", "Just saying hi"];

export default function ContactForm({ to }: { to: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<Topic>("Project Inquiry");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[${topic}] from ${name || "website visitor"}`);
    const body = encodeURIComponent(
      `${message}\n\n---\nFrom: ${name}\nReply to: ${email}`,
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
              className={`rounded-full border px-3.5 py-1.5 font-sans text-xs transition-colors ${
                topic === t
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

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-sans text-sm font-medium text-beige-card transition-colors hover:bg-sage"
        >
          Open in email client
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
        </button>
        <p className="font-sans text-xs text-ink-muted">
          No data is stored. The form just prepares the message.
        </p>
      </div>
    </form>
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
