"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="bg-background flex min-h-screen items-center justify-center px-4 py-16">
      <section className="border-border bg-card w-full max-w-md rounded-2xl border p-6 text-center shadow-sm">
        <p className="text-primary text-sm font-medium">Something went wrong</p>
        <h1 className="text-foreground mt-3 text-2xl font-semibold tracking-normal">
          FarmSetu could not load this view.
        </h1>
        <p className="text-muted-foreground mt-3 text-sm leading-6">
          Please retry. If this happens during the demo, refresh once and
          continue from the dashboard.
        </p>
        {error.digest ? (
          <p className="text-muted-foreground mt-3 text-xs">
            Error reference: {error.digest}
          </p>
        ) : null}
        <Button onClick={reset} className="mt-6 min-h-11 rounded-full px-5">
          <RotateCcw className="size-4" aria-hidden="true" />
          Try again
        </Button>
      </section>
    </main>
  );
}
