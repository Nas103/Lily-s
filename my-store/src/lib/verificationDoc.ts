/**
 * Verification document helpers (brand KYC uploads).
 *
 * Files are stored in Postgres (`Brand.verificationDocData`), so the type is
 * derived from magic bytes rather than trusting the browser-supplied MIME type
 * or filename extension. Only formats that are safe to hand back as an
 * attachment are accepted.
 */

export const MAX_VERIFICATION_DOC_BYTES = 4 * 1024 * 1024; // 4 MB (Vercel caps requests at ~4.5 MB)

export const VERIFICATION_DOC_ACCEPT =
  ".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp";

const EXTENSION_BY_MIME: Record<string, string> = {
  "application/pdf": "pdf",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export const VERIFICATION_DOC_MIME_LABEL: Record<string, string> = {
  "application/pdf": "PDF",
  "image/png": "PNG image",
  "image/jpeg": "JPEG image",
  "image/webp": "WebP image",
};

function startsWith(bytes: Uint8Array, signature: number[], offset = 0): boolean {
  if (bytes.length < offset + signature.length) return false;
  return signature.every((byte, index) => bytes[offset + index] === byte);
}

/**
 * Returns the detected MIME type, or null when the file is not one of the
 * accepted formats (PDF / PNG / JPEG / WebP).
 */
export function detectVerificationDocMime(bytes: Uint8Array): string | null {
  if (startsWith(bytes, [0x25, 0x50, 0x44, 0x46])) return "application/pdf"; // %PDF
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) && startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8)) {
    return "image/webp";
  }
  return null;
}

/** Short, safe, downloadable filename with an extension matching the real type. */
export function sanitizeVerificationDocName(rawName: string, mimeType: string): string {
  const base = String(rawName || "verification-document")
    .split(/[\\/]/)
    .pop()!
    .replace(/[\u0000-\u001f\u007f"]/g, "")
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[.-]+/, "")
    .slice(0, 120)
    .trim();

  const extension = EXTENSION_BY_MIME[mimeType] ?? "bin";
  const withoutExtension = base.replace(/\.[A-Za-z0-9]{1,8}$/, "") || "verification-document";
  return `${withoutExtension}.${extension}`;
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** RFC 5987-safe Content-Disposition value for a stored document. */
export function contentDisposition(filename: string): string {
  const asciiFallback = filename.replace(/[^A-Za-z0-9._-]+/g, "_");
  const encoded = encodeURIComponent(filename).replace(/['()*]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`
  );
  return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encoded}`;
}

type StoredVerificationDoc = {
  data: Uint8Array | null;
  name: string | null;
  mimeType: string | null;
};

/**
 * Streams a stored document back as a download. Always served as an
 * attachment with nosniff so a crafted file can never execute in the browser.
 */
export function buildVerificationDocResponse(
  doc: StoredVerificationDoc,
  filenamePrefix?: string
): Response {
  const bytes = doc.data ? new Uint8Array(doc.data) : new Uint8Array();
  const storedName = doc.name || "verification-document";
  const filename = filenamePrefix ? `${filenamePrefix}-${storedName}` : storedName;
  return new Response(bytes, {
    status: 200,
    headers: {
      "Content-Type": doc.mimeType || "application/octet-stream",
      "Content-Length": String(bytes.byteLength),
      "Content-Disposition": contentDisposition(filename),
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
}
