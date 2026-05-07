import type { Metadata } from "next";
import { Bell, LineChart, PackagePlus, Sprout } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { DashboardShell } from "@/components/shared/dashboard-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { MetricCard } from "@/components/shared/metric-card";

export const metadata: Metadata = {
  title: "Farmer Dashboard",
  description: "Manage FarmSetu products, stock, and product images.",
};

export default async function FarmerDashboardPage() {
  const user = await getCurrentUser();

  return (
    <DashboardShell
      eyebrow="Farmer dashboard"
      title={`Welcome, ${user?.name ?? "farmer"}`}
      description="Manage listings, stock, order activity, and buyer-facing updates from one practical workspace."
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Sprout}
          label="Products"
          value="0"
          hint="Uploaded products appear in the live marketplace."
        />
        <MetricCard
          icon={PackagePlus}
          label="Stock updates"
          value="Realtime"
          hint="Stock changes are designed for instant buyer updates."
        />
        <MetricCard
          icon={LineChart}
          label="Orders"
          value="0"
          hint="New buyer orders will be summarized here."
        />
        <MetricCard
          icon={Bell}
          label="Alerts"
          value="0"
          hint="Low-stock and order alerts will surface here."
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <EmptyState
          icon={Sprout}
          title="No products listed"
          description="Upload your first product to make it visible to buyers in the marketplace."
        />
        <EmptyState
          icon={LineChart}
          title="No orders yet"
          description="Orders will appear here once buyers complete checkout."
        />
      </section>
    </DashboardShell>
  );
}
