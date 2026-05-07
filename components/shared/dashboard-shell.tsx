import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DashboardShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function DashboardShell({
  eyebrow,
  title,
  description,
  children,
}: DashboardShellProps) {
  return (
    <main className="bg-background min-h-screen">
      <div className="container-page py-6 sm:py-8">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "min-h-10 rounded-full px-3",
          )}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Home
        </Link>

        <header className="mt-6 flex flex-col gap-3 sm:mt-8">
          <p className="text-primary text-sm font-medium">{eyebrow}</p>
          <div className="grid gap-2">
            <h1 className="text-foreground text-3xl leading-tight font-semibold tracking-normal sm:text-4xl">
              {title}
            </h1>
            <p className="text-muted-foreground max-w-3xl text-sm leading-6 sm:text-base">
              {description}
            </p>
          </div>
        </header>

        <div className="mt-8 grid gap-5">{children}</div>
      </div>
    </main>
  );
}
