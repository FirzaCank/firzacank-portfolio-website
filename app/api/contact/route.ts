import { NextResponse } from "next/server";

// ponytail: in-memory counters, reset on cold start. Fine for a portfolio.
// Move to Upstash/Redis only if persistent cross-instance limits are needed.
type RateBucket = { count: number; resetAt: number };
const _ipHits = new Map<string, RateBucket>();
const _global: RateBucket = { count: 0, resetAt: 0 };

function ipLimited(ip: string): boolean {
  const now = Date.now();
  const entry = _ipHits.get(ip);
  if (!entry || now > entry.resetAt) {
    _ipHits.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

function globalLimited(): boolean {
  const now = Date.now();
  if (now > _global.resetAt) {
    _global.count = 0;
    _global.resetAt = now + 3_600_000;
  }
  if (_global.count >= 50) return true;
  _global.count++;
  return false;
}

// Strips control characters and trims. Does NOT strip markup characters:
// escapeHtml below neutralizes those at the point they enter the template, so
// apostrophes and ampersands survive in the delivered email. Removing them here
// mangled legitimate text ("O'Brien" became "OBrien", "I'd" became "Id").
function sanitize(val: unknown, maxLen: number, keepNewlines = false): string {
  // Newlines are control characters, so the message body has to opt back in:
  // the email template renders it with white-space: pre-wrap and a stripped
  // body would arrive as one run-on paragraph. Header fields must not keep
  // them (CRLF injection), which is why the default is off.
  const controls = keepNewlines
    // eslint-disable-next-line no-control-regex
    ? /[\x00-\x09\x0b\x0c\x0e-\x1f\x7f]/g
    // eslint-disable-next-line no-control-regex
    : /[\x00-\x1f\x7f]/g;
  return String(val ?? "").replace(controls, "").trim().slice(0, maxLen);
}

function escapeHtml(val: string): string {
  return val
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidEmail(val: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

export async function POST(request: Request) {
  try {
    const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
    if (globalLimited()) {
      return NextResponse.json(
        { error: "The contact form is receiving a lot of submissions right now. Please try again later." },
        { status: 429 }
      );
    }
    if (ipLimited(ip)) {
      return NextResponse.json(
        { error: "You've submitted a few messages recently. Please wait a minute before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json();

    const name = sanitize(body.name, 100);
    const email = sanitize(body.email, 254).replace(/[\r\n]/g, "");
    const topic = sanitize(body.topic, 100);
    const message = sanitize(body.message, 5000, true);

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // The chat assistant prefixes its topic with "Chat:", so the heading can
    // say where the message came from without a separate flag in the payload.
    const heading = topic.startsWith("Chat:")
      ? "New Message via Chat Assistant"
      : "New Contact Form Message";

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "RESEND_API_KEY is not configured on the server. Please add it to your environment variables." },
        { status: 500 }
      );
    }

    // Call Resend API via fetch
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: "firzasandjaya@gmail.com",
        subject: `[${topic}] from ${name}`,
        reply_to: email,
        // Every interpolated value is escaped here, at the point it enters the
        // markup. sanitize() deliberately leaves apostrophes and ampersands
        // intact so the delivered text reads correctly.
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #fdfdfd;">
            <h2 style="color: #4a5d4a; border-bottom: 2px solid #eef2ee; padding-bottom: 10px; margin-top: 0;">${escapeHtml(heading)}</h2>
            <p style="margin: 10px 0;"><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${encodeURIComponent(email)}" style="color: #607360; text-decoration: none;">${escapeHtml(email)}</a></p>
            <p style="margin: 10px 0;"><strong>Topic:</strong> ${escapeHtml(topic)}</p>

            <div style="background-color: #f4f6f4; padding: 15px; border-left: 4px solid #607360; margin-top: 20px; border-radius: 4px;">
              <p style="margin: 0; white-space: pre-wrap; font-size: 14px; color: #2c352c;">${escapeHtml(message)}</p>
            </div>

            <p style="font-size: 11px; color: #888; margin-top: 25px; border-t: 1px solid #eee; padding-top: 10px;">Sent automatically from your portfolio website.</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Resend API error:", errorData);
      return NextResponse.json(
        { error: errorData.message || "Failed to send email via Resend API." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
