import Link from "next/link";
import { Sprout } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group text-foreground flex items-center gap-2.5 transition-opacity hover:opacity-90",
        className,
      )}
      aria-label={`${APP_NAME} home`}
    >
      <span className="farm-gradient shadow-primary/20 flex size-9 items-center justify-center rounded-xl text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
        <Sprout className="size-5" aria-hidden="true" />
      </span>
      <span className="text-lg font-semibold tracking-normal">{APP_NAME}</span>
    </Link>
  );
}
