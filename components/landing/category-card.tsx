import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CategoryCardProps = {
  title: string;
  count: string;
  icon: LucideIcon;
  className?: string;
};

export function CategoryCard({
  title,
  count,
  icon: Icon,
  className,
}: CategoryCardProps) {
  return (
    <Card
      className={cn(
        "group border-border/70 bg-card hover:border-primary/25 rounded-xl px-4 py-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold tracking-normal">{title}</h3>
          <p className="text-muted-foreground mt-1 text-sm leading-5">
            {count}
          </p>
        </div>
      </div>
    </Card>
  );
}
