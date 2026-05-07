import type { Metadata } from "next";
import { Bell, Database, ShieldCheck, Users } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { DashboardShell } from "@/components/shared/dashboard-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { MetricCard } from "@/components/shared/metric-card";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Review FarmSetu marketplace activity and users.",
};

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  return (
    <DashboardShell
      eyebrow="Admin dashboard"
      title={`Welcome, ${user?.name ?? "admin"}`}
      description="A stable operational overview for marketplace health, user roles, and demo readiness."
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={ShieldCheck}
          label="Auth"
          value="Protected"
          hint="Dashboard routes are guarded by middleware."
        />
        <MetricCard
          icon={Database}
          label="Database"
          value="Prisma"
          hint="Schema checks run before production build."
        />
        <MetricCard
          icon={Users}
          label="Roles"
          value="3"
          hint="Buyer, farmer, and admin routing is supported."
        />
        <MetricCard
          icon={Bell}
          label="Incidents"
          value="0"
          hint="Use friendly error screens for graceful recovery."
        />
      </section>

      <EmptyState
        icon={Bell}
        title="No admin alerts"
        description="Production warnings, moderation tasks, and failed demo actions can be surfaced here later."
      />
    </DashboardShell>
  );
}
