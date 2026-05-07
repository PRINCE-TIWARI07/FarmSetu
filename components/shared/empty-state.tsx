import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        "border-border bg-card grid place-items-center rounded-2xl border p-6 text-center shadow-sm sm:p-8",
        className,
      )}
    >
      <div className="mx-auto max-w-sm">
        <div className="bg-primary/10 text-primary mx-auto flex size-12 items-center justify-center rounded-2xl">
          <Icon className="size-6" aria-hidden="true" />
        </div>
        <h2 className="text-foreground mt-5 text-xl font-semibold tracking-normal">
          {title}
        </h2>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          {description}
        </p>
        {action ? <div className="mt-6">{action}</div> : null}
      </div>
    </section>
  );
}
