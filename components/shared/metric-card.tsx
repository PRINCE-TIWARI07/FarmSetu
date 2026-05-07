import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
  className?: string;
};

export function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
  className,
}: MetricCardProps) {
  return (
    <article
      className={cn(
        "border-border bg-card rounded-2xl border p-5 shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-normal">{value}</p>
        </div>
        <div className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-2xl">
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </div>
      <p className="text-muted-foreground mt-4 text-xs leading-5">{hint}</p>
    </article>
  );
}
