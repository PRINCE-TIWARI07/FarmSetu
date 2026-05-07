"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/auth/user-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { title: "Marketplace", href: "#featured-products" },
  { title: "For Farmers", href: "/farmer/dashboard" },
  { title: "For Buyers", href: "/buyer/dashboard" },
  { title: "Impact", href: "#impact" },
];

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="container-page pt-3">
        <nav className="glass-panel shadow-primary/10 flex h-16 items-center justify-between rounded-2xl px-3 sm:px-4">
          <Logo />

          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:bg-primary/10 hover:text-foreground rounded-full px-4 py-2 text-sm font-medium transition-all duration-300"
              >
                {item.title}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <UserMenu />
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-lg"
                    className="hover:bg-primary/10 rounded-full"
                    aria-label="Open navigation menu"
                  />
                }
              >
                <Menu className="size-5" aria-hidden="true" />
              </SheetTrigger>
              <SheetContent className="glass-panel border-border/70 w-[88vw] border-l p-0">
                <SheetHeader className="border-border/60 border-b p-5 text-left">
                  <Logo />
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <SheetDescription className="pt-3">
                    Fresh marketplace navigation for farmers and buyers.
                  </SheetDescription>
                </SheetHeader>

                <div className="grid gap-2 p-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-muted-foreground hover:bg-primary/10 hover:text-foreground rounded-xl px-4 py-3 text-sm font-medium transition-colors"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>

                <div className="border-border/60 mt-auto grid gap-3 border-t p-4">
                  <UserMenu />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
