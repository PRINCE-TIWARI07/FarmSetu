"use client";

import { useRouter } from "next/navigation";
import { logoutUser } from "@/actions/auth";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, BarChart3, ShoppingCart, Shield } from "lucide-react";

export function UserMenu() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const logout = useAuthStore((state) => state.logout);

  if (!hasHydrated || !user) {
    return (
      <Button
        onClick={() => router.push("/login")}
        variant="outline"
        size="sm"
      >
        Sign In
      </Button>
    );
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const roleIcons: Record<string, React.ReactNode> = {
    FARMER: <BarChart3 className="size-4" />,
    BUYER: <ShoppingCart className="size-4" />,
    ADMIN: <Shield className="size-4" />,
  };

  const roleDashboards: Record<string, string> = {
    FARMER: "/farmer/dashboard",
    BUYER: "/buyer/dashboard",
    ADMIN: "/admin/dashboard",
  };

  const handleLogout = async () => {
    await logoutUser();
    logout();
    router.push("/login");
  };

  const handleDashboard = () => {
    router.push(roleDashboards[user.role] || "/dashboard");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-accent inline-flex h-9 items-center justify-center rounded-full px-3 transition-colors">
          <Avatar className="size-8">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className="bg-blue-500 text-white text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* User Info */}
        <div className="px-2 py-1.5">
          <div className="text-sm font-semibold">{user.name}</div>
          <div className="text-xs text-slate-500">{user.email}</div>
        </div>

        <DropdownMenuSeparator />

        {/* Dashboard Link */}
        <DropdownMenuItem onClick={handleDashboard} className="cursor-pointer">
          {roleIcons[user.role]}
          <span className="ml-2">
            {user.role === "FARMER" && "Dashboard"}
            {user.role === "BUYER" && "Dashboard"}
            {user.role === "ADMIN" && "Admin Panel"}
          </span>
        </DropdownMenuItem>

        {/* Settings */}
        <DropdownMenuItem
          onClick={() => router.push("/profile")}
          className="cursor-pointer"
        >
          <Settings className="size-4" />
          <span className="ml-2">Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="size-4" />
          <span className="ml-2">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
