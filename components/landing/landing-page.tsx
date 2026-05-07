import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedProductsSection = dynamic(
  () =>
    import("@/components/landing/featured-products-section").then(
      (mod) => mod.FeaturedProductsSection,
    ),
  { loading: () => <SectionSkeleton cards={4} /> },
);

const CategoriesSection = dynamic(
  () =>
    import("@/components/landing/categories-section").then(
      (mod) => mod.CategoriesSection,
    ),
  { loading: () => <SectionSkeleton cards={5} muted /> },
);

const FarmerBenefitsSection = dynamic(
  () =>
    import("@/components/landing/farmer-benefits-section").then(
      (mod) => mod.FarmerBenefitsSection,
    ),
  { loading: () => <SectionSkeleton cards={3} /> },
);

const StatisticsStrip = dynamic(
  () =>
    import("@/components/landing/statistics-strip").then(
      (mod) => mod.StatisticsStrip,
    ),
  { loading: () => <SectionSkeleton cards={4} muted compact /> },
);

const TestimonialsSection = dynamic(
  () =>
    import("@/components/landing/testimonials-section").then(
      (mod) => mod.TestimonialsSection,
    ),
  { loading: () => <SectionSkeleton cards={3} /> },
);

function SectionSkeleton({
  cards,
  muted,
  compact,
}: {
  cards: number;
  muted?: boolean;
  compact?: boolean;
}) {
  return (
    <section className={muted ? "bg-secondary/45" : undefined}>
      <div className="container-page py-16 sm:py-20">
        <Skeleton className="h-7 w-36 rounded-full" />
        <Skeleton className="mt-4 h-10 w-full max-w-xl rounded-xl" />
        <Skeleton className="mt-3 h-5 w-full max-w-2xl rounded-full" />
        <div
          className={`mt-10 grid gap-4 sm:grid-cols-2 ${compact ? "lg:grid-cols-4" : "lg:grid-cols-3 xl:grid-cols-4"}`}
        >
          {Array.from({ length: cards }).map((_, index) => (
            <Skeleton key={index} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Navbar />
      <HeroSection />
      <FeaturedProductsSection />
      <CategoriesSection />
      <FarmerBenefitsSection />
      <StatisticsStrip />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}
