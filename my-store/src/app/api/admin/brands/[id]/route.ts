import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminUser } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { validateText } from "@/lib/security";

export const dynamic = "force-dynamic";

type Action = "approve" | "reject" | "suspend" | "reinstate";

const ACTIONS: Action[] = ["approve", "reject", "suspend", "reinstate"];

/**
 * PATCH /api/admin/brands/[id]
 * Review workflow for brand applications:
 *   approve   – brand goes live (requires a verification document on file)
 *   reject    – reason required; brand may resubmit documents afterwards
 *   suspend   – delist the brand and all its ACTIVE products immediately
 *   reinstate – back to APPROVED (or PENDING if identity was never verified)
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!prisma) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 500 });
  }
  const admin = await requireAdminUser(request);
  if (admin instanceof NextResponse) return admin;

  const { id } = await context.params;
  const body = (await request.json()) as { action?: string; reason?: string };
  const action = body.action as Action;
  if (!action || !ACTIONS.includes(action)) {
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }

  const brand = await (prisma as any).brand.findUnique({ where: { id } });
  if (!brand) {
    return NextResponse.json({ error: "Brand not found." }, { status: 404 });
  }

  let reason: string | null = null;
  if (typeof body.reason === "string" && body.reason.trim()) {
    const check = validateText(body.reason, 500, false);
    if (!check.valid) {
      return NextResponse.json({ error: check.error }, { status: 400 });
    }
    reason = check.sanitized;
  }

  const now = new Date();
  const data: Record<string, unknown> = {
    reviewedBy: admin.id,
    reviewedAt: now,
  };

  switch (action) {
    case "approve": {
      if (!brand.verificationDocUrl && !brand.verificationDocName) {
        return NextResponse.json(
          {
            error:
              "Cannot approve: no verification document on file. Ask the brand to submit one first.",
            code: "NO_DOCUMENT",
          },
          { status: 400 }
        );
      }
      data.status = "APPROVED";
      data.verificationStatus = "APPROVED";
      data.rejectionReason = null;
      break;
    }
    case "reject": {
      if (!reason) {
        return NextResponse.json(
          { error: "A rejection reason is required." },
          { status: 400 }
        );
      }
      data.status = "REJECTED";
      data.rejectionReason = reason;
      if (
        (brand.verificationDocUrl || brand.verificationDocName) &&
        brand.verificationStatus !== "APPROVED"
      ) {
        data.verificationStatus = "REJECTED";
      }
      break;
    }
    case "suspend": {
      if (brand.status === "APPROVED") {
        // Belt and braces: API routes already gate on brand status, this also
        // delists existing ACTIVE products in the same transaction.
        await (prisma as any).$transaction([
          (prisma as any).brand.update({ where: { id }, data: {
            status: "SUSPENDED",
            reviewedBy: admin.id,
            reviewedAt: now,
            rejectionReason: reason,
          } }),
          (prisma as any).product.updateMany({
            where: { brandId: id, status: "ACTIVE" },
            data: { status: "PENDING_REVIEW" },
          }),
        ]);
        const updated = await (prisma as any).brand.findUnique({ where: { id } });
        return NextResponse.json({ brand: updated });
      }
      data.status = "SUSPENDED";
      data.rejectionReason = reason ?? brand.rejectionReason;
      break;
    }
    case "reinstate": {
      data.status =
        brand.verificationStatus === "APPROVED" ? "APPROVED" : "PENDING";
      data.rejectionReason = null;
      break;
    }
  }

  const updated = await (prisma as any).brand.update({ where: { id }, data });
  return NextResponse.json({ brand: updated });
}
