import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  ProductCard,
  type ProductCardData,
} from "@/components/landing/product-card";
import { SectionHeader } from "@/components/landing/section-header";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const products: ProductCardData[] = [
  {
    name: "Fresh Roma Tomatoes",
    farmer: "Anand Farms",
    price: "₹38",
    unit: "kg",
    stock: "In stock",
    location: "Nashik",
    image:
      "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Alphonso Mangoes",
    farmer: "Konkan Harvest",
    price: "₹210",
    unit: "dozen",
    stock: "Few left",
    location: "Ratnagiri",
    image:
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "A2 Farm Milk",
    farmer: "Green Meadow Dairy",
    price: "₹74",
    unit: "litre",
    stock: "In stock",
    location: "Hosur",
    image:
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Organic Brown Rice",
    farmer: "Kaveri Organics",
    price: "₹92",
    unit: "kg",
    stock: "Pre-order",
    location: "Mandya",
    image:
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=900&q=80",
  },
];

export function FeaturedProductsSection() {
  return (
    <section id="featured-products" className="container-page py-20 sm:py-24">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeader
          align="left"
          eyebrow="Fresh this week"
          title="Products that feel like a real grocery marketplace."
          description="A simple catalog with familiar pricing, stock states, and farmer attribution so the demo feels grounded from the first scroll."
        />
        <Link
          href="#featured-products"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "min-h-11 w-full rounded-full px-5 py-2.5 sm:w-fit",
          )}
        >
          Browse marketplace
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <StaggerItem key={product.name}>
            <ProductCard product={product} />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
