import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { BRAND } from "@/lib/brand";
import { applySecurityMiddleware } from "@/lib/middleware";
import { isValidEmail, validateText } from "@/lib/security";

export const dynamic = "force-dynamic";

const SUPPORT_TO = process.env.SUPPORT_TO_EMAIL || "nascode.dev@gmail.com";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * POST /api/support — customer/brand support enquiry.
 * Emails the message via Resend (reply-to the sender) and returns JSON so the
 * form can show a real success/failure state instead of a blind redirect.
 *
 * Accepts JSON (fetch) or form-encoded bodies so the endpoint keeps working for
 * any legacy no-JS submission.
 */
export async function POST(request: NextRequest) {
  const response = NextResponse.next();
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: {
      maxRequests: process.env.NODE_ENV !== "production" ? 50 : 5,
      windowMs: 60000,
    },
    csrf: true,
    securityHeaders: true,
  });
  if (securityResponse) return securityResponse;

  let name = "";
  let email = "";
  let message = "";
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const body = await request.json();
      name = String(body?.name ?? "");
      email = String(body?.email ?? "");
      message = String(body?.message ?? "");
    } else {
      const formData = await request.formData();
      name = String(formData.get("name") ?? "");
      email = String(formData.get("email") ?? "");
      message = String(formData.get("message") ?? "");
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const nameCheck = validateText(name, 120, true);
  const messageCheck = validateText(message, 5000, true);

  if (!nameCheck.valid) {
    return NextResponse.json({ error: nameCheck.error ?? "Name is required." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  if (!messageCheck.valid) {
    return NextResponse.json(
      { error: messageCheck.error ?? "Message is required." },
      { status: 400 }
    );
  }

  const safeName = nameCheck.sanitized;
  const safeEmail = email.trim();
  const safeMessage = messageCheck.sanitized;

  const fromEmail = process.env.SUPPORT_FROM_EMAIL || BRAND.supportEmail;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.warn("[support] RESEND_API_KEY is not set; logging support request instead.");
    console.log("[support] would send:", { to: SUPPORT_TO, name: safeName, email: safeEmail });
    // Not configured: don't claim success to the user.
    return NextResponse.json(
      { error: "Support email is temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  try {
    const resend = new Resend(resendApiKey);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: SUPPORT_TO,
      replyTo: safeEmail,
      subject: `Support request from ${safeName}`,
      text: `From: ${safeName} <${safeEmail}>\n\n${safeMessage}`,
      html: `<p><strong>From:</strong> ${escapeHtml(safeName)} &lt;${escapeHtml(
        safeEmail
      )}&gt;</p><p style="white-space:pre-wrap">${escapeHtml(safeMessage)}</p>`,
    });
    if (error) {
      console.error("[support] send failed:", error);
      return NextResponse.json(
        { error: "Unable to send your message right now. Please try again." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("[support] send failed:", err);
    return NextResponse.json(
      { error: "Unable to send your message right now. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
