import type { Metadata } from "next";
import { Bell, PackageOpen, ShoppingCart, WalletCards } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { DashboardShell } from "@/components/shared/dashboard-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { MetricCard } from "@/components/shared/metric-card";

export const metadata: Metadata = {
  title: "Buyer Dashboard",
  description: "Browse fresh FarmSetu products and track buying activity.",
};

export default async function BuyerDashboardPage() {
  const user = await getCurrentUser();

  return (
    <DashboardShell
      eyebrow="Buyer dashboard"
      title={`Welcome, ${user?.name ?? "buyer"}`}
      description="A calm overview for browsing produce, cart activity, orders, and updates during the demo."
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={PackageOpen}
          label="Fresh listings"
          value="Live"
          hint="Products are served from the marketplace database."
        />
        <MetricCard
          icon={ShoppingCart}
          label="Cart"
          value="0"
          hint="Cart state appears here once checkout is wired."
        />
        <MetricCard
          icon={WalletCards}
          label="Payments"
          value="Ready"
          hint="Keep payment credentials verified before judging."
        />
        <MetricCard
          icon={Bell}
          label="Notifications"
          value="0"
          hint="Realtime updates will surface here."
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Add produce from the marketplace during the demo to continue into checkout."
        />
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="Order and stock updates will appear here when realtime events arrive."
        />
      </section>
    </DashboardShell>
  );
}
