import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminUser } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { buildVerificationDocResponse } from "@/lib/verificationDoc";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/brands/[id]/verification-document
 * Admin download for a brand's uploaded verification document. The document is
 * always served as an attachment (never inline) and prefixed with the brand slug
 * so reviewers can tell files apart after downloading several.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!prisma) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 500 });
  }
  const admin = await requireAdminUser(request);
  if (admin instanceof NextResponse) return admin;

  const { id } = await context.params;
  const brand = await (prisma as any).brand.findUnique({
    where: { id },
    select: {
      slug: true,
      verificationDocData: true,
      verificationDocName: true,
      verificationDocMimeType: true,
    },
  });

  if (!brand) {
    return NextResponse.json({ error: "Brand not found." }, { status: 404 });
  }
  if (!brand.verificationDocData) {
    return NextResponse.json({ error: "No document uploaded for this brand." }, { status: 404 });
  }

  return buildVerificationDocResponse(
    {
      data: brand.verificationDocData,
      name: brand.verificationDocName,
      mimeType: brand.verificationDocMimeType,
    },
    brand.slug
  );
}
