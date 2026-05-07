import { Quote } from "lucide-react";
import { SectionHeader } from "@/components/landing/section-header";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Card } from "@/components/ui/card";

const testimonials = [
  {
    quote:
      "I could list tomatoes and leafy vegetables in minutes. The best part is seeing who ordered directly from my farm.",
    name: "Ramesh Patil",
    role: "Vegetable farmer, Nashik",
  },
  {
    quote:
      "It feels like a grocery app, but the farmer name and location make it more trustworthy than a usual listing.",
    name: "Aditi Rao",
    role: "Buyer, Bengaluru",
  },
  {
    quote:
      "For a first version, the dashboard idea is clear. Farmers need simple orders and simple payments, not complexity.",
    name: "Meera Kulkarni",
    role: "Agri mentor",
  },
];

export function TestimonialsSection() {
  return (
    <section className="container-page py-20 sm:py-24">
      <SectionHeader
        eyebrow="Early feedback"
        title="Built around people who would actually use it."
        description="The story stays simple: farmers get a cleaner selling path, buyers get fresher food, and everyone understands what happened."
      />

      <Stagger className="mt-10 grid gap-5 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <StaggerItem key={testimonial.name}>
            <Card className="border-border/70 bg-card h-full rounded-xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <Quote className="text-primary size-5" aria-hidden="true" />
              <p className="text-foreground mt-5 text-sm leading-7">
                “{testimonial.quote}”
              </p>
              <div className="border-border/70 mt-6 border-t pt-4">
                <p className="font-semibold tracking-normal">
                  {testimonial.name}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {testimonial.role}
                </p>
              </div>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
