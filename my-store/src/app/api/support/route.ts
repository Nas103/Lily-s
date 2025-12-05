import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const message = String(formData.get("message") ?? "");

  const toEmail = process.env.SUPPORT_TO_EMAIL ?? "nascode.dev@gmail.com";
  const fromEmail = process.env.SUPPORT_FROM_EMAIL ?? "support@lily-atelier.dev";

  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.warn("RESEND_API_KEY is not set; logging support email instead.");
    console.log("Support request submitted:", {
      to: toEmail,
      from: fromEmail,
      name,
      email,
      message,
    });
  } else {
    const resend = new Resend(resendApiKey);

    try {
      await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        replyTo: email || undefined,
        subject: `Support request from ${name || "customer"}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      });
    } catch (error) {
      console.error("Failed to send support email via Resend:", error);
    }
  }

  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: "/support",
    },
  });
}

