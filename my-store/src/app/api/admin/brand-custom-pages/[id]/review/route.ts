import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/adminAuth";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requireAdminUser(request);
  if (gate instanceof NextResponse) return gate;
  if (!prisma) return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  const adminId = (gate as any).user?.id || (gate as any).id;

  const { id } = await params;
  try {
    const body = await request.json();
    const action = body.action as "approve" | "reject" | "changes_requested";
    const adminNotes = body.adminNotes || null;
    const rejectionReason = body.rejectionReason || null;

    const page = await (prisma as any).brandCustomPage.findUnique({ where: { id }, include: { brand: true } });
    if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (action === "approve") {
      await (prisma as any).brandCustomPage.update({
        where: { id },
        data: { status: "APPROVED", reviewedBy: adminId, reviewedAt: new Date(), adminNotes, rejectionReason: null },
      });
      await (prisma as any).brandCustomProduct.updateMany({ where: { pageId: id }, data: { status: "APPROVED" } });
      await (prisma as any).brandPageSubmission.updateMany({ where: { pageId: id, status: "SUBMITTED" }, data: { status: "APPROVED", reviewedAt: new Date(), adminNotes } });
      try {
        await (prisma as any).brandMessage.create({
          data: {
            brandId: page.brandId,
            fromUserId: adminId,
            fromRole: "ADMIN",
            body: `Your custom page "${page.pageName}" has been approved and is now live.`,
          },
        });
      } catch {}
      return NextResponse.json({ ok: true });
    } else if (action === "reject") {
      await (prisma as any).brandCustomPage.update({
        where: { id },
        data: { status: "REJECTED", reviewedBy: adminId, reviewedAt: new Date(), adminNotes, rejectionReason },
      });
      await (prisma as any).brandCustomProduct.updateMany({ where: { pageId: id }, data: { status: "REJECTED" } });
      await (prisma as any).brandPageSubmission.updateMany({ where: { pageId: id, status: "SUBMITTED" }, data: { status: "REJECTED", reviewedAt: new Date(), adminNotes, internalNotes: rejectionReason } });
      try {
        await (prisma as any).brandMessage.create({
          data: {
            brandId: page.brandId,
            fromUserId: adminId,
            fromRole: "ADMIN",
            body: `Your custom page "${page.pageName}" was rejected. ${rejectionReason || ""}`.trim(),
          },
        });
      } catch {}
      return NextResponse.json({ ok: true });
    } else if (action === "changes_requested") {
      await (prisma as any).brandCustomPage.update({
        where: { id },
        data: { status: "CHANGES_REQUESTED", reviewedBy: adminId, reviewedAt: new Date(), adminNotes },
      });
      await (prisma as any).brandCustomProduct.updateMany({ where: { pageId: id }, data: { status: "DRAFT" } });
      await (prisma as any).brandPageSubmission.updateMany({ where: { pageId: id, status: "SUBMITTED" }, data: { status: "CHANGES_REQUESTED", reviewedAt: new Date(), adminNotes } });
      try {
        await (prisma as any).brandMessage.create({
          data: {
            brandId: page.brandId,
            fromUserId: adminId,
            fromRole: "ADMIN",
            body: `Changes requested for your custom page "${page.pageName}". ${adminNotes || ""}`.trim(),
          },
        });
      } catch {}
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Review failed" }, { status: 500 });
  }
}
