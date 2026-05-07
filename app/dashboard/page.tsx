import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

export default async function DashboardRouterPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  if (user.role === "FARMER") {
    redirect("/farmer/dashboard");
  }

  redirect("/buyer/dashboard");
}
