import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Choose Role",
  description: "Choose how you want to use FarmSetu.",
};

export default async function RoleOnboardingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="container-page flex min-h-screen items-center py-10">
      <section className="border-border bg-card mx-auto w-full max-w-xl rounded-2xl border p-6 text-center shadow-sm sm:p-8">
        <p className="text-primary text-sm font-medium">One last setup step</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal">
          Choose your FarmSetu role
        </h1>
        <p className="text-muted-foreground mt-3 text-sm leading-6">
          Role selection UI will be wired in the next auth polish slice. For
          backend testing, set the user role to BUYER, FARMER, or ADMIN in the
          database.
        </p>
      </section>
    </main>
  );
}
