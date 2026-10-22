import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireBrandAccount } from "@/lib/brandAuth";
import { applySecurityMiddleware } from "@/lib/middleware";
import { handleApiError } from "@/lib/errorHandler";
import {
  MAX_VERIFICATION_DOC_BYTES,
  VERIFICATION_DOC_MIME_LABEL,
  buildVerificationDocResponse,
  detectVerificationDocMime,
  formatBytes,
  sanitizeVerificationDocName,
} from "@/lib/verificationDoc";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SELECT = {
  id: true,
  name: true,
  slug: true,
  status: true,
  verificationStatus: true,
  verificationDocUrl: true,
  verificationDocName: true,
  verificationDocMimeType: true,
  verificationDocSize: true,
  verificationDocUploadedAt: true,
};

/**
 * POST /api/brand/verification-document
 * Upload (or replace) the caller's verification document as multipart/form-data
 * with a single `file` field. The bytes are stored in Postgres — see
 * prisma/add-brand-verification-documents.sql.
 *
 * The type is sniffed from the file's magic bytes, never from the client MIME
 * header, and re-uploading queues the document for admin review again.
 */
export async function POST(request: NextRequest) {
  const response = NextResponse.next();
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: { maxRequests: 10, windowMs: 60000 },
    csrf: true,
    securityHeaders: true,
  });
  if (securityResponse) return securityResponse;
  if (!prisma) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 500 });
  }

  const gate = await requireBrandAccount(request);
  if (gate instanceof NextResponse) return gate;
  if (!gate.brand) {
    return NextResponse.json(
      { error: "Brand profile not found. Complete brand signup first.", code: "NO_BRAND" },
      { status: 403 }
    );
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Upload the document as multipart/form-data." },
      { status: 415 }
    );
  }

  let file: File | null = null;
  try {
    const formData = await request.formData();
    const entry = formData.get("file");
    if (entry && typeof entry === "object" && "arrayBuffer" in entry) {
      file = entry as File;
    }
  } catch {
    return NextResponse.json({ error: "Invalid upload payload." }, { status: 400 });
  }

  if (!file || file.size === 0) {
    return NextResponse.json({ error: "Choose a document to upload." }, { status: 400 });
  }
  if (file.size > MAX_VERIFICATION_DOC_BYTES) {
    return NextResponse.json(
      {
        error: `Document is too large (${formatBytes(file.size)}). Maximum is ${formatBytes(
          MAX_VERIFICATION_DOC_BYTES
        )}.`,
      },
      { status: 413 }
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const mimeType = detectVerificationDocMime(bytes);
  if (!mimeType) {
    return NextResponse.json(
      { error: "Unsupported file type. Upload a PDF, PNG, JPEG or WebP document." },
      { status: 415 }
    );
  }

  try {
    const brand = await (prisma as any).brand.update({
      where: { id: gate.brand.id },
      data: {
        verificationDocData: bytes,
        verificationDocName: sanitizeVerificationDocName(file.name, mimeType),
        verificationDocMimeType: mimeType,
        verificationDocSize: bytes.byteLength,
        verificationDocUploadedAt: new Date(),
        // The uploaded file supersedes any legacy external link.
        verificationDocUrl: null,
        ...(gate.brand.verificationStatus !== "APPROVED"
          ? { verificationStatus: "PENDING" }
          : {}),
      },
      select: SELECT,
    });
    return NextResponse.json(
      {
        brand,
        document: {
          name: brand.verificationDocName,
          type: VERIFICATION_DOC_MIME_LABEL[mimeType] ?? mimeType,
          size: brand.verificationDocSize,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    return await handleApiError(
      error,
      "brand/verification-document.post",
      "Unable to store the document.",
      500
    );
  }
}

/** GET /api/brand/verification-document — download your own uploaded document. */
export async function GET(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 500 });
  }

  const gate = await requireBrandAccount(request);
  if (gate instanceof NextResponse) return gate;
  if (!gate.brand) {
    return NextResponse.json({ error: "Brand profile not found." }, { status: 404 });
  }

  const doc = await (prisma as any).brand.findUnique({
    where: { id: gate.brand.id },
    select: {
      verificationDocData: true,
      verificationDocName: true,
      verificationDocMimeType: true,
    },
  });

  if (!doc?.verificationDocData) {
    return NextResponse.json({ error: "No document uploaded yet." }, { status: 404 });
  }

  return buildVerificationDocResponse({
    data: doc.verificationDocData,
    name: doc.verificationDocName,
    mimeType: doc.verificationDocMimeType,
  });
}
