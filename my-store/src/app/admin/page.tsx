import { getAdminStats } from "@/lib/adminStats";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const stats = await getAdminStats(30);
  return <AdminDashboard initial={stats} />;
}
