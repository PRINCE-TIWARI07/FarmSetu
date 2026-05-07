import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="bg-background flex min-h-screen items-center justify-center px-4 py-16">
      <section className="border-border bg-card w-full max-w-md rounded-2xl border p-6 text-center shadow-sm">
        <p className="text-primary text-sm font-medium">404</p>
        <h1 className="text-foreground mt-3 text-2xl font-semibold tracking-normal">
          This FarmSetu page is not available.
        </h1>
        <p className="text-muted-foreground mt-3 text-sm leading-6">
          Use the home page during judging if a demo route has not been wired
          yet.
        </p>
        <Link
          href="/"
          className={cn(
            buttonVariants(),
            "mt-6 min-h-11 rounded-full px-5",
          )}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back home
        </Link>
      </section>
    </main>
  );
}
