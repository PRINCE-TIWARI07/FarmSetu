"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

const protectedRoutes = [
  "/admin",
  "/buyer",
  "/dashboard",
  "/farmer",
  "/onboarding",
  "/cart",
  "/checkout",
];

const roleRedirects: Record<string, string> = {
  FARMER: "/farmer/dashboard",
  BUYER: "/buyer/dashboard",
  ADMIN: "/admin/dashboard",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    setHasMounted(true);
    void useAuthStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (!hasMounted || !hasHydrated || isLoading) return;

    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route),
    );

    // If trying to access protected route without auth
    if (isProtectedRoute && !user) {
      console.log("[AuthProvider] Redirecting to login - no user session");
      router.push("/login");
      return;
    }

    // If authenticated on login page, redirect to dashboard
    if (pathname === "/login" && user) {
      console.log("[AuthProvider] User already authenticated, redirecting to dashboard");
      const redirectUrl = roleRedirects[user.role] || "/dashboard";
      router.push(redirectUrl);
      return;
    }

    // Role-based redirects for protected routes
    if (isProtectedRoute && user) {
      if (pathname.startsWith("/admin") && user.role !== "ADMIN") {
        console.log("[AuthProvider] Non-admin trying to access /admin, redirecting");
        router.push("/buyer/dashboard");
        return;
      }

      if (pathname.startsWith("/farmer") && user.role !== "FARMER" && user.role !== "ADMIN") {
        console.log("[AuthProvider] Non-farmer trying to access /farmer, redirecting");
        router.push("/buyer/dashboard");
        return;
      }
    }
  }, [pathname, user, isLoading, router, hasMounted, hasHydrated]);

  return <>{children}</>;
}
