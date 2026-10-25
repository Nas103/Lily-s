import { getAdminStats } from "@/lib/adminStats";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import CrystalizedBall from "@/components/CrystalizedBall";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const stats = await getAdminStats(30);
  return (
    <div className="relative">
      <div className="pointer-events-none fixed inset-0 z-0 bg-zinc-950">
        <CrystalizedBall
          preset="plasma"
          color="#F25BD0"
          size={0.7}
          crackle={0.85}
          fill={0.5}
          interactive
          hoverStrength={0.7}
          strands={6}
          flares={0.65}
          glow={0.9}
          sparks={0.6}
          particleCount={15000}
          motion="rise"
          particleShape="square"
          depth={0.6}
          sway={0.5}
          twinkle={0.5}
          haze={0.7}
          dustSpeed={1}
          speed={1}
          intro
          paused={false}
        />
      </div>
      <div className="relative z-10">
        <AdminDashboard initial={stats} />
      </div>
    </div>
  );
}
