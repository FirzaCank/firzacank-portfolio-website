import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, topic, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

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
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #fdfdfd;">
            <h2 style="color: #4a5d4a; border-bottom: 2px solid #eef2ee; padding-bottom: 10px; margin-top: 0;">New Contact Form Message</h2>
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #607360; text-decoration: none;">${email}</a></p>
            <p style="margin: 10px 0;"><strong>Topic:</strong> ${topic}</p>
            
            <div style="background-color: #f4f6f4; padding: 15px; border-left: 4px solid #607360; margin-top: 20px; border-radius: 4px;">
              <p style="margin: 0; white-space: pre-wrap; font-size: 14px; color: #2c352c;">${message}</p>
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
