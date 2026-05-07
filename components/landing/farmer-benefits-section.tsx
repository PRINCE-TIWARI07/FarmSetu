import { Banknote, Handshake, ReceiptText, UsersRound } from "lucide-react";
import { SectionHeader } from "@/components/landing/section-header";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Card } from "@/components/ui/card";

const benefits = [
  {
    title: "Better profits",
    description:
      "Farmers set transparent prices and keep more value from each sale.",
    icon: Banknote,
  },
  {
    title: "Direct selling",
    description:
      "Products go from farm listings to buyer carts without middlemen.",
    icon: Handshake,
  },
  {
    title: "Faster payments",
    description:
      "Simple order records make collection and settlement easier to track.",
    icon: ReceiptText,
  },
  {
    title: "Wider reach",
    description:
      "Local farmers can reach city buyers through one clean storefront.",
    icon: UsersRound,
  },
];

export function FarmerBenefitsSection() {
  return (
    <section id="impact" className="container-page py-20 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <SectionHeader
          align="left"
          eyebrow="For farmers"
          title="Useful tools first. Fancy features later."
          description="The MVP focuses on the basics that actually matter for a farmer: list produce, get orders, understand demand, and receive money faster."
        />

        <Stagger className="grid gap-4 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <StaggerItem key={benefit.title}>
              <Card className="border-border/70 bg-card h-full rounded-xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
                  <benefit.icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-normal">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-6">
                  {benefit.description}
                </p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
