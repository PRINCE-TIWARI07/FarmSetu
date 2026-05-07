import { AnimatedCounter } from "@/components/motion/animated-counter";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

const stats = [
  { label: "Farmers onboarded", value: 412 },
  { label: "Products sold", value: 18000, suffix: "+" },
  { label: "Cities served", value: 12 },
  { label: "Customer satisfaction", value: 96, suffix: "%" },
];

export function StatisticsStrip() {
  return (
    <section className="container-page">
      <Stagger className="border-border/70 bg-card grid overflow-hidden rounded-2xl border shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StaggerItem
            key={stat.label}
            className="border-border/70 border-b p-6 lg:border-b-0 lg:border-l lg:first:border-l-0"
          >
            <p className="text-foreground text-3xl font-semibold tracking-normal">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="text-muted-foreground mt-2 text-sm">{stat.label}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
