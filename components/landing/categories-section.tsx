import { Apple, Carrot, Leaf, Milk, Wheat } from "lucide-react";
import { CategoryCard } from "@/components/landing/category-card";
import { SectionHeader } from "@/components/landing/section-header";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

const categories = [
  { title: "Vegetables", count: "124 local listings", icon: Carrot },
  { title: "Fruits", count: "86 seasonal picks", icon: Apple },
  { title: "Dairy", count: "34 verified dairies", icon: Milk },
  { title: "Grains", count: "51 farm batches", icon: Wheat },
  { title: "Organic", count: "63 certified products", icon: Leaf },
];

export function CategoriesSection() {
  return (
    <section className="bg-secondary/45 py-16 sm:py-24">
      <div className="container-page">
        <SectionHeader
          eyebrow="Shop by category"
          title="Find everyday essentials without digging through clutter."
          description="Clear categories keep the buying flow fast, especially on mobile during a hackathon demo."
        />

        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((category) => (
            <StaggerItem key={category.title}>
              <CategoryCard {...category} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
