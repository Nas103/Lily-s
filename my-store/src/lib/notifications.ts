import { Resend } from "resend";
import { BRAND } from "@/lib/brand";
import { statusLabel } from "@/lib/orders";

type SendResult = { ok: boolean; reason?: string };

/**
 * Order status update email. `to` is the customer address, shippingEmail
 * usually. Degrades gracefully (logs) when Resend is not configured.
 */
export async function sendOrderStatusEmail(input: {
  to: string;
  orderNumber: string;
  status: string;
  trackingNumber?: string | null;
  amount?: string;
}): Promise<SendResult> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const status = statusLabel(input.status);
  const trackingUrl = `${siteUrl}/track-order`;
  const trackHref = input.trackingNumber
    ? `${trackingUrl}?orderNumber=${encodeURIComponent(input.orderNumber)}&email=${encodeURIComponent(input.to)}`
    : trackingUrl;

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f5f5f4;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid #e7e5e4;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background:#0a0a0a;color:#ffffff;padding:24px 28px;">
              <div style="font-size:13px;letter-spacing:0.3em;text-transform:uppercase;color:#fcd34d;">${BRAND.name}</div>
              <div style="font-size:22px;font-weight:600;margin-top:6px;">Order update</div>
            </td>
          </tr>
          <tr><td style="padding:28px;">
            <p style="margin:0 0 12px;font-size:15px;color:#171717;">Hi,</p>
            <p style="margin:0 0 20px;font-size:15px;color:#171717;line-height:1.5;">
              Your order <strong>${input.orderNumber}</strong> has been updated to
              <span style="display:inline-block;padding:2px 10px;border-radius:999px;background:#fef3c7;color:#92400e;font-weight:600;font-size:13px;">${status}</span>.
            </p>
            ${input.amount ? `<p style="margin:0 0 20px;font-size:14px;color:#52525b;">Total: <strong>${input.amount}</strong></p>` : ""}
            ${input.trackingNumber ? `<p style="margin:0 0 20px;font-size:14px;color:#52525b;">Tracking number: <strong>${input.trackingNumber}</strong></p>` : ""}
            <p style="margin:0 0 24px;font-size:14px;color:#52525b;line-height:1.5;">
              You can follow your order any time on the order tracking page.
            </p>
            <a href="${trackHref}" style="display:inline-block;background:#171717;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-size:13px;font-weight:600;letter-spacing:0.05em;">
              Track this order →
            </a>
          </td></tr>
          <tr><td style="padding:16px 28px 24px;border-top:1px solid #e7e5e4;">
            <p style="margin:0;font-size:12px;color:#a1a1aa;">Questions about your order? Reply to this email or contact our concierge at ${BRAND.supportEmail}.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  return sendEmail({
    to: input.to,
    subject: `${BRAND.name} — order ${input.orderNumber} is ${status.toLowerCase()}`,
    html,
  });
}

/** Generic admin-to-user message. */
export async function sendAdminMessage(input: {
  to: string;
  subject: string;
  message: string;
}): Promise<SendResult> {
  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f5f5f4;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid #e7e5e4;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background:#0a0a0a;color:#ffffff;padding:24px 28px;">
              <div style="font-size:13px;letter-spacing:0.3em;text-transform:uppercase;color:#fcd34d;">${BRAND.name}</div>
              <div style="font-size:22px;font-weight:600;margin-top:6px;">${input.subject}</div>
            </td>
          </tr>
          <tr><td style="padding:28px;">
            <p style="margin:0;font-size:15px;color:#171717;line-height:1.6;white-space:pre-wrap;">${escapeHtml(input.message)}</p>
          </td></tr>
          <tr><td style="padding:16px 28px 24px;border-top:1px solid #e7e5e4;">
            <p style="margin:0;font-size:12px;color:#a1a1aa;">Please reply to this email if you have any questions.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  return sendEmail({ to: input.to, subject: input.subject, html });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[notifications] RESEND_API_KEY is not set; logging email instead.");
    console.log("[notifications] would send:", {
      to: input.to,
      subject: input.subject,
    });
    return { ok: true, reason: "logged" };
  }

  const from = process.env.SUPPORT_FROM_EMAIL || BRAND.supportEmail;
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });
    if (error) {
      console.error("[notifications] send failed:", error);
      return { ok: false, reason: error.message };
    }
    return { ok: true };
  } catch (error) {
    console.error("[notifications] send failed:", error);
    return {
      ok: false,
      reason: error instanceof Error ? error.message : "Unknown error",
    };
  }
}