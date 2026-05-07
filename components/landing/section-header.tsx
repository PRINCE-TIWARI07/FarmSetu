import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-3xl",
        align === "center" ? "text-center" : "mx-0 text-left",
        className,
      )}
    >
      <Badge
        variant="outline"
        className="border-primary/20 bg-primary/5 text-primary h-7 rounded-full px-3"
      >
        {eyebrow}
      </Badge>
      <h2 className="text-foreground mt-4 text-3xl leading-tight font-semibold tracking-normal sm:text-4xl">
        {title}
      </h2>
      <p className="text-muted-foreground mt-4 text-base leading-7">
        {description}
      </p>
    </div>
  );
}
